document.addEventListener("DOMContentLoaded", function () {
    let difficulty = sessionStorage.getItem("difficulty") || "Medium"; // Default to "Medium" if not found
    console.log("Loaded Difficulty: ", difficulty); // Check if the difficulty is retrieved correctly

    let timeLimit;
    if (difficulty === "Hard") {
        timeLimit = 20;  // Hard mode
    } else if (difficulty === "Medium") {
        timeLimit = 40;  // Medium mode
    } else {
        timeLimit = 60;  // Easy mode
    }

    console.log("Time Limit Set: ", timeLimit); // Check the set time limit

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
        clearInterval(timer); // Reset the previous timer before starting a new quiz
        timeExpired = false;  // Reset timeExpired flag

        // Clear previous input and set the timer
        document.getElementById("answer").value = "";  // Clear the previous answer input
        document.getElementById("time-left").textContent = timeLimit;  // Display time limit

        await fetchQuizImage();  // Fetch a new quiz image

        // Start the timer countdown
        timer = setInterval(() => {
            if (timeExpired) return;  // Prevent timer from running if time has expired

            timeLimit--;
            document.getElementById("time-left").textContent = timeLimit; // Update the displayed timer

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
                        startQuiz();  // Start the next quiz after timeout
                    }, 500);
                });
            }
        }, 1000); // Countdown every second
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
