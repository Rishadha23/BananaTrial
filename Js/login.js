document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        const emailInput = document.querySelector("input[name='email']");
        const passwordInput = document.querySelector("input[name='pwd']");
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate email format
        if (!validateEmail(email)) {
            showAlert("Please enter a valid email address.", "error");
            emailInput.focus();
            return;
        }

        // Validate password (ensure it's not empty)
        if (password.length === 0) {
            showAlert("Password cannot be empty.", "error");
            passwordInput.focus();
            return;
        }

        // Proceed with AJAX login request if validation passes
        const formData = new FormData(loginForm);

        fetch("../Services/login.php", {
            method: "POST",
            body: new FormData(document.querySelector("form"))
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store the JWT token
                document.cookie = `token=${data.token}; path=/; secure; samesite=strict`;
                
                // Store username and score in session cookies (if needed for UI updates)
                document.cookie = `username=${data.username}; path=/; secure; samesite=strict`;
                document.cookie = `score=${data.score}; path=/; secure; samesite=strict`;

                showAlert("Login successful!", "success", () => {
                    window.location.href = "../assests/MainMenu.html";  
                });
            } else {
                showAlert(data.message || "Login failed! Please check your credentials.", "error");
            }
        });
    });

    // Helper Function: Email Validation
    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    // SweetAlert2 Function for Pop-up Messages
    function showAlert(message, type = "info", callback = null) {
        Swal.fire({
            title: message,
            icon: type,
            timer: 3000,
            showConfirmButton: false,
            background: type === "success" ? "#d4edda" : type === "error" ? "#f8d7da" : "#cce5ff",
            color: type === "success" ? "#155724" : type === "error" ? "#721c24" : "#004085",
            customClass: {
                popup: "custom-swal"
            }
        }).then(() => {
            if (callback) callback();
        });
    }
});
