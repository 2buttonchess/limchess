$(document).ready(() => {
  const board = Chessboard('board', 'start');
  const game = new Chess();
  console.log(game.moves({verbose: true}));
})
