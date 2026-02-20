<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateLuckyNameNumbersTable extends Migration
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
            'number' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
            ],
            'vibe' => [
                'type' => 'TEXT',
            ],
            'great_for' => [
                'type' => 'TEXT',
            ],
            'created_at datetime default current_timestamp',
            'updated_at datetime default current_timestamp on update current_timestamp',
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('lucky_name_numbers');
    }

    public function down()
    {
        $this->forge->dropTable('lucky_name_numbers');
    }
}
