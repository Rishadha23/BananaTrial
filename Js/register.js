document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const email = document.querySelector(".email");
    const username = document.querySelector(".username");
    const password = document.querySelector(".password");
    const cpassword = document.querySelector(".cpassword");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            alert("Invalid email format!");
            return;
        }

        // Validate username (at least 3 characters)
        if (username.value.length < 3) {
            alert("Username must be at least 3 characters long!");
            return;
        }

        // Validate password (at least 6 characters)
        if (password.value.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }

        // Confirm passwords match
        if (password.value !== cpassword.value) {
            alert("Passwords do not match!");
            return;
        }

        // If all checks pass, send data to register.php
        const formData = new FormData(form);

        fetch("../Services/register.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Registration successful!");
                window.location.href = "login.html"; // Redirect to login page
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
