<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SuperAdminEnhancements extends Migration
{
    public function up()
    {
        // 1. Audit Logs
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'action' => ['type' => 'VARCHAR', 'constraint' => 255],
            'performed_by' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'target_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'details' => ['type' => 'TEXT', 'null' => true],
            'ip_address' => ['type' => 'VARCHAR', 'constraint' => 45],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('audit_logs');

        // 2. Payments
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'invoice_id' => ['type' => 'VARCHAR', 'constraint' => 50, 'unique' => true],
            'user_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'plan_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'amount' => ['type' => 'DECimal', 'constraint' => '10,2'],
            'payment_method' => ['type' => 'VARCHAR', 'constraint' => 50],
            'status' => ['type' => 'ENUM', 'constraint' => ['paid', 'failed', 'pending'], 'default' => 'pending'],
            'gateway_resp' => ['type' => 'TEXT', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('payments');

        // 3. System Config
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'config_key' => ['type' => 'VARCHAR', 'constraint' => 100, 'unique' => true],
            'config_value' => ['type' => 'TEXT'],
            'description' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('system_config');

        // 4. Update Users Table
        $this->forge->addColumn('users', [
            'account_status' => [
                'type' => 'ENUM',
                'constraint' => ['Active', 'Suspended', 'Blocked'],
                'default' => 'Active',
                'after' => 'role'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('audit_logs');
        $this->forge->dropTable('payments');
        $this->forge->dropTable('system_config');
        $this->forge->dropColumn('users', 'account_status');
    }
}
