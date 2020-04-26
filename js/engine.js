"use strict";

class Engine {

  constructor() {
    const wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
    const stockfish = new Worker(wasmSupported ? 'js/stockfish.wasm.js' : 'js/stockfish.js');
    this.sf = stockfish
    this.sf.addEventListener('message', this.engine_callback);
    this.tell('uci'); // uci initialization
  }

  tell(msg) {
    this.sf.postMessage(msg)
  }

  engine_callback(e) {
    console.log(e.data);
  }

}
