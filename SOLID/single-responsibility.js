const fs = require("fs");
// The main roles of journal is to add and remove entries.
class Journal {
  constructor() {
    this.entries = {};
  }

  addEntry(text) {
    let c = ++Journal.count;
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
  //Imagine you further extend Journal to save journal, load journal etc etc.
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

  //Why we avoid adding extra stuffs to Journal ?
  //Suppose you have few behavious specific to serialization
}
Journal.count = 0;

class PersistenceManager {
  preprocess(j) {
    //
  }

  saveToFile(journal, filename) {
    fs.writeFileSync(filename, journal.toString());
  }
}

let j = new Journal();
j.addEntry("I cried today.");
j.addEntry("I ate a bug.");
console.log(j.toString());

let p = new PersistenceManager();
let filename = "c:/temp/journal.txt";
p.saveToFile(j, filename);

// separation of concerns
//Avoid God object - A single object or class that has a lot lot of methods and properties
