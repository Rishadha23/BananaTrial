<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "quiz_game";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $score = $_POST['score'];

    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $sql = "UPDATE users SET score = ? WHERE username = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("is", $score, $username);
    } else {
        $sql = "INSERT INTO users (username, score) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $username, $score);
    }

    if ($stmt->execute()) {
        echo "Score updated successfully";
    } else {
        echo "Error updating score: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}
?>
