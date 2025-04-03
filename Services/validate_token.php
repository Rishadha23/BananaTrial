<?php
require "../libs/JWT.php";
require "../libs/Key.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json");

// Your secret key (should be kept private)
$secret_key = "your_secret_key";

// Fetch the token from the Authorization header or cookies
$headers = getallheaders();
$jwt = null;

// Check if the Authorization header is present
if (isset($headers["Authorization"])) {
    $jwt = str_replace("Bearer ", "", $headers["Authorization"]);
}
// Alternatively, check if the JWT is in cookies
elseif (isset($_COOKIE["token"])) {
    $jwt = $_COOKIE["token"];
}

if (!$jwt) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

try {
    // Decode the JWT token
    $decoded = JWT::decode($jwt, new Key($secret_key, "HS256"));

    // Return the decoded data (username and score)
    echo json_encode([
        "success" => true,
        "username" => $decoded->username,
        "score" => $decoded->score
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Invalid token"]);
}
?>
