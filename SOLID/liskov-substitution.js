/*

-> When extending a class, remember that you should be able to pass objects of 
the subclass in place of objects of the parent class without breaking the 
client code.

  Ex - If class B is subclass of Class A, then we should be able to replace object of A 
  with B without breaking the behaviour of the program

-> Subclass should extend the capability of parent class not narrow it down.

-> The goal of this principle is that subclasses remain compatible with the 
  behavior of the parent class. Subclasses should extend the behavior of the 
  parent class and not replace it by something different.

-> If you follow this principle you will be able to replace a parent class 
  by any of its subclasses without breaking the client code.

-> Imagine that we have an application that accepts orders. 
  There are two possible states for an order: draft or confirmed. 
  If an order was not confirmed, it cannot be payed.
*/

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

  set width(value) {
    this._width = this._height = value;
  }

  set height(value) {
    this._width = this._height = value;
  }
}

let rcI = new Rectangle(2, 3);
console.log(rcI.toString()); //2*3
let sq1 = new Square(5);
console.log(sq1.toString()); //5*5
sq1.width = 10;
console.log(sq1.toString()); //10*5

//------After--LSP states that as below functions take a rectrangle, so it must also take a square
// which is extended from square

//Revise Again - Oct 18 2024
