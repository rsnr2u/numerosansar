<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateClientSelections extends Migration
{
    public function up()
    {
        // 1. Modify client_name_checks table enum
        $this->db->query("ALTER TABLE client_name_checks MODIFY COLUMN type ENUM('Name', 'Business', 'Mobile', 'Vehicle') DEFAULT 'Name'");

        // 2. Add fields to clients table
        $fields = [
            'confirmed_business_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'calling_name'
            ],
            'confirmed_mobile_number' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => true,
                'after' => 'confirmed_business_name'
            ],
            'confirmed_vehicle_number' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
                'after' => 'confirmed_mobile_number'
            ],
        ];
        $this->forge->addColumn('clients', $fields);
    }

    public function down()
    {
        // 1. Revert client_name_checks table enum
        $this->db->query("ALTER TABLE client_name_checks MODIFY COLUMN type ENUM('Name', 'Business') DEFAULT 'Name'");

        // 2. Remove fields from clients table
        $this->forge->dropColumn('clients', ['confirmed_business_name', 'confirmed_mobile_number', 'confirmed_vehicle_number']);
    }
}
