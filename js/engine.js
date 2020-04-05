"use strict";

class Engine {

  constructor() {
    const wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
    const stockfish = new Worker(wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js');
    this.sf = stockfish
    this.sf.onmessage = uci_callback(this);
    this.tell('uci'); // uci initialization
    this.tell('ucinewgame');
    this.isready = false;
    this.ping();
  }

  tell(msg) {
    this.sf.postMessage(msg)
  }

  ping() {
    this.tell('isready');
  }

}

const uci_callback = obj =>
  e => {
    if (e.data === "uciok") {
      obj.uciok = true;
      console.log("uciok")
    }
  }

const regular_callback = obj =>
  e => {
    console.log(e.data);
    if (e.data === 'readyok') {
      obj.isready = true;
    }
  }
