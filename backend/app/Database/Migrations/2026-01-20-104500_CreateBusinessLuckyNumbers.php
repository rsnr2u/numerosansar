<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateBusinessLuckyNumbers extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'sector_name' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'sector_name_telugu' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'lucky_numbers' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('business_lucky_numbers');
    }

    public function down()
    {
        $this->forge->dropTable('business_lucky_numbers');
    }
}
