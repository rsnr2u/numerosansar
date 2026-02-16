<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientNameCheckModel extends Model
{
    protected $table = 'client_name_checks';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'user_id',
        'client_id',
        'type',
        'name_value',
        'original_name',
        'chaldean_compound',
        'pythagorean_compound',
        'chaldean_root',
        'pythagorean_root',
        'chaldean_result',
        'pythagorean_result',
        'is_confirmed',
        'created_at'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
