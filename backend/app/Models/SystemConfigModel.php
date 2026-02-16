<?php

namespace App\Models;

use CodeIgniter\Model;

class SystemConfigModel extends Model
{
    protected $table = 'system_config';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = ['config_key', 'config_value', 'description'];

    protected $useTimestamps = true;
    protected $createdField = '';
    protected $updatedField = 'updated_at';
}
