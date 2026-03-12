<?php

namespace App\Models;

use CodeIgniter\Model;

class CreditPurchaseModel extends Model
{
    protected $table = 'credit_purchases';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $protectFields = true;
    protected $allowedFields = [
        'user_id',
        'credit_type',
        'quantity',
        'unit_price',
        'total_amount',
        'status',
        'payment_reference',
        'notes',
    ];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
}
