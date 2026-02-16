<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAiConfigurationsTable extends Migration
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
            'provider_name' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'unique' => true, // Gemini, OpenAI
            ],
            'api_key' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'is_active' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'default' => 0,
            ],
            'model_name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true,
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
        $this->forge->createTable('ai_configurations');

        // Seed initial data
        $db = \Config\Database::connect();
        $db->table('ai_configurations')->insertBatch([
            [
                'provider_name' => 'gemini',
                'api_key' => '',
                'is_active' => 1,
                'model_name' => 'gemini-1.5-flash',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ],
            [
                'provider_name' => 'openai',
                'api_key' => '',
                'is_active' => 0,
                'model_name' => 'gpt-3.5-turbo',
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('ai_configurations');
    }
}
