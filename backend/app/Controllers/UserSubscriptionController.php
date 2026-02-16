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

        if (!$sub) {
            // If super_admin, simulate full access
            if ($userData['role'] === 'super_admin') {
                return $this->respond([
                    'plan_name' => 'Admin Access',
                    'modules' => json_encode(['name', 'mobile', 'business', 'vehicle', 'ai']),
                    'status' => 'active',
                    'ends_at' => date('Y-m-d H:i:s', strtotime('+100 years'))
                ]);
            }
            return $this->failNotFound('No active subscription found');
        }

        return $this->respond($sub);
    }
}
