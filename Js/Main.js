document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("difficultyModal");
    var closeBtn = document.querySelector(".close");


    // To open modal before starting a new game if difficulty is not set
    document.getElementById("newGame").addEventListener("click", function() {
        if (!sessionStorage.getItem("difficulty")) {
            modal.style.display = "block";
        } else {
            window.location.href = "../assests/GamePage.html"; 
        }
    });

    // Close modal when 'X' is clicked
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the content
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Event delegation for difficulty selection
    document.querySelector(".modal-content").addEventListener("click", function(event) {
        if (event.target.classList.contains("difficulty-option")) {
            var selectedDifficulty = event.target.getAttribute("data-difficulty");
            sessionStorage.setItem("difficulty", selectedDifficulty);
            modal.style.display = "none";
            window.location.href = "../assests/MainMenu.html"; 
        }
    });

    //navigation links for the buttton texts 
    document.getElementById("level").addEventListener("click", function() {
        modal.style.display = "block"; 
    });

    document.getElementById("scoreboard").addEventListener("click", function() {
        window.location.href = "../assests/ScoreBoard.html"; 
    });

    document.getElementById("exit").addEventListener("click", function() {
        sessionStorage.clear();
        window.location.href = "../index.html"; 
    });
});
