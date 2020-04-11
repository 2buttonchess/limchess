var game = new Chess()
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

function onClickSquare (square, piece) {
  removeGreySquares()
  // get list of possible moves for this square
  const moves = game.moves({
    square: square,
    verbose: true
  })

  if(moves.length == 0) {
    $(highlightedSquare).removeClass(hiClass)
    clickedSquareName = ""
    alert("No valid moves")
    return
  }

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (const move of moves) {
    greySquare(move.to)
  }
}

function onMouseoverSquare(square, piece) {
  // get list of possible moves for this square
  const moves = game.moves({
    square: square,
    verbose: true
  })

  $('.square-' + square).addClass(hiClass)

}

function onMouseoutSquare(square, piece) {
  if(square != clickedSquareName)
    $('.square-' + square).removeClass(hiClass)
}

$(document).ready(() => {
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

})
