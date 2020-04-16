var makeCPUMove = function(game, board, depth) {
    var bestMove = calculateBestMove(depth, game, -1000000, 1000000, true);
    game.move(bestMove);
    board.position(game.fen());
}
  
var calculateBestMove = function(depth, game, alpha, beta, isMaximizingPlayer) {
    var newGameMoves = game.moves();
    var bestMove = null;
    var bestValue = -99999;
    for (var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i];
        game.move(newGameMove);

        var value = minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer);
        game.undo();

        if (value >= bestValue) {
        bestValue = value;
        bestMove = newGameMove;
        }
    }
    return bestMove;
}
  
var minimax = function(depth, game, alpha, beta, isMaximizingPlayer) {
    if (depth === 0) {
        return -evaluateBoard(game);
    }
    var newGameMoves = game.moves();

    if(isMaximizingPlayer) {
        var bestMove = -99999;
        for (var i = 0; i < newGameMoves.length; i++) {
        game.move(newGameMoves[i]);
        bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer));
        game.undo();
        alpha = Math.max(alpha, bestMove);
        if (alpha >= beta) {
            return bestMove;
        }
        }
        return bestMove;
    } else {
        var bestMove = 99999;
        for (var i = 0; i < newGameMoves.length; i++) {
        game.move(newGameMoves[i]);
        bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximizingPlayer));
        game.undo();
        beta = Math.min(beta, bestMove);
        if (alpha >= beta) {
            return bestMove;
        }
        }
        return bestMove;
    }
}
//Returns the score of the black player's pieces
var evaluateBoard = function(game) {
    var total = 0;
    
    var string = game.fen();
    var index = 0;
    var curr = string.substring(index, index + 1);
    while(curr !== ' ') {
    total = total + getPieceValue(curr);
    index++;
    curr = string.substring(index, index + 1);
    }
    return total;
}

var getPieceValue = function(string) {
    var pieceValue = {
    'p' : -100,
    'n' : -350,
    'b' : -350,
    'r' : -525,
    'q' : -1000,
    'k' : -10000,
    'P' : 100,
    'N' : 350,
    'B' : 350,
    'R' : 525,
    'Q' : 1000,
    'K' : 10000
    };
    if (pieceValue.hasOwnProperty(string)) {
    return pieceValue[string];
    }
    else return 0;
}