<?php


// Get the username and score from the POST request
$username = $_POST['username'] ?? '';
$score = $_POST['score'] ?? 0;

// Check if username and score are provided
if (empty($username) || !is_numeric($score)) {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
    exit();
}

// Connect to the database
require "config.php";

// Update the score in the database
$sql = "UPDATE user SET score = ? WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $score, $username);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Score updated successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error updating score"]);
}

$stmt->close();
?>
