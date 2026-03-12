<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddLoShuAIReportToClients extends Migration
{
    public function up()
    {
        $fields = [
            'loshu_ai_report' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'pincode'
            ],
        ];
        $this->forge->addColumn('clients', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('clients', 'loshu_ai_report');
    }
}
