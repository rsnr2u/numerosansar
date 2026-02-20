<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class LoShuSeeder extends Seeder
{
    public function run()
    {
        // Meanings
        $meanings = [
            ['number' => 1, 'quality' => 'Logic: clarity and planning ability.', 'remedy' => 'Write daily priorities; practice single-task focus.'],
            ['number' => 2, 'quality' => 'Relations: empathy, partnership, support.', 'remedy' => 'Nurture 1–2 key relationships each week.'],
            ['number' => 3, 'quality' => 'Creativity: expression, art, communication.', 'remedy' => 'Create content: short posts, reels, or journaling.'],
            ['number' => 4, 'quality' => 'Practicality: structure, diligence, method.', 'remedy' => 'Fixed routines; weekly operations checklist.'],
            ['number' => 5, 'quality' => 'Center: balance, adaptability, decision power.', 'remedy' => 'Breathwork / travel breaks to build flexibility.'],
            ['number' => 6, 'quality' => 'Responsibility: care, duty, family, service.', 'remedy' => 'Acts of service; structure family time.'],
            ['number' => 7, 'quality' => 'Spirituality: intuition, study, inner wisdom.', 'remedy' => 'Study/meditation; mentor guidance.'],
            ['number' => 8, 'quality' => 'Discipline: organization, authority, wealth building.', 'remedy' => 'Budgeting; negotiate pricing; wealth discipline.'],
            ['number' => 9, 'quality' => 'Idealism: vision, reputation, recognition.', 'remedy' => 'Reputation work: testimonials, PR, charity.'],
        ];

        foreach ($meanings as $m) {
            $this->db->table('lo_shu_meanings')->insert($m);
        }

        // Kua Details
        $kua = [
            ['kua_number' => 1, 'sheng_qi' => 'SE', 'tian_yi' => 'E', 'yan_nian' => 'S', 'fu_wei' => 'N', 'bad_directions' => 'SW, W, NW, NE'],
            ['kua_number' => 2, 'sheng_qi' => 'NE', 'tian_yi' => 'W', 'yan_nian' => 'NW', 'fu_wei' => 'SW', 'bad_directions' => 'N, S, E, SE'],
            ['kua_number' => 3, 'sheng_qi' => 'S', 'tian_yi' => 'N', 'yan_nian' => 'SE', 'fu_wei' => 'E', 'bad_directions' => 'NW, NE, SW, W'],
            ['kua_number' => 4, 'sheng_qi' => 'N', 'tian_yi' => 'S', 'yan_nian' => 'E', 'fu_wei' => 'SE', 'bad_directions' => 'SW, W, NW, NE'],
            ['kua_number' => 6, 'sheng_qi' => 'W', 'tian_yi' => 'NE', 'yan_nian' => 'SW', 'fu_wei' => 'NW', 'bad_directions' => 'E, SE, N, S'],
            ['kua_number' => 7, 'sheng_qi' => 'NW', 'tian_yi' => 'SW', 'yan_nian' => 'NE', 'fu_wei' => 'W', 'bad_directions' => 'E, SE, N, S'],
            ['kua_number' => 8, 'sheng_qi' => 'SW', 'tian_yi' => 'NW', 'yan_nian' => 'W', 'fu_wei' => 'NE', 'bad_directions' => 'E, SE, N, S'],
            ['kua_number' => 9, 'sheng_qi' => 'E', 'tian_yi' => 'SE', 'yan_nian' => 'N', 'fu_wei' => 'S', 'bad_directions' => 'W, NE, NW, SW'],
        ];

        foreach ($kua as $k) {
            $this->db->table('kua_details')->insert($k);
        }
    }
}
