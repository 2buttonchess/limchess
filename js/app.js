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
    const shuffled = shuffle(moves)
    const numMoves = this._getNumberMoves()
    if (numMoves === 'all') return shuffled
    else return shuffled.slice(0, numMoves)
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

  // this function needs the state
  const doCpuMove = (callback) => {
    if (game.game_over()) return
    $("#thinking").css('visibility', 'visible');
    $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn").prop('disabled', true)
    setTimeout(() => {
      makeMove(getCpuMove(game))
      $("#thinking").css('visibility', 'hidden');
      $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn").prop('disabled', false)
      if (callback) callback()
    }, 300)
  }

  $(window).resize(board.resize)

  $("#newGameWhiteBtn").on('click', () => {
    board.start()
    board.orientation('white')
    game.reset()
    playerMoves.newMoves()
    $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn")
      .prop('disabled', false)
      .prop('hidden', false)
  })

  $("#newGameBlackBtn").on('click', () => {
    board.start()
    board.orientation('black')
    game.reset()
    doCpuMove(() => {
      playerMoves.newMoves()
      $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn")
        .prop('disabled', false)
        .prop('hidden', false)
    })
  })

  $("#cycleMoveBtn").on('click', () => {
    playerMoves.nextMove()
  })

  $("#acceptMoveBtn").on('click', () => {
    makeMove(playerMoves.currentMove)
    doCpuMove(() => {
      if (game.game_over()) {
        $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn")
          .prop('disabled', true)
          .prop('hidden', true)
      } else {
        playerMoves.newMoves()
      }
    })
  })

  $("#newMovesBtn").on('click', () => playerMoves.newMoves())

  $("#numberMoves").on('change', () => playerMoves.newMoves())
})
