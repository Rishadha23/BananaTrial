document.addEventListener("DOMContentLoaded", function () {
    
    // Helper function to get cookie values by name taken by internet
    function getCookie(name) {
        let cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            let [key, value] = cookies[i].split("=");
            if (key === name) return decodeURIComponent(value);
        }
        return "";
    }

    // Get the token from cookies
    const token = getCookie("token");
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No token found. Please log in first.',
        }).then(() => {
            window.location.href = "../assests/login.html";  // Redirect to login if no token found
        });
        return; // Stop further execution if no token
    }

    // Validate the JWT token by making a request to the validate_token.php endpoint
    fetch("../Services/validate_token.php", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token  // Pass the token in the Authorization header
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Token is valid, proceed with the menu logic

            var modal = document.getElementById("difficultyModal");
            var closeBtn = document.querySelector(".close");

            // To open modal before starting a new game if difficulty is not set
            document.getElementById("newGame").addEventListener("click", function () {
                if (!sessionStorage.getItem("difficulty")) {
                    modal.style.display = "block";
                } else {
                    window.location.href = "../assests/GamePage.html";
                }
            });

            // Close modal when 'X' is clicked
            closeBtn.addEventListener("click", function () {
                modal.style.display = "none";
            });

            // Close modal when clicking outside the content
            window.addEventListener("click", function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            });

            // Event delegation for difficulty selection
            document.querySelector(".modal-content").addEventListener("click", function (event) {
                if (event.target.classList.contains("difficulty-option")) {
                    var selectedDifficulty = event.target.getAttribute("data-difficulty");
                    sessionStorage.setItem("difficulty", selectedDifficulty);
                    console.log("Selected Difficulty: ", selectedDifficulty); // Check if difficulty is being saved
                    modal.style.display = "none";
                    window.location.href = "../assests/MainMenu.html";
                }
            });

            // Navigation links for the button texts
            document.getElementById("level").addEventListener("click", function () {
                modal.style.display = "block";
            });

            document.getElementById("scoreboard").addEventListener("click", function () {
                window.location.href = "../assests/ScoreBoard.html";
            });

            document.getElementById("exit").addEventListener("click", function () {
                sessionStorage.clear();
                window.location.href = "../index.html";
            });

        } else {
            // Token is invalid, redirect to login
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Invalid token. Please log in again.',
            }).then(() => {
                window.location.href = "../assests/login.html";
            });
        }
    })
    .catch(error => {
        // Handle token validation error (e.g., network issues)
        console.error("Error validating token:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to validate token. Please try again later.',
        }).then(() => {
            window.location.href = "../assests/login.html";
        });
    });
});
