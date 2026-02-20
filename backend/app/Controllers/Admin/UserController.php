<?php

namespace App\Controllers\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class UserController extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format = 'json';

    public function index()
    {
        // Only super_admin can list users
        $userData = $this->request->userData ?? null;
        if (!$userData || $userData['role'] !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can manage users');
        }

        $users = $this->model->select('id, username, full_name, role, email, mobile, business_name, city, created_at')->findAll();
        return $this->respond($users);
    }

    public function getVendors()
    {
        $userData = $this->request->userData ?? null;
        if (!$userData || $userData['role'] !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        // Get filter and pagination parameters
        $city = $this->request->getGet('city');
        $month = $this->request->getGet('month');
        $year = $this->request->getGet('year');
        $startDate = $this->request->getGet('start_date');
        $endDate = $this->request->getGet('end_date');
        $status = $this->request->getGet('status');
        $searchTerm = $this->request->getGet('search');

        $page = (int) ($this->request->getGet('page') ?? 1);
        $limit = (int) ($this->request->getGet('limit') ?? 10);
        $offset = ($page - 1) * $limit;

        $db = \Config\Database::connect();
        $builder = $db->table('users u');
        $builder->select('u.id, u.username, u.full_name, u.email, u.mobile, u.business_name, u.city, u.created_at, s.status as sub_status, s.ends_at, sp.name as plan_name, (SELECT COUNT(*) FROM clients WHERE user_id = u.id) as client_count');
        $builder->join('subscriptions s', 's.user_id = u.id', 'left');
        $builder->join('subscription_plans sp', 'sp.id = s.plan_id', 'left');
        $builder->where('u.role', 'numerologist');

        // Apply dynamic filters
        if (!empty($city)) {
            $builder->like('u.city', $city);
        }

        if (!empty($searchTerm)) {
            $builder->groupStart()
                ->like('u.username', $searchTerm)
                ->orLike('u.full_name', $searchTerm)
                ->orLike('u.email', $searchTerm)
                ->orLike('u.business_name', $searchTerm)
                ->groupEnd();
        }

        if (!empty($status) && $status !== 'all') {
            if ($status === 'active') {
                $builder->where('s.status', 'active');
            } else {
                $builder->where('s.status !=', 'active');
            }
        }

        if (!empty($month)) {
            $builder->where('MONTH(u.created_at)', $month);
        }

        if (!empty($year)) {
            $builder->where('YEAR(u.created_at)', $year);
        }

        if (!empty($startDate)) {
            $builder->where('u.created_at >=', $startDate . ' 00:00:00');
        }

        if (!empty($endDate)) {
            $builder->where('u.created_at <=', $endDate . ' 23:59:59');
        }

        // Get total count for pagination metadata
        $totalBuilder = clone $builder;
        $total = $totalBuilder->countAllResults();

        $builder->orderBy('u.created_at', 'DESC');
        $builder->limit($limit, $offset);

        $vendors = $builder->get()->getResult();

        return $this->respond([
            'data' => $vendors,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }

    public function show($id = null)
    {
        try {
            $userData = $this->request->userData ?? null;

            if (!$userData || $userData['role'] !== 'super_admin') {
                return $this->failForbidden('Access denied');
            }

            $db = \Config\Database::connect();

            // 1. Basic Info
            $vendor = $db->table('users')
                ->select('id, username, full_name, email, mobile, business_name, city, address, role, account_status, last_login, last_ip, created_at')
                ->where('id', $id)
                ->get()->getRow();

            if (!$vendor) {
                return $this->failNotFound('Vendor not found with ID: ' . $id);
            }

            // 2. Subscription Info
            $subscription = $db->table('subscriptions s')
                ->select('s.*, sp.name as plan_name')
                ->join('subscription_plans sp', 'sp.id = s.plan_id', 'left')
                ->where('s.user_id', $id)
                ->get()->getRow();

            // 3. Usage Metrics
            $metrics = [
                'total_clients' => $db->table('clients')->where('user_id', $id)->countAllResults(),
                'name_checks' => $db->table('client_name_checks')->where('user_id', $id)->countAllResults(),
                'business_checks' => $db->table('client_business_checks bc')
                    ->join('clients c', 'c.id = bc.client_id')
                    ->where('c.user_id', $id)->countAllResults(),
                'mobile_checks' => $db->table('client_mobile_checks')->where('user_id', $id)->countAllResults(),
                'vehicle_checks' => $db->table('client_vehicle_checks')->where('user_id', $id)->countAllResults(),
                'confirmed_results' =>
                    $db->table('client_name_checks')->where('user_id', $id)->where('is_confirmed', '1')->countAllResults() +
                    $db->table('client_business_checks bc')
                        ->join('clients c', 'c.id = bc.client_id')
                        ->where('c.user_id', $id)->where('bc.is_confirmed', '1')->countAllResults() +
                    $db->table('client_mobile_checks')->where('user_id', $id)->countAllResults() + // Mobile checks lack is_confirmed, assuming all valid
                    $db->table('client_vehicle_checks')->where('user_id', $id)->where('is_confirmed', '1')->countAllResults()
            ];

            // 4. Recent Clients with Intelligence Meta
            $recent_clients = $db->table('clients c')
                ->select('c.*, 
                    (SELECT COUNT(*) FROM client_name_checks WHERE client_id = c.id) + 
                    (SELECT COUNT(*) FROM client_business_checks WHERE client_id = c.id) + 
                    (SELECT COUNT(*) FROM client_mobile_checks WHERE client_id = c.id) + 
                    (SELECT COUNT(*) FROM client_vehicle_checks WHERE client_id = c.id) as check_count')
                ->where('c.user_id', $id)
                ->orderBy('c.created_at', 'DESC')
                ->limit(10)
                ->get()->getResult();

            // 5. Full Payment Ledger
            $payments = $db->table('payments p')
                ->select('p.*, sp.name as plan_name')
                ->join('subscription_plans sp', 'sp.id = p.plan_id', 'left')
                ->where('p.user_id', $id)
                ->orderBy('p.created_at', 'DESC')
                ->get()->getResult();

            // 6. Audit Trail
            $audit = $db->table('audit_logs')
                ->where('target_id', $id)
                ->orWhere('performed_by', $id)
                ->orderBy('id', 'DESC')
                ->limit(20)
                ->get()->getResult();

            return $this->respond([
                'profile' => $vendor,
                'subscription' => $subscription,
                'metrics' => $metrics,
                'recent_clients' => $recent_clients,
                'payments' => $payments,
                'audit_logs' => $audit
            ]);
        } catch (\Exception $e) {
            return $this->respond(['_error' => true, 'message' => $e->getMessage()], 500);
        }
    }

    public function updateStatus($id = null)
    {
        $userData = $this->request->userData ?? null;
        if (!$userData || $userData['role'] !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $json = $this->request->getJSON();
        $status = $json->status ?? 'Active'; // Note: Migration uses 'Active', 'Suspended', 'Blocked'

        $db = \Config\Database::connect();

        // Update both user status and subscription status for clarity
        $db->table('users')->where('id', $id)->update(['account_status' => $status]);

        $subStatus = ($status === 'Active') ? 'active' : (($status === 'Suspended') ? 'suspended' : 'canceled');
        $db->table('subscriptions')->where('user_id', $id)->update(['status' => $subStatus]);

        $this->logActivity("status_change", $id, "Updated to $status");

        return $this->respond(['message' => "Vendor status updated to $status"]);
    }

    public function updateSubscription($id = null)
    {
        $userData = $this->request->userData ?? null;
        if (!$userData || $userData['role'] !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $json = $this->request->getJSON();
        $planId = $json->plan_id ?? null;
        $billingCycle = $json->billing_cycle ?? 'monthly';
        $endsAt = $json->ends_at ?? null;

        if (!$planId) {
            return $this->fail('Plan ID is required');
        }

        $db = \Config\Database::connect();

        $sub = $db->table('subscriptions')->where('user_id', $id)->get()->getRow();

        $data = [
            'user_id' => $id,
            'plan_id' => $planId,
            'billing_cycle' => $billingCycle,
            'status' => 'active'
        ];

        if ($endsAt) {
            $data['ends_at'] = $endsAt;
        }

        if ($sub) {
            $db->table('subscriptions')->where('id', $sub->id)->update($data);
        } else {
            $data['starts_at'] = date('Y-m-d H:i:s');
            if (!$endsAt) {
                $data['ends_at'] = date('Y-m-d H:i:s', strtotime('+30 days'));
            }
            $db->table('subscriptions')->insert($data);
        }

        $this->logActivity("subscription_override", $id, "Updated plan to #$planId");

        return $this->respond(['message' => "Vendor subscription updated"]);
    }

    public function create()
    {
        $userData = $this->request->userData ?? null;
        if (!$userData || $userData['role'] !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can manage users');
        }

        $data = $this->request->getJSON(true);
        $planId = $data['plan_id'] ?? null;
        $billingCycle = $data['billing_cycle'] ?? 'monthly';
        unset($data['plan_id'], $data['billing_cycle']);

        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if (!$this->model->insert($data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        $userId = $this->model->getInsertID();

        if ($planId) {
            $db = \Config\Database::connect();
            $db->table('subscriptions')->insert([
                'user_id' => $userId,
                'plan_id' => $planId,
                'billing_cycle' => $billingCycle,
                'status' => 'active',
                'starts_at' => date('Y-m-d H:i:s'),
                'ends_at' => date('Y-m-d H:i:s', strtotime($billingCycle === 'yearly' ? '+1 year' : '+30 days'))
            ]);
        }

        return $this->respondCreated(['id' => $userId, 'message' => 'User created successfully']);
    }

    public function update($id = null)
    {
        $userData = $this->request->userData ?? null;
        if (!$userData || $userData['role'] !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can manage users');
        }

        $user = $this->model->find($id);
        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $data = $this->request->getJSON(true);

        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        } else {
            unset($data['password']);
        }

        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        return $this->respond(['message' => 'User updated successfully']);
    }

    public function delete($id = null)
    {
        $userData = $this->request->userData ?? null;
        if (!$userData || $userData['role'] !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can manage users');
        }

        if ($userData['uid'] == $id) {
            return $this->fail('You cannot delete yourself');
        }

        if (!$this->model->find($id)) {
            return $this->failNotFound('User not found');
        }

        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'User deleted successfully']);
    }

    public function getRegistrationStats()
    {
        $userData = $this->request->userData ?? null;
        if (!$userData || $userData['role'] !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $db = \Config\Database::connect();
        $builder = $db->table('users');
        $builder->select("DATE(created_at) as date, COUNT(*) as count");
        $builder->where('role', 'numerologist');
        $builder->where('created_at >=', date('Y-m-d', strtotime('-7 days')));
        $builder->groupBy('DATE(created_at)');
        $builder->orderBy('date', 'ASC');

        return $this->respond($builder->get()->getResult());
    }

    private function logActivity($action, $target_id, $details)
    {
        $db = \Config\Database::connect();
        $userData = $this->request->userData ?? null;
        $db->table('audit_logs')->insert([
            'performed_by' => $userData['uid'] ?? null,
            'action' => $action,
            'target_id' => $target_id,
            'details' => $details,
            'ip_address' => $this->request->getIPAddress(),
            'created_at' => date('Y-m-d H:i:s')
        ]);
    }
}
