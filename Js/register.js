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
            Swal.fire({
                title: "Invalid email format!",
                icon: "error",
                showConfirmButton: true
            });
            return;
        }

        // Validate username (at least 3 characters)
        if (username.value.length < 3) {
            Swal.fire({
                title: "Username must be at least 3 characters long!",
                icon: "error",
                showConfirmButton: true
            });
            return;
        }

        // Validate password (at least 6 characters)
        if (password.value.length < 6) {
            Swal.fire({
                title: "Password must be at least 6 characters long!",
                icon: "error",
                showConfirmButton: true
            });
            return;
        }

        // Confirm passwords match
        if (password.value !== cpassword.value) {
            Swal.fire({
                title: "Passwords do not match!",
                icon: "error",
                showConfirmButton: true
            });
            return;
        }

        // If only  all checks pass, send data to register.php
        const formData = new FormData(form);

        fetch("../Services/register.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: "Registration successful!",
                    icon: "success",
                    showConfirmButton: true
                }).then(() => {
                    window.location.href = "login.html"; 
                });
            } else {
                Swal.fire({
                    title: "Error: " + data.message,
                    icon: "error",
                    showConfirmButton: true
                });
            }
        })
        .catch(error => console.error("Error:", error));
    });
});
