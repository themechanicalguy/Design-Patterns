# Interface Segregation Principle (ISP) in SOLID

The **Interface Segregation Principle (ISP)** states that `do not force any client to implement an interface which is irrelevant to them`.
In other words, it's better to have many small, specific interfaces than one large, general-purpose interface.

Real life analogy-

- Suppose if you enter a restaurant and you are pure vegetarian.
- The waiter in that restaurant gave you the menu card which includes vegetarian items,
  non-vegetarian items, drinks, and sweets.

## Key Idea

Interface should be defined in such a way that,Clients shouldn’t be forced to depend on methods they do not use.

Instead of having one "fat" interface with many methods, we should break it down into smaller, more focused interfaces so that classes only need to implement the methods they actually need.

- The idea behind this principle is that it is better to have smaller and more specific interfaces rather than a big interface.
- If we had just one interface that covered a lot of features, clients of that interface would have to implement behavior that they didn't need.
- Instead, if we have smaller interfaces, clients can implement just the needed behavior.
- Another advantage is that when we update an interface, the changes will affect less clients, so there is less risk of breaking the code.
- Remember that a class can implement multiple interfaces, so there is no need to include everything in just one interface.

## TypeScript Example

### Violation of ISP

```typescript
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class HumanWorker implements Worker {
  work() {
    console.log("Human working");
  }
  eat() {
    console.log("Human eating");
  }
  sleep() {
    console.log("Human sleeping");
  }
}

class RobotWorker implements Worker {
  work() {
    console.log("Robot working");
  }
  eat() {
    /* Robots don't eat! */ throw new Error("Not implemented");
  }
  sleep() {
    /* Robots don't sleep! */ throw new Error("Not implemented");
  }
}
//Example 2
interface Animal {
  walk(): void;
  fly(): void;
}

class Dog implements Animal {
  walk() {
    console.log("Walking");
  }

  fly() {
    throw new Error("Dogs cannot fly");
  }
}

class Duck implements Animal {
  walk() {
    console.log("Walking");
  }

  fly() {
    console.log("Flying");
  }
}
```

Here, `RobotWorker` is forced to implement `eat()` and `sleep()` methods it doesn't need, violating ISP.

### Following ISP

```typescript
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class HumanWorker implements Workable, Eatable, Sleepable {
  work() {
    console.log("Human working");
  }
  eat() {
    console.log("Human eating");
  }
  sleep() {
    console.log("Human sleeping");
  }
}

class RobotWorker implements Workable {
  work() {
    console.log("Robot working");
  }
}

// Example 2 Later ----After
interface AnimalCanWalk {
  walk(): void;
}

interface AnimalCanFly {
  fly(): void;
}

class Dog2 implements AnimalCanWalk {
  walk() {
    console.log("Walking");
  }
}

class Duck2 implements AnimalCanWalk, AnimalCanFly {
  walk() {
    console.log("Walking");
  }

  fly() {
    console.log("Flying");
  }
}
```

Now, each class only implements the interfaces it needs.

## Use Cases

1. **Plugin architectures**: Where different plugins provide different capabilities
2. **Multi-role systems**: Where objects can have different roles with different behaviors
3. **Large codebases**: To prevent "interface pollution" where interfaces become too large

## Advantages

1. **Reduces coupling**: Classes only depend on methods they actually use
2. **Improves readability**: Smaller interfaces are easier to understand
3. **Increases flexibility**: Easier to add new functionality without affecting existing code
4. **Better maintainability**: Changes to one interface don't affect unrelated classes

## Disadvantages

1. **Increased number of interfaces**: Can lead to more files and more complex structure
2. **Initial design overhead**: Requires more upfront thought about interface design
3. **Potential over-engineering**: For simple systems, might be unnecessary

## Real-world TypeScript Example

```typescript
// Before ISP
interface Printer {
  print(): void;
  scan(): void;
  fax(): void;
}

class BasicPrinter implements Printer {
  print() {
    /* implementation */
  }
  scan() {
    throw new Error("Scan not supported");
  }
  fax() {
    throw new Error("Fax not supported");
  }
}

// After ISP
interface Printer {
  print(): void;
}

interface Scanner {
  scan(): void;
}

interface FaxMachine {
  fax(): void;
}

class BasicPrinter implements Printer {
  print() {
    /* implementation */
  }
}

class AllInOnePrinter implements Printer, Scanner, FaxMachine {
  print() {
    /* implementation */
  }
  scan() {
    /* implementation */
  }
  fax() {
    /* implementation */
  }
}
```

This approach allows each class to implement only the capabilities it actually provides.
