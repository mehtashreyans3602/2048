let board;
let score = 0;
let highscore = 0;
const rows = 4;
const columns = 4;

window.onload = () => {
    setGame();
    const gameboard = document.getElementById('gameboard');
    gameboard.addEventListener("touchstart", handleTouchStart);
    gameboard.addEventListener("touchend", handleTouchEnd);
}

const setGame = () => {
    document.getElementById('gameboard').innerHTML = "";
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById('gameboard').append(tile);
        }
    }
    setTwo();
    setTwo();
    document.getElementById('highscore').innerText = highscore; // Initialize highscore display
}

const handleTouchStart = (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}

const handleTouchEnd = (event) => {
    endX = event.changedTouches[0].clientX;
    endY = event.changedTouches[0].clientY;

    handleSwipe();
}

const handleSwipe = () => {
    let diffX = endX - startX;
    let diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideRight();
        } else {
            slideLeft();
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            slideDown();
        } else {
            slideUp();
        }
    }

    setTwo();
    document.getElementById("score").innerText = score;
    checkGameOver();
}

const updateTile = (tile, num) => {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num;
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup", (event) => {
    let moved = false;
    if (event.code == "ArrowLeft") {
        slideLeft();
        moved = true;
    }
    if (event.code == "ArrowRight") {
        slideRight();
        moved = true;
    }
    if (event.code == "ArrowUp") {
        slideUp();
        moved = true;
    }
    if (event.code == "ArrowDown") {
        slideDown();
        moved = true;
    }
    if (moved) {
        setTwo();
        document.getElementById("score").innerText = score;
        checkGameOver();
    }
});

const filterZeros = (row) => {
    return row.filter(num => num != 0);
}

const slide = (row) => {
    row = filterZeros(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZeros(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

const slideLeft = () => {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

const slideRight = () => {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

const slideUp = () => {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < columns; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

const slideDown = () => {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < columns; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

const setTwo = () => {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

const hasEmptyTile = () => {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

const hasPossibleMerge = () => {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let currentTile = board[r][c];
            // Check right
            if (c < columns - 1 && currentTile == board[r][c + 1]) {
                return true;
            }
            // Check down
            if (r < rows - 1 && currentTile == board[r + 1][c]) {
                return true;
            }
        }
    }
    return false;
}

const checkGameOver = () => {
    if (!hasEmptyTile() && !hasPossibleMerge()) {
        // Update highscore if the current score is higher
        if (score > highscore) {
            highscore = score;
            document.getElementById("highscore").innerText = highscore; // Update highscore display
        }
        alert("Game Over! Your score is " + score);
        score = 0; // Reset score
        document.getElementById("score").innerText = score; // Update score display
        setGame(); // Reset the game board
    }
}
