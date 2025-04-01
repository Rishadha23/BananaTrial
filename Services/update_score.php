<?php
session_start();
require "config.php";

// Enable error reporting for debugging
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'] ?? '';
    $score = $_POST['score'] ?? 0;

    // Validate input
    if ($username === '' || !is_numeric($score)) {
        echo json_encode(["status" => "error", "message" => "Invalid input"]);
        exit();
    }

    // Check if the user exists
    $sql = "SELECT * FROM user WHERE username = ?";
    $stmt2 = $conn->prepare($sql);
    $stmt2->bind_param("s", $username);
    $stmt2->execute();
    $result = $stmt2->get_result();

    if ($result->num_rows > 0) {
        // User exists, update score
        $sql = "UPDATE user SET score = ? WHERE username = ?";
        $stmt2 = $conn->prepare($sql);
        $stmt2->bind_param("is", $score, $username);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Score updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error updating score"]);
        }
    } else {
        // If user doesn't exist, send error message
        echo json_encode(["status" => "error", "message" => "User does not exist"]);
    }

    $stmt2->close();

} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>
