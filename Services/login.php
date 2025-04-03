<?php
session_start();
header("Content-Type: application/json");
require "config.php"; 

// Get input values
$email = $_POST["email"] ?? "";
$password = $_POST["pwd"] ?? "";

// Prepare and execute the SQL query
$sql = "SELECT username, password, score FROM user WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($db_username, $db_password_hash, $db_score);

// Check if the user exists
if ($stmt->num_rows > 0) {
    // Fetch the user data
    $stmt->fetch();

    // Verify the password hash
    if (password_verify($password, $db_password_hash)) {
        // Password is correct, set session data
        $_SESSION["username"] = $db_username;
        $_SESSION["score"] = $db_score;

        // Send response with username and score
        echo json_encode([
            "success" => true,
            "username" => $db_username,  // Send username directly to the client
            "score" => $db_score         // Send score directly to the client
        ]);

        // Also set cookies with the session data 
        setcookie("username", $db_username, 0,"/");  // expires as user closes browser
        setcookie("score", $db_score, 0,"/"); 
        /*setcookie("score", $db_score, time() + 3600, "/");         // expires in 1 hour */
    } else {
        // Password is incorrect
        echo json_encode(["success" => false, "message" => "Incorrect password"]);
    }
} else {
    // User does not exist
    echo json_encode(["success" => false, "message" => "User not found"]);
}

// Close the statement and connection
$stmt->close();
?>
