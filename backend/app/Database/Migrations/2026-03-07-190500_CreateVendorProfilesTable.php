<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateVendorProfilesTable extends Migration
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
            'user_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
            ],
            // SECTION 2 — Professional Identity
            'professional_name' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'brand_name' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'professional_title' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'experience_years' => [
                'type' => 'INT',
                'constraint' => 5,
                'null' => true,
            ],
            // SECTION 3 — Business Details
            'business_type' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => true,
            ],
            'gst_number' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => true,
            ],
            // SECTION 4 — Contact Information
            'alt_mobile' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => true,
            ],
            'whatsapp' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => true,
            ],
            'website' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'instagram' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'youtube' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'facebook' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            // SECTION 5 — Address Information
            'country' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true,
                'default' => 'India',
            ],
            'state' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true,
            ],
            'pincode' => [
                'type' => 'VARCHAR',
                'constraint' => '10',
                'null' => true,
            ],
            'full_address' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            // SECTION 6 — Consultation Preferences
            'primary_system' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => true,
                'default' => 'Chaldean',
            ],
            'analysis_system' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => true,
                'default' => 'Chaldean',
            ],
            // SECTION 7 — Report Branding
            'report_header' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'report_footer' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'signature_name' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'signature_img' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'brand_logo' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ],
            'profile_photo' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
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
        $this->forge->addForeignKey('user_id', 'users', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('vendor_profiles');
    }

    public function down()
    {
        $this->forge->dropTable('vendor_profiles');
    }
}
