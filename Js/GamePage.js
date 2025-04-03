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
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Username not found. Please log in first.',
        }).then(() => {
            window.location.href = "../assests/login.html";
        });
        return;
    }
    document.getElementById("username").textContent = "Username: " + username;

    let score = parseInt(getCookie("score")) || 0;
    document.getElementById("score").textContent = "Score: " + score;

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
        // Read the difficulty from sessionStorage every time the function is called.
        let difficulty = sessionStorage.getItem("difficulty") || "Medium";
        let timeLimit = difficulty === "Hard" ? 20 : difficulty === "Medium" ? 40 : 60;

        console.log("Start Quiz - Difficulty:", difficulty, "Time Limit:", timeLimit); 

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
                Swal.fire({
                    icon: 'error',
                    title: "Time's up!",
                    text: 'The correct answer was ' + correctAnswer,
                }).then(() => {
                    // Reset timer and prepare for the next round after user acknowledges the alert
                    setTimeout(() => {
                        let difficulty = sessionStorage.getItem("difficulty") || "Medium";
                        timeLimit = difficulty === "Hard" ? 20 : difficulty === "Medium" ? 40 : 60;  
                        console.log("Timeout - Difficulty:", difficulty, "Time Limit:", timeLimit); 
                        startQuiz();  
                    }, 500);
                });
            }
        }, 1000);
    }

    // Handle answer submission
    document.getElementById("submit-answer").addEventListener("click", function () {
        if (timeExpired) return;  // Prevent actions if time expired

        let userAnswer = document.getElementById("answer").value;

        // Validate user input
        if (userAnswer === "" || isNaN(userAnswer) || userAnswer < 0 || userAnswer > 9) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Answer',
                text: 'Please enter a valid number between 0 and 9.',
            });
            return;
        }

        // Check if answer is correct
        if (parseInt(userAnswer) === correctAnswer) {
            Swal.fire({
                icon: 'success',
                title: 'Correct!',
                text: 'You earned 10 points.',
            }).then(() => {
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
                    let difficulty = sessionStorage.getItem("difficulty") || "Medium";
                    timeLimit = difficulty === "Hard" ? 20 : difficulty === "Medium" ? 40 : 60;  
                    startQuiz();  
                }, 500);
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Incorrect!',
                text: 'Try again.',
            });
        }
    });

    // Handle new game request
    document.getElementById("newgame").addEventListener("click", function () {
        timeExpired = false;  
        let difficulty = sessionStorage.getItem("difficulty") || "Medium";
        timeLimit = difficulty === "Hard" ? 20 : difficulty === "Medium" ? 40 : 60;  
        console.log("New Game - Difficulty:", difficulty, "Time Limit:", timeLimit); 
        startQuiz();  
    });

    // Handle close button click
    document.getElementById("close-button").addEventListener("click", function () {
        window.location.href = "../assests/MainMenu.html";  
    });

    startQuiz();  // Start the first quiz when the page loads
});
