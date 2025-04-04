<?php
require_once "../libs/JWT.php"; // Include the JWT class
require_once "../libs/Key.php";  // Include the Key class

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Your secret key to decode the token
$secret_key = "your_secret_key";

// Get the token from the request header
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

if ($authHeader) {
    // Remove "Bearer " prefix from the token
    $token = str_replace('Bearer ', '', $authHeader);
    error_log("Token received: " . $token);  // Debugging log for token

    try {
        // Decode the JWT token
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        
        // Extract username and score from the decoded JWT
        $username = $decoded->username;
        $score = $_POST['score'] ?? 0;

        error_log("Username: " . $username);  // Debugging log for username
        error_log("Score: " . $score);  // Debugging log for score

        // Check if score is numeric and update it
        if (!is_numeric($score)) {
            echo json_encode(["status" => "error", "message" => "Invalid score"]);
            exit();
        }

        // Update the score in the database
        require "config.php";
        $sql = "UPDATE user SET score = ? WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $score, $username);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Score updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error updating score"]);
        }

        $stmt->close();
    } catch (Exception $e) {
        error_log("Error decoding token: " . $e->getMessage());  // Debugging log for errors
        echo json_encode(["status" => "error", "message" => "Invalid token or token expired"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Token not provided"]);
}
?>
