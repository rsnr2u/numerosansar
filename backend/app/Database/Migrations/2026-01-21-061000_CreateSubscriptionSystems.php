<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateSubscriptionSystems extends Migration
{
    public function up()
    {
        // 1. Subscription Plans Table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
            ],
            'price_monthly' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
            ],
            'price_yearly' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
            ],
            'modules' => [
                'type' => 'TEXT', // JSON array: ["name", "mobile", "business", "vehicle", "ai"]
            ],
            'description' => [
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
        $this->forge->createTable('subscription_plans');

        // 2. Subscriptions Table
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
            'plan_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            'billing_cycle' => [
                'type' => 'ENUM',
                'constraint' => ['monthly', 'yearly'],
                'default' => 'monthly',
            ],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['active', 'expired', 'cancelled', 'pending'],
                'default' => 'active',
            ],
            'starts_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'ends_at' => [
                'type' => 'DATETIME',
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
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('plan_id', 'subscription_plans', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('subscriptions');

        // Insert Default Plans
        $db = \Config\Database::connect();
        $db->table('subscription_plans')->insertBatch([
            [
                'name' => 'Starter Pack',
                'price_monthly' => 999.00,
                'price_yearly' => 9999.00,
                'modules' => json_encode(['name', 'mobile']),
                'description' => 'Perfect for individual numerologists starting their journey.',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Professional Pack',
                'price_monthly' => 1999.00,
                'price_yearly' => 19999.00,
                'modules' => json_encode(['name', 'mobile', 'business', 'vehicle', 'ai']),
                'description' => 'Advance tools for professional consultants and businesses.',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('subscriptions');
        $this->forge->dropTable('subscription_plans');
    }
}
