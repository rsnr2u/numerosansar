<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDedicatedClientTables extends Migration
{
    public function up()
    {
        // 1. Business Checks Table
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'client_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'business_name' => ['type' => 'VARCHAR', 'constraint' => 255],
            'chaldean_compound' => ['type' => 'INT', 'constraint' => 11],
            'pythagorean_compound' => ['type' => 'INT', 'constraint' => 11],
            'chaldean_root' => ['type' => 'INT', 'constraint' => 11],
            'pythagorean_root' => ['type' => 'INT', 'constraint' => 11],
            'result' => ['type' => 'VARCHAR', 'constraint' => 100],
            'is_confirmed' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('client_id', 'clients', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('client_business_checks');

        // 2. Mobile Checks Table
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'client_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'mobile_number' => ['type' => 'VARCHAR', 'constraint' => 255],
            'chaldean_compound' => ['type' => 'INT', 'constraint' => 11],
            'pythagorean_compound' => ['type' => 'INT', 'constraint' => 11],
            'chaldean_root' => ['type' => 'INT', 'constraint' => 11],
            'pythagorean_root' => ['type' => 'INT', 'constraint' => 11],
            'result' => ['type' => 'VARCHAR', 'constraint' => 100],
            'is_confirmed' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('client_id', 'clients', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('client_mobile_checks');

        // 3. Vehicle Checks Table
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'client_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'vehicle_number' => ['type' => 'VARCHAR', 'constraint' => 255],
            'chaldean_compound' => ['type' => 'INT', 'constraint' => 11],
            'pythagorean_compound' => ['type' => 'INT', 'constraint' => 11],
            'chaldean_root' => ['type' => 'INT', 'constraint' => 11],
            'pythagorean_root' => ['type' => 'INT', 'constraint' => 11],
            'result' => ['type' => 'VARCHAR', 'constraint' => 100],
            'is_confirmed' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('client_id', 'clients', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('client_vehicle_checks');
    }

    public function down()
    {
        $this->forge->dropTable('client_business_checks');
        $this->forge->dropTable('client_mobile_checks');
        $this->forge->dropTable('client_vehicle_checks');
    }
}
