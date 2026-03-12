<?php

namespace App\Models;

use CodeIgniter\Model;

class AstrologyPlanetModel extends Model
{
    protected $table = 'numerology_planets';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'number',
        'planet_name',
        'notes',
        'planet_name_telugu',
        'planet_name_hindi',
        'planet_name_bengali',
        'planet_name_devanagari',
        'planet_name_kannada',
        'planet_name_tamil',
        'planet_name_malayalam',
        'planet_name_gujarati'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    // Validation
    protected $validationRules = [];
    protected $validationMessages = [];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;
}
