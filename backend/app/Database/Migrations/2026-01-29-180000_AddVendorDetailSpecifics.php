<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddVendorDetailSpecifics extends Migration
{
    public function up()
    {
        // 1. Add fields to Users
        $this->forge->addColumn('users', [
            'last_login' => [
                'type' => 'DATETIME',
                'null' => true,
                'after' => 'account_status'
            ],
            'last_ip' => [
                'type' => 'VARCHAR',
                'constraint' => 45,
                'null' => true,
                'after' => 'last_login'
            ],
            'address' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'city'
            ]
        ]);

        // 2. Add fields to Subscriptions
        $this->forge->addColumn('subscriptions', [
            'auto_renew' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1,
                'after' => 'ends_at'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('users', ['last_login', 'last_ip', 'address']);
        $this->forge->dropColumn('subscriptions', ['auto_renew']);
    }
}
