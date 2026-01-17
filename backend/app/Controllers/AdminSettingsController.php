<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\SettingsModel;
use CodeIgniter\API\ResponseTrait;

class AdminSettingsController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new SettingsModel();
        $settings = $model->findAll();
        // Return as key-value pair for frontend ease? Or list?
        // Let's return list or dictionary. Dictionary is easier: { 'site_title': '...', ... }
        $data = [];
        foreach ($settings as $s) {
            $data[$s['setting_key']] = $s['setting_value'];
        }
        return $this->respond($data);
    }

    public function update()
    {
        $model = new SettingsModel();
        $input = $this->request->getJSON(true); // Expect JSON object { 'site_title': 'New Title', ... }

        if (!$input) {
            return $this->fail('No data provided');
        }

        foreach ($input as $key => $value) {
            // Check if exists
            $existing = $model->where('setting_key', $key)->first();
            if ($existing) {
                $model->update($existing['id'], ['setting_value' => $value]);
            } else {
                // Determine group? Default to general if new
                $model->insert(['setting_key' => $key, 'setting_value' => $value, 'setting_group' => 'general']);
            }
        }

        return $this->respond(['message' => 'Settings updated successfully']);
    }
}
