# limchess

[![This project is considered experimental](https://img.shields.io/badge/status-experimental-critical.svg)](https://benknoble.github.io/status/experimental/)

Limited input assisted chess for the web

Built by [@benknoble](https://github.com/benknoble) and
[@zlintz14](https://github.com/zlintz14) for
[@gbishop](https://github.com/gbishop)'s Comp 580: Enabling Technology class.

## Tech

- [chess.js](https://github.com/jhlywa/chess.js) [BSD-2](./LICENSE-chess.js):
  `js/chess.js`
- [chessboard.js](https://chessboardjs.com) [MIT](./LICENSE-chessboard.js):
  `js/chessboard-1.0.0.*`,
  `img/chesspieces/*`, `css/chessboard-1.0.0.*`
  - depends on [jquery](https://jquery.com): `js/jquery-3.4.1.min.js`

## Local development

You'll need to spin up a `localhost` server to serve the content if you want to
view the webpage.

A sh script that automatically chooses the correct python server to run is
provided in `local-server`.
