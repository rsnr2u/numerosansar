<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class RegistryPerformanceIndexing extends Migration
{
    public function up()
    {
        // Indexes for 'users' table - to speed up filtering by role, city and registration date
        $this->db->query("ALTER TABLE users ADD INDEX idx_users_role (role)");
        $this->db->query("ALTER TABLE users ADD INDEX idx_users_city (city)");
        $this->db->query("ALTER TABLE users ADD INDEX idx_users_created_at (created_at)");
        $this->db->query("ALTER TABLE users ADD INDEX idx_users_account_status (account_status)");

        // Indexes for 'subscriptions' table - to speed up joins and filtering by status
        $this->db->query("ALTER TABLE subscriptions ADD INDEX idx_subs_user_id (user_id)");
        $this->db->query("ALTER TABLE subscriptions ADD INDEX idx_subs_status (status)");

        // Index for 'clients' table - to speed up multi-tenancy grouping and metrics
        $this->db->query("ALTER TABLE clients ADD INDEX idx_clients_user_id (user_id)");
    }

    public function down()
    {
        $this->db->query("ALTER TABLE users DROP INDEX idx_users_role");
        $this->db->query("ALTER TABLE users DROP INDEX idx_users_city");
        $this->db->query("ALTER TABLE users DROP INDEX idx_users_created_at");
        $this->db->query("ALTER TABLE users DROP INDEX idx_users_account_status");

        $this->db->query("ALTER TABLE subscriptions DROP INDEX idx_subs_user_id");
        $this->db->query("ALTER TABLE subscriptions DROP INDEX idx_subs_status");

        $this->db->query("ALTER TABLE clients DROP INDEX idx_clients_user_id");
    }
}
