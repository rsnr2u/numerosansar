<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\UserModel;
use App\Models\VendorProfileModel;
use CodeIgniter\API\ResponseTrait;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AdminProfileController extends BaseController
{
    use ResponseTrait;

    public function index()
    {
        // Get user from JWT (Middleware likely validates, but we need ID)
        $key = getenv('JWT_SECRET') ?: env('JWT_SECRET') ?: 'default_fallback_secret_change_me';
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header)
            return $this->failUnauthorized('No token');

        $token = explode(' ', $header)[1];
        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->uid;

            $model = new UserModel();
            $user = $model->find($userId);
            if (!$user)
                return $this->failNotFound('User not found');

            $vendorModel = new VendorProfileModel();
            $profile = $vendorModel->where('user_id', $userId)->first();

            if (!$profile) {
                // Initialize empty profile if not exists
                $vendorModel->insert(['user_id' => $userId]);
                $profile = $vendorModel->where('user_id', $userId)->first();
            }

            unset($user['password']); // Don't send password

            return $this->respond(array_merge($user, $profile ?: []));

        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token');
        }
    }

    public function update()
    {
        $key = getenv('JWT_SECRET') ?: env('JWT_SECRET') ?: 'default_fallback_secret_change_me';
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header)
            return $this->failUnauthorized('No token');

        $token = explode(' ', $header)[1];
        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->uid;

            $model = new UserModel();
            $vendorModel = new VendorProfileModel();
            $data = $this->request->getPost(); // Changed to getPost for file handling support

            $userFields = ['username', 'full_name', 'email', 'mobile', 'business_name', 'city', 'address'];
            $profileFields = [
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
                'signature_name'
            ];

            $updateUser = [];
            foreach ($userFields as $f)
                if (isset($data[$f]))
                    $updateUser[$f] = $data[$f];

            $updateProfile = [];
            foreach ($profileFields as $f)
                if (isset($data[$f]))
                    $updateProfile[$f] = $data[$f];

            // Handle File Uploads
            $files = ['brand_logo', 'signature_img', 'profile_photo'];
            foreach ($files as $fileName) {
                $file = $this->request->getFile($fileName);
                if ($file && $file->isValid() && !$file->hasMoved()) {
                    $newName = $file->getRandomName();
                    $file->move(FCPATH . 'uploads/profiles', $newName);
                    $updateProfile[$fileName] = 'uploads/profiles/' . $newName;
                }
            }

            if (!empty($updateUser)) {
                $model->update($userId, $updateUser);
            }

            if (!empty($updateProfile)) {
                $existing = $vendorModel->where('user_id', $userId)->first();
                if ($existing) {
                    $vendorModel->update($existing['id'], $updateProfile);
                } else {
                    $updateProfile['user_id'] = $userId;
                    $vendorModel->insert($updateProfile);
                }
            }

            return $this->respond(['message' => 'Profile updated successfully']);

        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token');
        }
    }

    public function changePassword()
    {
        $key = getenv('JWT_SECRET') ?: env('JWT_SECRET') ?: 'default_fallback_secret_change_me';
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header)
            return $this->failUnauthorized('No token');

        $token = explode(' ', $header)[1];
        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userId = $decoded->uid;

            $model = new UserModel();
            $data = $this->request->getJSON(true);

            $newPass = $data['new_password'] ?? '';
            $confirmPass = $data['confirm_password'] ?? '';

            if (empty($newPass) || strlen($newPass) < 6) {
                return $this->fail('Password must be at least 6 characters');
            }

            if ($newPass !== $confirmPass) {
                return $this->fail('Passwords do not match');
            }

            // Hash new password
            $hashed = password_hash($newPass, PASSWORD_DEFAULT);
            $model->update($userId, ['password' => $hashed]);

            return $this->respond(['message' => 'Password changed successfully']);

        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid token');
        }
    }
}
