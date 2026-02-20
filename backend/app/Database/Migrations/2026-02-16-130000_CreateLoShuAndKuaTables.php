<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateLoShuAndKuaTables extends Migration
{
    public function up()
    {
        // Lo Shu Meanings Table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'number' => [
                'type' => 'INT',
                'constraint' => 1,
            ],
            'quality' => [
                'type' => 'TEXT',
            ],
            'remedy' => [
                'type' => 'TEXT',
            ],
            'created_at datetime default current_timestamp',
            'updated_at datetime default current_timestamp on update current_timestamp',
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('lo_shu_meanings');

        // Kua Details Table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'kua_number' => [
                'type' => 'INT',
                'constraint' => 2,
            ],
            'sheng_qi' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
            ],
            'tian_yi' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
            ],
            'yan_nian' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
            ],
            'fu_wei' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
            ],
            'bad_directions' => [
                'type' => 'TEXT',
            ],
            'created_at datetime default current_timestamp',
            'updated_at datetime default current_timestamp on update current_timestamp',
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('kua_details');
    }

    public function down()
    {
        $this->forge->dropTable('lo_shu_meanings');
        $this->forge->dropTable('kua_details');
    }
}
