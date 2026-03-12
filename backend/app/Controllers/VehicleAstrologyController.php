<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\CompoundNumberModel;
use App\Models\AstrologySystemModel;

class VehicleAstrologyController extends BaseController
{
    use ResponseTrait;
    public function check()
    {
        if (!$this->checkModuleAccess('vehicle')) {
            return $this->failForbidden('Access to Vehicle module requires a Professional subscription.');
        }

        $json = $this->request->getJSON();
        $vehicle = $json->vehicle_number ?? '';
        $vehicleType = $json->vehicle_type ?? '4 Wheeler';
        $dob = $json->dob ?? null;

        if (empty($vehicle)) {
            return $this->fail('Vehicle number is required');
        }

        // Clean: Remove spaces, dashes, keep alphanumeric
        $cleanNumber = strtoupper(preg_replace('/[^A-Z0-9]/', '', strtoupper($vehicle)));

        // Get Letter Mappings (Chaldean and Pythagorean)
        $systemModel = new AstrologySystemModel();
        $letters = $systemModel->findAll();
        $chaldeanMap = [];
        $pythagoreanMap = [];
        $numerologyMap = [];
        foreach ($letters as $row) {
            $char = strtoupper($row['letter']);
            $chaldeanMap[$char] = (int) $row['chaldean_number'];
            $pythagoreanMap[$char] = (int) $row['pythagorean_number'];
            $numerologyMap[$char] = (int) ($row['numerology_number'] ?? 0);
        }

        $chaldeanTotal = 0;
        $pythagoreanTotal = 0;
        $numerologyTotal = 0;
        $breakdown = [];

        $chars = str_split($cleanNumber);
        foreach ($chars as $char) {
            $chVal = 0;
            $pyVal = 0;
            $nuVal = 0;
            if (is_numeric($char)) {
                $chVal = (int) $char;
                $pyVal = (int) $char;
                $nuVal = (int) $char;
            } elseif (isset($chaldeanMap[$char])) {
                $chVal = $chaldeanMap[$char];
                $pyVal = $pythagoreanMap[$char] ?? 0;
                $nuVal = $numerologyMap[$char] ?? 0;
            }

            $chaldeanTotal += $chVal;
            $pythagoreanTotal += $pyVal;
            $numerologyTotal += $nuVal;
            $breakdown[] = [
                'char' => $char,
                'ch' => $chVal,
                'py' => $pyVal,
                'nu' => $nuVal
            ];
        }

        // Calculate Roots
        $chaldeanRoot = $this->reduceToSingle($chaldeanTotal);
        $pythagoreanRoot = $this->reduceToSingle($pythagoreanTotal);
        $numerologyRoot = $this->reduceToSingle($numerologyTotal);

        // Calculate Last 4 Digits
        // Only take the last 4 actual digits if possible, or just last 4 characters if they are digits
        $onlyDigits = preg_replace('/[^0-9]/', '', $cleanNumber);
        $last4Str = substr($onlyDigits, -4);
        if (strlen($last4Str) < 4) {
            // If less than 4 digits, maybe take last 4 chars from cleanNumber?
            // Usually vehicle last 4 are the ones people check.
            $last4Str = substr($cleanNumber, -4);
        }

        $last4Compound = 0;
        foreach (str_split($last4Str) as $char) {
            if (is_numeric($char)) {
                $last4Compound += (int) $char;
            } elseif (isset($chaldeanMap[$char])) {
                $last4Compound += $chaldeanMap[$char]; // Default to Chaldean for last 4 if letters? 
                // Usually last 4 are digits.
            }
        }
        $last4Root = $this->reduceToSingle($last4Compound);

        // Fetch Meaning (Using Chaldean Total for primary meaning)
        $meaningModel = new CompoundNumberModel();
        $meaning = $meaningModel->where('number', $chaldeanTotal)->first();
        $last4Meaning = $meaningModel->where('number', $last4Compound)->first();

        // Save to History
        $clientId = $json->client_id ?? null;
        $saveRecord = $json->save_record ?? true;
        $existingId = $json->id ?? null;
        $savedCheckId = null;

        if ($clientId && $saveRecord) {
            $checkModel = new \App\Models\ClientVehicleCheckModel();
            $saveData = [
                'user_id' => $this->getVendorId(),
                'client_id' => $clientId,
                'vehicle_number' => $vehicle,
                'vehicle_type' => $vehicleType,
                'chaldean_compound' => $chaldeanTotal,
                'pythagorean_compound' => $pythagoreanTotal,
                'numerology_compound' => $numerologyTotal,
                'chaldean_root' => $chaldeanRoot,
                'pythagorean_root' => $pythagoreanRoot,
                'numerology_root' => $numerologyRoot,
                'last_4_numbers' => $last4Str,
                'last_4_compound' => $last4Compound,
                'last_4_root' => $last4Root,
                'result' => $meaning ? $meaning['result'] : '',
                'numerology_result' => ($meaningModel->where('number', $numerologyTotal)->first())['result'] ?? '',
                'l_result' => $last4Meaning ? $last4Meaning['result'] : '',
                'is_confirmed' => 0
            ];

            if ($existingId) {
                // Validate ownership before update
                if (!$this->validateOwnership(\App\Models\ClientVehicleCheckModel::class, $existingId)) {
                    return $this->failForbidden('Access denied');
                }
                $checkModel->update($existingId, $saveData);
                $savedCheckId = $existingId;
            } else {
                $savedCheckId = $checkModel->insert($saveData);
            }
        }

        $response = [
            'vehicle_number' => $vehicle,
            'vehicle_type' => $vehicleType,
            'clean_number' => $cleanNumber,
            'breakdown' => $breakdown,
            'chaldean' => [
                'compound' => $chaldeanTotal,
                'root' => $chaldeanRoot,
                'meaning' => $meaning ? [
                    'title' => $meaning['title'],
                    'description' => $meaning['description'],
                    'result' => $meaning['result']
                ] : null
            ],
            'pythagorean' => [
                'compound' => $pythagoreanTotal,
                'root' => $pythagoreanRoot,
            ],
            'numerology' => [
                'compound' => $numerologyTotal,
                'root' => $numerologyRoot,
                'meaning' => ($meaningModel->where('number', $numerologyTotal)->first()) ? [
                    'title' => ($meaningModel->where('number', $numerologyTotal)->first())['title'],
                    'description' => ($meaningModel->where('number', $numerologyTotal)->first())['description'],
                    'result' => ($meaningModel->where('number', $numerologyTotal)->first())['result']
                ] : null
            ],
            'last4' => [
                'number' => $last4Str,
                'compound' => $last4Compound,
                'root' => $last4Root,
                'meaning' => $last4Meaning ? [
                    'title' => $last4Meaning['title'],
                    'description' => $last4Meaning['description'],
                    'result' => $last4Meaning['result']
                ] : null
            ],
            'check_id' => $savedCheckId
        ];

        return $this->respond($response);
    }

    private function reduceToSingle($number)
    {
        while ($number > 9) {
            $sum = 0;
            foreach (str_split((string) $number) as $digit) {
                $sum += (int) $digit;
            }
            $number = $sum;
        }
        return $number;
    }
}
