<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientBusinessCheckModel extends Model
{
    protected $table = 'client_business_checks';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'client_id',
        'business_sector_id',
        'business_name',
        'original_name',
        'chaldean_compound',
        'pythagorean_compound',
        'chaldean_root',
        'pythagorean_root',
        'chaldean_result',
        'pythagorean_result',
        'is_confirmed',
        'created_at',
        'updated_at'
    ];

    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
