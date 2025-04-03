<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Database connection
$host = "localhost";
$user = "root";
$password = "";
$database = "quizera";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

// Query to fetch top 4 players
$sql = "SELECT username, score FROM user ORDER BY score DESC LIMIT 4";
$result = $conn->query($sql);

$players = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $players[] = $row;
    }
}

// Return JSON response
echo json_encode($players);

$conn->close();
?>
