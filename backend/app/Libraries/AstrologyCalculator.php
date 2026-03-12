<?php

namespace App\Libraries;

use App\Models\AstrologySystemModel; // Now points to numerology_letters
use App\Models\AstrologyPlanetModel; // Points to numerology_planets

class AstrologyCalculator
{
    private $letterModel;
    private $planetModel;
    private $auspiciousModel;
    private $letterMap = [];
    private $planetMap = [];
    private $planetRelationModel;
    private $planetRelationMap = [];

    public function __construct()
    {
        $this->letterModel = new AstrologySystemModel();
        $this->planetModel = new AstrologyPlanetModel();
        $this->planetRelationModel = new \App\Models\PlanetRelationModel();
        $this->loadMappings();
    }

    private function loadMappings()
    {
        // Cache letter mappings
        $letters = $this->letterModel->findAll();
        foreach ($letters as $l) {
            $char = strtoupper($l['letter']);
            $this->letterMap[$char] = [
                'be' => $l['chaldean_number'], // Correct column
                'py' => $l['pythagorean_number'], // Correct column
                'nu' => $l['numerology_number'] // New column
            ];
        }

        // Cache planet mappings
        $planets = $this->planetModel->findAll();
        foreach ($planets as $p) {
            $this->planetMap[$p['number']] = $p['planet_name']; // Correct column
        }

        // Cache planet relations (planetary compatibility matrix)
        $relations = $this->planetRelationModel->findAll();
        foreach ($relations as $row) {
            $friends = array_map('trim', explode(',', $row['friend_numbers'] ?? ''));
            $this->planetRelationMap[$row['root_number'] ?? $row['planet_number']] = array_filter($friends);
        }
    }

    public function calculate($name, $dob = null)
    {
        $cleanName = preg_replace('/[^A-Z]/', '', strtoupper($name));
        $chars = str_split($cleanName);

        // Name Calculations (Destiny/Mission)
        $breakdown = [];
        $chaldeanTotal = 0;
        $pythagoreanTotal = 0;
        $numerologyTotal = 0;
        $soulUrgeTotal = 0; // Heart (Vowels)
        $personalityTotal = 0; // Mask (Consonants)

        $vowels = ['A', 'E', 'I', 'O', 'U'];
        // Y is considered a vowel only if there are no other vowels in the syllable, 
        // but for simple numerology, Y is often treated conditionally. 
        // Standard/Simple approach: Y is a consonant unless explicitly defined. 
        // Let's stick to standard strict vowels for now as per common algorithms unless specified.

        foreach ($chars as $char) {
            $vals = $this->letterMap[$char] ?? ['be' => 0, 'py' => 0];
            $chaldeanVal = $vals['be'] ?? 0;
            $chaldeanTotal += $chaldeanVal;
            $pyNum = $vals['py'] ?? 0;
            $pythagoreanTotal += $pyNum;
            $nuNum = $vals['nu'] ?? 0;
            $numerologyTotal += $nuNum;

            if (in_array($char, $vowels)) {
                $soulUrgeTotal += $chaldeanVal; // Chaldean for Vowels per user request
            } else {
                $personalityTotal += $chaldeanVal; // Chaldean for Consonants per user request
            }

            $breakdown[] = [
                'char' => $char,
                'ch' => $vals['be'] ?? 0,
                'py' => $vals['py'] ?? 0,
                'nu' => $vals['nu'] ?? 0
            ];
        }

        $chaldeanSingle = $this->reduceToSingle($chaldeanTotal);
        $pythagoreanSingle = $this->reduceToSingle($pythagoreanTotal);
        $numerologySingle = $this->reduceToSingle($numerologyTotal);
        $soulUrgeSingle = $this->reduceToSingle($soulUrgeTotal);
        $personalitySingle = $this->reduceToSingle($personalityTotal);

        // Date Calculations
        $birthNumber = 0; // Driver
        $lifePathNumber = 0; // Road
        $auspiciousList = [];

        if ($dob) {
            // DOB format expected: YYYY-MM-DD or similar standard format
            $timestamp = strtotime($dob);
            if ($timestamp) {
                $day = date('d', $timestamp);
                $month = date('m', $timestamp);
                $year = date('Y', $timestamp);

                // Birth Number (Driver) - Day only
                $birthNumber = $this->reduceToSingle((int) $day);

                // Get Auspicious List based on Birth Number
                $auspiciousList = $this->planetRelationMap[$birthNumber] ?? [];

                // Life Path (Road) - Full Date
                // Method: Reduce components then sum? Or sum all digits?
                // Standard: Sum Day + Month + Year, then reduce.
                // Or: Reduce Day, Reduce Month, Reduce Year, then sum and reduce.
                // "Calculated from your entire DOB (Day + Month + Year)."
                // Let's do simple sum of all digits in date string for safety.
                $dateString = $day . $month . $year;
                $lifePathSum = 0;
                foreach (str_split($dateString) as $d) {
                    $lifePathSum += (int) $d;
                }
                $lifePathNumber = $this->reduceToSingle($lifePathSum);
            }
        }

        return [
            'name' => $name,
            'dob' => $dob,
            'breakdown' => $breakdown,
            'destiny' => [ // Conductor (Full DOB) - User Request
                'number' => $lifePathNumber,
                'planet' => $this->planetMap[$lifePathNumber] ?? 'Unknown',
                'description' => 'Destiny Number (The Conductor)'
            ],
            'birth' => [ // Driver (Day of Birth)
                'number' => $birthNumber,
                'planet' => $this->planetMap[$birthNumber] ?? 'Unknown',
                'description' => 'Birth Number (The Driver)'
            ],
            'name_number' => [ // Full Name
                'number' => $chaldeanSingle,
                'planet' => $this->planetMap[$chaldeanSingle] ?? 'Unknown',
                'description' => 'Name Number'
            ],
            'life_path' => [ // Legacy/Alternate (Full DOB) - Same as Destiny now per user
                'number' => $lifePathNumber,
                'planet' => $this->planetMap[$lifePathNumber] ?? 'Unknown',
                'description' => 'Life Path Number'
            ],
            'soul_urge' => [ // Heart (Vowels)
                'number' => $soulUrgeTotal, // Compound
                'single' => $soulUrgeSingle, // Single Digit for Planet
                'planet' => $this->planetMap[$soulUrgeSingle] ?? 'Unknown',
                'description' => 'Soul Urge Number (The Heart)'
            ],
            'personality' => [ // Mask (Consonants)
                'number' => $personalityTotal, // Compound
                'single' => $personalitySingle, // Single Digit for Planet
                'planet' => $this->planetMap[$personalitySingle] ?? 'Unknown',
                'description' => 'Personality Number (The Mask)'
            ],
            'auspicious' => $auspiciousList, // New Field
            // Legacy/Extra fields for reference
            'chaldean' => [
                'total' => $chaldeanTotal,
                'single' => $chaldeanSingle,
                'planet' => $this->planetMap[$chaldeanSingle] ?? 'Unknown'
            ],
            'pythagorean' => [
                'total' => $pythagoreanTotal,
                'single' => $pythagoreanSingle,
                'planet' => $this->planetMap[$pythagoreanSingle] ?? 'Unknown'
            ],
            'numerology' => [
                'total' => $numerologyTotal,
                'single' => $numerologySingle,
                'planet' => $this->planetMap[$numerologySingle] ?? 'Unknown'
            ]
        ];
    }

    private function reduceToSingle($number)
    {
        while ($number > 9) {
            $sum = 0;
            foreach (str_split((string) $number) as $digit) {
                $sum += (int) $digit;
            }
            $number = $sum;
        }
        return $number;
    }
}
