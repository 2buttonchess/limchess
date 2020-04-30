# limchess

[![This project is considered experimental](https://img.shields.io/badge/status-experimental-critical.svg)](https://benknoble.github.io/status/experimental/)

Limited input assisted chess for the web

Play at
[https://benknoble.github.io/limchess](https://github.com/benknoble/limchess)!

Built by [@benknoble](https://github.com/benknoble) and
[@zlintz14](https://github.com/zlintz14) for
[@gbishop](https://github.com/gbishop)'s Comp 580: Enabling Technology class.

## About

### Goal

A prototype of limited input assisted chess for the web.

We wanted to build a game of chess that could be played with only two buttons,
had a functional AI to beat, and assisted the player in making moves by limiting
the available options.

### Motivation

Tasked with building a project for the 2020 Maze Day (which met the same fate as
many other Spring 2020 events, in light of the COVID-19 epidemic), we decided to
bring chess to the world of limited-mobility players.

Imagine trying to make the first moves in a game of chess when your muscles are
spastic or only controllable with difficulty. A natural step is voice-playable
chess&mdash;given the time and resource constraints, we felt this was beyond the
scope of our project. Instead, we opted for a 2-button accessible game player,
since 2-buttons is a common input device for people with cerebral palsy or other
motor disorders. One button to choose a move and another to confirm the
selection. Theoretically, this is all one needs to play chess&mdash;and the web
makes a perfect candidate for the prototype.

In addition, we felt that the number of possible moves in chess can be
overwhelming to new players and presents yet another degree of freedom. In an
attempt to give more freedom by constraining the available options, we decided
to gives players the ability to limit how many moves from which to choose.
Advanced players can opt for all moves to be a part of the repertoire, while
newer players might be happy with only a few. This allows them to focus on the
fun of playing the game and worry less about making the best moves. In order to
be fair, we wished to present the player with a choice of good, bad, and average
moves, based on an AI evaluation (not yet implemented). This being difficult, we
opted to present feedback to the player on whether a move was good or bad.

Name inspired in part by [lichess](https://lichess.org).

## Tech

- [chess.js](https://github.com/jhlywa/chess.js) ([BSD-2](./LICENSE-chess.js)):
  `js/chess.js`
- [chessboard.js](https://chessboardjs.com) ([MIT](./LICENSE-chessboard.js)):
  `js/chessboard-1.0.0.*`,
  `img/chesspieces/*`, `css/chessboard-1.0.0.*`
  - depends on [jquery](https://jquery.com) ([MIT](./LICENSE-jquery.js)):
    `js/jquery-3.4.1.min.js`
- [stockfish.js](https://github.com/niklasf/stockfish.js)
  ([GPL](https://github.com/niklasf/stockfish.js/Copying.txt)): `js/stockfish.*`

## Local development

You'll need to spin up a `localhost` server to serve the content if you want to
view the webpage.

A sh script that automatically chooses the correct python server to run is
provided in `local-server`.
