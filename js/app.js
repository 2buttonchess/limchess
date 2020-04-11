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

$(document).ready(() => {

  const syncGameBoard = () => board.position(game.fen())
  const makeMove = move => {
    game.move(move)
    syncGameBoard()
  }

  const makeRandomMove = () => {
    if (game.game_over()) return
    const moves = game.moves()
    const moveIdx = Math.floor(Math.random() * moves.length)
    makeMove(moves[moveIdx])
  }
  const makeCpuMove = makeRandomMove
  const makePlayerMove = makeRandomMove

  const game = new Chess()

  const config = {
    position: 'start',
    showErrors: 'console',
  }
  const board = Chessboard('board', config)

  $(window).resize(board.resize)

  $("#newGameBtn").on('click', () => {
    board.start()
    game.reset()
  })

  $("#cycleMoveBtn").on('click', () => {
    // show next move
  })

  $("#acceptMoveBtn").on('click', () => {
    makePlayerMove()
    makeCpuMove()
  })

})
