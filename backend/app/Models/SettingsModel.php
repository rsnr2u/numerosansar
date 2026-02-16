<?php

namespace App\Models;

use CodeIgniter\Model;

class SettingsModel extends Model
{
    protected $table = 'settings';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = ['setting_key', 'setting_value', 'setting_group'];
    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    public static function getSetting($key, $default = null)
    {
        $model = new self();
        $setting = $model->where('setting_key', $key)->first();
        return $setting ? $setting['setting_value'] : $default;
    }
}
