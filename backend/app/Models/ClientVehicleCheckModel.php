<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientVehicleCheckModel extends Model
{
    protected $table = 'client_vehicle_checks';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'user_id',
        'client_id',
        'vehicle_number',
        'vehicle_type',
        'chaldean_compound',
        'pythagorean_compound',
        'chaldean_root',
        'pythagorean_root',
        'numerology_compound',
        'numerology_root',
        'numerology_result',
        'last_4_numbers',
        'last_4_compound',
        'last_4_root',
        'result',
        'l_result',
        'is_confirmed',
        'created_at',
        'updated_at'
    ];

    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
