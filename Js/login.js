document.addEventListener("DOMContentLoaded", function () {
    
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

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
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert("Login successful!", "success", () => {
                    window.location.href = "../assests/MainMenu.html";
                });
            } else {
                showAlert(data.message || "Login failed! Please check your credentials.", "error");
            }
        })
        .catch(() => {
            showAlert("There was an issue with the request. Please try again.", "error");
        });
    });

    /**********  Additional Event Listeners *************/

    // Enter Key Press - Submits form when pressing 'Enter'
    document.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            loginForm.dispatchEvent(new Event("submit"));
        }
    });

    // Mouse Hover Effect - Changes button color
    const loginButton = document.querySelector(".color-button");
    if (loginButton) {
        loginButton.addEventListener("mouseover", function () {
            this.style.backgroundColor = "#ff6600"; // Highlight button
        });

        loginButton.addEventListener("mouseout", function () {
            this.style.backgroundColor = ""; // Revert to default
        });
    }

    // Input Focus - Highlights input fields when focused
    document.querySelectorAll(".input-box input").forEach(input => {
        input.addEventListener("focus", function () {
            this.style.border = "2px solid green";
        });

        input.addEventListener("blur", function () {
            this.style.border = ""; // Reset border when unfocused
        });
    });

     /* Helper Function: Email Validation */
    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    /* SweetAlert2 Function for Pop-up Messages */
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
