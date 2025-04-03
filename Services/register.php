<?php
header("Content-Type: application/json");
require "config.php"; 

$response = ["success" => false, "message" => ""];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"]);
    $username = trim($_POST["username"]);
    $password = $_POST["password"];
    $cpassword = $_POST["cpassword"];

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response["message"] = "Invalid email format!";
        echo json_encode($response);
        exit;
    }

    // Validate username (at least 3 characters)
    if (strlen($username) < 3) {
        $response["message"] = "Username must be at least 3 characters!";
        echo json_encode($response);
        exit;
    }

    // Validate password length
    if (strlen($password) < 6) {
        $response["message"] = "Password must be at least 6 characters!";
        echo json_encode($response);
        exit;
    }

    // Confirm passwords match
    if ($password !== $cpassword) {
        $response["message"] = "Passwords do not match!";
        echo json_encode($response);
        exit;
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT Uid FROM user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        $response["message"] = "Email is already registered!";
        echo json_encode($response);
        exit;
    }
    $stmt->close();

    // Check if username already exists
    $stmt = $conn->prepare("SELECT Uid FROM user WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $response["message"] = "Username is already taken!";
        echo json_encode($response);
        exit;
    }
    $stmt->close();

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO user (email, username, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $email, $username, $hashedPassword);

    if ($stmt->execute()) {
        $response["success"] = true;
        $response["message"] = "User registered successfully!";
    } else {
        $response["message"] = "Error registering user!";
    }

    $stmt->close();
}

echo json_encode($response);
?>
