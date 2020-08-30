# limchess

Limited-input chess for the web

Zak Lintz and Ben Knoble

Inspired in part by [lichess][].

[lichess]: https://lichess.org

[Demo](https://youtu.be/kLtK9YxcZKA)

## Description

limchess brings the beautiful world of chess to the web by using the accessible
principles of limited input and limited degrees of freedom.

limchess pits the player against a variable-difficulty chess AI in the world's
greatest game. The player picks moves from a list of optionally-limited possible
moves using only two buttons, two switches, or a joystick; the player then
receives feedback on the quality of the move and finally is met with the chess
AI's move. Players control the difficulty of the AI and the number of moves
presented as choices with two sliders (also drivable via switch inputs). In
order to keep the game appealing to stronger chess players, we permit the full
range of AI difficulties, and we permit the player to "unlimit" the possible
move choices (allowing the player to play any valid chess move). Players may
also get a new list of choices if they wish, and they may start a new game as
either side at any time. limchess also appeals to players learning the game by
- annotating moves as good or bad,
- limiting the number of choices a new player has to consider, and
- annotating the current position when certain rules trigger (such as check or
  promotions)

Ultimately, limchess brings a complete (though not necessarily featureful) game
of chess to the accessible web.

## Audience

Our primary audience is people with motor impairments. Secondary factors include
- age (particularly scholastic-aged children) and
- chess skill (beginners and advanced players alike, with a special eye towards
  people learning the game)

Imagine trying to make the first moves in a game of chess when your muscles are
spastic or only controllable with difficulty. A natural step is voice-playable
chess&mdash;given the time and resource constraints, we felt this was beyond the
scope of our project. Instead, we opted for a 2-button accessible game player,
since 2-buttons is a common input device for people with cerebral palsy or other
motor disorders. One button chooses a move and another confirms the selection.
Theoretically, this is all one needs to play chess, and the web makes a perfect
candidate for the prototype.

In addition, we felt that the number of possible moves in chess can be
overwhelming to new players and presents yet another degree of freedom. In an
attempt to give more freedom by constraining the available options, we decided
to gives players the ability to limit how many moves from which to choose.
Advanced players can opt for all moves to be a part of the repertoire, while
newer players might be happy with only a few. This allows them to focus on the
fun of playing the game and worry less about making the best moves. In order to
be fair, we wished to present the player with a choice of good, bad, and average
moves, based on an AI evaluation. This being difficult, we opted instead to
present feedback to the player on whether a move was good or bad.

## Technologies, frameworks, libraries

limchess is a website and so leans directly on the technology of the web (HTML,
CSS, and JavaScript). It also makes heavy use of [jquery][] to simplify
cross-browser differences and aid development. It makes use of the [Gamepad
API][] to enable alternative input sources.

[jquery]: https://jquery.com
[Gamepad API]: https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API

We made use of 3 primary libraries in our webgame:

- [chess.js][] provides a chess rules-engine that backs the web-facing game.
  It is responsible for deciding whose move it is, which moves are valid, and
  when the game is won, lost, or drawn based on the current moves. It includes
  castling, en-passant, promotions, and many other chess complexities.
- [chessboard.js][] provides a web-facing (HTML) board that is manipulable via
  JavaScript functions. When tied in with chess.js, it becomes a fully
  functional and programmable virtual chessboard. It is primarily responsible
  for displaying the game to players.
- [stockfish.js][] provides an implementation of the infamous [Stockfish][]
  chess AI and engine for the web (the same engine used by lichess!). While
  Stockfish itself has many functions, its primary responsibility in limchess is
  to control the AI opponent and to evaluate the players moves. We do this with
  two separate instances of the engine, each of which runs in a [web worker][]
  (a background thread that receives messages via a function call and responds
  via asynchronous callbacks). Stockfish itself implements the [UCI][]
  chess-engine interface to standardize the messages being sent and received. A
  sample UCI transcript is provided below:


```
GUI     engine

// tell the engine to switch to UCI mode
uci

// engine identify  
      id name Shredder
                id author Stefan MK

// engine sends the options it can change
// the engine can change the hash size from 1 to 128 MB
                option name Hash type spin default 1 min 1 max 128

// the engine supports Nalimov endgame tablebases
                option name NalimovPath type string default 
                option name NalimovCache type spin default 1 min 1 max 32

// the engine can switch off Nullmove and set the playing style
           option name Nullmove type check default true
                option name Style type combo default Normal var Solid var Normal var Risky

// the engine has sent all parameters and is ready
                uciok

// Note: here the GUI can already send a "quit" command if it just wants to find out
//       details about the engine, so the engine should not initialize its internal
//       parameters before here.
// now the GUI sets some values in the engine
// set hash to 32 MB
setoption name Hash value 32

// init tbs
setoption name NalimovCache value 1
setoption name NalimovPath value d:\tb;c\tb

// waiting for the engine to finish initializing
// this command and the answer is required here!
isready

// engine has finished setting up the internal values
                readyok

// now we are ready to go

// if the GUI is supporting it, tell the engine that is is
// searching on a game that is hasn't searched on before
ucinewgame

// if the engine supports the "UCI_AnalyseMode" option and the next search is supposted to
// be an analysis, the GUI should set "UCI_AnalyseMode" to true if it is currently
// set to false with this engine
setoption name UCI_AnalyseMode value true

// tell the engine to search infinite from the start position after 1.e4 e5
position startpos moves e2e4 e7e5
go infinite

// the engine starts sending infos about the search to the GUI
// (only some examples are given)


                info depth 1 seldepth 0
                info score cp 13  depth 1 nodes 13 time 15 pv f1b5 
                info depth 2 seldepth 2
                info nps 15937
                info score cp 14  depth 2 nodes 255 time 15 pv f1c4 f8c5 
                info depth 2 seldepth 7 nodes 255
                info depth 3 seldepth 7
                info nps 26437
                info score cp 20  depth 3 nodes 423 time 15 pv f1c4 g8f6 b1c3 
                info nps 41562
                ....


// here the user has seen enough and asks to stop the searching
stop

// the engine has finished searching and is sending the bestmove command
// which is needed for every "go" command sent to tell the GUI
// that the engine is ready again
                bestmove g1f3 ponder d8f6
```

[chess.js]: https://github.com/jhlywa/chess.js
[chessboard.js]: https://chessboardjs.com
[stockfish.js]: https://github.com/niklasf/stockfish.js
[Stockfish]: https://github.com/niklasf/stockfish.js
[web worker]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
[UCI]: https://github.com/niklasf/stockfish.js

## Build and Deploy

No build is necessary; the repo comes with all the HTML, CSS, and JS files
necessary to serve a complete static website.

There are two ways to deploy the website: via GitHub Pages and manually.

### GitHub Pages

To deploy via GitHub Pages, create a repo with this source code (such as by
[forking][] it) and enable GitHub Pages on it.

[forking]: https://github.com/2buttonchess/limchess/fork

### To deploy manually

Copy at least the following files (preserving directory structures) to your
web-serving host. Static serving is enough for this site.

- index.html
- about.html
- help.html
- css/
- js/
- img/

You can run a local server using the sh script [./local-server](./local-server),
which will automatically choose the correct Python (2 or 3) HTTP server to run.

## Problems Encountered

We encountered at least 3 serious problems during the course of development:

1. Drop-downs created by the HTML element `<select>` are not easily accessible
   via either <kbd>Tab</kbd> and <kbd>Enter</kbd> combinations or Gamepad
   inputs. We solved this by converting to sliders (`<input type='range'>`) and
   manipulating them.
1. Communicating with web workers proved an exercise in thoughtful design. We
   originally shied away from using Stockfish for exactly this reason, as we
   were concerned about the additional complexity (even though we knew no
   non-neural-network engine is comparable to Stockfish in features and
   strength). Ultimately, the available JS-based chess engines proved too weak
   or slow to be of great use. We switched to stockfish.js and carefully
   designed the callbacks to extract the relevant information. We were
   fortunately able to constrain rather precisely the engine's thought-time and
   skill-level in order to achieve a realistic back-and-forth.
1. In the same vein, handling multiple responses of the same kind from a web
   worker proved beyond the scope of the project. Our ability to rate moves
   *before* presenting them to the player required us to be able to tag each
   possible move and thus to precisely identify which of many similar responses
   was related to which move. Further, each response is often several similar
   messages, with later messages giving more accurate evaluations. The quantity
   of information is generally useful, but in this case it was overwhelming to
   attempt to program asynchronously. We solved this by (1) rating moves after
   they have been played, so that we only have to identify one move's response,
   (2) by constraining the response of the network to only give one evaluation
   message. We sacrificed both an original feature and some accuracy in the
   adapted feature in order to implement a working prototype.

## Future Work

Future work could

- improve accessibility by incorporating audio input and output;
- integrate move-rating prior to player choice as a form of assisted learning
  and playing;
- develop the ability for 2 players to play a shared game together from
  different browsers or computers;
- test other alternative input devices for compatibility with the sites Gamepad
  API programming
- implement other alternative chess rules (bughouse/crazyhouse, chess960, and
  antichess being popular [variants][])

[variants]: https://lichess.org/variant
