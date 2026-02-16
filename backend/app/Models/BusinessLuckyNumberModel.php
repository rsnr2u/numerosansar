<?php

namespace App\Models;

use CodeIgniter\Model;

class BusinessLuckyNumberModel extends Model
{
    protected $table = 'business_lucky_numbers';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = ['sector_name', 'sector_name_telugu', 'lucky_numbers', 'primary_planet', 'chaldean_targets', 'pythagorean_targets'];

    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
