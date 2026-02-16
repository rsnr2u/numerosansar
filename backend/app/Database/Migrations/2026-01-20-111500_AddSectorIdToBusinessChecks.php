<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddSectorIdToBusinessChecks extends Migration
{
    public function up()
    {
        $fields = [
            'business_sector_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true,
                'after' => 'client_id'
            ],
        ];
        $this->forge->addColumn('client_business_checks', $fields);

        // Add foreign key
        $this->db->query("ALTER TABLE client_business_checks ADD CONSTRAINT fk_business_sector FOREIGN KEY (business_sector_id) REFERENCES business_lucky_numbers(id) ON DELETE SET NULL ON UPDATE CASCADE");
    }

    public function down()
    {
        $this->forge->dropForeignKey('client_business_checks', 'fk_business_sector');
        $this->forge->dropColumn('client_business_checks', 'business_sector_id');
    }
}
