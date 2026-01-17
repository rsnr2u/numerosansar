<?php
// Script to login as admin and verify calculation logic via API

// 1. Login
$ch = curl_init('http://localhost:8080/api/admin/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'admin@admin.com',
    'password' => 'admin123'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$loginData = json_decode($response, true);
curl_close($ch);

if (!isset($loginData['token'])) {
    echo "Login Failed: $response\n";
    exit;
}

$token = $loginData['token'];
echo "Logged in. Token acquired.\n";

// 2. Test Calculation
$testName = "Rahul";
$testDob = "1990-01-01"; // Sum = 1+9+9+0+0+1+0+1 = 21 -> 3.

echo "Testing Name: $testName, DOB: $testDob (Expect Destiny=3)\n";

$ch = curl_init('http://localhost:8080/api/admin/calculate');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['name' => $testName, 'dob' => $testDob]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $token]);
$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);

if (isset($data['destiny'])) {
    echo "Destiny Number: " . $data['destiny']['number'] . "\n";
    echo "Destiny Description: " . $data['destiny']['description'] . "\n";
    echo "Name Number: " . $data['name_number']['number'] . "\n";

    if ($data['destiny']['number'] == 3) {
        echo "VERIFICATION PASSED: Destiny matches DOB sum.\n";
    } else {
        echo "VERIFICATION FAILED: Destiny does not match DOB sum.\n";
    }
} else {
    echo "Failed to get calculation result: $response\n";
}
