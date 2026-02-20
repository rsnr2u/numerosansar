<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\LuckyNameNumberModel;
use CodeIgniter\API\ResponseTrait;

class LuckyNameNumberController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new LuckyNameNumberModel();
        return $this->respond($model->findAll());
    }

    public function save()
    {
        $model = new LuckyNameNumberModel();
        $data = $this->request->getJSON(true);

        if (empty($data)) {
            $data = $this->request->getPost();
        }

        $id = $data['id'] ?? null;

        if ($id) {
            if ($model->update($id, $data)) {
                return $this->respond(['status' => 'success', 'message' => 'Updated successfully']);
            }
        } else {
            if ($model->insert($data)) {
                return $this->respond(['status' => 'success', 'message' => 'Created successfully']);
            }
        }

        return $this->fail($model->errors());
    }

    public function delete($id = null)
    {
        $model = new LuckyNameNumberModel();
        if ($model->delete($id)) {
            return $this->respondDeleted(['status' => 'success', 'message' => 'Deleted successfully']);
        }
        return $this->fail('Failed to delete');
    }
}
