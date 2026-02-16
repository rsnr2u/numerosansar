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

        $db = \Config\Database::connect();
        $builder = $db->table('audit_logs a');
        $builder->select('a.*, u.username as performer_name');
        $builder->join('users u', 'u.id = a.performed_by', 'left');
        $builder->orderBy('a.created_at', 'DESC');
        $builder->limit(100);

        return $this->respond($builder->get()->getResult());
    }
}
