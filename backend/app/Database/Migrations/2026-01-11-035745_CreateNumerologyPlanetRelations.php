<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateNumerologyPlanetRelations extends Migration
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
            'planet_number' => [
                'type' => 'TINYINT',
                'constraint' => 2,
            ],
            'planet_name' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'friend_numbers' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
            ],
            'enemy_numbers' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
            ],
            'neutral_numbers' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
                'null' => true,
            ],
            'status' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 1,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('numerology_planet_relations');
    }

    public function down()
    {
        //
    }
}
