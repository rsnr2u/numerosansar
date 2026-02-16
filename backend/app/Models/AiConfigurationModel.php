<?php

namespace App\Models;

use CodeIgniter\Model;

class AiConfigurationModel extends Model
{
    protected $table = 'ai_configurations';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = ['provider_name', 'api_key', 'is_active', 'model_name'];

    // Dates
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    /**
     * Get the currently active AI configuration
     */
    public static function getActiveConfig()
    {
        $model = new self();
        return $model->where('is_active', 1)->first();
    }
}
