<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\AiConfigurationModel;
use App\Models\VowelConsonantRuleModel;
use App\Models\CompoundNumberModel;

class AIController extends BaseController
{
    use ResponseTrait;

    public function suggest()
    {
        if (!$this->checkModuleAccess('ai')) {
            return $this->failForbidden('Access to AI features requires a Professional subscription.');
        }

        $input = $this->request->getJSON(true);
        $dob = $input['dob'] ?? null;
        $preferences = $input['preferences'] ?? [];
        $type = $input['type'] ?? 'person'; // 'person' or 'business'

        // Get active configuration
        $config = AiConfigurationModel::getActiveConfig();

        if (!$config || empty($config['api_key'])) {
            log_message('debug', "AI: Using mock suggestions (no active config)");
            return $this->respond([
                'success' => true,
                'is_mock' => true,
                'message' => 'No active AI API key found. Returning mock data.',
                'suggestions' => $this->getMockSuggestions($dob, $type, $preferences)
            ]);
        }

        $provider = $config['provider_name'];
        $apiKey = trim($config['api_key']);
        $model = trim($config['model_name']);

        $keyPreview = substr($apiKey, 0, 5) . '...';
        log_message('debug', "AI Request: provider=$provider, model=$model, type=$type, key=$keyPreview");

        // Construct detailed prompt
        $prompt = $this->buildPrompt($dob, $type, $preferences);

        try {
            $suggestedNames = [];
            if ($provider === 'gemini') {
                log_message('debug', "Calling Gemini API...");
                $suggestedNames = $this->callGemini($apiKey, $model, $prompt);
            } else if ($provider === 'openai') {
                log_message('debug', "Calling OpenAI API...");
                $suggestedNames = $this->callOpenAI($apiKey, $model, $prompt);
            }

            log_message('debug', "AI Names Suggested Count: " . count($suggestedNames));

            if (empty($suggestedNames)) {
                return $this->fail('AI suggested zero names. Please check your prompt or API limits.');
            }

            // Calculate numerology for each suggested name
            $results = $this->processSuggestions($suggestedNames, $dob);

            return $this->respond([
                'success' => true,
                'provider' => $provider,
                'model' => $model,
                'suggestions' => $results
            ]);

        } catch (\Exception $e) {
            log_message('error', "AI Controller Error: " . $e->getMessage());
            return $this->respond([
                'success' => false,
                'message' => 'AI Error: ' . $e->getMessage()
            ], 500);
        }
    }

    private function buildPrompt($dob, $type, $preferences)
    {
        // 1. Get Good Compound Numbers
        $compModel = new CompoundNumberModel();
        $goodCompounds = $compModel->whereIn('result', ['excellent', 'super', 'good'])->findAll();
        $goodNums = array_column($goodCompounds, 'number');
        $goodNumsStr = implode(', ', array_slice($goodNums, 0, 30));

        // 2. Industry Specific Lucky Numbers (if provided)
        $sectorLucky = $preferences['sector_lucky_numbers'] ?? null;
        $sectorPriority = "";
        if ($sectorLucky) {
            $sectorPriority = "\nCRITICAL PRIORITY: For this business sector, the following numbers are considered extremely lucky: $sectorLucky. 
Names MUST ideally sum up to one of these numbers in Chaldean systems.";
        }

        // 3. Get Rules to Avoid
        $ruleModel = new VowelConsonantRuleModel();
        $rules = $ruleModel->findAll();
        $ruleStrs = [];
        foreach ($rules as $r) {
            $ruleStrs[] = "{$r['type']} should NOT result in number {$r['number']}";
        }
        $rulesText = !empty($ruleStrs) ? "Additional Rules:\n" . implode("\n", $ruleStrs) : "";

        $startLetter = $preferences['start_letter'] ?? 'any';
        $gender = $preferences['gender'] ?? 'unspecified';
        $desc = $preferences['description'] ?? '';
        $baseName = $preferences['base_name'] ?? null;
        $count = $preferences['count'] ?? 15;

        $prompt = "You are a specialized Vedic and Chaldean Numerology consultant. 
Suggest $count creative " . ($type === 'business' ? 'Business names' : "Personal names for a $gender") . " that are numerologically favorable.
Birth Date: $dob";

        if ($baseName) {
            $prompt .= "\nCURRENT NAME TO OPTIMIZE: \"$baseName\". Please provide small variations (changing letters, adding/removing characters) or very similar sounding alternatives that match the lucky numbers below.";
        } else {
            $prompt .= "\nTarget Starting Letter: $startLetter";
        }

        $prompt .= "\nPreferences: $desc $sectorPriority

Target Criteria:
- Names should ideally sum up to one of these favorable Chaldean Compound Numbers: $goodNumsStr.
- $rulesText

Output Format:
Return ONLY a valid JSON array of strings containing the suggested names.
Example: [\"Name One\", \"Name Two\"]";

        return $prompt;
    }

    private function callGemini($apiKey, $model, $prompt)
    {
        // Sanitize model name
        $cleanModel = trim(str_replace(['models/', 'google/', 'Models/'], '', $model));

        // Models to try in order - trying every possible variation found in logs
        $modelFallbacks = [];
        if (!empty($cleanModel))
            $modelFallbacks[] = $cleanModel;

        // prioritized fallbacks based on verified ListModels output
        $standardModels = [
            'gemini-2.0-flash',
            'gemini-flash-latest',
            'gemini-2.5-flash',
            'gemini-pro-latest',
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-pro'
        ];
        foreach ($standardModels as $sm) {
            if (!in_array($sm, $modelFallbacks))
                $modelFallbacks[] = $sm;
        }

        $lastError = "";
        $client = \Config\Services::curlrequest();

        foreach ($modelFallbacks as $m) {
            // Try both v1 and v1beta for each model
            $endpoints = [
                "https://generativelanguage.googleapis.com/v1/models/{$m}:generateContent?key={$apiKey}",
                "https://generativelanguage.googleapis.com/v1beta/models/{$m}:generateContent?key={$apiKey}"
            ];

            foreach ($endpoints as $url) {
                // log_message('debug', "AI: Trying Gemini endpoint: $url");

                $payload = [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ]
                ];

                $response = $client->post($url, [
                    'json' => $payload,
                    'headers' => ['Content-Type' => 'application/json'],
                    'http_errors' => false,
                    'verify' => false
                ]);

                $rawBody = $response->getBody();
                $body = json_decode($rawBody, true);

                // If success, return data
                if (isset($body['candidates'][0]['content']['parts'][0]['text'])) {
                    log_message('debug', "AI: Successfully used model $m via $url");
                    $jsonStr = trim($body['candidates'][0]['content']['parts'][0]['text']);
                    $jsonStr = preg_replace('/^```json\s*|```$/i', '', $jsonStr);
                    $data = json_decode($jsonStr, true);
                    return is_array($data) ? $data : [];
                }

                // If we got a real error, log it for full diagnostics
                $statusCode = $response->getStatusCode();
                if ($statusCode !== 200) {
                    log_message('debug', "AI: Gemini Failure ($statusCode) for $m: " . $rawBody);
                }

                // If not found or unsupported, capture error and continue to next endpoint/model
                if ($statusCode === 404 || $statusCode === 400) {
                    $lastError = "Model $m: " . ($body['error']['message'] ?? "Not found or unsupported.");

                    // ONCE during failure, try to list models for diagnostics
                    static $triedList = false;
                    if (!$triedList && $statusCode === 404) {
                        $triedList = true;
                        $listUrl = "https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}";
                        $listRes = $client->get($listUrl, ['http_errors' => false, 'verify' => false]);
                        log_message('debug', "AI: ListModels Diagnostic (" . $listRes->getStatusCode() . "): " . $listRes->getBody());
                    }
                    continue;
                }

                // For other errors (like 429 Quota), throw immediately
                $errMsg = $body['error']['message'] ?? 'Unknown Gemini Error';
                if (isset($body['error']['status'])) {
                    $errMsg = "[{$body['error']['status']}] $errMsg";
                }
                throw new \Exception("Gemini API: " . $errMsg);
            }
        }

        throw new \Exception("Gemini API: All attempts failed. Please ensure you have enabled the 'Generative Language API' in Google Cloud for your project. Last error: " . $lastError);
    }

    private function callOpenAI($apiKey, $model, $prompt)
    {
        $url = "https://api.openai.com/v1/chat/completions";

        $payload = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => 'You are a professional numerologist.'],
                ['role' => 'user', 'content' => $prompt]
            ],
            'response_format' => ['type' => 'json_object']
        ];

        $client = \Config\Services::curlrequest();
        $response = $client->post($url, [
            'json' => $payload,
            'headers' => [
                'Authorization' => "Bearer $apiKey",
                'Content-Type' => 'application/json'
            ],
            'http_errors' => false,
            'verify' => false // Bypass SSL check for localhost troubleshooting
        ]);

        $body = json_decode($response->getBody(), true);

        if (isset($body['choices'][0]['message']['content'])) {
            $content = trim($body['choices'][0]['message']['content']);
            // Strip markdown backticks if present
            $content = preg_replace('/^```json\s*|```$/i', '', $content);
            $data = json_decode($content, true);
            // Some models might wrap it in a key, try to be robust
            if (is_array($data)) {
                return $data['suggestions'] ?? $data['names'] ?? array_values($data)[0] ?? $data;
            }
            return [];
        }

        throw new \Exception($body['error']['message'] ?? 'Failed to get response from OpenAI');
    }

    private function processSuggestions($names, $dob)
    {
        $results = [];
        $calculator = new \App\Libraries\NumerologyCalculator();

        foreach ($names as $name) {
            if (empty(trim($name)))
                continue;

            $calc = $calculator->calculate($name, $dob);

            // Check suitability (simplified)
            $suitability = "Average";
            if (isset($calc['chaldean']['result']) && in_array(strtolower($calc['chaldean']['result']), ['excellent', 'super', 'good'])) {
                $suitability = $calc['chaldean']['result'];
            }

            $results[] = [
                'name' => $name,
                'chaldean_compound' => $calc['chaldean']['total'],
                'chaldean_root' => $calc['chaldean']['single'],
                'pythagorean_compound' => $calc['pythagorean']['total'],
                'pythagorean_root' => $calc['pythagorean']['single'],
                'vowels_chaldean' => $calc['soul_urge']['number'],
                'consonants_chaldean' => $calc['personality']['number'],
                'suitability' => $suitability
            ];
        }

        return $results;
    }

    public function getSettings()
    {
        $userData = $this->request->userData ?? null;
        if (!$userData || $userData['role'] !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }
        $model = new AiConfigurationModel();
        return $this->respond($model->findAll());
    }

    public function updateSettings()
    {
        $userData = $this->request->userData ?? null;
        if (!$userData || $userData['role'] !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }
        $input = $this->request->getJSON(true);
        $model = new AiConfigurationModel();

        if (!$input)
            return $this->fail('No data provided');

        // Check if any is marked as active in the input to avoid dual activation
        $hasActive = false;
        if (is_array($input)) {
            foreach ($input as $values) {
                if (isset($values['is_active']) && ($values['is_active'] == 1 || $values['is_active'] === true)) {
                    $hasActive = true;
                    break;
                }
            }
        }

        $db = \Config\Database::connect();
        $db->transStart();

        if ($hasActive) {
            // Reset all to 0 first
            $db->table('ai_configurations')->update(['is_active' => 0]);
        }

        foreach ($input as $values) {
            if (!isset($values['provider_name']))
                continue;

            $provider = $values['provider_name'];
            $existing = $model->where('provider_name', $provider)->first();

            // Standardize is_active to integer 0/1
            if (isset($values['is_active'])) {
                $values['is_active'] = ($values['is_active'] == 1 || $values['is_active'] === true) ? 1 : 0;
            }

            if ($existing) {
                $model->update($existing['id'], $values);
            } else {
                $model->insert($values);
            }
        }

        $db->transComplete();
        return $this->respond(['success' => true]);
    }

    private function getMockSuggestions($dob, $type, $preferences)
    {
        $names = ($type === 'business')
            ? ['AstroVibe Solutions', 'Zenith Numerics', 'Stellar Path Co']
            : ['Aarav', 'Ishani', 'Kavya', 'Rohan'];

        return $this->processSuggestions($names, $dob);
    }
}
