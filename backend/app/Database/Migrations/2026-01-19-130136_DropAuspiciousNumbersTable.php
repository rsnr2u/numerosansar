<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class DropAuspiciousNumbersTable extends Migration
{
    public function up()
    {
        $this->forge->dropTable('auspicious_numbers', true);
    }

    public function down()
    {
        // Not easily reversible without full schema, but we've migrated the data already.
    }
}
