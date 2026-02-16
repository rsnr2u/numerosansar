<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

use App\Models\CompoundNumberModel;
use CodeIgniter\API\ResponseTrait;

class AdminController extends BaseController
{
    use ResponseTrait;

    public function calculateName()
    {
        if (!$this->checkModuleAccess('name')) {
            return $this->failForbidden('Feature requires active subscription');
        }

        $name = $this->request->getVar('name');
        $dob = $this->request->getVar('dob'); // Get Date of Birth

        if (!$name) {
            return $this->fail('Name is required');
        }

        $calculator = new \App\Libraries\NumerologyCalculator();
        $result = $calculator->calculate($name, $dob);

        // Save to New History Table
        $clientId = $this->request->getVar('client_id');
        $checkModel = new \App\Models\ClientNameCheckModel();

        $chaldeanRoot = $result['chaldean']['single'];
        $pythagoreanRoot = $result['pythagorean']['single'];

        // Determine suitability if DOB is available
        $chaldeanStatus = 'Pending';
        $pythagoreanStatus = 'Pending';

        if ($dob) {
            $age = $this->calculateAge($dob);
            $driver = $this->calculateDriver($dob);
            $conductor = $this->calculateConductor($dob);

            $chaldeanStatus = $this->classifyName($age, $result['chaldean']['total'], $chaldeanRoot, $driver, $conductor);
            $pythagoreanStatus = $this->classifyName($age, $result['pythagorean']['total'], $pythagoreanRoot, $driver, $conductor);
        }

        $savedId = null;
        $existingId = $this->request->getVar('id');

        if ($clientId || $name) {
            $saveData = [
                'user_id' => $this->getVendorId(),
                'client_id' => $clientId, // Nullable
                'type' => 'Name',
                'name_value' => $name,
                'original_name' => $this->request->getVar('original_name'),
                'chaldean_compound' => $result['chaldean']['total'],
                'pythagorean_compound' => $result['pythagorean']['total'],
                'chaldean_root' => $chaldeanRoot,
                'pythagorean_root' => $pythagoreanRoot,
                'chaldean_result' => $chaldeanStatus,
                'pythagorean_result' => $pythagoreanStatus,
                'is_confirmed' => 0
            ];

            if ($existingId) {
                // Validate ownership before update
                if (!$this->validateOwnership(\App\Models\ClientNameCheckModel::class, $existingId)) {
                    return $this->failForbidden('Access denied');
                }
                $checkModel->update($existingId, $saveData);
                $savedId = $existingId;
            } else {
                $savedId = $checkModel->insert($saveData);
            }
        }

        $result['check_id'] = $savedId;
        $result['chaldean_status'] = $chaldeanStatus;
        $result['pythagorean_status'] = $pythagoreanStatus;

        return $this->respond($result);
    }

    private function calculateAge($dob)
    {
        $dobDate = new \DateTime($dob);
        $now = new \DateTime();
        return $now->diff($dobDate)->y;
    }

    private function calculateDriver($dob)
    {
        $day = date('d', strtotime($dob));
        return $this->reduceToSingleDigit($day);
    }

    private function calculateConductor($dob)
    {
        $sum = 0;
        $digits = str_split(date('Ymd', strtotime($dob)));
        foreach ($digits as $d) {
            $sum += (int) $d;
        }
        return $this->reduceToSingleDigit($sum);
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

    private function classifyName($age, $compound, $root, $driver, $conductor)
    {
        $compoundModel = new \App\Models\CompoundNumberModel();

        // 1. Fetch inherent compound vibration directly
        $compoundData = $compoundModel->where('number', $compound)->first();

        // Return the vibration from settings, or 'Analyzed' if missing
        return $compoundData['result'] ?? 'Analyzed';
    }

    private function parseNumberList($str)
    {
        if (empty($str))
            return [];
        return array_map('trim', explode(',', $str));
    }


    public function listMeanings()
    {
        $model = new CompoundNumberModel();
        return $this->respond($model->findAll());
    }

    public function saveMeaning()
    {
        $model = new CompoundNumberModel();
        $data = [
            'id' => $this->request->getVar('id'),
            'number' => $this->request->getVar('number'),
            'title' => $this->request->getVar('title'),
            'description' => $this->request->getVar('description'),
            'result' => $this->request->getVar('result'),
        ];

        if ($data['id']) {
            $model->update($data['id'], $data);
        } else {
            unset($data['id']);
            $model->insert($data);
        }

        return $this->respond(['message' => 'Saved successfully']);
    }

    public function deleteMeaning($id)
    {
        $model = new CompoundNumberModel();
        $model->delete($id);
        return $this->respond(['message' => 'Deleted successfully']);
    }

    public function listPlanets()
    {
        $model = new \App\Models\NumerologyPlanetModel();
        return $this->respond($model->findAll());
    }

    public function listLetters()
    {
        $model = new \App\Models\NumerologySystemModel();
        return $this->respond($model->findAll());
    }

    public function getGlobalHistory()
    {
        $vendorId = $this->getVendorId();
        $model = new \App\Models\ClientNameCheckModel();

        $query = $model->orderBy('created_at', 'DESC');
        if ($this->getVendorRole() !== 'super_admin') {
            $query->where('user_id', $vendorId);
        }

        $data = $query->findAll(20);

        $formatted = array_map(function ($row) {
            return [
                'id' => $row['id'],
                'name' => $row['name_value'],
                'chaldean_total' => $row['chaldean_compound'],
                'pythagorean_total' => $row['pythagorean_compound'],
                'created_at' => $row['created_at']
            ];
        }, $data);

        return $this->respond($formatted);
    }

    public function getDashboardStats()
    {
        $vendorId = $this->getVendorId();
        $clientModel = new \App\Models\ClientModel();
        $nameCheckModel = new \App\Models\ClientNameCheckModel();
        $mobileCheckModel = new \App\Models\ClientMobileCheckModel();
        $vehicleCheckModel = new \App\Models\ClientVehicleCheckModel();

        if ($this->getVendorRole() !== 'super_admin') {
            $clientModel->where('user_id', $vendorId);
            $nameCheckModel->where('user_id', $vendorId);
            $mobileCheckModel->where('user_id', $vendorId);
            $vehicleCheckModel->where('user_id', $vendorId);
        }

        $totalNameChecks = $nameCheckModel->countAllResults(false);
        $totalMobileChecks = $mobileCheckModel->countAllResults(false);
        $totalVehicleChecks = $vehicleCheckModel->countAllResults(false);

        $stats = [
            'total_clients' => $clientModel->countAllResults(false),
            'total_checks' => $totalNameChecks + $totalMobileChecks + $totalVehicleChecks,
            'total_compounds' => $totalNameChecks + $totalMobileChecks + $totalVehicleChecks, // Reinterpreted as "Archive Items"
            'recent_clients' => $clientModel->orderBy('created_at', 'DESC')->findAll(5),
            'recent_checks' => $nameCheckModel->orderBy('created_at', 'DESC')->findAll(5),
        ];

        return $this->respond($stats);
    }
}
