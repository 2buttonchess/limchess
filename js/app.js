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
  game.move(move, {sloppy: true})
  board.position(game.fen())
}

const getRandomMove = game => {
  if (game.game_over()) return
  const moves = game.moves()
  const moveIdx = Math.floor(Math.random() * moves.length)
  return moves[moveIdx]
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
    if (this.currentMove.flags.includes('p')) { // promotion
      const promotion = this.currentMove.promotion
      const newPiece =
        promotion === 'q'
        ? 'Queen!'
        : promotion === 'r'
        ? 'Rook!'
        : promotion === 'b'
        ? 'Bishop!'
        : promotion === 'n'
        ? 'Knight!'
        : `bad promotion: ${promotion}`
      $("#status").css('visibility', 'visible').find("p").html(`Promote to a ${newPiece}`);
    } else if ($("#status").find("p").html().startsWith("Promote")) {
      $("#status").css('visibility', 'hidden');
    }
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

  const doCpuMove = engine => {
    if (game.game_over()) {
      handleGameOver()
      return
    }
    const status = `${game.in_check() ? "Check!" : ''} Thinking...`
    $("#status").css('visibility', 'visible').find("p").html(status);
    $("#acceptMoveBtn, #cycleMoveBtn, #newMovesBtn").prop('disabled', true)
    setTimeout(() => {
      engine.position(game.fen())
      engine.search(2000, 5)
    }, 300)
  }

  const engine = new Engine(bm => {
    makeMove(bm)
    $("#status").css('visibility', 'hidden');
    if (game.game_over()) handleGameOver()
    else prepPlayerTurn()
  })
  engine.setSkillLevel(10)

  const newgame = side => {
    $("#status").css('visibility', 'hidden');
    engine.newgame()
    board.start()
    board.orientation(side)
    game.reset()
    if (side === 'white') prepPlayerTurn()
    else if (side === 'black') doCpuMove(engine)
  }

  $(window).resize(board.resize)

  $("#newGameWhiteBtn").on('click', () => newgame('white'))

  $("#newGameBlackBtn").on('click', () => newgame('black'))

  $("#cycleMoveBtn").on('click', () => {
    playerMoves.nextMove()
  })

  $("#acceptMoveBtn").on('click', () => {
    makeMove(playerMoves.currentMove)
    doCpuMove(engine)
  })

  $("#newMovesBtn").on('click', () => playerMoves.newMoves())

  $("#numberMoves").on('change', () => playerMoves.newMoves())

  $("#difficultySlider").on('input', () => {
    const val = $("#difficultySlider").val()
    $("output[for=difficulty]").html(val)
    engine.setSkillLevel(val)
  })

  // $("#test").on('click', () => {
  //   const fen = "8/1P6/3N4/8/8/3k4/r7/4KN2 w - - 0 1" // promotion
  //   game.load(fen)
  //   board.position(game.fen())
  //   playerMoves.newMoves()
  // })

})
