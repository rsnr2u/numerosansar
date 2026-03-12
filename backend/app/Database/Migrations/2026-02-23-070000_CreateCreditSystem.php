<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCreditSystem extends Migration
{
    public function up()
    {
        // 1. Credit Wallets — one row per user
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'user_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'regular_balance' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
            ],
            'whitelabel_balance' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('user_id');
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('credit_wallets');

        // 2. Credit Purchases — logs every buy transaction
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'user_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'credit_type' => [
                'type' => 'ENUM',
                'constraint' => ['regular', 'whitelabel'],
            ],
            'quantity' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'unit_price' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
            ],
            'total_amount' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
            ],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['pending', 'completed', 'failed'],
                'default' => 'completed',
            ],
            'payment_reference' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('user_id');
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('credit_purchases');

        // 3. Credit Usage — links each credit spent to a specific confirmed analysis
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'user_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'check_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'check_type' => [
                'type' => 'ENUM',
                'constraint' => ['Name', 'Business', 'Mobile', 'Vehicle'],
            ],
            'credit_type' => [
                'type' => 'ENUM',
                'constraint' => ['regular', 'whitelabel'],
            ],
            'client_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('user_id');
        $this->forge->addKey(['check_id', 'check_type']);
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('credit_usage');
    }

    public function down()
    {
        $this->forge->dropTable('credit_usage');
        $this->forge->dropTable('credit_purchases');
        $this->forge->dropTable('credit_wallets');
    }
}
