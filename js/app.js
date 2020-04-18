"use strict";

const whiteSquareGrey = '#a9a9a9'
const blackSquareGrey = '#696969'
const hiClass = 'highlight2-9c5d2'
var CPUMove = false

function removeGreySquares () {
  $('#board .square-55d63').css('background', '')
}

function greySquare (square) {
  const $square = $('#board .square-' + square)

  const background =
    $square.hasClass('black-3c85d')
    ? whiteSquareGrey
    : blackSquareGrey

  $square.css('background', background)
}

const makeMoveMaker = (game, board) => move => {
  if(CPUMove) {
    game.ugly_to_pretty(move)
  }
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
  CPUMove = true
  return minimaxRoot(3, game, false);
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
    removeGreySquares()
    greySquare(this.currentMove.to)
    greySquare(this.currentMove.from)
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

const doCpuMove = (game, getCpuMove, makeMove) => {
  // $("#thinking").css('visibility', 'visible');
  // const date = Date.now()
  makeMove(getCpuMove(game))
  //$("#thinking").css('visibility', 'hidden');
  // console.log('AI think time: ' + ((Date.now() - date) / 1000) + 's')
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
    doCpuMove(game, getCpuMove, makeMove)
    playerMoves.newMoves()
    $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn")
      .prop('disabled', false)
      .prop('hidden', false)
  })

  $("#cycleMoveBtn").on('click', () => {
    playerMoves.nextMove()
  })

  $("#acceptMoveBtn").on('click', () => {
    makeMove(playerMoves.currentMove)
    doCpuMove(game, getCpuMove, makeMove)
    if (game.game_over()) {
      $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn")
        .prop('disabled', true)
        .prop('hidden', true)
    } else {
      CPUMove = false
      playerMoves.newMoves()
    }
  })

  $("#newMovesBtn").on('click', () => playerMoves.newMoves())

  $("#numberMoves").on('change', () => playerMoves.newMoves())
})
