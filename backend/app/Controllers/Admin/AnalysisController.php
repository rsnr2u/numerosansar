<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;

class AnalysisController extends BaseController
{
    use ResponseTrait;

    /**
     * GET /api/admin/analyses/stats
     */
    public function stats()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $db = \Config\Database::connect();

        // 1. Overview Metrics
        $totalAnalyses = $db->table('credit_usage')->countAllResults();
        $todayAnalyses = $db->table('credit_usage')
            ->where('DATE(created_at)', date('Y-m-d'))
            ->countAllResults();

        $todayCredits = $db->table('credit_usage')
            ->where('DATE(created_at)', date('Y-m-d'))
            ->countAllResults(); // Default 1 credit per analysis as per user prompt

        $activeNumerologistsToday = $db->table('credit_usage')
            ->where('DATE(created_at)', date('Y-m-d'))
            ->select('COUNT(DISTINCT user_id) as count')
            ->get()->getRow()->count ?? 0;

        // 2. Type Distribution
        $typeDistribution = $db->table('credit_usage')
            ->select('check_type as type, COUNT(*) as count')
            ->groupBy('check_type')
            ->get()->getResult();

        // 3. High Usage Users (Suspicious Activity)
        $highUsage = $db->table('credit_usage cu')
            ->select('u.full_name as numerologist, COUNT(*) as count')
            ->join('users u', 'u.id = cu.user_id')
            ->where('DATE(cu.created_at)', date('Y-m-d'))
            ->groupBy('cu.user_id')
            ->orderBy('count', 'DESC')
            ->limit(5)
            ->get()->getResult();

        return $this->respond([
            'summary' => [
                'total_analyses' => (int) $totalAnalyses,
                'today_analyses' => (int) $todayAnalyses,
                'today_credits' => (int) $todayCredits,
                'active_numerologists' => (int) $activeNumerologistsToday
            ],
            'distribution' => $typeDistribution,
            'high_usage' => $highUsage
        ]);
    }

    /**
     * GET /api/admin/analyses
     * Query: ?search=...&type=...&user_id=...&page=1&limit=25
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
        $type = $this->request->getGet('type');
        $vendorId = $this->request->getGet('user_id');

        $db = \Config\Database::connect();
        $builder = $db->table('credit_usage cu');
        $builder->select('cu.*, u.username as vendor_username, u.full_name as vendor_name, c.full_name as client_name');
        $builder->join('users u', 'u.id = cu.user_id', 'left');
        $builder->join('clients c', 'c.id = cu.client_id', 'left');

        if ($searchTerm) {
            $builder->groupStart()
                ->like('u.full_name', $searchTerm)
                ->orLike('c.full_name', $searchTerm)
                ->groupEnd();
        }

        if ($type && $type !== 'all') {
            $builder->where('cu.check_type', $type);
        }

        if ($vendorId) {
            $builder->where('cu.user_id', $vendorId);
        }

        $totalBuilder = clone $builder;
        $total = $totalBuilder->countAllResults();

        $builder->orderBy('cu.created_at', 'DESC');
        $builder->limit($limit, $offset);

        $results = $builder->get()->getResultArray();

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
     * GET /api/admin/analyses/(:num)
     */
    public function show($id)
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $db = \Config\Database::connect();

        // 1. Get usage record
        $usage = $db->table('credit_usage')->where('id', $id)->get()->getRowArray();
        if (!$usage)
            return $this->failNotFound('Usage record not found');

        // 2. Get client info
        $client = $db->table('clients')->where('id', $usage['client_id'])->get()->getRowArray();

        // 3. Get vendor info
        $vendor = $db->table('users')->where('id', $usage['user_id'])->select('full_name, username')->get()->getRowArray();

        // 4. Get specific analysis result
        $tableMapping = [
            'Name' => 'client_name_checks',
            'Business' => 'client_business_checks',
            'Mobile' => 'client_mobile_checks',
            'Vehicle' => 'client_vehicle_checks'
        ];

        $tableName = $tableMapping[$usage['check_type']] ?? 'client_name_checks';
        $result = $db->table($tableName)->where('id', $usage['check_id'])->get()->getRowArray();

        return $this->respond([
            'usage' => $usage,
            'client' => $client,
            'vendor' => $vendor,
            'result' => $result
        ]);
    }
}
