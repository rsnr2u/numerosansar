<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddCallingNameToClients extends Migration
{
    public function up()
    {
        $fields = [
            'calling_name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'full_name'
            ],
        ];
        $this->forge->addColumn('clients', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('clients', 'calling_name');
    }
}
