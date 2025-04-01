document.addEventListener("DOMContentLoaded", function () {
    function getCookie(name) {
        let cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            let [key, value] = cookies[i].split("=");
            if (key === name) return decodeURIComponent(value);
        }
        return "";
    }

    // Get the username and score from cookies
    let username = getCookie("username");
    if (!username) {
        alert("Error: Username not found. Please log in first.");
        window.location.href = "login.html";
        return;
    }
    document.getElementById("username").textContent = "Username: " + username;

    let score = parseInt(getCookie("score")) || 0;
    document.getElementById("score").textContent = "Score: " + score;

    let difficulty = getCookie("difficulty") || "medium";
    let timeLimit = difficulty === "hard" ? 20 : difficulty === "medium" ? 40 : 60;
    let timer, correctAnswer = 0, quizImageURL = "", timeExpired = false;

    // Fetch quiz image and answer
    async function fetchQuizImage() {
        try {
            let response = await fetch("https://marcconrad.com/uob/banana/api.php");
            let data = await response.json();
            quizImageURL = data.question;
            correctAnswer = data.solution;

            let imgElement = document.getElementById("quiz-image");
            imgElement.style.display = "none";
            imgElement.src = quizImageURL;

            imgElement.onload = function () {
                imgElement.style.display = "block";
            };
        } catch (error) {
            console.error("Error fetching quiz image:", error);
        }
    }

    // Start quiz function
    async function startQuiz() {
        clearInterval(timer); // Reset the previous timer
        timeExpired = false;  // Reset timeExpired flag
        document.getElementById("answer").value = "";  // Clear the previous answer input
        document.getElementById("time-left").textContent = timeLimit;  // Display time limit

        await fetchQuizImage();  // Fetch a new quiz image

        // Start the timer countdown
        timer = setInterval(() => {
            if (timeExpired) return;

            timeLimit--;
            document.getElementById("time-left").textContent = timeLimit;

            if (timeLimit <= 0) {
                clearInterval(timer);  // Stop the timer
                timeExpired = true;  // Mark time as expired
                alert("Time's up! The correct answer was " + correctAnswer);

                // Reset timer and prepare for the next round after user acknowledges the alert
                setTimeout(() => {
                    timeLimit = difficulty === "hard" ? 20 : difficulty === "medium" ? 40 : 60;  // Reset the time limit based on difficulty
                    startQuiz();  // Start a new round with a new image and timer
                }, 500);
            }
        }, 1000);
    }

    // Handle answer submission
    document.getElementById("submit-answer").addEventListener("click", function () {
        if (timeExpired) return;  // Prevent actions if time expired

        let userAnswer = document.getElementById("answer").value;

        // Validate user input
        if (userAnswer === "" || isNaN(userAnswer) || userAnswer < 0 || userAnswer > 9) {
            alert("Please enter a valid number between 0 and 9.");
            return;
        }

        // Check if answer is correct
        if (parseInt(userAnswer) === correctAnswer) {
            alert("Correct! You earned 10 points.");
            score += 10;
            document.cookie = `score=${score}; path=/`;  // Update score in cookies
            document.getElementById("score").textContent = "Score: " + score;

            // Update score in the database
            fetch("../Services/update_score.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `username=${username}&score=${score}`
            });

            // Reset the timer and start a new quiz after correct answer
            setTimeout(() => {
                timeLimit = difficulty === "hard" ? 20 : difficulty === "medium" ? 40 : 60;  // Reset the time limit based on difficulty
                startQuiz();  // Start a new round with a new image and timer
            }, 500);
        } else {
            alert("Incorrect! Try again.");
        }
    });

    // Handle new game request
    document.getElementById("new-game").addEventListener("click", function () {
        timeExpired = false;  // Reset time expired flag
        timeLimit = difficulty === "hard" ? 20 : difficulty === "medium" ? 40 : 60;  // Reset timer based on difficulty
        startQuiz();  // Start a new game
    });

    // Handle close button click
    document.getElementById("close-button").addEventListener("click", function () {
        window.location.href = "../index.html";  // Navigate back to the main page
    });

    startQuiz();  // Start the first quiz when the page loads
});
