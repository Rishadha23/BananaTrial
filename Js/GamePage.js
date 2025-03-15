document.addEventListener("DOMContentLoaded", function () {
    function getCookie(name) {
        let cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            let [key, value] = cookies[i].split("=");
            if (key === name) return value;
        }
        return "";
    }

    function setCookie(name, value) {
        document.cookie = `${name}=${value}; path=/`;
    }

    let username = getCookie("username");
    if (!username) {
        username = prompt("Enter your username:");
        setCookie("username", username);
    }
    document.getElementById("username").textContent = "Username: " + username;

    let score = parseInt(getCookie("score")) || 0;
    document.getElementById("score").textContent = "Score: " + score;

    let difficulty = getCookie("difficulty") || "medium";
    setCookie("difficulty", difficulty);

    let timeLimit = difficulty === "hard" ? 20 : difficulty === "medium" ? 40 : 60;
    let timer, correctAnswer = 0, quizImageURL = "";

    async function fetchTimerAPI() {
        return new Promise(resolve => {
            setTimeout(() => resolve(timeLimit), 500);
        });
    }

    async function fetchQuizImage() {
        try {
            let response = await fetch("https://marcconrad.com/uob/banana/api.php");
            let data = await response.json();
            quizImageURL = data.question;
            correctAnswer = data.solution;

            // Preload the image
            let img = new Image();
            img.onload = function () {
                document.getElementById("quiz-image").src = quizImageURL;
                document.getElementById("quiz-image").style.display = "block";
                document.getElementById("quiz-container").style.backgroundColor = "white";
            };
            img.src = quizImageURL;
        } catch (error) {
            console.error("Error fetching quiz image:", error);
        }
    }

    async function startQuiz() {
        clearInterval(timer);
        document.getElementById("answer").value = "";
        let timeLeft = await fetchTimerAPI();
        document.getElementById("time-left").textContent = timeLeft;

        await fetchQuizImage(); // Load the quiz image before starting timer

        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("time-left").textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                document.getElementById("time-left").textContent = "0";
                alert("Time's up! Try again.");
            }
        }, 1000);
    }

    document.getElementById("submit-answer").addEventListener("click", function () {
        let userAnswer = document.getElementById("answer").value;
        if (userAnswer === "" || isNaN(userAnswer) || userAnswer < 0 || userAnswer > 9) {
            alert("Please enter a valid number between 0 and 9.");
            return;
        }

        if (parseInt(userAnswer) === correctAnswer) {
            alert("Correct! You earned 10 points.");
            score += 10;
            setCookie("score", score);
            document.getElementById("score").textContent = "Score: " + score;

            fetch("update_score.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `username=${username}&score=${score}`
            }).then(response => response.text())
              .then(data => console.log(data));
        } else {
            alert("Incorrect! Try again.");
        }
        startQuiz();
    });

    document.getElementById("new-game").addEventListener("click", startQuiz);
    document.getElementById("close-button").addEventListener("click", function () {
        window.location.href = "mainmenu.html";
    });

    // Load the quiz image and start the quiz immediately on page load
    startQuiz();
});
