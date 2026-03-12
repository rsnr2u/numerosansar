<?php

namespace App\Controllers;

use App\Models\SubscriptionPlanModel;
use CodeIgniter\API\ResponseTrait;

class SubscriptionController extends BaseController
{
    use ResponseTrait;

    public function getPlans()
    {
        $model = new SubscriptionPlanModel();
        $plans = $model->findAll();

        foreach ($plans as &$plan) {
            $plan['modules'] = [];
        }

        return $this->respond($plans);
    }

    public function savePlan()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can manage plans');
        }

        $model = new SubscriptionPlanModel();
        $data = $this->request->getJSON(true);

        // We preserve the field for DB compatibility but it's no longer used for logic
        $data['modules'] = json_encode([]);

        $id = $data['id'] ?? null;
        if ($id) {
            $model->update($id, $data);
        } else {
            $id = $model->insert($data);
        }

        return $this->respond(['id' => $id, 'message' => 'Plan saved successfully']);
    }

    public function deletePlan($id)
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can manage plans');
        }

        $model = new SubscriptionPlanModel();
        $model->delete($id);
        return $this->respondDeleted(['message' => 'Plan deleted successfully']);
    }
}
