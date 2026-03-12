<?php

namespace App\Controllers;

use App\Models\SubscriptionModel;
use CodeIgniter\API\ResponseTrait;

class UserSubscriptionController extends BaseController
{
    use ResponseTrait;

    public function getActiveSubscription()
    {
        $userData = $this->request->userData ?? null;
        if (!$userData) {
            return $this->failUnauthorized();
        }

        $model = new SubscriptionModel();
        $sub = $model->getUserSubscription($userData['uid']);

        return $this->respond([
            'plan_name' => 'Universal Master Pass',
            'status' => 'active',
            'ends_at' => date('Y-m-d H:i:s', strtotime('+100 years'))
        ]);
    }
}
