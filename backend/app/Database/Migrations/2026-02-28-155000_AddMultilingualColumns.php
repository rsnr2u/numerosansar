<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddMultilingualColumns extends Migration
{
    private $languages = [
        'telugu',
        'hindi',
        'bengali',
        'devanagari',
        'kannada',
        'tamil',
        'malayalam',
        'gujarati'
    ];

    public function up()
    {
        // 1. compound_numbers (description)
        $compoundFields = [];
        foreach ($this->languages as $lang) {
            $compoundFields["description_{$lang}"] = [
                'type' => 'TEXT',
                'null' => true,
            ];
        }
        $this->forge->addColumn('compound_numbers', $compoundFields);

        // 2. lo_shu_meanings (quality, remedy)
        $loShuFields = [];
        foreach ($this->languages as $lang) {
            $loShuFields["quality_{$lang}"] = [
                'type' => 'TEXT',
                'null' => true,
            ];
            $loShuFields["remedy_{$lang}"] = [
                'type' => 'TEXT',
                'null' => true,
            ];
        }
        $this->forge->addColumn('lo_shu_meanings', $loShuFields);

        // 3. numerology_planets (planet_name)
        $planetFields = [];
        foreach ($this->languages as $lang) {
            $planetFields["planet_name_{$lang}"] = [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ];
        }
        $this->forge->addColumn('numerology_planets', $planetFields);

        // 4. business_lucky_numbers (sector_name, primary_planet)
        $businessFields = [];
        foreach ($this->languages as $lang) {
            // sector_name_telugu already exists from a previous migration, so we skip it to prevent errors
            if ($lang !== 'telugu') {
                $businessFields["sector_name_{$lang}"] = [
                    'type' => 'VARCHAR',
                    'constraint' => '255',
                    'null' => true,
                ];
            }
            $businessFields["primary_planet_{$lang}"] = [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true,
            ];
        }
        $this->forge->addColumn('business_lucky_numbers', $businessFields);

        // 5. clients (loshu_ai_report, yearly_ai_report, yoga_ai_report)
        $clientFields = [];
        foreach ($this->languages as $lang) {
            $clientFields["loshu_ai_report_{$lang}"] = [
                'type' => 'LONGTEXT',
                'null' => true,
            ];
            $clientFields["yearly_ai_report_{$lang}"] = [
                'type' => 'LONGTEXT',
                'null' => true,
            ];
            $clientFields["yoga_ai_report_{$lang}"] = [
                'type' => 'LONGTEXT',
                'null' => true,
            ];
        }
        $this->forge->addColumn('clients', $clientFields);
    }

    public function down()
    {
        // 1. compound_numbers
        $compoundCols = array_map(function ($lang) {
            return "description_{$lang}"; }, $this->languages);
        $this->forge->dropColumn('compound_numbers', $compoundCols);

        // 2. lo_shu_meanings
        $loShuCols = [];
        foreach ($this->languages as $lang) {
            $loShuCols[] = "quality_{$lang}";
            $loShuCols[] = "remedy_{$lang}";
        }
        $this->forge->dropColumn('lo_shu_meanings', $loShuCols);

        // 3. numerology_planets
        $planetCols = array_map(function ($lang) {
            return "planet_name_{$lang}"; }, $this->languages);
        $this->forge->dropColumn('numerology_planets', $planetCols);

        // 4. business_lucky_numbers
        $businessCols = [];
        foreach ($this->languages as $lang) {
            if ($lang !== 'telugu') {
                $businessCols[] = "sector_name_{$lang}";
            }
            $businessCols[] = "primary_planet_{$lang}";
        }
        $this->forge->dropColumn('business_lucky_numbers', $businessCols);

        // 5. clients
        $clientCols = [];
        foreach ($this->languages as $lang) {
            $clientCols[] = "loshu_ai_report_{$lang}";
            $clientCols[] = "yearly_ai_report_{$lang}";
            $clientCols[] = "yoga_ai_report_{$lang}";
        }
        $this->forge->dropColumn('clients', $clientCols);
    }
}
