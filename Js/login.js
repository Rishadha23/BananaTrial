document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.querySelector("input[name='email']").value.trim();
        const password = document.querySelector("input[name='pwd']").value.trim();

        if (!validateEmail(email)) {
            showAlert("Please enter a valid email address.", "error");
            return;
        }

        if (password === "") {
            showAlert("Password cannot be empty.", "error");
            return;
        }

        fetch("../Services/login.php", {
            method: "POST",
            body: new FormData(loginForm)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // ✅ Set cookies WITHOUT 'secure' for localhost
                document.cookie = `token=${data.token}; path=/; SameSite=Strict`;
                document.cookie = `username=${data.username}; path=/; SameSite=Strict`;
                document.cookie = `score=${data.score}; path=/; SameSite=Strict`;

                showAlert("Login successful!", "success", () => {
                    // Add a tiny delay to ensure cookies are saved
                    setTimeout(() => {
                        window.location.href = "../assests/MainMenu.html";
                    }, 300);
                });
            } else {
                showAlert(data.message || "Login failed.", "error");
            }
        });
    });

    function validateEmail(email) {
        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        return pattern.test(email.toLowerCase());
    }

    function showAlert(message, type = "info", callback = null) {
        Swal.fire({
            title: message,
            icon: type,
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            if (callback) callback();
        });
    }
});
