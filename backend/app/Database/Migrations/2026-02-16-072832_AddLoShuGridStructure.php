<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddLoShuGridStructure extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'cell' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
            ],
            'number' => [
                'type' => 'INT',
                'constraint' => 1,
            ],
            'quality' => [
                'type' => 'TEXT',
            ],
            'created_at datetime default current_timestamp',
            'updated_at datetime default current_timestamp on update current_timestamp',
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('lo_shu_grid');

        // Initial Seed
        $db = \Config\Database::connect();
        $db->table('lo_shu_grid')->insertBatch([
            ['cell' => 'Top-Left', 'number' => 4, 'quality' => 'Order, hard work, practicality'],
            ['cell' => 'Top-Center', 'number' => 9, 'quality' => 'Idealism, fame, inspiration'],
            ['cell' => 'Top-Right', 'number' => 2, 'quality' => 'Relationships, cooperation'],
            ['cell' => 'Mid-Left', 'number' => 3, 'quality' => 'Creativity, expression'],
            ['cell' => 'Center', 'number' => 5, 'quality' => 'Balance, adaptability'],
            ['cell' => 'Mid-Right', 'number' => 7, 'quality' => 'Intuition, spirituality'],
            ['cell' => 'Bottom-Left', 'number' => 8, 'quality' => 'Discipline, ambition'],
            ['cell' => 'Bottom-Center', 'number' => 1, 'quality' => 'Logic, leadership seed'],
            ['cell' => 'Bottom-Right', 'number' => 6, 'quality' => 'Service, responsibility'],
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('lo_shu_grid');
    }
}
