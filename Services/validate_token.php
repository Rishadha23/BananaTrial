<?php
require "config.php";
require "../libs/JWT.php";
require "../libs/Key.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json");

// ✅ Get token from the Authorization header
$headers = apache_request_headers();
$authHeader = $headers["Authorization"] ?? '';

if (!$authHeader || !str_starts_with($authHeader, "Bearer ")) {
    echo json_encode(["success" => false, "message" => "Token not provided."]);
    exit;
}

$token = str_replace("Bearer ", "", $authHeader);
$secret_key = "your_secret_key"; // ✅ MUST match exactly with login.php

try {
    $decoded = JWT::decode($token, new Key($secret_key, "HS256"));

    // Token is valid
    echo json_encode([
        "success" => true,
        "username" => $decoded->username,
        "score" => $decoded->score
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Invalid token", "error" => $e->getMessage()]);
}
?>
