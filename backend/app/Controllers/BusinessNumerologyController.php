<?php

namespace App\Controllers;

use App\Models\PlanetRelationModel;
use App\Models\NumerologySystemModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class BusinessNumerologyController extends ResourceController
{
    use ResponseTrait;

    public function check()
    {
        $businessName = $this->request->getVar('business_name');
        $clientId = $this->request->getVar('client_id');

        if (!$businessName) {
            return $this->fail('Business name is required');
        }

        // Analyze Business Name
        $nameAnalysis = $this->analyzeName($businessName);

        // Get status directly from Compound Number meaning
        $chaldeanStatus = $nameAnalysis['chaldean']['meaning'] ? $nameAnalysis['chaldean']['meaning']['result'] : 'Analyzed';
        $pythagoreanStatus = $nameAnalysis['pythagorean']['meaning'] ? $nameAnalysis['pythagorean']['meaning']['result'] : 'Analyzed';

        $nameAnalysis['chaldean_status'] = $chaldeanStatus;
        $nameAnalysis['pythagorean_status'] = $pythagoreanStatus;

        // AUTO-SAVE LOGIC
        $savedCheckId = null;
        if ($clientId) {
            $id = $this->request->getVar('id');
            $checkModel = new \App\Models\ClientBusinessCheckModel();

            $data = [
                'client_id' => $clientId,
                'client_id' => $clientId,
                'business_name' => $businessName,
                'original_name' => $this->request->getVar('original_name'),
                'chaldean_compound' => $nameAnalysis['chaldean']['compound'],
                'pythagorean_compound' => $nameAnalysis['pythagorean']['compound'],
                'chaldean_root' => $nameAnalysis['chaldean']['root'],
                'pythagorean_root' => $nameAnalysis['pythagorean']['root'],
                'chaldean_result' => $chaldeanStatus,
                'pythagorean_result' => $pythagoreanStatus,
                'is_confirmed' => 0
            ];

            if ($id) {
                $checkModel->update($id, $data);
                $savedCheckId = $id;
            } else {
                $savedCheckId = $checkModel->insert($data);
            }
        }

        return $this->respond([
            'business_name_analysis' => $nameAnalysis,
            'check_id' => $savedCheckId ?? null
        ]);
    }

    private function reduceToSingleDigit($number)
    {
        while ($number > 9) {
            $sum = 0;
            $digits = str_split((string) $number);
            foreach ($digits as $d) {
                $sum += (int) $d;
            }
            $number = $sum;
        }
        return $number;
    }

    private function parseNumberList($str)
    {
        if (empty($str))
            return [];
        return array_map('trim', explode(',', $str));
    }

    private function analyzeName($name)
    {
        $cleanName = preg_replace('/[^A-Z]/', '', strtoupper($name));
        $letters = str_split($cleanName);

        $systemModel = new NumerologySystemModel();
        $mappings = $systemModel->findAll();
        $map = [];
        foreach ($mappings as $row) {
            $map[$row['letter']] = $row;
        }

        $chaldeanSum = 0;
        $pythagoreanSum = 0;
        $vowelSum = 0;
        $consonantSum = 0;

        $lettersBreakdown = []; // Sequential array

        foreach ($letters as $char) {
            if (isset($map[$char])) {
                $val = ($map[$char]['chaldean_number'] ?? 0);
                $chaldeanSum += $val;
                $pythagoreanSum += $map[$char]['pythagorean_number'];

                // Check Vowel or Consonant
                if (in_array($char, ['A', 'E', 'I', 'O', 'U'])) {
                    $vowelSum += $val;
                } else {
                    $consonantSum += $val;
                }

                $lettersBreakdown[] = [
                    'char' => $char,
                    'value' => $val
                ];
            }
        }

        // Fetch Compound Number Meaning for Chaldean
        $compoundModel = new \App\Models\CompoundNumberModel();
        $chaldeanInfo = $compoundModel->where('number', $chaldeanSum)->first();

        // Fetch Compound Number Meaning for Pythagorean
        $pythagoreanInfo = $compoundModel->where('number', $pythagoreanSum)->first();

        return [
            'name' => $name,
            'letters' => $lettersBreakdown,
            'chaldean' => [
                'compound' => $chaldeanSum,
                'root' => $this->reduceToSingleDigit($chaldeanSum),
                'vowels' => [
                    'compound' => $vowelSum,
                    'root' => $this->reduceToSingleDigit($vowelSum)
                ],
                'consonants' => [
                    'compound' => $consonantSum,
                    'root' => $this->reduceToSingleDigit($consonantSum)
                ],
                'meaning' => $chaldeanInfo
            ],
            'pythagorean' => [
                'compound' => $pythagoreanSum,
                'root' => $this->reduceToSingleDigit($pythagoreanSum),
                'meaning' => $pythagoreanInfo
            ]
        ];
    }
}
