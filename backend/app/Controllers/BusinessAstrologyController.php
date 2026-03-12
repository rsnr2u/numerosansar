<?php

namespace App\Controllers;

use App\Models\PlanetRelationModel;
use App\Models\AstrologySystemModel;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\RESTful\ResourceController;

class BusinessAstrologyController extends BaseController
{
    use ResponseTrait;

    public function check()
    {
        if (!$this->checkModuleAccess('business')) {
            return $this->failForbidden('Access to Business module requires a Professional subscription.');
        }

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
        $numerologyStatus = $nameAnalysis['numerology']['meaning'] ? $nameAnalysis['numerology']['meaning']['result'] : 'Analyzed';

        $nameAnalysis['chaldean_status'] = $chaldeanStatus;
        $nameAnalysis['pythagorean_status'] = $pythagoreanStatus;
        $nameAnalysis['numerology_status'] = $numerologyStatus;

        // AUTO-SAVE LOGIC
        $savedCheckId = null;
        if ($clientId) {
            $id = $this->request->getVar('id');
            $checkModel = new \App\Models\ClientBusinessCheckModel();

            $data = [
                'user_id' => $this->getVendorId(),
                'client_id' => $clientId,
                'business_sector_id' => $this->request->getVar('business_sector_id'),
                'business_name' => $businessName,
                'original_name' => $this->request->getVar('original_name'),
                'chaldean_compound' => $nameAnalysis['chaldean']['compound'],
                'pythagorean_compound' => $nameAnalysis['pythagorean']['compound'],
                'numerology_compound' => $nameAnalysis['numerology']['compound'],
                'chaldean_root' => $nameAnalysis['chaldean']['root'],
                'pythagorean_root' => $nameAnalysis['pythagorean']['root'],
                'numerology_root' => $nameAnalysis['numerology']['root'],
                'chaldean_result' => $chaldeanStatus,
                'pythagorean_result' => $pythagoreanStatus,
                'numerology_result' => $numerologyStatus,
                'is_confirmed' => 0
            ];

            if ($id) {
                // Validate ownership before update
                if (!$this->validateOwnership(\App\Models\ClientBusinessCheckModel::class, $id)) {
                    return $this->failForbidden('Access denied');
                }
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

        $systemModel = new AstrologySystemModel();
        $mappings = $systemModel->findAll();
        $map = [];
        foreach ($mappings as $row) {
            $map[$row['letter']] = $row;
        }

        $chaldeanSum = 0;
        $pythagoreanSum = 0;
        $numerologySum = 0;
        $vowelSum = 0;
        $consonantSum = 0;

        $lettersBreakdown = []; // Sequential array

        foreach ($letters as $char) {
            if (isset($map[$char])) {
                $val = ($map[$char]['chaldean_number'] ?? 0);
                $chaldeanSum += $val;
                $pythagoreanSum += $map[$char]['pythagorean_number'];
                $numerologySum += ($map[$char]['numerology_number'] ?? 0);

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
            ],
            'numerology' => [
                'compound' => $numerologySum,
                'root' => $this->reduceToSingleDigit($numerologySum),
                'meaning' => $compoundModel->where('number', $numerologySum)->first()
            ]
        ];
    }
}
