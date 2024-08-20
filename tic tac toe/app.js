// Select DOM elements
let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset");
let resetScorebtn = document.querySelector("#resetScore");
let newgamebtn = document.querySelector("#newgame");
let msgcontainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let modeSelector = document.querySelector("#mode");
let themeSelector = document.querySelector("#themeSelector");

let scoreO = 0;
let scoreX = 0;
let draws = 0;

let turnO = true;
let mode = "multiplayer"; // Default mode is multiplayer
const winpatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Update the score display
const updateScores = () => {
    document.querySelector("#scoreO").innerText = `O: ${scoreO}`;
    document.querySelector("#scoreX").innerText = `X: ${scoreX}`;
    document.querySelector("#draws").innerText = `Draws: ${draws}`;
};

// Reset the game board
const resetGame = () => {
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
    });
    turnO = true;
    msgcontainer.classList.add("hide");
};

// Reset the scorecard
const resetScorecard = () => {
    scoreO = 0;
    scoreX = 0;
    draws = 0;
    updateScores();
};

// Check if there is a winner or a draw
const checkWinner = () => {
    for (let pattern of winpatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val && pos1Val === pos2Val && pos1Val === pos3Val) {
            showWinner(pos1Val);
            return;
        }
    }

    // Check for a draw
    if ([...boxes].every(box => box.innerText !== "")) {
        showWinner("Draw");
    }
};

// Show the winner message
const showWinner = (winner) => {
    if (winner === "Draw") {
        msg.innerText = "It's a draw!";
        draws++;
    } else {
        msg.innerText = `Congratulations, Winner is ${winner}`;
        if (winner === "O") scoreO++;
        if (winner === "X") scoreX++;
    }
    updateScores();
    msgcontainer.classList.remove("hide");
    boxes.forEach(box => box.disabled = true);
};

// Minimax algorithm for AI move
const minimax = (board, player) => {
    let availSpots = board.filter(s => typeof s === "number");

    if (checkWinning(board, "X")) {
        return { score: -10 };
    } else if (checkWinning(board, "O")) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = board[availSpots[i]];
        board[availSpots[i]] = player;

        if (player === "O") {
            let result = minimax(board, "X");
            move.score = result.score;
        } else {
            let result = minimax(board, "O");
            move.score = result.score;
        }

        board[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
};

// Check for winning patterns
const checkWinning = (board, player) => {
    return winpatterns.some(pattern => {
        return pattern.every(index => board[index] === player);
    });
};

// AI's move
const aiMove = () => {
    let board = [...boxes].map(box => box.innerText === "" ? [...boxes].indexOf(box) : box.innerText);
    let bestMove = minimax(board, "X"); // AI is "X" now
    boxes[bestMove.index].innerText = "X";
    boxes[bestMove.index].disabled = true;
    checkWinner();
    turnO = true;
};

// Event listener for each box
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO || mode === "multiplayer") {
            box.innerText = turnO ? "O" : "X";
            box.disabled = true;
            checkWinner();
            turnO = !turnO;

            if (mode === "single" && !turnO) {
                setTimeout(aiMove, 500);
            }
        }
    });
});

// Event listener for the "New Game" button
newgamebtn.addEventListener("click", resetGame);

// Event listener for the "Reset Game" button
resetbtn.addEventListener("click", resetGame);

// Event listener for the "Reset Scorecard" button
resetScorebtn.addEventListener("click", resetScorecard);

// Event listener for mode selection
modeSelector.addEventListener("change", (e) => {
    mode = e.target.value;
    resetGame();
});

// Event listener for theme selection
themeSelector.addEventListener("change", (e) => {
    document.documentElement.setAttribute('data-theme', e.target.value);
});
