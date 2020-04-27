"use strict";

const whiteSquareBg = '#00a900'
const blackSquareBg = '#006900'
const hiClass = 'highlight2-9c5d2'
var selectableItems;
var selectItemsIdx = 0;

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
 
function canGame() {
    return "getGamepads" in navigator;
}

function checkGamepad() {
  var gp = navigator.getGamepads()[0];
  var axeLR = gp.axes[0];
  var axeUD = gp.axes[1];
  if(axeUD < -0.5) {
    //up
    if(selectableItems[selectItemsIdx].localName == "button") {
      $(selectableItems[selectItemsIdx]).click()
    } else if(selectableItems[selectItemsIdx].localName == "a"){
      window.location.href = selectableItems[selectItemsIdx].href
    } else {
      console.log('select')
      $(selectableItems[selectItemsIdx]).select()
    }
  } else if(axeUD > 0.5) {
    //down
    var y = $(window).scrollTop();
    $(window).scrollTop(y+50); 
  }
  
  if(selectableItems[selectItemsIdx].localName == "button") {
    $(selectableItems[selectItemsIdx]).css("background-color", "")
  } else {
    $(selectableItems[selectItemsIdx]).css("border", "none")
  }

  if(axeLR < -0.5) {
    if(selectItemsIdx == 0) {
      selectItemsIdx = selectableItems.length - 1
    } else {
      selectItemsIdx--
    }
  } else if(axeLR > 0.5) {
    if(selectItemsIdx == selectableItems.length - 1) {
      selectItemsIdx = 0
    } else {
      selectItemsIdx++
    }
  }

  if(selectableItems[selectItemsIdx].localName == "button") {
    $(selectableItems[selectItemsIdx]).css("background-color", "yellow")
  } else {
    $(selectableItems[selectItemsIdx]).css("border", "0.5rem solid yellow")
  }
}

$(document).ready(() => {
  var hasGP = false;
  var gp;
  selectableItems = document.getElementsByTagName("BODY")[0].querySelectorAll("button, a, select")
  if(canGame()) {

    $(window).on("gamepadconnected", function() {
        hasGP = true;
        console.log("connection event");
        gp = window.setInterval(checkGamepad,150);
    });

    $(window).on("gamepaddisconnected", function() {
        console.log("disconnection event");
        window.clearInterval(gp)
    });

    //setup an interval for Chrome
    var checkGP = window.setInterval(function() {
        if(navigator.getGamepads()[0]) {
            if(!hasGP) $(window).trigger("gamepadconnected");
            window.clearInterval(checkGP);
        }
    }, 500);
  }

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
      engine.search(5000, 10)
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
