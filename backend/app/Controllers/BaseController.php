<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

abstract class BaseController extends Controller
{
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        parent::initController($request, $response, $logger);
    }

    protected function getVendorId(): ?int
    {
        return $this->request->userData['uid'] ?? null;
    }

    protected function getVendorRole(): ?string
    {
        return $this->request->userData['role'] ?? 'numerologist';
    }

    protected function validateOwnership(string $modelClass, int $id): bool
    {
        $vendorId = $this->getVendorId();
        if (!$vendorId)
            return false;

        // Super Admin can access everything
        if ($this->getVendorRole() === 'super_admin') {
            return true;
        }

        $model = new $modelClass();
        $resource = $model->find($id);

        if (!$resource)
            return false;

        // Resource must have user_id and it must match
        return isset($resource['user_id']) && (int) $resource['user_id'] === (int) $vendorId;
    }

    protected function checkModuleAccess(string $moduleCode)
    {
        $userData = $this->request->userData ?? null;

        if ($userData && $userData['role'] === 'super_admin') {
            return true;
        }

        if (!$userData) {
            return false;
        }

        // Universal Access: Module access is granted if the professional account is active.
        // The credit system handles the actual restriction per transaction.
        $userModel = new \App\Models\UserModel();
        $user = $userModel->find($userData['uid']);

        return $user && $user['account_status'] === 'Active';
    }

    protected function checkUsageLimit(): bool
    {
        $vendorId = $this->getVendorId();
        if (!$vendorId)
            return false;

        // Super Admin has no limits
        if ($this->getVendorRole() === 'super_admin') {
            return true;
        }

        // Get Active Subscription
        $subModel = new \App\Models\SubscriptionModel();
        $sub = $subModel->where('user_id', $vendorId)->where('status', 'active')->first();

        if (!$sub)
            return false;

        $planId = $sub['plan_id'];
        $clientModel = new \App\Models\ClientModel();
        $currentCount = $clientModel->where('user_id', $vendorId)->countAllResults();

        // Enforcement: Starter (ID 1) = 100, others higher
        $limit = ($planId == 1) ? 100 : 10000;

        return $currentCount < $limit;
    }

    protected function logActivity(string $action, ?int $targetId = null, ?string $details = null)
    {
        $auditModel = new \App\Models\AuditLogModel();
        $userData = $this->request->userData ?? null;

        $auditModel->insert([
            'action' => $action,
            'performed_by' => $userData['id'] ?? 0,
            'target_id' => $targetId,
            'details' => $details,
            'ip_address' => $this->request->getIPAddress()
        ]);
    }
}
