<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class OptimizeClientIndexes extends Migration
{
    public function up()
    {
        // Add indexes to 'clients' table for search optimization
        $this->db->query("ALTER TABLE clients ADD INDEX idx_clients_full_name (full_name)");
        $this->db->query("ALTER TABLE clients ADD INDEX idx_clients_calling_name (calling_name)");
        $this->db->query("ALTER TABLE clients ADD INDEX idx_clients_created_at (created_at)");

        // Add indexes to dedicated check tables for history performance
        $this->db->query("ALTER TABLE client_name_checks ADD INDEX idx_cnc_client_id (client_id)");
        $this->db->query("ALTER TABLE client_business_checks ADD INDEX idx_cbc_client_id (client_id)");
        $this->db->query("ALTER TABLE client_mobile_checks ADD INDEX idx_cmc_client_id (client_id)");
        $this->db->query("ALTER TABLE client_vehicle_checks ADD INDEX idx_cvc_client_id (client_id)");
    }

    public function down()
    {
        $this->db->query("ALTER TABLE clients DROP INDEX idx_clients_full_name");
        $this->db->query("ALTER TABLE clients DROP INDEX idx_clients_calling_name");
        $this->db->query("ALTER TABLE clients DROP INDEX idx_clients_created_at");

        $this->db->query("ALTER TABLE client_name_checks DROP INDEX idx_cnc_client_id");
        $this->db->query("ALTER TABLE client_business_checks DROP INDEX idx_cbc_client_id");
        $this->db->query("ALTER TABLE client_mobile_checks DROP INDEX idx_cmc_client_id");
        $this->db->query("ALTER TABLE client_vehicle_checks DROP INDEX idx_cvc_client_id");
    }
}
