<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class DropSavedNamesTable extends Migration
{
    public function up()
    {
        $this->forge->dropTable('saved_names', true);
    }

    public function down()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'chaldean_total' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'pythagorean_total' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('saved_names');
    }
}
