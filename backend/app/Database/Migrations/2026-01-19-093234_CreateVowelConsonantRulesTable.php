<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateVowelConsonantRulesTable extends Migration
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
            'type' => [
                'type' => 'ENUM',
                'constraint' => ['Vowel', 'Consonant'],
                'default' => 'Vowel',
            ],
            'number' => [
                'type' => 'INT',
                'constraint' => 11,
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('vowel_consonant_rules');
    }

    public function down()
    {
        $this->forge->dropTable('vowel_consonant_rules');
    }
}
