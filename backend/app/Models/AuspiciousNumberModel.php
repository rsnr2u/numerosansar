<?php

namespace App\Models;

use CodeIgniter\Model;

class AuspiciousNumberModel extends Model
{
    protected $table = 'auspicious_numbers';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = ['root_number', 'number', 'notes'];
}
