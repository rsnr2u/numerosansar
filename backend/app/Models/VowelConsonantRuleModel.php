<?php

namespace App\Models;

use CodeIgniter\Model;

class VowelConsonantRuleModel extends Model
{
    protected $table = 'vowel_consonant_rules';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = ['type', 'number', 'notes'];
}
