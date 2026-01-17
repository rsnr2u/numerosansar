<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class RemoveRedundantColumns extends Migration
{
    public function up()
    {
        $this->forge->dropColumn('clients', 'calling_name');
        $this->forge->dropColumn('clients', 'confirmed_business_name');
        $this->forge->dropColumn('clients', 'confirmed_mobile_number');
        $this->forge->dropColumn('clients', 'confirmed_vehicle_number');
    }

    public function down()
    {
        $this->forge->addColumn('clients', [
            'calling_name' => ['type' => 'VARCHAR', 'constraint' => '255', 'null' => true],
            'confirmed_business_name' => ['type' => 'VARCHAR', 'constraint' => '255', 'null' => true],
            'confirmed_mobile_number' => ['type' => 'VARCHAR', 'constraint' => '20', 'null' => true],
            'confirmed_vehicle_number' => ['type' => 'VARCHAR', 'constraint' => '20', 'null' => true],
        ]);
    }
}
