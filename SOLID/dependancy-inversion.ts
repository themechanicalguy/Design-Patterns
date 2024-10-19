//Depend upon abstractions, not concretions
// Classes should depend on interfaces rather than concrete classes

/*
In our applications we can differentiate between two types of classes:

-> Low level classes which do operations like reading from a database or saving a file.
-> High level classes which implement the business logic and use those low level classes.

This principle proposes is that high level classes depend on interfaces instead of concrete 
implementations. 

*/

//Bad example - we have the OrderService class that saves orders in a database.
// The OrderService class depends directly on the low level class MySQLDatabase.

type Order = {
  id: number;
};

class OrderService {
  database: MySQLDatabase;

  // constructor

  save(order: Order): void {
    if (order.id === undefined) {
      this.database.insert(order);
    } else {
      this.database.update(order);
    }
  }
}

class MySQLDatabase {
  insert(order: Order) {
    // insert
  }

  update(order: Order) {
    // update
  }
}

//If in the future we wanted to change the database that we are using we would
//have to modify the OrderService class

// --------------- Improvised Exmaple

//We can improve this by creating an interface and make the OrderServiceN class dependant of it.
//This way, we are inverting the dependency.
//Now the high level class depends on an abstraction instead of a low level class.

class OrderServiceN {
  database: Database;

  // constructor

  save(order: Order): void {
    this.database.save(order);
  }
}

interface Database {
  save(order: Order): void;
}

class MySQLDatabaseS implements Database {
  save(order: Order) {
    if (order.id === undefined) {
      // insert
    } else {
      // update
    }
  }
}

//Now we can add new databases without modifying the OrderService class.
