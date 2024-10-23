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
            [0, 5, 0],
            [5, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === "l") {
        return [
            [0, 0, 5],
            [5, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === "j") {
        return [
            [5, 0, 0],
            [5, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === "o") {
        return [
            [5, 5],
            [5, 5],
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
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0],
        ];
    } else if (type === "z") {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    }
};

let points = 0;
let board = makeMatrix(10, 20);
let dropInter = setInterval(drop, 1000);
let piece = createPiece();
let playerReset = () => {
    piece = createPiece();
    if (collides(board, piece)) {
        alert("Game Over");
        resetGame();
    }
};

function resetGame() {
    board = makeMatrix(12, 20);
    points = 0;
    updateScore();
    playerReset();
    draw();
}

function updateScore() {
    scoreElement.innerText = points;
}

function createPiece() {
    const pieces = "ijlostz";
    return {
        matrix: makePiece(pieces[Math.floor(Math.random() * pieces.length)]),
        pos: { x: 4, y: 0 },
    };
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawMatrix(board, { x: 0, y: 0 });
    drawMatrix(piece.matrix, piece.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = "red";
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
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
    const temp = piece.matrix;
    piece.matrix = piece.matrix[0].map((_, index) =>
        temp.map((row) => row[index]).reverse()
    );
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
    if (event.key === "ArrowLeft") {
        piece.pos.x--;
        if (collides(board, piece)) {
            piece.pos.x++;
        }
    } else if (event.key === "ArrowRight") {
        piece.pos.x++;
        if (collides(board, piece)) {
            piece.pos.x--;
        }
    } else if (event.key === "ArrowDown") {
        drop();
    } else if (event.key === "ArrowUp") {
        rotate(piece);
        if (collides(board, piece)) {
            rotate(piece); // Rotate back if collision
        }
    }
});

startButton.addEventListener("click", () => {
    resetGame();
    draw();
});