<?php

namespace App\Models;

use CodeIgniter\Model;

class CreditUsageModel extends Model
{
    protected $table = 'credit_usage';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $protectFields = true;
    protected $allowedFields = [
        'user_id',
        'check_id',
        'check_type',
        'credit_type',
        'client_id',
    ];

    protected $useTimestamps = false;
    protected $createdField = 'created_at';

    // Only created_at, no updated_at
    protected $beforeInsert = ['addCreatedAt'];

    protected function addCreatedAt(array $data): array
    {
        $data['data']['created_at'] = date('Y-m-d H:i:s');
        return $data;
    }
}
