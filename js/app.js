"use strict";

const whiteSquareBg = '#00a900'
const blackSquareBg = '#006900'
const hiClass = 'highlight2-9c5d2'

function removeColorOnSquares () {
  $('#board .square-55d63').css('background', '')
}

function colorSquare (square) {
  const $square = $('#board .square-' + square)

  const background =
    $square.hasClass('black-3c85d')
    ? whiteSquareBg
    : blackSquareBg

  $square.css('background', background)
}

const makeMoveMaker = (game, board) => move => {
  game.move(move)
  board.position(game.fen())
}

const getRandomMove = game => {
  if (game.game_over()) return
  const moves = game.moves()
  const moveIdx = Math.floor(Math.random() * moves.length)
  return moves[moveIdx]
}

const getCpuMove = game => {
  const move = minimaxRoot(3, game, false);
  game.ugly_to_pretty(move) // fix minimaxRoot return value; mutates move
  return move
}

const shuffle = array => {
  // fisher-yates via https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class PlayerMoves {
  constructor(game, getNumberMoves) {
    this._game = game
    this._getNumberMoves = getNumberMoves
    this.newMoves()
  }

  get currentMove() {
    if (this._game.game_over()) return
    return this._moves[this._current_move]
  }

  highlightMove() {
    removeColorOnSquares()
    colorSquare(this.currentMove.to)
    colorSquare(this.currentMove.from)
  }

  nextMove() {
    this._current_move++
    if (this._current_move >= this._moves.length) this._current_move = 0
    this.highlightMove()
    return this.currentMove
  }

  _getMoves() {
    if (this._game.game_over()) return
    const moves = this._game.moves({verbose: true})
    const numMoves = this._getNumberMoves()
    if (numMoves === 'all') return moves
    const shuffled = shuffle(moves)
    return shuffled.slice(0, numMoves)
  }

  newMoves() {
    this._moves = this._getMoves()
    this._current_move = 0
    this.highlightMove()
  }
}

$(document).ready(() => {

  // state
  const game = new Chess()
  const config = {
    position: 'start',
    showErrors: 'console',
  }
  const board = Chessboard('board', config)
  const playerMoves = new PlayerMoves(game, () => $("#numberMoves").val())
  playerMoves.highlightMove()

  const makeMove = makeMoveMaker(game, board)

  // these functions needs the state
  const doCpuMove = (keepGoing, gameOver) => {
    if (game.game_over()) {
      if (gameOver) gameOver()
      return
    }
    const status = `${game.in_check() ? "Check!" : ''} Thinking...`
    $("#status").css('visibility', 'visible').find("p").html(status);
    $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn").prop('disabled', true)
    setTimeout(() => {
      makeMove(getCpuMove(game))
      $("#status").css('visibility', 'hidden');
      if (game.game_over()) {
        if (gameOver) gameOver()
      } else {
        if (keepGoing) keepGoing()
      }
    }, 300)
  }

  const prepPlayerTurn = () => {
    if (game.in_check()) {
      $("#status").css('visibility', 'visible').find("p").html("Check! Secure your king!")
    }
    playerMoves.newMoves()
    $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn")
      .prop('disabled', false)
      .prop('hidden', false)
  }

  const handleGameOver = () => {
    $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn")
      .prop('disabled', true)
      .prop('hidden', true)
    const status = (() => {
      const turn = game.turn()
      if (game.in_checkmate()) {
        const winner = (turn === 'b') ? 'White' : 'Black'
        return `Checkmate! ${winner} wins!`
      } else if (game.in_draw()) {
        const reason = game.insufficient_material() ? "Insufficent material to win" : "50-move rule"
        return `Draw! ${reason}`
      } else if (game.in_stalemate()) {
        return "Stalemate!"
      } else if (game.in_threefold_repetition()) {
        return "Draw! 3-fold repetition"
      }
    })()
    $("#status").css('visibility', 'visible').find("p").html(status)
  }

  $(window).resize(board.resize)

  $("#newGameWhiteBtn").on('click', () => {
    $("#status").css('visibility', 'hidden');
    board.start()
    board.orientation('white')
    game.reset()
    prepPlayerTurn()
  })

  $("#newGameBlackBtn").on('click', () => {
    $("#status").css('visibility', 'hidden');
    board.start()
    board.orientation('black')
    game.reset()
    doCpuMove(prepPlayerTurn, handleGameOver)
  })

  $("#cycleMoveBtn").on('click', () => {
    playerMoves.nextMove()
  })

  $("#acceptMoveBtn").on('click', () => {
    makeMove(playerMoves.currentMove)
    doCpuMove(prepPlayerTurn, handleGameOver)
  })

  $("#newMovesBtn").on('click', () => playerMoves.newMoves())

  $("#numberMoves").on('change', () => playerMoves.newMoves())
})
