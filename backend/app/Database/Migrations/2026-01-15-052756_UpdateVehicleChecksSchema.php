<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class UpdateVehicleChecksSchema extends Migration
{
    public function up()
    {
        $fields = [
            'vehicle_type' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => true,
                'after' => 'vehicle_number'
            ],
            'last_4_numbers' => [
                'type' => 'VARCHAR',
                'constraint' => '10',
                'null' => true,
                'after' => 'pythagorean_root'
            ],
            'last_4_compound' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
                'after' => 'last_4_numbers'
            ],
            'last_4_root' => [
                'type' => 'INT',
                'constraint' => 11,
                'default' => 0,
                'after' => 'last_4_compound'
            ],
            'l_result' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => true,
                'after' => 'last_4_root'
            ],
        ];
        $this->forge->addColumn('client_vehicle_checks', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('client_vehicle_checks', 'vehicle_type');
        $this->forge->dropColumn('client_vehicle_checks', 'last_4_numbers');
        $this->forge->dropColumn('client_vehicle_checks', 'last_4_compound');
        $this->forge->dropColumn('client_vehicle_checks', 'last_4_root');
        $this->forge->dropColumn('client_vehicle_checks', 'l_result');
    }
}
