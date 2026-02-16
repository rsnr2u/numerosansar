<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddUserRolesAndClientOwner extends Migration
{
    public function up()
    {
        // 1. Add 'role' to 'users' table
        $this->forge->addColumn('users', [
            'role' => [
                'type' => 'ENUM',
                'constraint' => ['super_admin', 'numerologist'],
                'default' => 'numerologist',
                'after' => 'password'
            ]
        ]);

        // 2. Add 'user_id' to 'clients' table
        $this->forge->addColumn('clients', [
            'user_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true,
                'after' => 'id'
            ]
        ]);

        // 3. Add foreign key to 'clients'
        $this->db->query("ALTER TABLE clients ADD CONSTRAINT fk_clients_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE");

        // 4. Set default role for existing users to 'super_admin' (assuming first users are admins)
        $this->db->query("UPDATE users SET role = 'super_admin'");

        // 5. Assign existing clients to the first user found
        $firstUser = $this->db->table('users')->select('id')->orderBy('id', 'ASC')->get()->getRow();
        if ($firstUser) {
            $this->db->table('clients')->update(['user_id' => $firstUser->id]);
        }
    }

    public function down()
    {
        $this->forge->dropForeignKey('clients', 'fk_clients_user_id');
        $this->forge->dropColumn('clients', 'user_id');
        $this->forge->dropColumn('users', 'role');
    }
}
