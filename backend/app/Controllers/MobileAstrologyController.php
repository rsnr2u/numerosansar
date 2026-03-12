<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use App\Models\CompoundNumberModel;

class MobileAstrologyController extends BaseController
{
    use ResponseTrait;
    public function check()
    {
        if (!$this->checkModuleAccess('mobile')) {
            return $this->failForbidden('Access to Mobile module requires a subscription.');
        }

        $json = $this->request->getJSON();
        $mobile = $json->mobile_number ?? '';
        // Optional DOB to check lucky status
        $dob = $json->dob ?? null;

        if (empty($mobile)) {
            return $this->failValidationError('Mobile number is required');
        }

        // Clean number (remove spaces, dashes)
        $cleanNumber = preg_replace('/[^0-9]/', '', $mobile);

        // Calculate Compound (Sum of all digits)
        $compound = 0;
        $digits = str_split($cleanNumber);
        foreach ($digits as $d) {
            $compound += (int) $d;
        }

        // Calculate Root (Single digit)
        $root = $compound;
        while ($root > 9) {
            $sum = 0;
            $dArr = str_split((string) $root);
            foreach ($dArr as $val) {
                $sum += (int) $val;
            }
            $root = $sum;
        }

        // Fetch Meaning
        $meaningModel = new CompoundNumberModel();
        $meaning = $meaningModel->where('number', $compound)->first();

        // Calculate Last 4 Digits Compound & Meaning
        $last4Str = substr($cleanNumber, -4);
        $last4Compound = 0;
        $l4Digits = str_split($last4Str);
        foreach ($l4Digits as $d) {
            $last4Compound += (int) $d;
        }
        $last4Root = $last4Compound;
        while ($last4Root > 9) {
            $sum = 0;
            $dArr = str_split((string) $last4Root);
            foreach ($dArr as $val) {
                $sum += (int) $val;
            }
            $last4Root = $sum;
        }
        $last4Meaning = $meaningModel->where('number', $last4Compound)->first();

        // Save to History if client matches
        $clientId = $json->client_id ?? null;
        $saveRecord = $json->save_record ?? true;
        $existingId = $json->id ?? null;

        $savedCheckId = null;
        if ($clientId && $saveRecord) {
            $checkModel = new \App\Models\ClientMobileCheckModel();
            $saveData = [
                'user_id' => $this->getVendorId(),
                'client_id' => $clientId,
                'mobile_number' => $mobile,
                'Compound_number' => $compound,
                'total_number' => $root,
                't_result' => $meaning ? $meaning['result'] : '',
                'last_4_numbers' => $last4Str,
                'l_result' => $last4Meaning ? $last4Meaning['result'] : ''
            ];

            if ($existingId) {
                // Validate ownership before update
                if (!$this->validateOwnership(\App\Models\ClientMobileCheckModel::class, $existingId)) {
                    return $this->failForbidden('Access denied');
                }
                $checkModel->update($existingId, $saveData);
                $savedCheckId = $existingId;
            } else {
                $savedCheckId = $checkModel->insert($saveData);
            }
        }

        $response = [
            'mobile_number' => $mobile,
            'compound' => $compound,
            'root' => $root,
            'check_id' => $savedCheckId,
            'meaning' => $meaning ? [
                'title' => $meaning['title'],
                'description' => $meaning['description'],
                'result' => $meaning['result']
            ] : null,
            'last4' => [
                'compound' => $last4Compound,
                'root' => $last4Root,
                'meaning' => $last4Meaning ? [
                    'title' => $last4Meaning['title'],
                    'description' => $last4Meaning['description'],
                    'result' => $last4Meaning['result']
                ] : null
            ]
        ];

        return $this->respond($response);
    }

    public function delete($id = null)
    {
        if (!$id) {
            return $this->failValidationError('ID is required');
        }

        if (!$this->validateOwnership(\App\Models\ClientMobileCheckModel::class, $id)) {
            return $this->failForbidden('Access denied');
        }

        $model = new \App\Models\ClientMobileCheckModel();
        $model->delete($id);
        return $this->respondDeleted(['id' => $id, 'message' => 'Record deleted']);
    }

    public function update($id = null)
    {
        if (!$id) {
            return $this->failValidationError('ID is required');
        }

        if (!$this->validateOwnership(\App\Models\ClientMobileCheckModel::class, $id)) {
            return $this->failForbidden('Access denied');
        }

        $json = $this->request->getJSON();
        $model = new \App\Models\ClientMobileCheckModel();

        $data = [];
        if (isset($json->t_result))
            $data['t_result'] = $json->t_result;

        // Note: result is now t_result. The frontend might send result still? 
        // We should check if frontend sends result and map it to t_result if needed,
        // but ideally frontend sends correct keys. For now, assume consistent backend logic.
        if (isset($json->result))
            $data['t_result'] = $json->result; // Backwards compat just in case

        // Handle re-calculation if mobile number changes
        if (isset($json->mobile_number) && !empty($json->mobile_number)) {
            $mobile = $json->mobile_number;
            $cleanNumber = preg_replace('/[^0-9]/', '', $mobile);

            // Total Compound
            $compound = 0;
            $digits = str_split($cleanNumber);
            foreach ($digits as $d) {
                $compound += (int) $d;
            }

            // Total Root
            $root = $compound;
            while ($root > 9) {
                $sum = 0;
                $dArr = str_split((string) $root);
                foreach ($dArr as $val) {
                    $sum += (int) $val;
                }
                $root = $sum;
            }

            // Meaning
            $meaningModel = new CompoundNumberModel();
            $meaning = $meaningModel->where('number', $compound)->first();

            // Last 4 Digits
            $last4Str = substr($cleanNumber, -4);
            $last4Compound = 0;
            $l4Digits = str_split($last4Str);
            foreach ($l4Digits as $d) {
                $last4Compound += (int) $d;
            }
            $last4Meaning = $meaningModel->where('number', $last4Compound)->first();

            $data['mobile_number'] = $mobile;
            $data['Compound_number'] = $compound;
            $data['total_number'] = $root;
            $data['t_result'] = $meaning ? $meaning['result'] : '';
            $data['last_4_numbers'] = $last4Str;
            $data['l_result'] = $last4Meaning ? $last4Meaning['result'] : '';
        }

        if (empty($data)) {
            return $this->failValidationError('No data to update');
        }

        if ($model->update($id, $data)) {
            // Fetch updated record to return
            $updated = $model->find($id);
            return $this->respond(['id' => $id, 'message' => 'Record updated', 'data' => $updated]);
        }

        return $this->fail('Failed to update record');
    }
}
