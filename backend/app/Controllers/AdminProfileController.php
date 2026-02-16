<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\UserModel;
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

            unset($user['password']); // Don't send password
            return $this->respond($user);

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
            $data = $this->request->getJSON(true);

            $updateData = [];
            if (isset($data['username']))
                $updateData['username'] = $data['username'];
            // Add other fields if user table has them

            if (!empty($updateData)) {
                $model->update($userId, $updateData);
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
