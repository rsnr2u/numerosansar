<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

use App\Models\CompoundNumberModel;
use CodeIgniter\API\ResponseTrait;

class AdminController extends BaseController
{
    use ResponseTrait;

    public function calculateName()
    {
        if (!$this->checkModuleAccess('name')) {
            return $this->failForbidden('Feature requires active subscription');
        }

        $name = $this->request->getVar('name');
        $dob = $this->request->getVar('dob'); // Get Date of Birth

        if (!$name) {
            return $this->fail('Name is required');
        }

        $calculator = new \App\Libraries\AstrologyCalculator();
        $result = $calculator->calculate($name, $dob);

        // Save to New History Table
        $clientId = $this->request->getVar('client_id');
        $checkModel = new \App\Models\ClientNameCheckModel();

        $chaldeanRoot = $result['chaldean']['single'];
        $pythagoreanRoot = $result['pythagorean']['single'];
        $numerologyRoot = $result['numerology']['single'];

        // Determine suitability if DOB is available
        $chaldeanStatus = 'Pending';
        $pythagoreanStatus = 'Pending';
        $numerologyStatus = 'Pending';

        if ($dob) {
            $age = $this->calculateAge($dob);
            $driver = $this->calculateDriver($dob);
            $conductor = $this->calculateConductor($dob);

            $chaldeanStatus = $this->classifyName($age, $result['chaldean']['total'], $chaldeanRoot, $driver, $conductor);
            $pythagoreanStatus = $this->classifyName($age, $result['pythagorean']['total'], $pythagoreanRoot, $driver, $conductor);
            $numerologyStatus = $this->classifyName($age, $result['numerology']['total'], $numerologyRoot, $driver, $conductor);
        }

        $savedId = null;
        $existingId = $this->request->getVar('id');

        if ($clientId || $name) {
            $saveData = [
                'user_id' => $this->getVendorId(),
                'client_id' => $clientId, // Nullable
                'type' => 'Name',
                'name_value' => $name,
                'original_name' => $this->request->getVar('original_name'),
                'chaldean_compound' => $result['chaldean']['total'],
                'pythagorean_compound' => $result['pythagorean']['total'],
                'numerology_compound' => $result['numerology']['total'],
                'chaldean_root' => $chaldeanRoot,
                'pythagorean_root' => $pythagoreanRoot,
                'numerology_root' => $numerologyRoot,
                'chaldean_result' => $chaldeanStatus,
                'pythagorean_result' => $pythagoreanStatus,
                'numerology_result' => $numerologyStatus,
                'is_confirmed' => 0
            ];

            if ($existingId) {
                // Validate ownership before update
                if (!$this->validateOwnership(\App\Models\ClientNameCheckModel::class, $existingId)) {
                    return $this->failForbidden('Access denied');
                }
                $checkModel->update($existingId, $saveData);
                $savedId = $existingId;
            } else {
                $savedId = $checkModel->insert($saveData);
            }
        }

        $result['check_id'] = $savedId;
        $result['chaldean_status'] = $chaldeanStatus;
        $result['pythagorean_status'] = $pythagoreanStatus;
        $result['numerology_status'] = $numerologyStatus;

        return $this->respond($result);
    }

    private function calculateAge($dob)
    {
        $dobDate = new \DateTime($dob);
        $now = new \DateTime();
        return $now->diff($dobDate)->y;
    }

    private function calculateDriver($dob)
    {
        $day = date('d', strtotime($dob));
        return $this->reduceToSingleDigit($day);
    }

    private function calculateConductor($dob)
    {
        $sum = 0;
        $digits = str_split(date('Ymd', strtotime($dob)));
        foreach ($digits as $d) {
            $sum += (int) $d;
        }
        return $this->reduceToSingleDigit($sum);
    }

    private function reduceToSingleDigit($number)
    {
        while ($number > 9) {
            $sum = 0;
            $digits = str_split((string) $number);
            foreach ($digits as $d) {
                $sum += (int) $d;
            }
            $number = $sum;
        }
        return $number;
    }

    private function classifyName($age, $compound, $root, $driver, $conductor)
    {
        $compoundModel = new \App\Models\CompoundNumberModel();

        // 1. Fetch inherent compound vibration directly
        $compoundData = $compoundModel->where('number', $compound)->first();

        // Return the vibration from settings, or 'Analyzed' if missing
        return $compoundData['result'] ?? 'Analyzed';
    }

    private function parseNumberList($str)
    {
        if (empty($str))
            return [];
        return array_map('trim', explode(',', $str));
    }


    public function listMeanings()
    {
        $model = new CompoundNumberModel();
        return $this->respond($model->findAll());
    }

    public function saveMeaning()
    {
        $model = new CompoundNumberModel();
        $data = [
            'id' => $this->request->getVar('id'),
            'number' => $this->request->getVar('number'),
            'title' => $this->request->getVar('title'),
            'description' => $this->request->getVar('description'),
            'result' => $this->request->getVar('result'),
        ];

        if ($data['id']) {
            $model->update($data['id'], $data);
        } else {
            unset($data['id']);
            $model->insert($data);
        }

        return $this->respond(['message' => 'Saved successfully']);
    }

    public function deleteMeaning($id)
    {
        $model = new CompoundNumberModel();
        $model->delete($id);
        return $this->respond(['message' => 'Deleted successfully']);
    }

    public function listPlanets()
    {
        $model = new \App\Models\AstrologyPlanetModel();
        return $this->respond($model->findAll());
    }

    public function listLetters()
    {
        $model = new \App\Models\AstrologySystemModel();
        return $this->respond($model->findAll());
    }

    public function getGlobalHistory()
    {
        $vendorId = $this->getVendorId();
        $model = new \App\Models\ClientNameCheckModel();

        $query = $model->orderBy('created_at', 'DESC');
        if ($this->getVendorRole() !== 'super_admin') {
            $query->where('user_id', $vendorId);
        }

        $data = $query->findAll(20);

        $formatted = array_map(function ($row) {
            return [
                'id' => $row['id'],
                'name' => $row['name_value'],
                'chaldean_total' => $row['chaldean_compound'],
                'pythagorean_total' => $row['pythagorean_compound'],
                'created_at' => $row['created_at']
            ];
        }, $data);

        return $this->respond($formatted);
    }

    public function getDashboardStats()
    {
        $vendorId = $this->getVendorId();
        $isSuperAdmin = $this->getVendorRole() === 'super_admin';

        $clientModel = new \App\Models\ClientModel();
        $nameCheckModel = new \App\Models\ClientNameCheckModel();
        $mobileCheckModel = new \App\Models\ClientMobileCheckModel();
        $vehicleCheckModel = new \App\Models\ClientVehicleCheckModel();
        $businessCheckModel = new \App\Models\ClientBusinessCheckModel();
        $walletModel = new \App\Models\CreditWalletModel();
        $purchaseModel = new \App\Models\CreditPurchaseModel();
        $usageModel = new \App\Models\CreditUsageModel();

        if (!$isSuperAdmin) {
            $clientModel->where('user_id', $vendorId);
            $nameCheckModel->where('user_id', $vendorId);
            $mobileCheckModel->where('user_id', $vendorId);
            $vehicleCheckModel->where('user_id', $vendorId);
            $businessCheckModel->where('user_id', $vendorId);
            $purchaseModel->where('user_id', $vendorId);
            $usageModel->where('user_id', $vendorId);
        }

        // 1. Total Clients
        $totalClients = $clientModel->countAllResults(false);

        // 2. Total Analyses (Across all modules)
        $nChecks = $nameCheckModel->countAllResults(false);
        $mChecks = $mobileCheckModel->countAllResults(false);
        $vChecks = $vehicleCheckModel->countAllResults(false);
        $bChecks = $businessCheckModel->countAllResults(false);
        $totalAnalyses = $nChecks + $mChecks + $vChecks + $bChecks;

        // 3. Credits Remaining & Total Allocated
        $wallet = $walletModel->getOrCreate($vendorId);
        $creditsRemaining = (int) $wallet['regular_balance'];

        // 3.5 Trial Status & Subscription Info
        $subscriptionModel = new \App\Models\SubscriptionModel();
        $sub = $subscriptionModel->getUserSubscription($vendorId);
        $isTrial = false;
        $planName = 'Basic';
        $trialDaysRemaining = 0;
        $trialTotalDays = 7; // Default
        
        if ($sub) {
            $planName = $sub['plan_name'];
            $isTrial = (isset($sub['type']) && $sub['type'] === 'trial') || (stripos($planName, 'trial') !== false);
            
            if ($sub['starts_at'] && $sub['ends_at']) {
                $start = new \DateTime($sub['starts_at']);
                $end = new \DateTime($sub['ends_at']);
                $trialTotalDays = $start->diff($end)->days;
                
                $now = new \DateTime();
                if ($end > $now) {
                    $trialDaysRemaining = $now->diff($end)->days;
                }
            }
        }

        // 4. Analyses This Month (Credits Used This Month)
        $firstOfCurrentMonth = date('Y-m-01 00:00:00');
        $thisMonthCreditsUsed = $usageModel->where('created_at >=', $firstOfCurrentMonth)->countAllResults(false);

        // 5. Monthly Chart Data (Last 6 Months)
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = date('Y-m-01 00:00:00', strtotime("-$i months"));
            $monthEnd = date('Y-m-t 23:59:59', strtotime("-$i months"));
            $monthLabel = date('M', strtotime("-$i months"));

            $count = 0;
            $mUsage = new \App\Models\CreditUsageModel();
            if (!$isSuperAdmin) $mUsage->where('user_id', $vendorId);
            $count = $mUsage->where('created_at >=', $monthStart)->where('created_at <=', $monthEnd)->countAllResults();
            $chartData[] = ['month' => $monthLabel, 'count' => $count];
        }

        // 5.5 Daily Usage Chart (Last 30 Days)
        $dailyUsage = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-$i days"));
            $label = date('d M', strtotime("-$i days"));
            
            $dUsage = new \App\Models\CreditUsageModel();
            if (!$isSuperAdmin) $dUsage->where('user_id', $vendorId);
            $count = $dUsage->where('created_at >=', "$date 00:00:00")->where('created_at <=', "$date 23:59:59")->countAllResults();
            $dailyUsage[] = ['date' => $label, 'count' => $count];
        }

        // 6. Recent Clients with credit info
        if (!$isSuperAdmin) $clientModel->where('user_id', $vendorId);
        $recentClientsRaw = $clientModel->orderBy('created_at', 'DESC')->findAll(5);
        $recentClients = array_map(function($client) use ($usageModel) {
            $creditsUsed = (new \App\Models\CreditUsageModel())->where('client_id', $client['id'])->countAllResults();
            return array_merge($client, ['credits_used' => $creditsUsed]);
        }, $recentClientsRaw);

        // 7. Recent Consumption Logic (Usage History)
        $usageRaw = $usageModel->orderBy('created_at', 'DESC')->findAll(10);
        $usageHistory = [];
        $tempBalance = $creditsRemaining;
        foreach ($usageRaw as $u) {
            $client = (new \App\Models\ClientModel())->find($u['client_id']);
            $usageHistory[] = [
                'date' => date('d M', strtotime($u['created_at'])),
                'client' => $client ? $client['full_name'] : 'Guest',
                'analysis' => $u['check_type'],
                'credits_used' => 1,
                'remaining' => $tempBalance + 1 // This is estimation since we don't store snapshots
            ];
            $tempBalance += 1; // Backtracking balance
        }

        // 8. Purchase History
        $purchases = $purchaseModel->orderBy('created_at', 'DESC')->findAll(5);
        $purchaseHistory = array_map(function($p) {
            return [
                'package' => $p['notes'] ?: 'Credits Topup',
                'credits' => $p['quantity'],
                'amount' => '₹' . number_format($p['total_amount'], 2),
                'date' => date('d M', strtotime($p['created_at'])),
                'status' => $p['status']
            ];
        }, $purchases);

        return $this->respond([
            'total_clients' => $totalClients,
            'total_analyses' => $totalAnalyses,
            'credits_remaining' => $creditsRemaining,
            'credits_used_this_month' => $thisMonthCreditsUsed,
            'is_trial' => $isTrial,
            'plan_name' => $planName,
            'trial_days_remaining' => $trialDaysRemaining,
            'trial_total_days' => $trialTotalDays,
            'monthly_chart_data' => $chartData,
            'daily_usage_chart' => $dailyUsage,
            'recent_clients' => $recentClients,
            'usage_history' => $usageHistory,
            'purchase_history' => $purchaseHistory
        ]);
    }
}
