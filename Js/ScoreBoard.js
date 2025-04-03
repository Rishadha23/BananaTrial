document.addEventListener("DOMContentLoaded", function () {
    fetchLeaderboard();

    // Close button event
    document.getElementById("closeBtn").addEventListener("click", function () {
        window.location.href = "../assests/MainMenu.html"; // Change to your main menu URL
    });
});

function fetchLeaderboard() {
    fetch("../Services/scoreboard.php")
        .then(response => response.json())
        .then(players => {
            const playerElements = [
                document.getElementById("player1"),
                document.getElementById("player2"),
                document.getElementById("player3"),
                document.getElementById("player4")
            ];

            players.forEach((player, index) => {
                if (playerElements[index]) {
                    playerElements[index].textContent = ` ${player.username} - ${player.score} points`;
                }
            });

            for (let i = players.length; i < 4; i++) {
                playerElements[i].textContent = ` No player`;
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("leaderboard").innerHTML = "<p>Failed to load data</p>";
        });
}
