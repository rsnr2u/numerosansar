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
    protected $allowedFields = ['number', 'quality', 'remedy'];

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
