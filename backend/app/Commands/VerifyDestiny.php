<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use App\Libraries\NumerologyCalculator;

class VerifyDestiny extends BaseCommand
{
    protected $group = 'Numerology';
    protected $name = 'verify:destiny';
    protected $description = 'Verifies the Destiny Number calculation logic.';

    public function run(array $params)
    {
        $name = 'Rahul';
        $dob = '1990-01-01'; // Sum: 1+9+9+0 + 0+1 + 0+1 = 21 -> 3

        CLI::write("Testing with Name: $name", 'yellow');
        CLI::write("Testing with DOB: $dob", 'yellow');

        $calculator = new NumerologyCalculator();
        $result = $calculator->calculate($name, $dob);

        CLI::write("--- Results ---", 'white');
        CLI::write("Name Input: " . $result['name']);
        CLI::write("DOB Input: " . $result['dob']);

        // Check Destiny
        $destiny = $result['destiny'];
        CLI::write("Destiny (Should be DOB Sum '3'): " . $destiny['number'], 'green');
        CLI::write("Destiny Description: " . $destiny['description'], 'green');

        // Check Name Number
        $nameNum = $result['name_number'];
        CLI::write("Name Number (Should be Name Sum '8'): " . $nameNum['number'], 'cyan');

        // Check logic
        if ($destiny['number'] == 3) {
            CLI::write("SUCCESS: Destiny number matches DOB sum.", 'light_green');
        } else {
            CLI::write("FAILURE: Destiny number matches " . $destiny['number'], 'red');
        }
    }
}
