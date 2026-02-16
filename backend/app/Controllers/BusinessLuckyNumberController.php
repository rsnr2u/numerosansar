<?php

namespace App\Controllers;

use App\Models\BusinessLuckyNumberModel;
use CodeIgniter\API\ResponseTrait;

class BusinessLuckyNumberController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new BusinessLuckyNumberModel();
        $sectors = $model->findAll();

        return $this->respond($sectors ?: []);
    }

    public function save()
    {
        $model = new BusinessLuckyNumberModel();
        $data = $this->request->getJSON(true);

        if (isset($data['id'])) {
            $model->update($data['id'], $data);
        } else {
            $model->insert($data);
        }

        return $this->respond(['status' => 'success', 'message' => 'Sector saved successfully']);
    }

    public function delete($id = null)
    {
        $model = new BusinessLuckyNumberModel();
        if ($model->delete($id)) {
            return $this->respond(['status' => 'success', 'message' => 'Sector deleted successfully']);
        }
        return $this->fail('Failed to delete sector');
    }
}
