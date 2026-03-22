<?php
require 'app/Config/Database.php';
$db = \Config\Database::connect();
$tables = $db->listTables();
echo "Tables:\n";
print_r($tables);

foreach (['user_credits', 'credit_transactions', 'payments', 'users'] as $table) {
    if (in_array($table, $tables)) {
        echo "\nTable: $table\n";
        $query = $db->query("DESCRIBE $table");
        print_r($query->getResultArray());
    }
}
