document.addEventListener("DOMContentLoaded", function () {

    // Helper function to get cookie values by name
    function getCookie(name) {
        let cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            let [key, value] = cookies[i].split("=");
            if (key === name) return decodeURIComponent(value);
        }
        return "";
    }

    // Fetch the token from cookies (for validating user session if needed)
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

    console.log("Token retrieved:", token);  // Debugging log to check the token

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
            const username = data.username;
            let score = data.score;

            document.getElementById("username").textContent = "Username: " + username;
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
                            setTimeout(() => {
                                startQuiz();  
                            }, 500);
                        });
                    }
                }, 1000);
            }

            // Handle answer submission
            document.getElementById("submit-answer").addEventListener("click", function () {
                console.log("Submit Answer Button Clicked");  // Debugging log

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

                        // Log the fetch request before it's called
                        console.log("Updating score in the database...");
                        console.log("Username:", username);
                        console.log("Score:", score);

                        // Update score in the database (No Authorization Header)
                        fetch("../Services/update_score.php", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: new URLSearchParams({
                                "username": username,
                                "score": score
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log("Update score response:", data);
                        })
                        .catch(error => {
                            console.log("Error updating score:", error);
                        });

                        // Reset the timer and start a new quiz after correct answer
                        setTimeout(() => {
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
                startQuiz();  
            });

            // Handle close button click
            document.getElementById("close-button").addEventListener("click", function () {
                window.location.href = "../assests/MainMenu.html";  
            });

            startQuiz();  // Start the first quiz when the page loads

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
    });

});
