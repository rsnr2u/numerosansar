<?php

namespace App\Models;

use CodeIgniter\Model;

class SubscriptionModel extends Model
{
    protected $table = 'subscriptions';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = ['user_id', 'plan_id', 'billing_cycle', 'status', 'starts_at', 'ends_at'];
    protected $useTimestamps = true;

    public function getUserSubscription($userId)
    {
        return $this->select('subscriptions.*, subscription_plans.name as plan_name, subscription_plans.modules')
            ->join('subscription_plans', 'subscription_plans.id = subscriptions.plan_id')
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->orderBy('ends_at', 'DESC')
            ->first();
    }
}
