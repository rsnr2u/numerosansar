<?php

namespace App\Models;

use CodeIgniter\Model;

class LoShuMeaningModel extends Model
{
    protected $table = 'lo_shu_meanings';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'number',
        'quality',
        'remedy',
        'quality_telugu',
        'quality_hindi',
        'quality_bengali',
        'quality_devanagari',
        'quality_kannada',
        'quality_tamil',
        'quality_malayalam',
        'quality_gujarati',
        'remedy_telugu',
        'remedy_hindi',
        'remedy_bengali',
        'remedy_devanagari',
        'remedy_kannada',
        'remedy_tamil',
        'remedy_malayalam',
        'remedy_gujarati'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    // Validation
    protected $validationRules = [
        'number' => 'required|numeric',
        'quality' => 'required',
        'remedy' => 'required',
    ];
    protected $validationMessages = [];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;
}
