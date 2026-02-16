<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\SystemConfigModel;
use CodeIgniter\API\ResponseTrait;

class SystemConfigController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can access system config');
        }

        $model = new SystemConfigModel();
        return $this->respond($model->findAll());
    }

    public function update()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can update system config');
        }

        $model = new SystemConfigModel();
        $data = $this->request->getJSON(true);

        foreach ($data as $key => $value) {
            $existing = $model->where('config_key', $key)->first();
            if ($existing) {
                $model->update($existing['id'], ['config_value' => is_array($value) ? json_encode($value) : $value]);
            } else {
                $model->insert([
                    'config_key' => $key,
                    'config_value' => is_array($value) ? json_encode($value) : $value
                ]);
            }
        }

        $this->logActivity("config_update", null, "Updated system configurations");
        return $this->respond(['message' => 'Configuration updated successfully']);
    }
}
