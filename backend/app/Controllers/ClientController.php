<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ClientModel;

class ClientController extends ResourceController
{
    protected $modelName = 'App\Models\ClientModel';
    protected $format = 'json';

    // GET /api/admin/clients
    public function index()
    {
        try {
            $search = $this->request->getGet('search');

            if ($search) {
                $this->model->groupStart()
                    ->like('full_name', $search)
                    ->orLike('calling_name', $search)
                    ->orLike('email_id', $search)
                    ->orLike('mobile_number', $search)
                    ->groupEnd();
            }

            $data = $this->model->orderBy('id', 'DESC')->findAll(100);
            return $this->respond($data);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    // GET /api/admin/clients/(:id)
    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data)
            return $this->failNotFound('Client not found');
        return $this->respond($data);
    }

    // POST /api/admin/clients
    public function create()
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->insert($data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        return $this->respondCreated(['id' => $this->model->getInsertID(), 'message' => 'Client added successfully']);
    }

    // PUT /api/admin/clients/(:id)
    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->find($id)) {
            return $this->failNotFound('Client not found');
        }
        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        return $this->respond(['message' => 'Client updated successfully']);
    }

    // DELETE /api/admin/clients/(:id)
    public function delete($id = null)
    {
        if (!$this->model->find($id)) {
            return $this->failNotFound('Client not found');
        }
        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Client deleted successfully']);
    }

    // GET /api/admin/clients/(:id)/history
    public function getHistory($id = null)
    {
        $nameModel = new \App\Models\ClientNameCheckModel();
        $businessModel = new \App\Models\ClientBusinessCheckModel();
        $mobileModel = new \App\Models\ClientMobileCheckModel();
        $vehicleModel = new \App\Models\ClientVehicleCheckModel();

        $names = $nameModel->where('client_id', $id)->findAll();
        $business = $businessModel->where('client_id', $id)->findAll();
        $mobile = $mobileModel->where('client_id', $id)->findAll();
        $vehicle = $vehicleModel->where('client_id', $id)->findAll();

        $combined = [];

        foreach ($names as $n) {
            $n['type'] = 'Name';
            $n['name_value'] = $n['name_value'];
            $combined[] = $n;
        }
        foreach ($business as $b) {
            $b['type'] = 'Business';
            $b['name_value'] = $b['business_name'];
            $combined[] = $b;
        }
        foreach ($mobile as $m) {
            $m['type'] = 'Mobile';
            $m['name_value'] = $m['mobile_number'];
            $combined[] = $m;
        }
        foreach ($vehicle as $v) {
            $v['type'] = 'Vehicle';
            $v['name_value'] = $v['vehicle_number'];
            $combined[] = $v;
        }

        // Sort by created_at DESC
        usort($combined, function ($a, $b) {
            return strtotime($b['created_at']) - strtotime($a['created_at']);
        });

        return $this->response->setJSON($combined);
    }

    // POST /api/admin/numerology/confirm
    public function confirmSelection()
    {
        $id = $this->request->getVar('check_id');
        $type = $this->request->getVar('type'); // Name, Business, Mobile, Vehicle

        if (!$id || !$type) {
            return $this->fail('Check ID and Type are required');
        }

        $model = null;
        switch ($type) {
            case 'Name':
                $model = new \App\Models\ClientNameCheckModel();
                break;
            case 'Business':
                $model = new \App\Models\ClientBusinessCheckModel();
                break;
            case 'Mobile':
                $model = new \App\Models\ClientMobileCheckModel();
                break;
            case 'Vehicle':
                $model = new \App\Models\ClientVehicleCheckModel();
                break;
            default:
                return $this->fail('Invalid type');
        }

        $check = $model->find($id);
        if (!$check) {
            return $this->failNotFound('Check record not found');
        }

        $clientId = $check['client_id'];
        if (!$clientId) {
            return $this->fail('No client linked to this check');
        }

        // 1. Un-confirm any previous selection of the same type for this client
        $model->where([
            'client_id' => $clientId
        ])->set(['is_confirmed' => 0])->update();

        // 2. Confirm the selected check
        $model->update($id, ['is_confirmed' => 1]);

        // 3. If it's a Name check, sync the calling_name to the client's profile
        if ($type === 'Name') {
            $clientModel = new \App\Models\ClientModel();
            $clientModel->update($clientId, ['calling_name' => $check['name_value']]);
        }

        return $this->respond([
            'message' => 'Selection confirmed successfully',
            'type' => $type,
            'value' => $check['name_value'] ?? ($check['business_name'] ?? ($check['mobile_number'] ?? ($check['vehicle_number'] ?? '')))
        ]);
    }
}
