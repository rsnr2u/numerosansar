<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientModel extends Model
{
    protected $table = 'clients';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $useSoftDeletes = false;
    protected $protectFields = true;
    protected $allowedFields = [
        'user_id',
        'full_name',
        'calling_name',
        'dob',
        'gender',
        'mobile_number',
        'email_id',
        'address',
        'city',
        'state',
        'pincode',
        'created_at',
        'updated_at'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat = 'datetime';
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';
    protected $deletedField = 'deleted_at';

    // Validation
    protected $validationRules = [
        'full_name' => 'required|min_length[3]|max_length[255]',
        'dob' => 'required|valid_date',
    ];
    protected $validationMessages = [];
    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    // Encryption Hooks
    protected $beforeInsert = ['encryptData'];
    protected $beforeUpdate = ['encryptData'];
    protected $afterFind = ['decryptData'];

    protected $encryptedFields = [];

    protected function encryptData(array $data)
    {
        if (!isset($data['data']))
            return $data;

        $encrypter = \Config\Services::encrypter();

        foreach ($this->encryptedFields as $field) {
            if (isset($data['data'][$field]) && !empty($data['data'][$field])) {
                $data['data'][$field] = base64_encode($encrypter->encrypt($data['data'][$field]));
            }
        }

        return $data;
    }

    protected function decryptData(array $data)
    {
        if (!isset($data['data']))
            return $data;

        $encrypter = \Config\Services::encrypter();

        // Handle single result vs multiple results
        if (isset($data['data'][$this->primaryKey])) {
            $data['data'] = $this->decryptRow($data['data'], $encrypter);
        } else {
            foreach ($data['data'] as &$row) {
                $row = $this->decryptRow($row, $encrypter);
            }
        }

        return $data;
    }

    private function decryptRow(array $row, $encrypter)
    {
        foreach ($this->encryptedFields as $field) {
            if (isset($row[$field]) && !empty($row[$field])) {
                try {
                    $row[$field] = $encrypter->decrypt(base64_decode($row[$field]));
                } catch (\Exception $e) {
                    // Fail gracefully if data is not encrypted (e.g. legacy data)
                }
            }
        }
        return $row;
    }
}
