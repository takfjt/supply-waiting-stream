const assert = require('assert');
const SupplyWaitingStream = require('../index');
const es = require('event-stream');

describe('SupplyWaitingStream', function () {
  it('synchronous', function (done) {
    class Test extends SupplyWaitingStream {
      constructor() {
        super();
        this._a = [1,2,3,4,5];
      }
      _requestSupply() {
        if (this._a.length === 0) {
          return false;
        }
        this._stock.push(this._a.shift().toString());
        this._next();
        return true;
      }
    }
    let t = new Test();
    let r = [];
    t.pipe(es.map((data) => {
      r.push(data);
    }));
    t.on('end', () => {
      assert.deepStrictEqual(Buffer.concat(r), new Buffer('12345'));
      done();
    });
  });
  it('asynchronous', function (done) {
    class Test extends SupplyWaitingStream {
      constructor() {
        super();
        this._a = [1,2,3,4,5];
      }
      _requestSupply() {
        if (this._a.length === 0) {
          return false;
        }
        this._waiting = true;
        setTimeout(() => {
          this._stock.push(this._a.shift().toString());
          this._waiting = false;
          this._next();
        }, 200);
        return true;
      }
    }
    let t = new Test();
    let r = [];
    t.pipe(es.map((data) => {
      r.push(data);
    }));
    t.on('end', () => {
      assert.deepStrictEqual(Buffer.concat(r), new Buffer('12345'));
      done();
    });
  });
});
