# S.O.L.I.D Principles

SOLID is an acronym for five object-oriented design principles that help create more maintainable, flexible, and scalable software.

# 1. Single Responsibility Principle (SRP):

- The **Single Responsibility Principle** (SRP) is one of the five SOLID principles of object-oriented design, which aim to make software designs more understandable, flexible, and maintainable.
- **Single Responsibility Principle** states that a class should have only one reason to change, meaning it should have only one responsibility or job.
- This principle promotes high cohesion and low coupling in code, making it easier to maintain and extend.

**Key Idea**:

- Each class should _focus on a single task or concern_, such as handling business logic, data persistence, or user interface rendering.
- If a class does too many things, it becomes harder to test, maintain, and modify.

## Real-World Analogy

Think of a restaurant kitchen:

- **Without SRP**: One chef handles cooking, serving, and cleaning. If the menu changes, the chef’s workflow is disrupted, and they’re overwhelmed.

- **With SRP**: One chef cooks, a waiter serves, and a cleaner handles dishes. Each person focuses on their job, making the kitchen more efficient and adaptable.

## Use Case:

**Scenario:** Imagine you’re building an e-commerce application where you need to manage orders.

- An order might involve:

  1. Calculating the total price.
  2. Saving the order to a database.
  3. Sending a confirmation email to the customer.

**Without SRP**, you might create a single Order class that handles all these tasks.However, this violates SRP because the class has multiple responsibilities (price calculation, database operations, and email sending).

**Applying SRP**, you’d split these responsibilities into separate classes, each handling one task.

### Example: Violating SRP

```typescript
class Order {
  items: { name: string; price: number }[];

  constructor(items: { name: string; price: number }[]) {
    this.items = items;
  }

  // Responsibility 1: Calculate total price
  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  // Responsibility 2: Save order to database
  saveToDatabase(): void {
    console.log("Saving order to database:", this.items);
    // Simulate database save
  }

  // Responsibility 3: Send confirmation email
  sendConfirmationEmail(customerEmail: string): void {
    console.log(
      `Sending email to ${customerEmail} with order details:`,
      this.items
    );
    // Simulate email sending
  }
}

// Usage
const order = new Order([
  { name: "Laptop", price: 1000 },
  { name: "Mouse", price: 50 },
]);
order.calculateTotal(); // Output: 1050
order.saveToDatabase(); // Output: Saving order to database: [...]
order.sendConfirmationEmail("customer@example.com"); // Output: Sending email to customer@example.com with order details: [...]
```

**Problems in this example:**

- The `Order` class has three responsibilities: `calculating the total, saving to the database, and sending emails`.
- If the database logic changes (e.g., switching from SQL to NoSQL), the `Order` class must be modified.
- If the email service changes (e.g., switching providers), the `Order` class must be modified again.
- Testing the `Order` class is complex because you need to mock database and email services to test price calculations.
- The class is **tightly coupled to multiple concerns**, making it _fragile_ and _hard to maintain_.

### Improved Example: With SRP

```typescript
// Responsibility 1: Manage order data and calculate total
class Order {
  items: { name: string; price: number }[];

  constructor(items: { name: string; price: number }[]) {
    this.items = items;
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
}

// Responsibility 2: Save order to database
class OrderRepository {
  save(order: Order): void {
    console.log("Saving order to database:", order.items);
    // Simulate database save
  }
}

// Responsibility 3: Send confirmation email
class EmailService {
  sendConfirmationEmail(customerEmail: string, order: Order): void {
    console.log(
      `Sending email to ${customerEmail} with order details:`,
      order.items
    );
    // Simulate email sending
  }
}

// Orchestrator to coordinate the responsibilities
class OrderProcessor {
  constructor(
    private orderRepository: OrderRepository,
    private emailService: EmailService
  ) {}

  processOrder(order: Order, customerEmail: string): void {
    const total = order.calculateTotal();
    console.log(`Order total: ${total}`);
    this.orderRepository.save(order);
    this.emailService.sendConfirmationEmail(customerEmail, order);
  }
}

// Usage
const order = new Order([
  { name: "Laptop", price: 1000 },
  { name: "Mouse", price: 50 },
]);
const orderRepository = new OrderRepository();
const emailService = new EmailService();
const orderProcessor = new OrderProcessor(orderRepository, emailService);

orderProcessor.processOrder(order, "customer@example.com");
// Output:
// Order total: 1050
// Saving order to database: [...]
// Sending email to customer@example.com with order details: [...]
```

**How this follows SRP:**

- _Order:_ Responsible only for managing order data and calculating the total.
- _OrderRepository:_ Responsible only for saving orders to the database.
- _EmailService:_ Responsible only for sending emails.
- _OrderProcessor:_ Coordinates the workflow, ensuring loose coupling between components.

**Advantages**:

- _Improved Maintainability:_ Each class has a single responsibility, so changes to one responsibility (e.g., email logic) don’t affect others (e.g., database logic).
- _Easier Testing:_ Classes are smaller and focused, making unit tests simpler.
- _Reusability:_ Components like EmailService can be reused in other parts of the application (e.g., for sending promotional emails).
- _Loose Coupling:_ Classes are independent, reducing dependencies between modules.
- _Scalability:_ Adding new features (e.g., logging orders to a file) requires creating a new class, not modifying existing ones.

**Disadvantages**:

- _Increased Complexity_
- _Overhead in Small Projects_
- _Potential for Misinterpretation_
- _Learning Curve_

---

# 2. Open/Closed Principle (OCP)

- The **Open/Closed Principle** is one of the five SOLID principles of object-oriented design, introduced by Robert C. Martin.
- It states that software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.
- This means you should be able to extend a system's behavior without modifying its existing code, thereby reducing the risk of introducing bugs into stable, tested code.

## Explanation of OCP

**Open for Extension:** You can add new functionality by creating new classes, modules, or components (e.g., through inheritance, interfaces, or composition).
**Closed for Modification:** The existing code (e.g., a base class or module) should not need to be changed when new functionality is added.

The OCP promotes designing systems that are flexible and maintainable by relying on abstractions (like interfaces or abstract classes) rather than concrete implementations.

## Real-Life Analogy

Think of a power strip (extension cord):

- **Open for Extension:** You can plug in new devices (e.g., a phone charger, laptop charger) without changing the power strip itself.
- **Closed for Modification:** The power strip’s internal wiring doesn’t need to be altered to accommodate new devices, as long as they use the standard plug interface.

Similarly, in software, you define an interface or abstract class (like the power strip’s plug socket) that new components can "plug into" without changing the core system.

## Use Case

- Considering our e-commerce system that calculates discounts for different types of customers (e.g., regular, premium, or VIP customers).
- Initially, you might hardcode discount logic for each customer type. However, if a new customer type (e.g., "student") is introduced, you’d need to modify the existing discount calculator class, which violates OCP.(Apple Student Discount Plan)
- Instead, OCP encourages designing the system so you can add new discount types without altering the existing code.

### Example: Without OCP || Violating OCP

```typescript
class DiscountCalculator {
  calculateDiscount(customerType: string, amount: number): number {
    if (customerType === "regular") {
      return amount * 0.1; // 10% discount
    } else if (customerType === "premium") {
      return amount * 0.2; // 20% discount
    } else if (customerType === "vip") {
      return amount * 0.3; // 30% discount
    }
    return 0;
  }
}

// Usage
const calculator = new DiscountCalculator();
console.log(calculator.calculateDiscount("regular", 100)); // 10
console.log(calculator.calculateDiscount("premium", 100)); // 20
```

**Problem:** If you want to add a new customer type (e.g., "student" with a 15% discount), you must modify the DiscountCalculator class, violating OCP.

### Example: With OCP

Using an interface and polymorphism, we can make the system open for extension and closed for modification.

```typescript
// Interface defining the contract for discount calculation
interface DiscountStrategy {
  calculate(amount: number): number;
}

// Concrete classes implementing the interface
class RegularDiscount implements DiscountStrategy {
  calculate(amount: number): number {
    return amount * 0.1; // 10% discount
  }
}

class PremiumDiscount implements DiscountStrategy {
  calculate(amount: number): number {
    return amount * 0.2; // 20% discount
  }
}

class VipDiscount implements DiscountStrategy {
  calculate(amount: number): number {
    return amount * 0.3; // 30% discount
  }
}

class StudentDiscount implements DiscountStrategy {
  calculate(amount: number): number {
    return amount * 0.15; // 15% discount
  }
}

// Discount calculator that depends on abstraction
class DiscountCalculator {
  private strategy: DiscountStrategy;

  constructor(strategy: DiscountStrategy) {
    this.strategy = strategy;
  }

  calculateDiscount(amount: number): number {
    return this.strategy.calculate(amount);
  }
}

// Usage
const regularCalculator = new DiscountCalculator(new RegularDiscount());
const premiumCalculator = new DiscountCalculator(new PremiumDiscount());
const vipCalculator = new DiscountCalculator(new VipDiscount());
const studentCalculator = new DiscountCalculator(new StudentDiscount());

console.log(regularCalculator.calculateDiscount(100)); // 10
console.log(premiumCalculator.calculateDiscount(100)); // 20
console.log(vipCalculator.calculateDiscount(100)); // 30
console.log(studentCalculator.calculateDiscount(100)); // 15
```

## How OCP is Applied:

- The `DiscountStrategy` interface defines the contract.
- Each customer type has its own class `(RegularDiscount, PremiumDiscount, etc.)` implementing the interface.
- The `DiscountCalculator` depends on the `DiscountStrategy` abstraction, not concrete implementations.
- To add a new discount type `(e.g., StudentDiscount)`, you create a new class without modifying `DiscountCalculator`.

## Advantages

- _Maintainability:_ Existing code remains untouched, reducing the risk of breaking stable functionality.
- _Scalability:_ New features (e.g., new discount types) can be added easily by creating new classes.
- _Reusability:_ Components (e.g., discount strategies) can be reused across different contexts.
- _Testability:_ Each strategy can be tested independently, improving unit testing.

## Disadvantages

- _Increased Complexity:_ Introducing abstractions (e.g., interfaces, new classes) can make the codebase more complex, especially for simple systems.
- _Upfront Design Effort:_ Designing for OCP requires anticipating future changes, which may lead to over-engineering.
- _Performance Overhead:_ Using polymorphism (e.g., interfaces, virtual functions) may introduce slight performance costs in some languages, though this is negligible in most cases.

## When to Use OCP

- Use OCP when you expect the system to evolve with new features or behaviors (e.g., new discount types, payment methods, or report formats).
- Avoid OCP in very simple systems where changes are unlikely, as it may introduce unnecessary complexity.

---

# 3. Liskov Substitution Principle (LSP)

- The **Liskov Substitution Principle** states that objects of a superclass should be replaceable with objects of its subclasses without breaking the application.
- In other words, a derived class should extend its base class without changing its behavior.

## Key Idea

- If class `B` is a subtype of class `A`, then we should be able to replace `A` with `B` without disrupting the behavior of our program.

# Real-World Analogy

Imagine a Bird superclass with a `fly()` method.

- Good LSP Example: A Sparrow `(subclass)` can `fly()`, so replacing Bird with Sparrow works.
- Bad LSP Example: A Penguin `(subclass)` cannot `fly()`, so replacing Bird with Penguin breaks LSP.

Solution: Redesign inheritance (e.g., FlightlessBird subclass for Penguin).

### Violation of LSP

```typescript
class Bird {
    void fly() {
        System.out.println("Flying...");
    }
}

class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
    }
}

public class Main {
    public static void makeBirdFly(Bird bird) {
        bird.fly(); // Crashes if given a Penguin!
    }

    public static void main(String[] args) {
        Bird sparrow = new Bird();
        Bird penguin = new Penguin();

        makeBirdFly(sparrow); // ✅ Works
        makeBirdFly(penguin); // ❌ Throws exception (LSP violated)
    }
}
```

### With LSP

```typescript
class Bird {
    // Common bird behaviors
}

class FlyingBird extends Bird {
    void fly() {
        System.out.println("Flying...");
    }
}

class Penguin extends Bird {
    void swim() {
        System.out.println("Swimming...");
    }
}

public class Main {
    public static void makeBirdFly(FlyingBird bird) {
        bird.fly(); // Only accepts flying birds
    }

    public static void main(String[] args) {
        FlyingBird sparrow = new FlyingBird();
        Penguin penguin = new Penguin();

        makeBirdFly(sparrow); // ✅ Works
        // makeBirdFly(penguin); // ❌ Compile-time error (correctly prevented)
    }
}
```

## Advantages of LSP

1. **Maintains consistency** in inheritance hierarchies.
2. **Reduces bugs** by preventing unexpected behavior in subclasses.
3. **Improves code reusability** by ensuring proper polymorphism.
4. **Easier to extend** without breaking existing functionality.

## Disadvantages of LSP

1. **May require more classes** (e.g., splitting `Bird` into `FlyingBird` and `FlightlessBird`).
2. **Can complicate design** if overused (not every hierarchy needs deep inheritance).
3. **Requires careful planning** to avoid violating the principle accidentally.

## When to Use LSP?

- When **subclassing** to extend behavior.
- When **polymorphism** is a key part of the design.
- When **runtime substitution** of objects is needed.

## When to Avoid LSP?

- If inheritance is **not necessary** (composition may be better).
- If the subclass **fundamentally changes** the superclass behavior.

LSP ensures that **inheritance is used correctly**, preventing unexpected behavior when substituting objects.

# Interface Segregation Principle (ISP) in SOLID

The **Interface Segregation Principle** states that `do not force any client to implement an interface which is irrelevant to them`.
In other words, it's better to have many small, specific interfaces than one large, general-purpose interface.

**Real life analogy**

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

## Violating ISP

Here's an example that violates ISP by forcing clients to implement methods they don't need:

```typescript
// A single large interface that does too much
interface RestaurantMenu {
  getVegetarianItems(): string[];
  getNonVegetarianItems(): string[];
  getDrinks(): string[];
}

// Restaurant implements all menu items
class Restaurant implements RestaurantMenu {
  getVegetarianItems(): string[] {
    return ["Paneer Tikka", "Dal Tadka", "Vegetable Biryani"];
  }

  getNonVegetarianItems(): string[] {
    return ["Chicken Curry", "Mutton Rogan Josh", "Fish Fry"];
  }

  getDrinks(): string[] {
    return ["Coke", "Lemonade", "Masala Chai"];
  }
}

// VegetarianCustomer is forced to implement all methods even though they only need vegetarian items
class VegetarianCustomer implements RestaurantMenu {
  getVegetarianItems(): string[] {
    return ["Paneer Tikka", "Dal Tadka"]; // Only cares about these
  }

  // Forced to implement these unnecessary methods
  getNonVegetarianItems(): string[] {
    throw new Error("I don't eat non-vegetarian food!");
  }

  getDrinks(): string[] {
    throw new Error("I'm only interested in food!");
  }
}

// This violates ISP because VegetarianCustomer is forced to implement methods it doesn't need
```

## ISP Design

Here's the improved version following ISP by splitting the large interface into smaller, more specific ones:

```typescript
// Smaller, more focused interfaces
interface VegetarianMenu {
  getVegetarianItems(): string[];
}

interface NonVegetarianMenu {
  getNonVegetarianItems(): string[];
}

interface DrinkMenu {
  getDrinks(): string[];
}

// Restaurant can implement all interfaces as it serves everything
class Restaurant
  implements VegetarianMenu, NonVegetarianMenu, DrinkMenu, SweetMenu
{
  getVegetarianItems(): string[] {
    return ["Paneer Tikka", "Dal Tadka", "Vegetable Biryani"];
  }

  getNonVegetarianItems(): string[] {
    return ["Chicken Curry", "Mutton Rogan Josh", "Fish Fry"];
  }

  getDrinks(): string[] {
    return ["Coke", "Lemonade", "Masala Chai"];
  }
}

// VegetarianCustomer only needs to implement what it cares about
class VegetarianCustomer implements VegetarianMenu {
  getVegetarianItems(): string[] {
    return ["Paneer Tikka", "Dal Tadka"]; // Only implements what it needs
  }
}

// Another customer might want both non-vegetarian items and drinks
class NonVegetarianCustomer implements NonVegetarianMenu, DrinkMenu {
  getVegetarianItems(): string[] {
    return ["Salad", "Soup", "Grilled Vegetables"];
  }

  getDrinks(): string[] {
    return ["Jhonny Walker", "Black Label", "Old Monk"];
  }
}

// Usage example
const vegCustomer = new VegetarianCustomer();
console.log("Vegetarian items:", vegCustomer.getVegetarianItems());

const nonVegCustomer = new NonVegetarianCustomer();
console.log("non-vegetarian:", nonVegCustomer.getVegetarianItems());
console.log("drinks:", nonVegCustomer.getDrinks());

// Now no class is forced to implement methods it doesn't need
```

## Use Cases

1. **Plugin architectures**: Where different plugins provide different capabilities
2. **Multi-role systems**: Where objects can have different roles with different behaviors
3. **Large codebases**: To prevent "interface pollution" where interfaces become too large

## Key Benefits of the ISP-Compliant Design:

1. **No forced implementations**: Clients only implement interfaces they actually need
2. **Better maintainability**: Changes to one interface don't affect unrelated clients
3. **More flexible**: Classes can combine only the interfaces they need
4. **Clearer intent**: Each interface has a single, well-defined responsibility
5. **Reduced coupling**: Dependencies are minimized to only what's necessary

### **Dependency Inversion Principle (DIP) Explained**

The Dependency Inversion Principle (DIP) introduced by Robert C. Martin focuses on decoupling software modules to make systems more flexible, maintainable, and testable.

#### **Key Idea**

- `High-level modules (which contain business logic) should not depend on low-level modules` (which handle implementation details).
- Both should depend on abstractions (e.g., interfaces or abstract classes). **Abstractions** should not depend on details. Instead, details (concrete implementations) should depend on abstractions.

Code Example: Without DIP

In this version, the TV is tightly coupled to a specific Samsung remote, making it inflexible.

**Real life analogy**

- A TV RemoteImagine you have a TV (high-level module) that needs to work with a remote control (low-level module).

**Violating DIP:** The TV is designed to work only with a specific brand’s remote (e.g., a Samsung remote). If you lose the remote or want to use a different brand’s remote, the TV won’t work unless you redesign it. This is inflexible and tightly coupled.
**DIP Design:** The TV depends on a standard remote interface (e.g., buttons for power, volume, and channels). Any remote—Samsung, LG, or a universal remote—can control the TV as long as it follows the interface. The TV doesn’t care about the remote’s brand, making it flexible and reusable.

## Example

**Violating DIP:**

```typescript
// Concrete low-level module
class SamsungRemote {
  pressButton(action) {
    console.log(`Samsung remote: ${action} pressed`);
  }
}

// High-level module directly depends on SamsungRemote
class TV {
  constructor() {
    this.remote = new SamsungRemote(); // Tight coupling to SamsungRemote
  }

  control(action) {
    this.remote.pressButton(action);
  }
}

// Usage
const tv = new TV();
tv.control("Power"); // Output: Samsung remote: Power pressed
```

**DIP Design:**

```typescript
// Abstraction (interface-like behavior in JavaScript)
class Remote {
  pressButton(action) {
    throw new Error("Method 'pressButton()' must be implemented.");
  }
}

// Concrete implementation: SamsungRemote
class SamsungRemote extends Remote {
  pressButton(action) {
    console.log(`Samsung remote: ${action} pressed`);
  }
}

// Concrete implementation: LGRemote
class LGRemote extends Remote {
  pressButton(action) {
    console.log(`LG remote: ${action} pressed`);
  }
}

// High-level module depends on the abstraction
class TV {
  constructor(remote) {
    if (!(remote instanceof Remote)) {
      throw new Error("TV requires a Remote instance");
    }
    this.remote = remote; // Depends on abstraction, not concrete class
  }

  control(action) {
    this.remote.pressButton(action);
  }
}

// Usage
const samsungTV = new TV(new SamsungRemote());
samsungTV.control("Power"); // Output: Samsung remote: Power pressed

const lgTV = new TV(new LGRemote());
lgTV.control("Volume Up"); // Output: LG remote: Volume Up pressed
```

## Explanation

**Abstraction:** The Remote class acts as an abstract base class (interface-like in JavaScript). It defines the pressButton method that all concrete remotes must implement.
**Concrete Implementations:** SamsungRemote and LGRemote extend Remote and provide specific implementations of pressButton.
**High-Level Module:** The TV class depends on the Remote abstraction, not a specific remote. You can pass any remote (Samsung, LG, or even a universal remote) as long as it follows the Remote interface.
**Flexibility:** You can easily add new remotes (e.g., UniversalRemote) without changing the TV class.

## Advantages:

**Flexibility:** The TV works with any remote (Samsung, LG, etc.) as long as it follows the Remote interface.
**Testability:** You can pass a mock remote for testing the TV’s behavior without using a real remote.
**Maintainability:** Adding a new remote type doesn’t require changing the TV class.

## Disadvantages

**Added Complexity:** The Remote abstraction adds a layer of code, which might feel unnecessary for a very simple system (e.g., if you’re sure you’ll only ever use one remote type).
**Design Effort:** You need to define the Remote interface upfront, which requires a bit more planning.
