<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\CreditPurchaseModel;
use CodeIgniter\API\ResponseTrait;

class TransactionController extends BaseController
{
    use ResponseTrait;

    /**
     * GET /api/admin/transactions
     * Query: ?search=...&status=...&package=...&start_date=...&end_date=...&page=1&limit=25
     */
    public function index()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $limit = (int) ($this->request->getGet('limit') ?? 25);
        $page = (int) ($this->request->getGet('page') ?? 1);
        $offset = ($page - 1) * $limit;

        $searchTerm = $this->request->getGet('search');
        $status = $this->request->getGet('status');
        $package = $this->request->getGet('package');
        $startDate = $this->request->getGet('start_date');
        $endDate = $this->request->getGet('end_date');

        $db = \Config\Database::connect();
        $builder = $db->table('credit_purchases p');
        $builder->select('p.*, u.username, u.full_name as vendor_name, u.email');
        $builder->join('users u', 'u.id = p.user_id', 'left');

        if ($searchTerm) {
            $builder->groupStart()
                ->like('u.full_name', $searchTerm)
                ->orLike('u.username', $searchTerm)
                ->orLike('u.email', $searchTerm)
                ->orLike('p.id', $searchTerm)
                ->orLike('p.payment_reference', $searchTerm)
                ->groupEnd();
        }

        if ($status && $status !== 'all') {
            $builder->where('p.status', $status);
        }

        if ($package && $package !== 'all') {
            // Package inference logic for filtering
            if ($package === 'Starter')
                $builder->where('p.quantity', 10);
            elseif ($package === 'Professional')
                $builder->where('p.quantity', 30);
            elseif ($package === 'Master')
                $builder->where('p.quantity', 100);
        }

        if ($startDate) {
            $builder->where('p.created_at >=', $startDate . ' 00:00:00');
        }
        if ($endDate) {
            $builder->where('p.created_at <=', $endDate . ' 23:59:59');
        }

        $totalBuilder = clone $builder;
        $total = $totalBuilder->countAllResults();

        $builder->orderBy('p.created_at', 'DESC');
        $builder->limit($limit, $offset);

        $results = $builder->get()->getResultArray();

        // Enhance results with Package Name inference
        foreach ($results as &$row) {
            $row['package_name'] = $this->inferPackageName($row['quantity']);
            $row['display_id'] = 'TXN' . str_pad($row['id'], 6, '0', STR_PAD_LEFT);
        }

        return $this->respond([
            'data' => $results,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }

    /**
     * GET /api/admin/transactions/stats
     */
    public function getStats()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $db = \Config\Database::connect();

        // Total Revenue
        $totalRevenue = $db->table('credit_purchases')
            ->where('status', 'completed')
            ->selectSum('total_amount')
            ->get()->getRow()->total_amount ?? 0;

        // Today's Revenue
        $todayRevenue = $db->table('credit_purchases')
            ->where('status', 'completed')
            ->where('DATE(created_at)', date('Y-m-d'))
            ->selectSum('total_amount')
            ->get()->getRow()->total_amount ?? 0;

        // This Month's Revenue
        $monthRevenue = $db->table('credit_purchases')
            ->where('status', 'completed')
            ->where('created_at >=', date('Y-m-01 00:00:00'))
            ->selectSum('total_amount')
            ->get()->getRow()->total_amount ?? 0;

        // Total Transactions Count
        $totalCount = $db->table('credit_purchases')->countAllResults();

        // Monthly Trends (Last 6 months)
        $trends = $db->table('credit_purchases')
            ->select("DATE_FORMAT(created_at, '%b %Y') as month, SUM(total_amount) as amount")
            ->where('status', 'completed')
            ->where('created_at >=', date('Y-m-d', strtotime('-6 months')))
            ->groupBy("DATE_FORMAT(created_at, '%b %Y')")
            ->orderBy('created_at', 'ASC')
            ->get()->getResult();

        return $this->respond([
            'summary' => [
                'total_revenue' => (float) $totalRevenue,
                'today_revenue' => (float) $todayRevenue,
                'month_revenue' => (float) $monthRevenue,
                'total_transactions' => (int) $totalCount
            ],
            'trends' => $trends
        ]);
    }

    /**
     * GET /api/admin/transactions/(:num)
     */
    public function show($id)
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $db = \Config\Database::connect();
        $builder = $db->table('credit_purchases p');
        $builder->select('p.*, u.username, u.full_name as vendor_name, u.email, u.mobile');
        $builder->join('users u', 'u.id = p.user_id', 'left');
        $builder->where('p.id', $id);

        $transaction = $builder->get()->getRowArray();

        if (!$transaction) {
            return $this->failNotFound('Transaction not found');
        }

        $transaction['package_name'] = $this->inferPackageName($transaction['quantity']);
        $transaction['display_id'] = 'TXN' . str_pad($transaction['id'], 6, '0', STR_PAD_LEFT);

        return $this->respond($transaction);
    }

    private function inferPackageName($quantity)
    {
        if ($quantity == 10)
            return 'Starter Pack';
        if ($quantity == 30)
            return 'Professional Pack';
        if ($quantity == 100)
            return 'Master Pack';
        if ($quantity == 3)
            return 'Free Trial';
        return 'Custom Pack';
    }
}
