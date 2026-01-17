<?php

namespace App\Controllers;

use App\Models\PlanetRelationModel;
use CodeIgniter\RESTful\ResourceController;

class AdminPlanetRelationController extends ResourceController
{
    public function index()
    {
        $model = new PlanetRelationModel();
        $data = $model->findAll();
        return $this->respond($data);
    }
}
