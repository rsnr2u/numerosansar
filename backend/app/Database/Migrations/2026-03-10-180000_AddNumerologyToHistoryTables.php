<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddNumerologyToHistoryTables extends Migration
{
    public function up()
    {
        // 1. client_business_checks
        $this->forge->addColumn('client_business_checks', [
            'numerology_compound' => ['type' => 'INT', 'constraint' => 11, 'null' => true, 'after' => 'pythagorean_compound'],
            'numerology_root' => ['type' => 'INT', 'constraint' => 11, 'null' => true, 'after' => 'pythagorean_root'],
            'numerology_result' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true, 'after' => 'pythagorean_result'],
        ]);

        // 2. client_vehicle_checks
        $this->forge->addColumn('client_vehicle_checks', [
            'numerology_compound' => ['type' => 'INT', 'constraint' => 11, 'null' => true, 'after' => 'pythagorean_compound'],
            'numerology_root' => ['type' => 'INT', 'constraint' => 11, 'null' => true, 'after' => 'pythagorean_root'],
            'numerology_result' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true, 'after' => 'result'],
        ]);

        // 3. client_name_checks
        $this->forge->addColumn('client_name_checks', [
            'numerology_compound' => ['type' => 'INT', 'constraint' => 11, 'null' => true, 'after' => 'pythagorean_compound'],
            'numerology_root' => ['type' => 'INT', 'constraint' => 11, 'null' => true, 'after' => 'pythagorean_root'],
            'numerology_result' => ['type' => 'VARCHAR', 'constraint' => 50, 'null' => true, 'after' => 'pythagorean_result'],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('client_business_checks', ['numerology_compound', 'numerology_root', 'numerology_result']);
        $this->forge->dropColumn('client_vehicle_checks', ['numerology_compound', 'numerology_root', 'numerology_result']);
        $this->forge->dropColumn('client_name_checks', ['numerology_compound', 'numerology_root', 'numerology_result']);
    }
}
