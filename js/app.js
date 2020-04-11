"use strict";

const whiteSquareGrey = '#a9a9a9'
const blackSquareGrey = '#696969'
const hiClass = 'highlight2-9c5d2'

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
  game.move(move)
  board.position(game.fen())
}

const getRandomMove = game => {
  if (game.game_over()) return
  const moves = game.moves()
  const moveIdx = Math.floor(Math.random() * moves.length)
  return moves[moveIdx]
}

const getCpuMove = getRandomMove
const getPlayerMove = getRandomMove

$(document).ready(() => {

  // state
  const game = new Chess()
  const config = {
    position: 'start',
    showErrors: 'console',
  }
  const board = Chessboard('board', config)

  const makeMove = makeMoveMaker(game, board)

  $(window).resize(board.resize)

  $("#newGameBtn").on('click', () => {
    board.start()
    game.reset()
  })

  $("#cycleMoveBtn").on('click', () => {
    // show next move
  })

  $("#acceptMoveBtn").on('click', () => {
    makeMove(getPlayerMove(game))
    makeMove(getCpuMove(game))
  })

})
