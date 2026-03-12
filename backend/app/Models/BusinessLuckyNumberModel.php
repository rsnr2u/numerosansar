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
    protected $allowedFields = [
        'sector_name',
        'sector_name_telugu',
        'lucky_numbers',
        'primary_planet',
        'chaldean_targets',
        'pythagorean_targets',
        'sector_name_hindi',
        'sector_name_bengali',
        'sector_name_devanagari',
        'sector_name_kannada',
        'sector_name_tamil',
        'sector_name_malayalam',
        'sector_name_gujarati',
        'primary_planet_telugu',
        'primary_planet_hindi',
        'primary_planet_bengali',
        'primary_planet_devanagari',
        'primary_planet_kannada',
        'primary_planet_tamil',
        'primary_planet_malayalam',
        'primary_planet_gujarati'
    ];

    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
