<?php
$hostname = 'localhost'; // or just 'localhost' if you're not using a custom port
$username = 'root'; // Your MySQL username
$password = ''; // Your MySQL password (often empty on local setups like WAMP)
$database = 'Quizera'; // Your database name

// Create connection
$conn = new mysqli($hostname, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
