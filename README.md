# limchess

[![This project is considered experimental](https://img.shields.io/badge/status-experimental-critical.svg)](https://benknoble.github.io/status/experimental/)

Limited input assisted chess for the web

Built by [@benknoble](https://github.com/benknoble) and
[@zlintz14](https://github.com/zlintz14) for
[@gbishop](https://github.com/gbishop)'s Comp 580: Enabling Technology class.

## Components

We make use of [stockfish.js](https://github.com/niklasf/stockfish.js), a
JS/WASM port of the stockfish engine (the original is covered under the GPL; see
[stockfish.js/Copying.txt](https://github.com/niklasf/stockfish.js/Copying.txt)

## Local development

You'll need to spin up a `localhost` server to serve the content if you want to
view the webpage.

A sh script that automatically chooses the correct python server to run is
provided in `local-server`.
