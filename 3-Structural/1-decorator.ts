/**
 * The Decorator Design Pattern is a structural design pattern that allows behavior to be added to individual objects dynamically, 
    without affecting the behavior of other objects from the same class. 
 * It involves creating a set of decorator classes that are used to wrap concrete components.
 * This pattern is useful when you need to add functionality to objects in a flexible and reusable way.
 * This pattern is vital for enhancing functionality while adhering to the open-closed principle.
 * 
 * Refer to Ipad notes for more
 */

interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost(): number {
    return 1;
  }

  description(): string {
    return "Simple coffee";
  }
}

abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  abstract cost(): number;
  abstract description(): string;
}

class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.5;
  }

  description(): string {
    return this.coffee.description() + ", milk";
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.2;
  }

  description(): string {
    return this.coffee.description() + ", sugar";
  }
}

class WhippedCreamDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.7;
  }

  description(): string {
    return this.coffee.description() + ", whipped cream";
  }
}

class CaramelDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.6;
  }

  description(): string {
    return this.coffee.description() + ", caramel";
  }
}

let coffee: Coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhippedCreamDecorator(coffee);
coffee = new CaramelDecorator(coffee);

console.log(`Cost: $${coffee.cost()}`); // Outputs: Cost: $3.0
console.log(`Description: ${coffee.description()}`); // Outputs: Description: Simple coffee, milk, sugar, whipped cream, caramel
