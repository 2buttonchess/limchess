"use strict";

class Engine {

  constructor(callback) {
    const wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
    const stockfish = new Worker(wasmSupported ? 'js/stockfish.wasm.js' : 'js/stockfish.js');
    this.sf = stockfish
    this.sf.addEventListener('message', callback)
    this.tell('uci'); // uci initialization
  }

  newgame() {
    this.tell('ucinewgame')
  }

  position(fen) {
    this.tell(`position fen ${fen}`)
  }

  search(maxtimeMS, depth) {
    this.tell(`go movetime ${maxtimeMS} depth ${depth}`)
  }

  setSkillLevel(skill) {
    this.tell(`setoption name Skill Level value ${skill}`)
  }

  tell(msg) {
    this.sf.postMessage(msg)
  }

}
