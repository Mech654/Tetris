const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("start");

particlesJS.load('particles-js', 'particles.json', function() {
    console.log('callback - particles.js config loaded');
});

context.scale(30, 30);

let makeMatrix = (w, h) => {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
};

let makePiece = (type) => {
    if (type === "t") {
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    } else if (type === "l") {
        return [
            [0, 0, 2],
            [2, 2, 2],
            [0, 0, 0],
        ];
    } else if (type === "j") {
        return [
            [3, 0, 0],
            [3, 3, 3],
            [0, 0, 0],
        ];
    } else if (type === "o") {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === "i") {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    } else if (type === "s") {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === "z") {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    } else if (type === "x") {  // New cross shape
        return [
            [0, 8, 0],
            [8, 8, 8],
            [0, 8, 0],
        ];
    } else if (type === "u") {  // New U shape
        return [
            [9, 0, 9],
            [9, 0, 9],
            [9, 9, 9],
        ];
    } else if (type === "w") {  // New W shape
        return [
            [10, 0, 10],
            [0, 10, 10],
            [10, 10, 0],
        ];
    } else if (type === "f") {  // New F shape
        return [
            [11, 11, 0],
            [11, 0, 0],
            [11, 11, 11],
        ];
    } else if (type === "v") {  // New V shape
        return [
            [12, 0, 12],
            [12, 0, 12],
            [0, 12, 0],
        ];
    }
};

// "ijlostzqxuwfv"



let points = 0;
let board = makeMatrix(16, 20);
let dropInter = setInterval(drop, 500); // Adjusted interval to make the game faster
let piece = createPiece();
let playerReset = () => {
    piece = createPiece();
    if (collides(board, piece)) {
        alert("Game Over");
        resetGame();
    }
};

function resetGame() {
    console.log('Resetting game');
    board = makeMatrix(16, 20);
    points = 0;
    updateScore();
    playerReset();
    draw();
}

function updateScore() {
    scoreElement.innerText = points;
}

function createPiece() {
    const pieces = "ijlostzqxuwfv";
    return {
        matrix: makePiece(pieces[Math.floor(Math.random() * pieces.length)]),
        pos: { x: 4, y: 0 },
    };
}

function draw() {
    console.log('Drawing game');
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawMatrix(board, { x: 0, y: 0 });
    drawMatrix(piece.matrix, piece.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {

                context.fillStyle = "#7F00FF";
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function getColor() {

    const r = Math.floor(Math.random() * 156) + 100; // 100-255
    const g = Math.floor(Math.random() * 156) + 100; // 100-255
    const b = Math.floor(Math.random() * 156) + 10; // 100-255
    return `rgb(${r}, ${g}, ${b})`;
}


function merge(board, piece) {
    piece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[y + piece.pos.y][x + piece.pos.x] = value;
            }
        });
    });
}

function collides(board, piece) {
    for (let y = 0; y < piece.matrix.length; ++y) {
        for (let x = 0; x < piece.matrix[y].length; ++x) {
            if (
                piece.matrix[y][x] &&
                (board[y + piece.pos.y] && board[y + piece.pos.y][x + piece.pos.x]) !== 0
            ) {
                return true;
            }
        }
    }
    return false; 
}

function rotate(piece) {
    const tempMatrix = piece.matrix; // Store the original matrix

    // Rotate the piece clockwise
    piece.matrix = piece.matrix[0].map((_, index) =>
        tempMatrix.map((row) => row[index]).reverse()
    );

    // Check for collision and out-of-bounds after rotation
    let offset = 1;
    while (collides(board, piece)) {
        piece.pos.x += offset; // Try shifting the piece
        offset = -(offset + (offset > 0 ? 1 : -1)); // Alternate directions
        if (offset > piece.matrix[0].length) {
            // If shifting didn't work, undo rotation
            piece.matrix = tempMatrix;
            return;
        }
    }
}



function drop() {
    piece.pos.y++;
    if (collides(board, piece)) {
        piece.pos.y--;
        merge(board, piece);
        playerReset();
        draw();
        clearRows();
    }
    draw();
}

function clearRows() {
    outer: for (let y = board.length - 1; y >= 0; --y) {
        for (let x = 0; x < board[y].length; ++x) {
            if (!board[y][x]) {
                continue outer;
            }
        }
        board.splice(y, 1);
        board.unshift(new Array(12).fill(0));
        points += 100;
        updateScore();
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "a") {
        piece.pos.x--;
        if (collides(board, piece)) {
            piece.pos.x++;
        }
        draw(); // Immediate rendering
    } else if (event.key === "ArrowRight" || event.key === "d") {
        piece.pos.x++;
        if (collides(board, piece)) {
            piece.pos.x--;
        }
        draw(); // Immediate rendering
    } else if (event.key === "ArrowDown" || event.key === "s") {
        drop();
    } else if (event.key === "ArrowUp" || event.key === "w") {
        rotate(piece);
        if (collides(board, piece)) {
            rotate(piece); // Rotate back if collision
        }
        draw(); // Immediate rendering
    }
});

startButton.addEventListener("click", () => {
    console.log('Start button clicked');
    resetGame();
    draw();
});