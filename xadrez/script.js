
const board = document.getElementById('chessboard');

// Layout inicial do tabuleiro
let initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

// Mapeamento das peças para emojis
const pieceMap = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

// Criar o tabuleiro
function createBoard() {
    board.innerHTML = '';
    let isBlack = false;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', isBlack ? 'black' : 'white');
            cell.dataset.row = row;
            cell.dataset.col = col;

            const piece = initialBoard[row][col];
            if (piece) {
                const pieceElement = document.createElement('span');
                pieceElement.classList.add('piece');
                pieceElement.textContent = pieceMap[piece];
                pieceElement.draggable = true;
                pieceElement.addEventListener('dragstart', dragStart);
                cell.appendChild(pieceElement);
            }

            cell.addEventListener('dragover', dragOver);
            cell.addEventListener('drop', drop);

            board.appendChild(cell);
            isBlack = !isBlack;
        }
        isBlack = !isBlack;
    }
}

// Função ao iniciar o arraste da peça
function dragStart(event) {
    event.dataTransfer.setData('text', event.target.parentNode.dataset.row + ',' + event.target.parentNode.dataset.col);
}

// Função para permitir arrastar sobre uma célula
function dragOver(event) {
    event.preventDefault();
}

// Função ao soltar a peça
function drop(event) {
    const [startRow, startCol] = event.dataTransfer.getData('text').split(',').map(Number);
    const endRow = parseInt(event.target.dataset.row);
    const endCol = parseInt(event.target.dataset.col);

    const piece = initialBoard[startRow][startCol];
    const targetPiece = initialBoard[endRow][endCol];

    // Verifica se o movimento é válido
    if (isValidMove(piece, startRow, startCol, endRow, endCol, targetPiece)) {
        // Captura a peça do oponente se houver
        if (targetPiece && isOpponentPiece(piece, targetPiece)) {
            initialBoard[endRow][endCol] = ''; // Elimina a peça capturada
        }

        // Movimenta a peça
        initialBoard[endRow][endCol] = piece;
        initialBoard[startRow][startCol] = '';
        createBoard();
    }
}

// Verificar se o movimento é válido para cada peça
function isValidMove(piece, startRow, startCol, endRow, endCol, targetPiece) {
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;

    // Prevenir mover para uma posição do mesmo time
    if (targetPiece && isSameTeam(piece, targetPiece)) return false;

    switch (piece.toLowerCase()) {
        case 'p': // Peão
            return validatePawnMove(piece, startRow, startCol, endRow, endCol, targetPiece, rowDiff, colDiff);
        case 'r': // Torre
            return validateRookMove(rowDiff, colDiff, startRow, startCol, endRow, endCol);
        case 'n': // Cavalo
            return validateKnightMove(rowDiff, colDiff);
        case 'b': // Bispo
            return validateBishopMove(rowDiff, colDiff, startRow, startCol, endRow, endCol);
        case 'q': // Rainha
            return validateQueenMove(rowDiff, colDiff, startRow, startCol, endRow, endCol);
        case 'k': // Rei
            return validateKingMove(rowDiff, colDiff);
        default:
            return false;
    }
}

// Validação do movimento do peão
function validatePawnMove(piece, startRow, startCol, endRow, endCol, targetPiece, rowDiff, colDiff) {
    const direction = piece === 'P' ? -1 : 1;
    const startLine = piece === 'P' ? 6 : 1;

    // Movimento normal
    if (colDiff === 0 && !targetPiece && ((rowDiff === direction) || (startRow === startLine && rowDiff === 2 * direction && !initialBoard[startRow + direction][startCol]))) {
        return true;
    }

    // Captura
    if (Math.abs(colDiff) === 1 && rowDiff === direction && targetPiece) {
        return true;
    }

    return false;
}

// Validação do movimento da torre
function validateRookMove(rowDiff, colDiff, startRow, startCol, endRow, endCol) {
    if (rowDiff !== 0 && colDiff !== 0) return false;
    return !isPathBlocked(startRow, startCol, endRow, endCol);
}

// Validação do movimento do cavalo
function validateKnightMove(rowDiff, colDiff) {
    return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
}

// Validação do movimento do bispo
function validateBishopMove(rowDiff, colDiff, startRow, startCol, endRow, endCol) {
    if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
    return !isPathBlocked(startRow, startCol, endRow, endCol);
}

// Validação do movimento da rainha
function validateQueenMove(rowDiff, colDiff, startRow, startCol, endRow, endCol) {
    if ((rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff))) {
        return !isPathBlocked(startRow, startCol, endRow, endCol);
    }
    return false;
}

// Validação do movimento do rei
function validateKingMove(rowDiff, colDiff) {
    return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
}

// Verificar se uma peça está bloqueando o caminho
function isPathBlocked(startRow, startCol, endRow, endCol) {
    const rowStep = Math.sign(endRow - startRow);
    const colStep = Math.sign(endCol - startCol);

    let currentRow = startRow + rowStep;
    let currentCol = startCol + colStep;

    while (currentRow !== endRow || currentCol !== endCol) {
        if (initialBoard[currentRow][currentCol] !== '') return true;
        currentRow += rowStep;
        currentCol += colStep;
    }
    return false;
}

// Verificar se as peças são do mesmo time
function isSameTeam(piece, target) {
    return (piece.toLowerCase() === piece && target.toLowerCase() === target) ||
           (piece.toUpperCase() === piece && target.toUpperCase() === target);
}

// Verificar se as peças são de times opostos
function isOpponentPiece(piece, target) {
    return (piece.toLowerCase() !== piece && target.toLowerCase() === target) ||
           (piece.toUpperCase() !== piece && target.toUpperCase() === target);
}

// Inicializar o jogo
createBoard();
