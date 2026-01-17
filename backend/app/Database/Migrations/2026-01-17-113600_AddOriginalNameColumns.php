<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddOriginalNameColumns extends Migration
{
    public function up()
    {
        // Add original_name to client_name_checks
        $this->forge->addColumn('client_name_checks', [
            'original_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'name_value'
            ]
        ]);

        // Add original_name to client_business_checks
        $this->forge->addColumn('client_business_checks', [
            'original_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'business_name'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('client_name_checks', 'original_name');
        $this->forge->dropColumn('client_business_checks', 'original_name');
    }
}
