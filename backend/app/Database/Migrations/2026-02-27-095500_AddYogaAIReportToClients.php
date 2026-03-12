<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddYogaAIReportToClients extends Migration
{
    public function up()
    {
        $fields = [
            'yoga_ai_report' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'yearly_ai_report'
            ],
        ];
        $this->forge->addColumn('clients', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('clients', 'yoga_ai_report');
    }
}
