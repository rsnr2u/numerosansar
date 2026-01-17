<?php

require_once __DIR__ . '/../app/Controllers/BaseController.php';
require_once __DIR__ . '/../app/Libraries/NumerologyCalculator.php';

// Mock CodeIgniter environment minimally if needed, or just test the class logic
// Since it depends on Models, we might need to bootstrap CI. 
// Easier to just use the existing route or a script that loads CI.
// We'll write to public/test_calc.php which can be accessed via CLI or browser.

// Load the bootstrap file
require __DIR__ . '/../program_paths.php'; // Just guessing standard paths or we can rely on `php spark` context if we write a command.
// Actually, easier to write a script in public/ that bootstraps full framework.

define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);
chdir(__DIR__ . '/../');
$paths = require 'app/Config/Paths.php';
require 'system/bootstrap.php';

use App\Libraries\NumerologyCalculator;
use App\Models\NumerologySystemModel;
use App\Models\NumerologyPlanetModel;
use Config\Services;

// Create calculator
$calc = new NumerologyCalculator();

$name = "Rahul";
$dob = "1990-01-01"; // 1+9+9+0 + 0+1 + 0+1 = 20 -> 2+0 = 2. 
// Destiny should be 2.

$result = $calc->calculate($name, $dob);

echo "Name: $name\n";
echo "DOB: $dob\n";
echo "Birth (Driver): " . $result['birth']['number'] . "\n";
echo "Destiny (Conductor - DOB): " . $result['destiny']['number'] . "\n";
echo "Name Number: " . $result['name_number']['number'] . "\n";

if ($result['destiny']['number'] == 2) {
    echo "SUCCESS: Destiny is calculated from DOB.\n";
} else {
    echo "FAILURE: Destiny is NOT 2.\n";
}
