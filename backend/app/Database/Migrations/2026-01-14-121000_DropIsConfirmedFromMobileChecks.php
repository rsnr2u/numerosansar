<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class DropIsConfirmedFromMobileChecks extends Migration
{
    public function up()
    {
        $this->forge->dropColumn('client_mobile_checks', 'is_confirmed');
    }

    public function down()
    {
        $fields = [
            'is_confirmed' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
                'null' => true
            ]
        ];
        $this->forge->addColumn('client_mobile_checks', $fields);
    }
}
