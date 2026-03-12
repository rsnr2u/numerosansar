<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\PaymentModel;
use CodeIgniter\API\ResponseTrait;

class PaymentsController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $limit = $this->request->getGet('limit') ?? 20;
        $page = $this->request->getGet('page') ?? 1;
        $offset = ($page - 1) * $limit;

        $db = \Config\Database::connect();
        $builder = $db->table('payments p');
        $builder->select('p.*, u.username, u.full_name, sp.name as plan_name');
        $builder->join('users u', 'u.id = p.user_id', 'left');
        $builder->join('subscription_plans sp', 'sp.id = p.plan_id', 'left');

        $totalBuilder = clone $builder;
        $total = $totalBuilder->countAllResults();

        $builder->orderBy('p.created_at', 'DESC');
        $builder->limit($limit, $offset);

        return $this->respond([
            'data' => $builder->get()->getResult(),
            'pagination' => [
                'total' => $total,
                'page' => (int) $page,
                'limit' => (int) $limit,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }

    public function dashboardStats()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $db = \Config\Database::connect();
        $stats = [
            'monthly_revenue' => $db->table('payments')
                ->selectSum('amount')
                ->where('status', 'paid')
                ->where('created_at >=', date('Y-m-01 00:00:00'))
                ->get()->getRow()->amount ?? 0,
            'yearly_revenue' => $db->table('payments')
                ->selectSum('amount')
                ->where('status', 'paid')
                ->where('created_at >=', date('Y-01-01 00:00:00'))
                ->get()->getRow()->amount ?? 0,
            'total_vendors' => $db->table('users')->where('role', 'numerologist')->countAllResults(),
            'active_numerologists' => $db->table('users')
                ->where('role', 'numerologist')
                ->where('account_status', 'Active')
                ->countAllResults(),
            'failed_payments' => $db->table('payments')->where('status', 'failed')->countAllResults(),
            'pending_credits' => $db->table('credit_purchases')->where('status', 'pending')->countAllResults(),
            'total_credits_sold' => $db->table('credit_purchases')
                ->selectSum('credits')
                ->where('status', 'completed')
                ->get()->getRow()->credits ?? 0,
            'system_credit_balance' => $db->table('users')
                ->selectSum('credits')
                ->get()->getRow()->credits ?? 0,
        ];

        return $this->respond($stats);
    }

    public function getTrendData()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $db = \Config\Database::connect();
        $builder = $db->table('payments');
        $builder->select("DATE(created_at) as date, SUM(amount) as total");
        $builder->where('status', 'paid');
        $builder->where('created_at >=', date('Y-m-d', strtotime('-10 days')));
        $builder->groupBy('DATE(created_at)');
        $builder->orderBy('date', 'ASC');

        return $this->respond($builder->get()->getResult());
    }
}
