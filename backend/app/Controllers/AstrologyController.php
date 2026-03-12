<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

use App\Models\AstrologySystemModel;
use App\Models\CompoundNumberModel;
use CodeIgniter\API\ResponseTrait;

class AstrologyController extends BaseController
{
    use ResponseTrait;

    public function calculate()
    {
        $name = $this->request->getVar('name');
        if (empty($name)) {
            return $this->fail('Name is required');
        }

        $name = preg_replace('/[^A-Z]/', '', strtoupper($name));
        $letters = str_split($name);

        $systemModel = new AstrologySystemModel();
        $mappings = $systemModel->findAll();
        $map = [];
        foreach ($mappings as $row) {
            $map[$row['letter']] = $row;
        }

        $pythagorean_compound = 0;
        $chaldean_compound = 0;
        $numerology_compound = 0;

        foreach ($letters as $char) {
            if (isset($map[$char])) {
                $pythagorean_compound += $map[$char]['pythagorean_number'];
                $chaldean_compound += ($map[$char]['chaldean_number'] ?? 0);
                $numerology_compound += ($map[$char]['numerology_number'] ?? 0);
            }
        }

        $compoundModel = new CompoundNumberModel();

        $pythagorean_meaning = $compoundModel->where('number', $pythagorean_compound)->first();
        $chaldean_meaning = $compoundModel->where('number', $chaldean_compound)->first();
        $numerology_meaning = $compoundModel->where('number', $numerology_compound)->first();

        return $this->respond([
            'input' => $name,
            'pythagorean' => [
                'compound' => $pythagorean_compound,
                'root' => $this->reduceToRoot($pythagorean_compound),
                'meaning' => $pythagorean_meaning ? $pythagorean_meaning['meaning'] : null
            ],
            'chaldean' => [
                'compound' => $chaldean_compound,
                'root' => $this->reduceToRoot($chaldean_compound),
                'meaning' => $chaldean_meaning ? $chaldean_meaning['meaning'] : null
            ],
            'numerology' => [
                'compound' => $numerology_compound,
                'root' => $this->reduceToRoot($numerology_compound),
                'meaning' => $numerology_meaning ? $numerology_meaning['meaning'] : null
            ]
        ]);
    }

    public function meanings($number)
    {
        $compoundModel = new CompoundNumberModel();
        $meaning = $compoundModel->where('number', $number)->first();

        if (!$meaning) {
            return $this->failNotFound('Meaning not found for number ' . $number);
        }

        return $this->respond($meaning);
    }

    private function reduceToRoot($number)
    {
        if ($number == 11 || $number == 22 || $number == 33) {
            return $number;
        }

        while ($number > 9) {
            $sum = 0;
            $digits = str_split((string) $number);
            foreach ($digits as $digit) {
                $sum += (int) $digit;
            }
            $number = $sum;

            if ($number == 11 || $number == 22 || $number == 33) {
                return $number;
            }
        }

        return $number;
    }
}
