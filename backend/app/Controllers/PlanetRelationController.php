<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\PlanetRelationModel;
use CodeIgniter\API\ResponseTrait;

class PlanetRelationController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        $model = new PlanetRelationModel();
        return $this->respond($model->orderBy('root_number', 'ASC')->findAll());
    }

    public function save()
    {
        $model = new PlanetRelationModel();
        $data = [
            'id' => $this->request->getVar('id'),
            'planet_number' => $this->request->getVar('planet_number'),
            'planet_name' => $this->request->getVar('planet_name'),
            'friend_numbers' => $this->request->getVar('friend_numbers'),
            'enemy_numbers' => $this->request->getVar('enemy_numbers'),
            'neutral_numbers' => $this->request->getVar('neutral_numbers'),
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
        $model = new PlanetRelationModel();
        $model->delete($id);
        return $this->respond(['message' => 'Deleted successfully']);
    }
}
