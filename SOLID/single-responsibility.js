/**
 * As the name suggests, the Single Responsibility principle states 2 key principles:
    -> The class or method should have only one reason to change
    -> The class or method should have only one responsibility to take care of.
 */

const fs = require("fs");
// The main roles of posts is to add and remove entries.
class Posts {
  constructor() {
    this.entries = {};
  }

  addEntry(text) {
    let c = ++Posts.count;
    let entry = `${c}: ${text}`;
    this.entries[c] = entry;
    return c;
  }

  removeEntry(index) {
    delete this.entries[index];
  }

  toString() {
    return Object.values(this.entries).join("\n");
  }
  //Imagine you further extend Posts to save journal, load journal etc etc.
  //This violates Single Responsibilty Principle
  // save(filename)
  // {
  //   fs.writeFileSync(filename, this.toString());
  // }
  //
  // load(filename)
  // {
  //   //
  // }
  //
  // loadFromUrl(url)
  // {
  //   //
  // }

  //Why we avoid adding extra stuffs to Posts ?
  //Suppose you have few behavious specific to serialization
}
Posts.count = 0;

class PersistenceManager {
  preprocess(j) {
    //
  }

  saveToFile(journal, filename) {
    fs.writeFileSync(filename, journal.toString());
  }
}

let j = new Posts();
j.addEntry("I cried today.");
j.addEntry("I ate a bug.");
console.log(j.toString());

let p = new PersistenceManager();
let filename = "c:/temp/journal.txt";
p.saveToFile(j, filename);

// separation of concerns
// Avoid God object - A single object or class that has a lot lot of methods and properties
