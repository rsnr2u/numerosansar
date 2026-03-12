<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateNumerologyTables extends Migration
{
    public function up()
    {
        // 1. Numerology Letters Table (formerly letter_mappings)
        // Stores letter-to-number values for Chaldean/Pythagorean
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'letter' => [
                'type' => 'CHAR',
                'constraint' => 1,
            ],
            'chaldean_number' => [
                'type' => 'TINYINT',
                'constraint' => 2,
            ],
            'pythagorean_number' => [
                'type' => 'TINYINT',
                'constraint' => 2,
            ],
            'numerology_number' => [
                'type' => 'TINYINT',
                'constraint' => 2,
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('numerology_letters');

        // 2. Numerology Planets Table (formerly numerology_systems)
        // Stores Number (1-9) -> Planet Schema
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'number' => [
                'type' => 'TINYINT',
                'constraint' => 2,
            ],
            'planet_name' => [
                'type' => 'VARCHAR',
                'constraint' => 50,
            ],
            'notes' => [
                'type' => 'TEXT',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('numerology_planets');

        // 3. Compound Numbers Table (Final Spec)
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'number' => [
                'type' => 'TINYINT',
                'constraint' => 3,
            ],
            'title' => [
                'type' => 'VARCHAR',
                'constraint' => 150,
            ],
            'description' => [
                'type' => 'TEXT',
            ],
            'result' => [
                'type' => 'ENUM',
                'constraint' => ['Good', 'Not Good', 'Very Good', 'Super', 'Excellent'],
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('compound_numbers');

        // 4. Saved Names Table (History) - Keeping this for feature continuity
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

        // Users Table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'username' => [
                'type' => 'VARCHAR',
                'constraint' => 100,
                'unique' => true,
            ],
            'password' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
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
        $this->forge->createTable('users');
    }

    public function down()
    {
        $this->forge->dropTable('numerology_letters', true);
        $this->forge->dropTable('numerology_planets', true);
        $this->forge->dropTable('letter_mappings', true);
        $this->forge->dropTable('numerology_systems', true);
        $this->forge->dropTable('compound_numbers', true);
        $this->forge->dropTable('saved_names', true);
        $this->forge->dropTable('users', true);
    }
}
