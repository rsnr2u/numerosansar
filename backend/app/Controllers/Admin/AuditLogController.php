<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\AuditLogModel;
use CodeIgniter\API\ResponseTrait;

class AuditLogController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Access denied');
        }

        $limit = $this->request->getGet('limit') ?? 20;
        $page = $this->request->getGet('page') ?? 1;
        $search = $this->request->getGet('search');
        $offset = ($page - 1) * $limit;

        $db = \Config\Database::connect();
        $builder = $db->table('audit_logs a');
        $builder->select('a.*, u.username as performer_name');
        $builder->join('users u', 'u.id = a.performed_by', 'left');

        if ($search) {
            $builder->groupStart()
                ->like('a.action', $search)
                ->orLike('u.username', $search)
                ->orLike('a.details', $search)
                ->groupEnd();
        }

        $totalBuilder = clone $builder;
        $total = $totalBuilder->countAllResults();

        $builder->orderBy('a.created_at', 'DESC');
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
}
