<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddProfessionAndTimeOfBirthToClients extends Migration
{
    public function up()
    {
        $fields = [
            'profession' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
                'null' => true,
                'after' => 'calling_name'
            ],
            'time_of_birth' => [
                'type' => 'VARCHAR',
                'constraint' => 20,
                'null' => true,
                'after' => 'dob'
            ],
        ];
        $this->forge->addColumn('clients', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('clients', ['profession', 'time_of_birth']);
    }
}
