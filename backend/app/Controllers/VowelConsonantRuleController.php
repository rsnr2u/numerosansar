<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\VowelConsonantRuleModel;
use CodeIgniter\API\ResponseTrait;

class VowelConsonantRuleController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new VowelConsonantRuleModel();
        return $this->respond($model->orderBy('type', 'ASC')->orderBy('number', 'ASC')->findAll());
    }

    public function save()
    {
        $model = new VowelConsonantRuleModel();
        $data = [
            'id' => $this->request->getVar('id'),
            'type' => $this->request->getVar('type'),
            'number' => $this->request->getVar('number'),
            'notes' => $this->request->getVar('notes'),
        ];

        if ($data['id']) {
            $model->update($data['id'], $data);
        } else {
            unset($data['id']);
            $model->insert($data);
        }

        return $this->respond(['message' => 'Saved successfully']);
    }

    public function delete($id)
    {
        $model = new VowelConsonantRuleModel();
        $model->delete($id);
        return $this->respond(['message' => 'Deleted successfully']);
    }
}
