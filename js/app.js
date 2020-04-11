"use strict";

const whiteSquareGrey = '#a9a9a9'
const blackSquareGrey = '#696969'
var highlightedSquare = null
var clickedSquareName = ""
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

function onMouseoutSquare(square, piece) {
  if(square != clickedSquareName)
    $('.square-' + square).removeClass(hiClass)
}

$(document).ready(() => {

  function onClickSquare (square, piece) {
    removeGreySquares()
    const moves = game.moves({square: square, verbose: true})

    if(moves.length == 0) {
      $(highlightedSquare).removeClass(hiClass)
      clickedSquareName = ""
      return
    }

    // highlight the square they moused over
    greySquare(square)
    // highlight the possible squares for this piece
    moves.forEach(move => greySquare(move.to))
  }

  function onMouseoverSquare(square, piece) {
    // get list of possible moves for this square
    const moves = game.moves({square: square, verbose: true})
    $('.square-' + square).addClass(hiClass)
  }

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
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    showErrors: 'console',
  }
  const board = Chessboard('board', config)

  $(window).resize(board.resize)

  $('*[class^="piece"]').click(function() {
    if(highlightedSquare != null) {
      $(highlightedSquare).removeClass(hiClass)
    }
    const piece = event.currentTarget;
    const pieceName = piece.getAttribute('data-piece')

    const squareDiv = $(this).parent().get(0)
    // square is always third class name and square number (a8, b5, c4, etc) is the last 2 chars of class name
    const clickedSquare = squareDiv.classList[2].substring(7, 9)
    $(squareDiv).addClass(hiClass)
    highlightedSquare = squareDiv
    clickedSquareName = clickedSquare
    onClickSquare(clickedSquare, pieceName)
  })

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
