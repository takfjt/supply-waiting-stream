const stream = require('stream');

class SupplyWaitingStream extends stream.Readable {
  constructor() {
    super();
    this._stock = [];
    this._waiting = false;
    this._forcast = 0;
    this._finished = false;
  }
  _requestSupply() {
    return false;
  }

  _next() {
    if (this._stock.length <= this._forcast && !this._waiting && !this._finished) {
      if (!this._requestSupply()) {
        this._finished = true;;
      }
    }
    if (this._stock.length === 0) {
      if (!this._waiting && this._finished) {
        this.push(null); // finish
      }
    } else {
      let a = this._stock.shift();
      if (this.push(a)) {
        process.nextTick(() => {
         // this._next();
        });
      }
    }
  }
  _read(size) {
    this._next();
  }
}

module.exports = SupplyWaitingStream;
