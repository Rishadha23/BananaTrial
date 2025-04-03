<?php
require "config.php";
require "../libs/JWT.php";  // Include the JWT class
require "../libs/Key.php";  // Include the Key class

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json");

$secret_key = "your_secret_key";
$email = $_POST["email"] ?? "";
$password = $_POST["pwd"] ?? "";

// Check user credentials in the database
$sql = "SELECT username, password, score FROM user WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($db_username, $db_password_hash, $db_score);

if ($stmt->num_rows > 0) {
    $stmt->fetch();

    if (password_verify($password, $db_password_hash)) {
        // Create JWT payload
        $payload = [
            "username" => $db_username,
            "score" => $db_score,
            "exp" => time() + 3600  // Token expires in 1 hour
        ];

        // Generate JWT
        $jwt = JWT::encode($payload, $secret_key, "HS256");

        echo json_encode([
            "success" => true,
            "token" => $jwt,
            "username" => $db_username,
            "score" => $db_score
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}

$stmt->close();
?>
