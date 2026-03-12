<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

use App\Models\UserModel;
use App\Models\SubscriptionModel;
use App\Models\SubscriptionPlanModel;
use CodeIgniter\API\ResponseTrait;
use Firebase\JWT\JWT;

class AuthController extends BaseController
{
    use ResponseTrait;

    public function login()
    {
        $userModel = new UserModel();

        $loginIdentity = $this->request->getVar('username'); // This can be email or username
        $password = $this->request->getVar('password');

        log_message('error', '[Login Debug] Identity: ' . ($loginIdentity ?? 'NULL'));

        $user = $userModel->groupStart()
            ->where('username', $loginIdentity)
            ->orWhere('email', $loginIdentity)
            ->groupEnd()
            ->first();

        if (is_null($user) || !password_verify($password, $user['password'])) {
            return $this->fail('Invalid credentials. Please check your username/email and password.', 401);
        }

        // Update Login Metadata
        $userModel->update($user['id'], [
            'last_login' => date('Y-m-d H:i:s'),
            'last_ip' => $this->request->getIPAddress()
        ]);

        $key = getenv('JWT_SECRET') ?: env('JWT_SECRET') ?: 'default_fallback_secret_change_me';
        $iat = time();
        $exp = $iat + 28800; // 8 hours

        $payload = [
            'iat' => $iat,
            'exp' => $exp,
            'uid' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role']
        ];

        $token = JWT::encode($payload, $key, 'HS256');

        return $this->respond([
            'message' => 'Login Successful',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ]);
    }

    public function register()
    {
        $userModel = new UserModel();
        $subModel = new SubscriptionModel();
        $planModel = new SubscriptionPlanModel();

        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');
        $email = $this->request->getVar('email');
        $planId = $this->request->getVar('plan_id');
        $billingCycle = $this->request->getVar('billing_cycle') ?: 'monthly';

        // Validation
        if ($userModel->where('username', $username)->first()) {
            return $this->failResourceExists('Username already taken');
        }
        if ($email && $userModel->where('email', $email)->first()) {
            return $this->failResourceExists('Email already registered');
        }

        $db = \Config\Database::connect();
        $db->transStart();

        // 1. Create User
        $userData = [
            'username' => $username,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'role' => 'numerologist',
            'full_name' => $this->request->getVar('full_name'),
            'email' => $email,
            'mobile' => $this->request->getVar('mobile'),
            'business_name' => $this->request->getVar('business_name'),
            'city' => $this->request->getVar('city')
        ];

        $userId = $userModel->insert($userData);

        if (!$userId) {
            $db->transRollback();
            return $this->fail('User creation failed');
        }

        // 2. Create Subscription
        $plan = $planModel->find($planId);
        if (!$plan) {
            // Fallback to first plan if none provided or invalid
            $plan = $planModel->first();
            $planId = $plan['id'];
        }

        $endsAt = date('Y-m-d H:i:s', strtotime($billingCycle === 'yearly' ? '+1 year' : '+1 month'));

        $subModel->insert([
            'user_id' => $userId,
            'plan_id' => $planId,
            'billing_cycle' => $billingCycle,
            'status' => 'active',
            'starts_at' => date('Y-m-d H:i:s'),
            'ends_at' => $endsAt
        ]);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->fail('Registration failed. Please try again.');
        }

        return $this->respondCreated(['message' => 'Registration successful! You can now login.']);
    }
}
