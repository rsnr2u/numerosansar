<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use App\Models\ClientModel;

class ClientController extends BaseController
{
    use ResponseTrait;
    protected $model;

    public function __construct()
    {
        $this->model = new ClientModel();
    }

    public function index()
    {
        try {
            $search = $this->request->getGet('search');
            $vendorIdFilter = $this->request->getGet('vendor_id');
            $vendorId = $this->getVendorId();

            $perPage = $this->request->getGet('per_page') ?? 10;
            $page = $this->request->getGet('page') ?? 1;
            $shouldPaginate = $this->request->getGet('paginate') === 'true';

            $this->model->select('clients.*, users.full_name as added_by_name, 
                ((SELECT COUNT(*) FROM client_name_checks WHERE client_id = clients.id) + 
                 (SELECT COUNT(*) FROM client_business_checks WHERE client_id = clients.id) + 
                 (SELECT COUNT(*) FROM client_mobile_checks WHERE client_id = clients.id) + 
                 (SELECT COUNT(*) FROM client_vehicle_checks WHERE client_id = clients.id)) as check_count');
            $this->model->join('users', 'users.id = clients.user_id', 'left');

            if ($this->getVendorRole() === 'super_admin') {
                if ($vendorIdFilter) {
                    $this->model->where('clients.user_id', $vendorIdFilter);
                }
            } else {
                $this->model->where('clients.user_id', $vendorId);
            }

            if ($search) {
                $this->model->groupStart()
                    ->like('clients.full_name', $search)
                    ->orLike('clients.calling_name', $search)
                    ->groupEnd();
            }

            if ($shouldPaginate) {
                $totalRecords = $this->model->countAllResults(false);
                $data = $this->model->orderBy('id', 'DESC')->paginate((int) $perPage, 'default', (int) $page);

                return $this->respond([
                    'data' => $data,
                    'total' => $totalRecords,
                    'current_page' => (int) $page,
                    'per_page' => (int) $perPage
                ]);
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
        if (!$this->validateOwnership(ClientModel::class, $id)) {
            return $this->failForbidden('Access denied');
        }

        $data = $this->model->find($id);
        return $this->respond($data);
    }

    // POST /api/admin/clients
    public function create()
    {
        $vendorId = $this->getVendorId();
        if (!$vendorId) {
            return $this->failUnauthorized('Authentication required');
        }

        if (!$this->checkUsageLimit()) {
            return $this->failForbidden('Client limit reached for your current plan. Please upgrade.');
        }

        $data = $this->request->getJSON(true);
        $data['user_id'] = $vendorId;

        if (!$this->model->insert($data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        return $this->respondCreated(['id' => $this->model->getInsertID(), 'message' => 'Client added successfully']);
    }

    // PUT /api/admin/clients/(:id)
    public function update($id = null)
    {
        if (!$this->validateOwnership(ClientModel::class, $id)) {
            return $this->failForbidden('Access denied');
        }

        $data = $this->request->getJSON(true);
        unset($data['user_id']); // Prevent changing owner

        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        return $this->respond(['message' => 'Client updated successfully']);
    }

    // DELETE /api/admin/clients/(:id)
    public function delete($id = null)
    {
        if (!$this->validateOwnership(ClientModel::class, $id)) {
            return $this->failForbidden('Access denied');
        }

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Client deleted successfully']);
    }

    // GET /api/admin/clients/(:id)/history
    public function getHistory($id = null)
    {
        if (!$this->validateOwnership(ClientModel::class, $id)) {
            return $this->failForbidden('Access denied');
        }

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

        usort($combined, function ($a, $b) {
            return strtotime($b['created_at'] ?? 0) - strtotime($a['created_at'] ?? 0);
        });

        return $this->respond($combined);
    }

    // POST /api/admin/numerology/confirm
    public function confirmSelection()
    {
        $id = $this->request->getVar('check_id');
        $type = $this->request->getVar('type');

        if (!$id || !$type) {
            return $this->fail('Check ID and Type are required');
        }

        $modelClass = null;
        switch ($type) {
            case 'Name':
                $modelClass = \App\Models\ClientNameCheckModel::class;
                break;
            case 'Business':
                $modelClass = \App\Models\ClientBusinessCheckModel::class;
                break;
            case 'Mobile':
                $modelClass = \App\Models\ClientMobileCheckModel::class;
                break;
            case 'Vehicle':
                $modelClass = \App\Models\ClientVehicleCheckModel::class;
                break;
            default:
                return $this->fail('Invalid type');
        }

        if (!$this->validateOwnership($modelClass, $id)) {
            return $this->failForbidden('Access denied');
        }

        $model = new $modelClass();
        $check = $model->find($id);
        $clientId = $check['client_id'];

        // Un-confirm others of same type for this client
        $model->where(['client_id' => $clientId])->set(['is_confirmed' => 0])->update();

        // Confirm this one
        $model->update($id, ['is_confirmed' => 1]);

        if ($type === 'Name') {
            $clientModel = new ClientModel();
            $clientModel->update($clientId, ['calling_name' => $check['name_value']]);
        }

        return $this->respond(['message' => 'Selection confirmed successfully']);
    }
}
