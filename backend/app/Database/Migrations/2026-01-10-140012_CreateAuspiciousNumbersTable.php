<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAuspiciousNumbersTable extends Migration
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
            'root_number' => [
                'type' => 'TINYINT',
                'constraint' => 2,
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
        $this->forge->addKey('root_number');
        $this->forge->createTable('auspicious_numbers');
    }

    public function down()
    {
        $this->forge->dropTable('auspicious_numbers');
    }
}
