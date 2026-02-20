<?php

namespace App\Models;

use CodeIgniter\Model;

class KuaDetailModel extends Model
{
    protected $table = 'kua_details';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = ['kua_number', 'sheng_qi', 'tian_yi', 'yan_nian', 'fu_wei', 'bad_directions'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    // Validation
    protected $validationRules = [
        'kua_number' => 'required|numeric',
        'sheng_qi' => 'required',
        'tian_yi' => 'required',
        'yan_nian' => 'required',
        'fu_wei' => 'required',
        'bad_directions' => 'required',
    ];
    protected $validationMessages = [];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;
}
