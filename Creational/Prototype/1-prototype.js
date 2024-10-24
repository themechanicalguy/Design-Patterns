/**
 * A Prototype method is a javascript design pattern where objects share a common prototype, which contains shared method.
 * In JavaScript all objects are linked to a prototye.
 * The Prototype Basically contains all the methods and properties that are accessible to all the objects linked to that prototype.
 * Object inherit properties and method from prototype, that it is linked to.
 * Ex: const num = [1, 2, 3];
       num.map((v) => v * 2);
  -> here in array num, we are able to use map() because Array.prototype has a map method and all arrays created have access to it.
  -> since array.prototype is the prototype of num array so methods are delegated to nums array(object).
  -> the map method is not defined in num array itself but on its prototype(Array.prototye)


    Advantages: -

    -> Efficient Object Creation: Objects can be created by copying existing ones, saving time and memory.
    -> Dynamic Updates: Changes made to a prototype are reflected in all instances, allowing for dynamic updates.
    -> Code Reusability: Multiple objects can share the same prototype, reducing code duplication.
    -> Easy Object Initialization: Objects can be initialized without specifying all properties and methods during creation.
    -> Structured Development: Encourages a structured approach to object creation and inheritance, promoting best coding practices.

    Disadvantages:

    -> Complexity: Managing and updating prototypes and their relationships can become complex as the application grows.
    -> Confusion: If not implemented carefully, it can lead to confusion and unintended consequences when modifying prototypes.
    -> Potential for Overwriting: Modifying the prototype can unintentionally affect all instances, causing unexpected behaviour.
    -> Performance Overhead: Cloning objects from prototypes can introduce some performance overhead, especially when dealing with deeply nested structures.
    -> Limited Privacy: Prototypes do not provide the same level of data encapsulation and privacy as some other design patterns, potentially exposing object properties and methods unintentionally.
 


 */

// 1- Create an Object using Constructor Function! ----------------------------------

const Person = function (firstName, birthYear) {
  // Instance properties
  this.firstName = firstName;
  this.birthYear = birthYear;
  // Never to this! - Never create a method inside constructor function
  //   Because if we create 1000 Person object, then each object would be having a copy of calcAge method.
  // this.calcAge = function () {
  //   console.log(2037 - this.birthYear);
  // };
};

const saurav = new Person("Saurav", 1996);
const venkat = new Person("Venkat", 1999);

// 2 - Attach a method to above created Prototype!----------------------------------------
Person.prototype.calcAge = function () {
  console.log(2022 - this.birthYear);
};

//3 - Add a new property to the Prototype Person! -----------------------------------------------
Person.prototype.species = "Homo Sapiens";
console.log(venkat.species, saurav.species);

//4 - Predict the output -----------------------------------------------------------------------
console.log(saurav.__proto__ === Person.prototype); //true
console.log(Person.prototype.isPrototypeOf(venkat)); //true
console.log(Person.prototype.isPrototypeOf(saurav)); //true
console.log(Person.prototype.isPrototypeOf(Person)); //false
console.log(jonas.hasOwnProperty(firstName)); //true
console.log(jonas.hasOwnProperty(species)); //false

//5 - Write the same using ES6 classes ! -------------------------------------------------------------
class PersonCl {
  constructor(firstName, birthYear) {
    this.firstName = firstName;
    this.birthYear = birthYear;
  }
  //   Methods will be added to prototype property
  calcAge() {
    console.log(2022 - this.birthYear);
  }
  greet() {
    console.log(`Hey ${this.firstName}`);
  }
}

const saurav1 = new PersonCl("SauravR", 1990);

//6- Predict the output ----------------------------------------------------------
console.log(PersonCl === PersonCl.prototype.constructor); //true

//7- Predict the output ------------------------------------------------------------------------------
function makeClass(phrase) {
  // declare a class and return it
  return class {
    sayHi() {
      alert(phrase);
    }
  };
}
// Create a new class
let User = makeClass("Hello");
new User().sayHi(); // Hello
