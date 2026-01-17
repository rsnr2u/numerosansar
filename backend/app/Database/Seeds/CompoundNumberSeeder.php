<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class CompoundNumberSeeder extends Seeder
{
    public function run()
    {
        $data = [
            // Single Digits (1-9) - Usually treated as Root, but added for completeness
            ['number' => 1, 'title' => 'The Sun', 'description' => 'Represents leadership, ambition, and independence.', 'result' => 'Good'],
            ['number' => 2, 'title' => 'The Moon', 'description' => 'Represents imagination, parenthood, and sensitivity.', 'result' => 'Good'],
            ['number' => 3, 'title' => 'Jupiter', 'description' => 'Represents spirituality, advisor roles, and expansion.', 'result' => 'Excellent'],
            ['number' => 4, 'title' => 'Uranus', 'description' => 'Represents unconventionality, sudden changes, and technology.', 'result' => 'Not Good'],
            ['number' => 5, 'title' => 'Mercury', 'description' => 'Represents communication, speed, and versatility.', 'result' => 'Excellent'],
            ['number' => 6, 'title' => 'Venus', 'description' => 'Represents love, luxury, and art.', 'result' => 'Excellent'],
            ['number' => 7, 'title' => 'Neptune', 'description' => 'Represents intuition, deep thought, and mysticism.', 'result' => 'Good'],
            ['number' => 8, 'title' => 'Saturn', 'description' => 'Represents karma, discipline, and hard work/struggles.', 'result' => 'Not Good'],
            ['number' => 9, 'title' => 'Mars', 'description' => 'Represents action, aggression, and energy.', 'result' => 'Good'],

            // Compound Numbers 10-52 (Classic Chaldean)
            ['number' => 10, 'title' => 'The Wheel of Fortune', 'description' => 'Symbolizes success, honor, and self-confidence. A very fortunate number.', 'result' => 'Excellent'],
            ['number' => 11, 'title' => 'The Clenched Fist', 'description' => 'Warning of hidden dangers, trial, and treachery from others. Master Number.', 'result' => 'Not Good'],
            ['number' => 12, 'title' => 'The Sacrifice', 'description' => 'Suffering and anxiety of mind. Indicates one who is sacrificed for the plans of others.', 'result' => 'Not Good'],
            ['number' => 13, 'title' => 'Regeneration', 'description' => 'Power which involves change or destruction. Not unfortunate if used correctly, but difficult.', 'result' => 'Not Good'],
            ['number' => 14, 'title' => 'Movement and Challenge', 'description' => 'Magnetic communication with public but risk from natural forces or temporary risks.', 'result' => 'Good'],
            ['number' => 15, 'title' => 'The Magician', 'description' => 'Highly fortunate for obtaining money, gifts, and favors from others. Eloquence and art.', 'result' => 'Super'],
            ['number' => 16, 'title' => 'The Shattered Citadel', 'description' => 'Warning of strange fatalities, accidents, and defeat of one\'s plans.', 'result' => 'Not Good'],
            ['number' => 17, 'title' => 'Star of the Magi', 'description' => 'The Number of Immortality. Highly spiritual and fortunate.', 'result' => 'Super'],
            ['number' => 18, 'title' => 'Material Conflict', 'description' => 'Bitter quarrels, family feuds, and war. Social upheaval.', 'result' => 'Bad'],
            ['number' => 19, 'title' => 'The Prince of Heaven', 'description' => 'One of the most fortunate numbers. Success, esteem, and happiness.', 'result' => 'Excellent'],
            ['number' => 20, 'title' => 'The Awakening', 'description' => 'Judgment and new purpose. Calls for action but not material success guarantee.', 'result' => 'Good'],
            ['number' => 21, 'title' => 'The Crown of the Magi', 'description' => 'Victory after long initiation. Success and advancement.', 'result' => 'Excellent'],
            ['number' => 22, 'title' => 'The Good Man who is Fooled', 'description' => 'A good person living in a dream world; awakens only when surrounded by danger. False judgment.', 'result' => 'Not Good'],
            ['number' => 23, 'title' => 'The Royal Star of the Lion', 'description' => 'Promise of success, help from superiors, and protection.', 'result' => 'Super'],
            ['number' => 24, 'title' => 'Love - Money - Creativity', 'description' => 'Gains through love and outer sex. Fortunate for finances and arts.', 'result' => 'Excellent'],
            ['number' => 25, 'title' => 'Discrimination and Analysis', 'description' => 'Strength through experience. Success comes later in life through observation.', 'result' => 'Good'],
            ['number' => 26, 'title' => 'Partnerships', 'description' => 'Disaster brought about by association with others; bad speculations.', 'result' => 'Not Good'],
            ['number' => 27, 'title' => 'The Sceptre', 'description' => 'Promise of authority, power, and command. Productive intellect.', 'result' => 'Excellent'],
            ['number' => 28, 'title' => 'The Trusting Lamb', 'description' => 'In opposition to the law; great possibilities but likely to lose out through misplaced trust.', 'result' => 'Not Good'],
            ['number' => 29, 'title' => 'Uncertainty', 'description' => 'Deception and treachery from others; unreliable friends.', 'result' => 'Not Good'],
            ['number' => 30, 'title' => 'The Loner', 'description' => 'Thoughtful deduction, retrospection, and mental superiority, but often lonely.', 'result' => 'Good'],
            ['number' => 31, 'title' => 'The Recluse', 'description' => 'Similar to 30, but more self-contained. Generous but isolated.', 'result' => 'Good'],
            ['number' => 32, 'title' => 'Communication', 'description' => 'Magical power like 14 and 23. Success with masses if one listens to own judgment.', 'result' => 'Excellent'],
            ['number' => 33, 'title' => 'The Master Teacher', 'description' => 'No specific Chaldean meaning different from 6, but Pythagorean Master Number. Compassion.', 'result' => 'Excellent'],
            ['number' => 34, 'title' => 'Strength', 'description' => 'Has the strength of 7. Growth through mystical understanding.', 'result' => 'Good'],
            ['number' => 35, 'title' => 'Structure', 'description' => 'Similar warnings to 26; financial caution needed.', 'result' => 'Not Good'],
            ['number' => 36, 'title' => 'The Sceptre (Varied)', 'description' => 'See 27. Authority and promise, but great effort required.', 'result' => 'Good'],
            ['number' => 37, 'title' => 'Royal Friendship', 'description' => 'Good fortune in love and partnership. See 10.', 'result' => 'Excellent'],
            ['number' => 38, 'title' => 'Deception', 'description' => 'See 11 and 29. Dangers through others.', 'result' => 'Not Good'],
            ['number' => 39, 'title' => 'The Orator', 'description' => 'Excellent for public speaking and fame.', 'result' => 'Excellent'],
            ['number' => 40, 'title' => 'Order', 'description' => 'Check 4. Generally lonely/isolated success.', 'result' => 'Not Good'],
            ['number' => 41, 'title' => 'The Magician (Higher)', 'description' => 'Same as 14 and 32/23. Fortunate for leadership.', 'result' => 'Excellent'],
            ['number' => 42, 'title' => 'Venusian Love', 'description' => 'Affection and devotion, but possible suffering through it.', 'result' => 'Good'],
            ['number' => 43, 'title' => 'The Badge of Trauma', 'description' => 'Unfortunate like 16. Accidents or upheaval.', 'result' => 'Bad'],
            ['number' => 44, 'title' => 'Double Saturn', 'description' => 'Extreme discipline or extreme hardship.', 'result' => 'Not Good'],
            ['number' => 45, 'title' => 'Mars and Mercury', 'description' => 'Action and speed. Good execution.', 'result' => 'Good'],
            ['number' => 46, 'title' => 'Crown of Magi (Higher)', 'description' => 'Same as 10, 19, 37. Fortunate.', 'result' => 'Excellent'],
            ['number' => 47, 'title' => 'The Sceptre (Higher)', 'description' => 'See 11/29? Actually usually 47 reduces to 2 (Moon). Deception warning.', 'result' => 'Not Good'],
            ['number' => 48, 'title' => 'Sacrifice (Higher)', 'description' => 'See 12/30. Emotional burden.', 'result' => 'Not Good'],
            ['number' => 49, 'title' => 'The Universe', 'description' => 'Completeness but unstable like 4. Reality check.', 'result' => 'Not Good'],
            ['number' => 50, 'title' => 'Freedom', 'description' => 'Mercury vibration. Communication and intellect.', 'result' => 'Excellent'],
            ['number' => 51, 'title' => 'Warrior', 'description' => 'High potency of ownership and power. 6 vibration.', 'result' => 'Super'],
            ['number' => 52, 'title' => 'Analysis', 'description' => 'See 7/43. Introspection.', 'result' => 'Good'],
        ];

        // Generate 53-100 based on standard reductions or generic messages
        for ($i = 53; $i <= 100; $i++) {
            $sum = 0;
            $temp = $i;
            while ($temp > 0) {
                $sum += $temp % 10;
                $temp = (int) ($temp / 10);
            }
            while ($sum > 9) {
                $s2 = 0;
                foreach (str_split((string) $sum) as $c)
                    $s2 += (int) $c;
                $sum = $s2;
            }

            // Basic interpretation based on root
            $rootMeanings = [
                1 => ['title' => 'Solar Vibration', 'res' => 'Good'],
                2 => ['title' => 'Lunar Vibration', 'res' => 'Good'],
                3 => ['title' => 'Jupiter Expansion', 'res' => 'Excellent'],
                4 => ['title' => 'Uranus Suddenness', 'res' => 'Not Good'],
                5 => ['title' => 'Mercurial Speed', 'res' => 'Excellent'],
                6 => ['title' => 'Venusian Harmony', 'res' => 'Excellent'],
                7 => ['title' => 'Neptunian Depth', 'res' => 'Good'],
                8 => ['title' => 'Saturnian Fate', 'res' => 'Not Good'],
                9 => ['title' => 'Martian Force', 'res' => 'Good']
            ];

            $data[] = [
                'number' => $i,
                'title' => "Vibration of $i (" . $rootMeanings[$sum]['title'] . ")",
                'description' => "A higher octave of the number $sum. " . $rootMeanings[$sum]['title'],
                'result' => $rootMeanings[$sum]['res']
            ];
        }

        // Using Query Builder for batch insert
        $this->db->table('compound_numbers')->emptyTable();
        $this->db->table('compound_numbers')->insertBatch($data);
    }
}
