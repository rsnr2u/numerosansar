<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class SplitResultColumns extends Migration
{
    public function up()
    {
        // 1. client_name_checks
        $this->forge->dropColumn('client_name_checks', 'result');
        $this->forge->addColumn('client_name_checks', [
            'chaldean_result' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true, 'after' => 'pythagorean_root'],
            'pythagorean_result' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true, 'after' => 'chaldean_result'],
        ]);

        // 2. client_business_checks
        $this->forge->dropColumn('client_business_checks', 'result');
        $this->forge->addColumn('client_business_checks', [
            'chaldean_result' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true, 'after' => 'pythagorean_root'],
            'pythagorean_result' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true, 'after' => 'chaldean_result'],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('client_name_checks', ['chaldean_result', 'pythagorean_result']);
        $this->forge->addColumn('client_name_checks', [
            'result' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true, 'after' => 'pythagorean_root'],
        ]);

        $this->forge->dropColumn('client_business_checks', ['chaldean_result', 'pythagorean_result']);
        $this->forge->addColumn('client_business_checks', [
            'result' => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true, 'after' => 'pythagorean_root'],
        ]);
    }
}
