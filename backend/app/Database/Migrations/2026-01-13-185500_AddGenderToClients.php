<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddGenderToClients extends Migration
{
    public function up()
    {
        $fields = [
            'gender' => [
                'type' => 'ENUM',
                'constraint' => ['Male', 'Female', 'Other'],
                'null' => true,
                'after' => 'dob'
            ],
        ];
        $this->forge->addColumn('clients', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('clients', 'gender');
    }
}
