<?php
/**
 * API Diagnostic Tool v2 for Numero Sansar
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h1>Numero Sansar API Diagnostic v2</h1>";

$current_path = __DIR__;
$is_inside_public = (basename($current_path) === 'public');
$backend_root = $is_inside_public ? dirname($current_path) : $current_path;

echo "<h2>1. Environment</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Current File Location: " . $current_path . "<br>";
echo "Detected Backend Root: " . $backend_root . "<br>";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";

echo "<h2>2. Folder Mapping Logic</h2>";
if ($is_inside_public) {
    echo "⚠️ <b>Warning:</b> Diagnostic file is located INSIDE the 'public' folder.<br>";
    echo "To test root routing, this file should be one level up in the 'backend' folder.<br>";
} else {
    echo "✅ Diagnostic file is in the root backend folder.<br>";
}

echo "<h2>3. Entry Point Check</h2>";
$public_index = $backend_root . '/public/index.php';
if (file_exists($public_index)) {
    echo "✅ Success: Found entry point at <code>backend/public/index.php</code><br>";
} else {
    echo "❌ ERROR: Cannot find <code>backend/public/index.php</code>. Please ensure you uploaded the 'public' folder.<br>";
}

echo "<h2>4. Recommended URL Tests</h2>";
$baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
$requestUri = $_SERVER['REQUEST_URI'];
// Strip diagnostic filename and /public if present to find the backend base
$cleanBase = preg_replace('/(\/public)?\/api_diagnostic\.php.*/', '', $requestUri);

echo "Try visiting these in order:<br>";
echo "1. <b>Clean Route</b> (Needs .htaccess in backend root):<br>";
echo "<a href='{$baseUrl}{$cleanBase}/api/test' target='_blank'>{$baseUrl}{$cleanBase}/api/test</a><br><br>";

echo "2. <b>Direct Route</b> (Always should work):<br>";
echo "<a href='{$baseUrl}{$cleanBase}/public/index.php/api/test' target='_blank'>{$baseUrl}{$cleanBase}/public/index.php/api/test</a><br><br>";

echo "<h2>5. Technical Details</h2>";
echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "<br>";
echo "REDIRECT_URL: " . (isset($_SERVER['REDIRECT_URL']) ? $_SERVER['REDIRECT_URL'] : 'N/A') . "<br>";

echo "<hr><p>Numero Sansar Development Team</p>";
