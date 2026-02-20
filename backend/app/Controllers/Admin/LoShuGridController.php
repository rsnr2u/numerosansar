<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\LoShuGridModel;
use CodeIgniter\API\ResponseTrait;

class LoShuGridController extends BaseController
{
    use ResponseTrait;

    protected $model;

    public function __construct()
    {
        $this->model = new LoShuGridModel();
    }

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if ($this->model->save($data)) {
            return $this->respondCreated(['status' => 'success', 'message' => 'Grid setting saved']);
        }
        return $this->fail($this->model->errors());
    }

    public function delete($id = null)
    {
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['status' => 'success', 'message' => 'Grid setting deleted']);
        }
        return $this->failNotFound('Grid setting not found');
    }
}
