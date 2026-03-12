<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddYearlyAIReportToClients extends Migration
{
    public function up()
    {
        $fields = [
            'yearly_ai_report' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'loshu_ai_report'
            ],
        ];
        $this->forge->addColumn('clients', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('clients', 'yearly_ai_report');
    }
}
