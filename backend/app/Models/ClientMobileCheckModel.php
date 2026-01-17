<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientMobileCheckModel extends Model
{
    protected $table = 'client_mobile_checks';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'client_id',
        'mobile_number',
        'Compound_number',
        'total_number',
        't_result',
        'last_4_numbers',
        'l_result',
        'created_at',
        'updated_at'
    ];

    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
