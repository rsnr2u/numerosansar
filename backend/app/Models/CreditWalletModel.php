<?php

namespace App\Models;

use CodeIgniter\Model;

class CreditWalletModel extends Model
{
    protected $table = 'credit_wallets';
    protected $primaryKey = 'id';
    protected $useAutoIncrement = true;
    protected $returnType = 'array';
    protected $protectFields = true;
    protected $allowedFields = ['user_id', 'regular_balance', 'whitelabel_balance'];

    protected $useTimestamps = true;
    protected $createdField = 'created_at';
    protected $updatedField = 'updated_at';

    /**
     * Get or auto-create a wallet for a user.
     */
    public function getOrCreate(int $userId): array
    {
        $wallet = $this->where('user_id', $userId)->first();

        if (!$wallet) {
            $this->insert([
                'user_id' => $userId,
                'regular_balance' => 0,
                'whitelabel_balance' => 0,
            ]);
            $wallet = $this->where('user_id', $userId)->first();
        } else if ($wallet['whitelabel_balance'] > 0) {
            // Auto-migrate legacy whitelabel credits to unified balance
            $total = (int)$wallet['regular_balance'] + (int)$wallet['whitelabel_balance'];
            $this->update($wallet['id'], [
                'regular_balance' => $total,
                'whitelabel_balance' => 0
            ]);
            $wallet['regular_balance'] = $total;
            $wallet['whitelabel_balance'] = 0;
        }

        return $wallet;
    }

    /**
     * Atomically deduct 1 credit from the unified balance.
     */
    public function deductCredit(int $userId, string $creditType = 'regular'): bool
    {
        $db = \Config\Database::connect();
        $builder = $db->table($this->table);

        $result = $builder
            ->where('user_id', $userId)
            ->where("regular_balance >", 0)
            ->set('regular_balance', "regular_balance - 1", false)
            ->update();

        return $db->affectedRows() > 0;
    }

    /**
     * Add credits to a user's unified wallet.
     */
    public function addCredits(int $userId, string $creditType, int $quantity): bool
    {
        // Ensure wallet exists and migrate if needed
        $this->getOrCreate($userId);

        $db = \Config\Database::connect();
        $builder = $db->table($this->table);

        return $builder
            ->where('user_id', $userId)
            ->set('regular_balance', "regular_balance + {$quantity}", false)
            ->update();
    }
}
