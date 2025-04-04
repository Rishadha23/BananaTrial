<?php

// Get the username and score from the POST request
$username = $_POST['username'] ?? '';
$score = $_POST['score'] ?? 0;

// Check if username and score are provided
if (empty($username) || !is_numeric($score)) {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
    exit();
}


// Database connection
$host = "localhost";
$user = "root";
$password = "";
$database = "quizera";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}


// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Debugging: Log username and score to the PHP error log
error_log("Username: $username, Score: $score");  // Logs to server's error log, not included in the response

// Update the score in the database
$sql = "UPDATE user SET Score = ? WHERE Username = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(["status" => "error", "message" => "Failed to prepare the SQL statement: " . $conn->error]);
    exit();
}

$stmt->bind_param("is", $score, $username);

// Execute the statement and check for errors
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Score updated successfully"]);
} else {
    // Include the error message from the statement
    echo json_encode(["status" => "error", "message" => "Error updating score: " . $stmt->error]);
}

$stmt->close();


?>
