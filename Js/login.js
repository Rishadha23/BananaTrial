document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get input values
        const emailInput = document.querySelector("input[name='email']");
        const passwordInput = document.querySelector("input[name='pwd']");

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate email format
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        // Validate password (ensure it's not empty)
        if (password.length === 0) {
            alert("Password cannot be empty.");
            passwordInput.focus();
            return;
        }

        // Proceed with AJAX login request if validation passes
        const formData = new FormData(loginForm);

        fetch("../Services/login.php", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server returned an error');
            }
        
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();  // Parse JSON directly if it's a valid JSON response
            } else {
                return response.text();  // Return as text if not JSON
            }
        })
        .then(text => {
            // Check if we have text but no JSON (in case of HTML or plain text)
            if (typeof text === "string") {
                console.log("Raw Response from Server:", text);
                alert("Server returned unexpected response: " + text);
                return;
            }
        
            // Now proceed to handle the valid JSON response
            if (text.success) {
                alert("Login successful!");
                window.location.href = "../assests/GamePage.html";
            } else {
                alert(text.message || "Login failed! Please check your credentials.");
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            alert("There was an issue with the request. Please try again.");
        });
        
        

    }); // <-- Closing bracket for the 'submit' event listener

    // ** Additional Event Listeners **

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

    // ** Helper Function: Email Validation **
    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }
}); // <-- Closing bracket for the 'DOMContentLoaded' event listener
