"use strict";

const whiteSquareBg = '#9340FF'
const blackSquareBg = '#5601C3'

function removeColorOnSquares () {
  $('#board .square-55d63').css('background', '')
}

function colorSquare (square) {
  const $square = $('#board .square-' + square)

  const background =
    $square.hasClass('black-3c85d')
    ? blackSquareBg
    : whiteSquareBg

  $square.css('background', background)
}

const lan = move => `${move.from}${move.to}`

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
    } else if (this.currentMove.flags.includes('k')
            || this.currentMove.flags.includes('q')) {
      $("#status").css('visibility', 'visible').find("p").html("Castle!");
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
    //all
    if (numMoves == 11) return moves
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
  selectableItems = document.getElementsByTagName("BODY")[0].querySelectorAll("button, a, input")
  let playerSide = 'white'
  let lastEval = 0
  const game = new Chess()
  const config = {
    position: 'start',
    showErrors: 'console',
  }
  const board = Chessboard('board', config)
  const playerMoves = new PlayerMoves(game, () => $("#numberMoves").val())
  playerMoves.highlightMove()

  const makeMove = makeMoveMaker(game, board)

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
      engine.search(5000, 10)
    }, 300)
  }

  const handleBestMove = bm => {
    isThinking = false
    makeMove(bm)
    $("#status").css('visibility', 'hidden');
    if (game.game_over()) handleGameOver()
    else prepPlayerTurn()
  }

  const engine = new Engine(e => {
    console.log(`ai: ${e.data}`);
    const words = e.data.split(' ')
    if (words[0] === 'bestmove')
      handleBestMove(words[1])
  });
  engine.setSkillLevel(10)

  const updateEvaluation = ev => {
    $("#feedback").find("p").html(ev)
  }

  const playerEv = new Engine(e => {
    console.log(`playerEv: ${e.data}`);
    const words = e.data.split(' ')
    if (words[0] === 'info') {
      // words[8] may be 'cp' for centipawn or 'mate' for mate in X moves
      const evaluation = words[9]
      const score = parseInt(evaluation)
      const good = (playerSide === 'white' && score >= lastEval)
                || (playerSide === 'black' && score <= lastEval);
      // console.warn(`debug: ${evaluation} ${score} ${good}`)
      updateEvaluation(good ? "Great move!" : "Bad move!")
      lastEval = score
    }
  });

  const newgame = side => {
    playerSide = side
    lastEval = 0
    $("#status").css('visibility', 'hidden');
    $("#feedback").find("p").html("")
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
    const move = playerMoves.currentMove
    playerEv.position(game.fen())
    playerEv.evaluateMove(500, 1, lan(move))
    isThinking = true
    makeMove(move)
    doCpuMove(engine)
    $("#cycleMoveBtn").focus()
  })

  $("#newMovesBtn").on('click', () => playerMoves.newMoves())

  $("#numberMoves").on('input', () => {
    const val = $("#numberMoves").val()
    //  console.log(val)
    if(val == 11) {
      $("output[for=number]").html("&ensp;all&emsp;")
    } else {
      $("output[for=number]").html("&ensp;" + val + "&emsp;")
    }
    playerMoves.newMoves()
  })

  $("#difficultySlider").on('input', () => {
    const val = $("#difficultySlider").val()
    //  console.log(val)
    $("output[for=difficulty]").html("&ensp;" + val + "&emsp;")
    engine.setSkillLevel(val)
  })

  // $("#test").on('click', () => {
  //   const fen = "8/1P6/3N4/8/8/3k4/r7/4KN2 w - - 0 1" // promotion
  //   game.load(fen)
  //   board.position(game.fen())
  //   playerMoves.newMoves()
  // })

  $("#numberMoves").on('focusin', () => $('#numberMovesContainer').css('background-color', 'yellow'))
  $("#numberMoves").on('focusout', () => $('#numberMovesContainer').css('background-color', ''))
  $("#difficultySlider").on('focusin', () => $('#difficultyContainer').css('background-color', 'yellow'))
  $("#difficultySlider").on('focusout', () => $('#difficultyContainer').css('background-color', ''))

})
