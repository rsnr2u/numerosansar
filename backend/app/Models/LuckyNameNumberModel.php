<?php

namespace App\Models;

use CodeIgniter\Model;

class LuckyNameNumberModel extends Model
{
    protected $table = 'lucky_name_numbers';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = ['number', 'vibe', 'great_for'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    // Validation
    protected $validationRules = [
        'number' => 'required|max_length[50]',
        'vibe' => 'required',
        'great_for' => 'required',
    ];
    protected $validationMessages = [];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;
}
