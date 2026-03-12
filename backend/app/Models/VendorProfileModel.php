<?php

namespace App\Models;

use CodeIgniter\Model;

class VendorProfileModel extends Model
{
    protected $table = 'vendor_profiles';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'user_id',
        'professional_name',
        'brand_name',
        'professional_title',
        'experience_years',
        'business_type',
        'gst_number',
        'alt_mobile',
        'whatsapp',
        'website',
        'instagram',
        'youtube',
        'facebook',
        'country',
        'state',
        'pincode',
        'full_address',
        'primary_system',
        'analysis_system',
        'report_header',
        'report_footer',
        'signature_name',
        'signature_img',
        'brand_logo',
        'profile_photo'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    // Validation
    protected $validationRules = [];
    protected $validationMessages = [];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert = [];
    protected $afterInsert = [];
    protected $beforeUpdate = [];
    protected $afterUpdate = [];
    protected $beforeFind = [];
    protected $afterFind = [];
    protected $beforeDelete = [];
    protected $afterDelete = [];
}
