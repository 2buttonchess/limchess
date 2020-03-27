"use strict";

class Engine {

  constructor() {
    const wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
    const stockfish = new Worker(wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js');
    this.sf = stockfish
    this.sf.addEventListener('message', this.engine_callback);
    this.sf.postMessage('uci'); // uci initialization
  }

  engine_callback(e) {
    console.log(e.data);
  }

}
