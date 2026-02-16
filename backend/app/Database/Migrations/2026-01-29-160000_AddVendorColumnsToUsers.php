<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddVendorColumnsToUsers extends Migration
{
    public function up()
    {
        $this->forge->addColumn('users', [
            'full_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'username'
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'unique' => true,
                'after' => 'full_name'
            ],
            'mobile' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => true,
                'after' => 'email'
            ],
            'business_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'mobile'
            ],
            'city' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'null' => true,
                'after' => 'business_name'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('users', ['full_name', 'email', 'mobile', 'business_name', 'city']);
    }
}
