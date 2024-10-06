class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  set width(value) {
    this._width = value;
  }
  set height(value) {
    this._height = value;
  }

  get area() {
    return this._width * this._height;
  }

  toString() {
    return `${this._width}×${this._height}`;
  }
}

class Square extends Rectangle {
  constructor(size) {
    super(size, size);
  }

  ////-----After-----

  // set width(value) {
  //   this._width = this._height = value;
  // }

  // set height(value) {
  //   this._width = this._height = value;
  // }
}

let rcI = new Rectangle(2, 3);
console.log(rcI.toString()); //2*3
let sq1 = new Square(5);
console.log(sq1.toString()); //5*5
sq1.width = 10;
console.log(sq1.toString()); //10*5

//------After--LSP states that as below functions take a rectrangle, so it must also take a square
// which is extended from square
let useIt = function (rc) {
  let width = rc._width;
  rc.height = 10;
  console.log(`Expected area of ${10 * width}, ` + `got ${rc.area}`);
};

let rc = new Rectangle(2, 3);
useIt(rc);

let sq = new Square(5);
useIt(sq);
