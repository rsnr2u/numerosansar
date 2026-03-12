<?php

namespace App\Models;

use CodeIgniter\Model;

class SubscriptionPlanModel extends Model
{
    protected $table = 'subscription_plans';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $allowedFields = ['name', 'price_monthly', 'price_yearly', 'credits', 'type', 'status', 'visibility', 'badge', 'discount_price', 'modules', 'description'];
    protected $useTimestamps = true;
}
