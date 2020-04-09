var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeGreySquares () {
  $('#board .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#board .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onClickSquare (square, piece) {
  removeGreySquares()
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  if(moves.length == 0) {
    alert("No valid moves")
    return
  } 

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

$(document).ready(() => {
  const board = Chessboard('board', 'start');
  console.log(game.moves({verbose: true}));

  $('*[class^="piece"]').click(function() {
    var piece = event.currentTarget;
    var pieceName = piece.getAttribute('data-piece')
   // square is always third class name and square number (a8, b5, c4, etc) is the last 2 chars of class name
    var clickedSquare = $(this).parent().get(0).classList[2].substring(7, 9);
    onClickSquare(clickedSquare, pieceName)
  })
  
})