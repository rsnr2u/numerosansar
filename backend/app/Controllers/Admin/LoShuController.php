<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\LoShuMeaningModel;
use App\Models\KuaDetailModel;
use CodeIgniter\API\ResponseTrait;

class LoShuController extends BaseController
{
    use ResponseTrait;

    // --- Lo Shu Meanings ---

    public function listMeanings()
    {
        $model = new LoShuMeaningModel();
        return $this->respond($model->orderBy('number', 'ASC')->findAll());
    }

    public function saveMeaning()
    {
        $model = new LoShuMeaningModel();
        $data = $this->request->getJSON(true);

        if (empty($data)) {
            $data = $this->request->getPost();
        }

        $id = $data['id'] ?? null;

        if ($id) {
            if ($model->update($id, $data)) {
                return $this->respond(['status' => 'success', 'message' => 'Meaning updated successfully']);
            }
        } else {
            if ($model->insert($data)) {
                return $this->respond(['status' => 'success', 'message' => 'Meaning created successfully']);
            }
        }

        return $this->fail($model->errors());
    }

    public function deleteMeaning($id = null)
    {
        $model = new LoShuMeaningModel();
        if ($model->delete($id)) {
            return $this->respondDeleted(['status' => 'success', 'message' => 'Meaning deleted successfully']);
        }
        return $this->fail('Failed to delete meaning');
    }

    // --- Kua Details ---

    public function listKuaDetails()
    {
        $model = new KuaDetailModel();
        return $this->respond($model->orderBy('kua_number', 'ASC')->findAll());
    }

    public function saveKuaDetail()
    {
        $model = new KuaDetailModel();
        $data = $this->request->getJSON(true);

        if (empty($data)) {
            $data = $this->request->getPost();
        }

        $id = $data['id'] ?? null;

        if ($id) {
            if ($model->update($id, $data)) {
                return $this->respond(['status' => 'success', 'message' => 'Kua detail updated successfully']);
            }
        } else {
            if ($model->insert($data)) {
                return $this->respond(['status' => 'success', 'message' => 'Kua detail created successfully']);
            }
        }

        return $this->fail($model->errors());
    }

    public function deleteKuaDetail($id = null)
    {
        $model = new KuaDetailModel();
        if ($model->delete($id)) {
            return $this->respondDeleted(['status' => 'success', 'message' => 'Kua detail deleted successfully']);
        }
        return $this->fail('Failed to delete kua detail');
    }
}
