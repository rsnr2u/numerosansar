<?php

define('FCPATH', __DIR__ . '/public/');
require FCPATH . '../app/Config/Paths.php';
$paths = new Config\Paths();
require $paths->systemDirectory . '/Boot.php';
$app = CodeIgniter\Boot::bootWeb($paths);

$model = new \App\Models\ClientModel();
try {
    $data = $model->findAll();
    echo "Count: " . count($data) . "\n";
    print_r($data);
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}
