<?php

namespace App\Controllers;

use App\Models\CreditWalletModel;
use App\Models\CreditPurchaseModel;
use App\Models\CreditUsageModel;
use App\Models\SubscriptionPlanModel;
use CodeIgniter\API\ResponseTrait;

class CreditController extends BaseController
{
    use ResponseTrait;

    private const UNIT_PRICE = 200; // Unified price per credit

    private const MIN_QUANTITY = 20;

    /**
     * GET /api/admin/credits/balance
     */
    public function balance()
    {
        $userId = $this->getVendorId();
        if (!$userId) {
            return $this->failUnauthorized('Unauthorized');
        }

        $walletModel = new CreditWalletModel();
        $wallet = $walletModel->getOrCreate($userId);

        // Return unified balance
        return $this->respond([
            'balance' => (int) $wallet['regular_balance'],
            'regular_balance' => (int) $wallet['regular_balance'], // Legacy support
            'whitelabel_balance' => (int) $wallet['whitelabel_balance'], // Should be 0 after migration
        ]);
    }

    /**
     * POST /api/admin/credits/purchase
     * Body: { quantity: int, payment_reference?: string, notes?: string }
     */
    public function purchase()
    {
        $userId = $this->getVendorId();
        if (!$userId) {
            return $this->failUnauthorized('Unauthorized');
        }

        $data = $this->request->getJSON(true);
        $planId = $data['plan_id'] ?? null;
        
        $quantity = 0;
        $totalAmount = 0;
        $unitPrice = self::UNIT_PRICE;
        $notes = $data['notes'] ?? null;
        $paymentRef = $data['payment_reference'] ?? null;

        if ($planId) {
            $planModel = new SubscriptionPlanModel();
            $plan = $planModel->find($planId);

            if (!$plan || $plan['type'] !== 'paid') {
                return $this->fail('Invalid package selected.');
            }

            $quantity = (int) $plan['credits'];
            $totalAmount = (float) ($plan['discount_price'] ?? $plan['price_monthly']);
            $unitPrice = $quantity > 0 ? $totalAmount / $quantity : 0;
            $notes = $notes ?? "Purchase of {$plan['name']}";
        } else {
            // Fallback for direct quantity purchase (maintaining legacy support if needed)
            $quantity = (int) ($data['quantity'] ?? 0);
            if ($quantity < self::MIN_QUANTITY) {
                return $this->fail('Minimum purchase is ' . self::MIN_QUANTITY . ' credits.');
            }
            $totalAmount = self::UNIT_PRICE * $quantity;
            $unitPrice = self::UNIT_PRICE;
        }

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            // Log the purchase
            $purchaseModel = new CreditPurchaseModel();
            $purchaseId = $purchaseModel->insert([
                'user_id' => $userId,
                'credit_type' => 'regular',
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_amount' => $totalAmount,
                'status' => 'completed',
                'payment_reference' => $paymentRef,
                'notes' => $notes,
            ]);

            // Add credits to wallet
            $walletModel = new CreditWalletModel();
            $walletModel->addCredits($userId, 'regular', $quantity);

            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->fail('Transaction failed. Please try again.');
            }

            $wallet = $walletModel->getOrCreate($userId);

            $this->logActivity('credit_purchase', $purchaseId, "{$quantity} credits purchased for ₹{$totalAmount}");

            return $this->respond([
                'message' => "Successfully purchased {$quantity} credits.",
                'purchase_id' => $purchaseId,
                'total_amount' => $totalAmount,
                'balance' => (int) $wallet['regular_balance'],
            ]);
        } catch (\Exception $e) {
            $db->transRollback();
            return $this->fail('Purchase failed: ' . $e->getMessage());
        }
    }

    /**
     * GET /api/admin/credits/history
     * Query: ?type=purchases|usage&page=1&per_page=20
     */
    public function history()
    {
        $userId = $this->getVendorId();
        if (!$userId) {
            return $this->failUnauthorized('Unauthorized');
        }

        $type = $this->request->getGet('type') ?? 'all';
        $page = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 20);
        $offset = ($page - 1) * $perPage;

        $response = [];

        if ($type === 'all' || $type === 'purchases') {
            $purchaseModel = new CreditPurchaseModel();
            $response['purchases'] = $purchaseModel
                ->where('user_id', $userId)
                ->orderBy('created_at', 'DESC')
                ->findAll($perPage, $offset);
            $response['purchase_total'] = $purchaseModel
                ->where('user_id', $userId)
                ->countAllResults();
        }

        if ($type === 'all' || $type === 'usage') {
            $usageModel = new CreditUsageModel();
            $response['usage'] = $usageModel
                ->where('user_id', $userId)
                ->orderBy('created_at', 'DESC')
                ->findAll($perPage, $offset);
            $response['usage_total'] = $usageModel
                ->where('user_id', $userId)
                ->countAllResults();
        }

        return $this->respond($response);
    }

    /**
     * Super Admin Methods
     */

    /**
     * GET /api/super-admin/credits/history
     */
    public function allHistory()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can access this');
        }

        $type = $this->request->getGet('type') ?? 'all';
        $page = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 50);
        $offset = ($page - 1) * $perPage;

        $response = [];
        $db = \Config\Database::connect();

        if ($type === 'all' || $type === 'purchases') {
            $builder = $db->table('credit_purchases p')
                ->select('p.*, u.username, u.full_name as vendor_name')
                ->join('users u', 'u.id = p.user_id')
                ->orderBy('p.created_at', 'DESC');

            $response['purchases'] = $builder->get($perPage, $offset)->getResultArray();
            $response['purchase_total'] = $db->table('credit_purchases')->countAllResults();
        }

        if ($type === 'all' || $type === 'usage') {
            $builder = $db->table('credit_usage u')
                ->select('u.*, v.username as vendor_username, v.full_name as vendor_name, c.full_name as client_name')
                ->join('users v', 'v.id = u.user_id')
                ->join('clients c', 'c.id = u.client_id', 'left') // Use left join just in case
                ->orderBy('u.created_at', 'DESC');

            $response['usage'] = $builder->get($perPage, $offset)->getResultArray();
            $response['usage_total'] = $db->table('credit_usage')->countAllResults();
        }

        return $this->respond($response);
    }

    /**
     * GET /api/super-admin/credits/vendor-balances
     */
    public function vendorBalances()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can access this');
        }

        $db = \Config\Database::connect();
        $builder = $db->table('users u')
            ->select('u.id, u.username, u.full_name as name, u.email, u.status, w.regular_balance as balance, w.updated_at as last_wallet_update, sp.name as plan_name, sp.credits as plan_credits')
            ->join('credit_wallets w', 'w.user_id = u.id', 'left')
            ->join('subscriptions s', 's.user_id = u.id AND s.status = "active"', 'left')
            ->join('subscription_plans sp', 'sp.id = s.plan_id', 'left')
            ->where('u.role', 'numerologist')
            ->orderBy('u.created_at', 'DESC');

        $vendors = $builder->get()->getResultArray();

        // Null balances to 0
        foreach ($vendors as &$v) {
            $v['balance'] = (int) ($v['balance'] ?? 0);
            $v['regular_balance'] = $v['balance']; // Legacy UI support
            $v['whitelabel_balance'] = 0; // Migrated
            $v['plan_credits'] = (int) ($v['plan_credits'] ?? 0);
            $v['credits_used'] = max(0, $v['plan_credits'] - $v['balance']);
        }

        return $this->respond($vendors);
    }

    /**
     * POST /api/super-admin/credits/adjust-balance
     * Body: { user_id: int, action: "add"|"subtract", quantity: int, notes?: string }
     */
    public function adjustBalance()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can access this');
        }

        $data = $this->request->getJSON(true);
        $targetUserId = (int) ($data['user_id'] ?? 0);
        $action = $data['action'] ?? 'add';
        $quantity = (int) ($data['quantity'] ?? 0);
        $notes = $data['notes'] ?? 'System Adjustment';

        if (!$targetUserId || $quantity <= 0) {
            return $this->fail('Invalid User ID or quantity');
        }

        $walletModel = new CreditWalletModel();
        $walletModel->getOrCreate($targetUserId); // Ensure wallet exists

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            if ($action === 'add') {
                $walletModel->addCredits($targetUserId, 'regular', $quantity);
            } else {
                $db->table('credit_wallets')
                    ->where('user_id', $targetUserId)
                    ->set('regular_balance', "regular_balance - {$quantity}", false)
                    ->update();
            }

            // Log adjustment as a "system" purchase/transaction record to keep history consistent
            $purchaseModel = new CreditPurchaseModel();
            $purchaseModel->insert([
                'user_id' => $targetUserId,
                'credit_type' => 'regular',
                'quantity' => $action === 'add' ? $quantity : -$quantity,
                'unit_price' => 0,
                'total_amount' => 0,
                'status' => 'completed',
                'notes' => $notes . " (Adjusted by Super Admin)",
            ]);

            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->fail('Adjustment failed');
            }

            $this->logActivity('credit_adjustment', $targetUserId, "{$action} {$quantity} credits by Super Admin. Notes: {$notes}");

            return $this->respond(['message' => 'Balance adjusted successfully']);
        } catch (\Exception $e) {
            $db->transRollback();
            return $this->fail('Adjustment failed: ' . $e->getMessage());
        }
    }
    /**
     * GET /api/admin/credits/platform-stats
     */
    public function getPlatformStats()
    {
        if ($this->getVendorRole() !== 'super_admin') {
            return $this->failForbidden('Only Super Admin can access this');
        }

        $db = \Config\Database::connect();

        // 1. Global Summaries
        $totalPurchased = $db->table('credit_purchases')
            ->where('quantity >', 0)
            ->where('status', 'completed')
            ->selectSum('quantity')
            ->get()->getRow()->quantity ?? 0;

        $totalUsed = $db->table('credit_usage')->countAllResults();

        $wallets = $db->table('credit_wallets')->selectSum('regular_balance')->get()->getRow();
        $totalRemaining = $wallets->regular_balance ?? 0;

        $lowCreditCount = $db->table('credit_wallets')->where('regular_balance <', 5)->countAllResults();

        // 2. Daily Usage (Last 14 days)
        $dailyUsage = $db->table('credit_usage')
            ->select("DATE(created_at) as date, COUNT(*) as count")
            ->where('created_at >=', date('Y-m-d', strtotime('-14 days')))
            ->groupBy('DATE(created_at)')
            ->orderBy('date', 'ASC')
            ->get()->getResult();

        // 3. Usage by Analysis Type
        $usageByType = $db->table('credit_usage')
            ->select("check_type, COUNT(*) as count")
            ->groupBy('check_type')
            ->get()->getResult();

        // 4. Low Credit Alerts List
        $lowCreditUsers = $db->table('users u')
            ->select('u.id, u.full_name, u.username, cw.regular_balance as balance')
            ->join('credit_wallets cw', 'cw.user_id = u.id')
            ->where('u.role', 'numerologist')
            ->where('cw.regular_balance <', 5)
            ->orderBy('cw.regular_balance', 'ASC')
            ->limit(10)
            ->get()->getResult();

        return $this->respond([
            'summary' => [
                'total_purchased' => (int) $totalPurchased,
                'total_used' => (int) $totalUsed,
                'total_remaining' => (int) $totalRemaining,
                'low_credit_users_count' => (int) $lowCreditCount
            ],
            'daily_usage' => $dailyUsage,
            'usage_by_type' => $usageByType,
            'low_credit_alerts' => $lowCreditUsers
        ]);
    }
}
