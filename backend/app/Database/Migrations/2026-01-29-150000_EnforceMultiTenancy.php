<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class EnforceMultiTenancy extends Migration
{
    public function up()
    {
        $tables = [
            'client_name_checks',
            'client_mobile_checks',
            'client_vehicle_checks'
        ];

        foreach ($tables as $table) {
            // Add user_id column
            $this->forge->addColumn($table, [
                'user_id' => [
                    'type' => 'INT',
                    'constraint' => 11,
                    'unsigned' => true,
                    'null' => true,
                    'after' => 'id'
                ]
            ]);

            // Add foreign key
            $this->db->query("ALTER TABLE {$table} ADD CONSTRAINT fk_{$table}_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE");

            // Data Migration: Associate existing checks with their client's user_id
            $this->db->query("
                UPDATE {$table} t
                JOIN clients c ON t.client_id = c.id
                SET t.user_id = c.user_id
                WHERE t.user_id IS NULL AND t.client_id IS NOT NULL
            ");

            // Final safety: assign remaining records (if any) to the first admin
            $firstAdmin = $this->db->table('users')->select('id')->where('role', 'super_admin')->orderBy('id', 'ASC')->get()->getRow();
            if ($firstAdmin) {
                $this->db->query("UPDATE {$table} SET user_id = {$firstAdmin->id} WHERE user_id IS NULL");
            }
        }
    }

    public function down()
    {
        $tables = [
            'client_name_checks',
            'client_mobile_checks',
            'client_vehicle_checks'
        ];

        foreach ($tables as $table) {
            $this->forge->dropForeignKey($table, "fk_{$table}_user_id");
            $this->forge->dropColumn($table, 'user_id');
        }
    }
}
