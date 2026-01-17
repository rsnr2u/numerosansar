<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateClientNameChecksTable extends Migration
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
            'client_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true, // Nullable for general checks, but usually linked
            ],
            'type' => [
                'type' => 'ENUM',
                'constraint' => ['Name', 'Business'],
                'default' => 'Name',
            ],
            'name_value' => [
                'type' => 'VARCHAR',
                'constraint' => 255,
            ],
            'chaldean_compound' => [
                'type' => 'INT',
                'constraint' => 11,
                'null' => true,
            ],
            'pythagorean_compound' => [
                'type' => 'INT',
                'constraint' => 11,
                'null' => true,
            ],
            'chaldean_root' => [
                'type' => 'INT',
                'constraint' => 11,
                'null' => true,
            ],
            'pythagorean_root' => [
                'type' => 'INT',
                'constraint' => 11,
                'null' => true,
            ],
            'result' => [
                'type' => 'VARCHAR',
                'constraint' => 50, // Excellent, Good, etc.
                'null' => true,
            ],
            'is_confirmed' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
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
        $this->forge->addForeignKey('client_id', 'clients', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('client_name_checks');
    }

    public function down()
    {
        $this->forge->dropTable('client_name_checks');
    }
}
