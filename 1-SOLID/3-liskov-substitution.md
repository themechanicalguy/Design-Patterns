# Liskov Substitution Principle (LSP) in SOLID

The **Liskov Substitution Principle (LSP)** states that objects of a superclass should be replaceable with objects of its subclasses without breaking the application. In other words, a derived class should extend its base class without changing its behavior.

## Key Idea

If class `B` is a subtype of class `A`, then we should be able to replace `A` with `B` without disrupting the behavior of our program.

## TypeScript Example

### Violation of LSP

```typescript
class Rectangle {
  constructor(public width: number, public height: number) {}

  setWidth(width: number) {
    this.width = width;
  }

  setHeight(height: number) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(size: number) {
    super(size, size);
  }

  setWidth(width: number) {
    this.width = width;
    this.height = width; // Violates LSP - changes behavior
  }

  setHeight(height: number) {
    this.height = height;
    this.width = height; // Violates LSP - changes behavior
  }
}

function testRectangleArea(rectangle: Rectangle) {
  rectangle.setWidth(5);
  rectangle.setHeight(4);
  console.assert(rectangle.getArea() === 20, "Area should be 20");
}

const rect = new Rectangle(5, 4);
testRectangleArea(rect); // Passes

const sq = new Square(5);
testRectangleArea(sq); // Fails - area becomes 16 instead of 20

//E-Commerce Example

abstract class PaymentProcessor {
  abstract processPayment(amount: number): void;
  abstract validatePayment(): boolean;
  abstract getRewardPoints(): number; // Not all payment methods give rewards
}

class CreditCardProcessor extends PaymentProcessor {
  processPayment(amount: number) {
    console.log(`Processing credit card payment: $${amount}`);
  }

  validatePayment() {
    // Credit card validation logic
    return true;
  }

  getRewardPoints() {
    return 10; // Credit cards give reward points
  }
}

class PayPalProcessor extends PaymentProcessor {
  processPayment(amount: number) {
    console.log(`Processing PayPal payment: $${amount}`);
  }

  validatePayment() {
    // PayPal validation logic
    return true;
  }

  getRewardPoints() {
    return 0; // PayPal doesn't give rewards (forced implementation)
  }
}

class CryptoProcessor extends PaymentProcessor {
  processPayment(amount: number) {
    console.log(`Processing crypto payment: $${amount}`);
  }

  validatePayment() {
    // Crypto validation is different
    return checkBlockchainConfirmations() > 2;
  }

  getRewardPoints() {
    throw new Error("Crypto payments don't support reward points"); // Violation!
  }
}
```

### Following LSP

```typescript
abstract class Shape {
  abstract getArea(): number;
}

class Rectangle extends Shape {
  constructor(public width: number, public height: number) {
    super();
  }

  setWidth(width: number) {
    this.width = width;
  }

  setHeight(height: number) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(private size: number) {
    super();
  }

  setSize(size: number) {
    this.size = size;
  }

  getArea() {
    return this.size * this.size;
  }
}

function testShapeArea(shape: Shape, expectedArea: number) {
  console.assert(
    shape.getArea() === expectedArea,
    `Area should be ${expectedArea}`
  );
}

const rect = new Rectangle(5, 4);
testShapeArea(rect, 20); // Passes

const sq = new Square(5);
testShapeArea(sq, 25); // Passes

//E-commerce example

// Core payment interface
interface PaymentProcessor {
  processPayment(amount: number): void;
  validatePayment(): boolean;
}

// Interface for payment methods that support rewards
interface Rewardable {
  getRewardPoints(): number;
}

class CreditCardProcessor implements PaymentProcessor, Rewardable {
  processPayment(amount: number) {
    console.log(`Processing credit card payment: $${amount}`);
  }

  validatePayment() {
    // Credit card validation logic
    return checkCVV() && checkExpiryDate();
  }

  getRewardPoints() {
    return 10;
  }
}

class PayPalProcessor implements PaymentProcessor {
  processPayment(amount: number) {
    console.log(`Processing PayPal payment: $${amount}`);
  }

  validatePayment() {
    // PayPal validation logic
    return checkPayPalAccountStatus();
  }
}

class CryptoProcessor implements PaymentProcessor {
  processPayment(amount: number) {
    console.log(`Processing crypto payment: $${amount}`);
  }

  validatePayment() {
    return checkBlockchainConfirmations() > 2;
  }
}

// Usage in e-commerce system
function checkout(paymentMethod: PaymentProcessor, amount: number) {
  if (paymentMethod.validatePayment()) {
    paymentMethod.processPayment(amount);

    // Optional reward points for compatible payment methods
    if ("getRewardPoints" in paymentMethod) {
      const rewardable = paymentMethod as Rewardable;
      console.log(`Earned ${rewardable.getRewardPoints()} reward points`);
    }

    console.log("Payment successful!");
  } else {
    console.log("Payment validation failed");
  }
}

// Test different payment methods
const creditCard = new CreditCardProcessor();
const paypal = new PayPalProcessor();
const crypto = new CryptoProcessor();

checkout(creditCard, 100); // Works with reward points
checkout(paypal, 50); // Works without reward points
checkout(crypto, 75); // Works without reward points
```

## Use Cases

1. **Class hierarchies**: When extending classes to add specialized behavior
2. **Polymorphic behavior**: When using inheritance to enable polymorphism
3. **API design**: When designing interfaces that will be implemented by others
4. **Framework development**: When creating base classes for others to extend

## Advantages

1. **Code reliability**: Subclasses won't break existing functionality
2. **Better polymorphism**: Enables proper use of polymorphism
3. **Easier maintenance**: Changes in subclasses are less likely to affect superclass behavior
4. **Improved extensibility**: New subclasses can be added without modifying existing code

## Disadvantages

1. **Design complexity**: Requires careful upfront design of class hierarchies
2. **Potential over-engineering**: May lead to more abstract designs than necessary for simple cases
3. **Performance overhead**: Additional layers of abstraction might introduce slight performance costs

## Real-world TypeScript Example

```typescript
// Database connection example
interface DatabaseConnection {
  connect(): void;
  query(sql: string): any[];
}

class MySQLConnection implements DatabaseConnection {
  connect() {
    /* MySQL connection logic */
  }
  query(sql: string) {
    /* MySQL query execution */ return [];
  }
}

class MongoDBConnection implements DatabaseConnection {
  connect() {
    /* MongoDB connection logic */
  }
  query(sql: string) {
    // MongoDB uses a different query language
    throw new Error("MongoDB doesn't use SQL");
    // This violates LSP!
  }
}

// Following LSP
interface DatabaseConnection {
  connect(): void;
}

interface SQLDatabaseConnection extends DatabaseConnection {
  query(sql: string): any[];
}

interface NoSQLDatabaseConnection extends DatabaseConnection {
  find(query: object): any[];
}

class MySQLConnection implements SQLDatabaseConnection {
  connect() {
    /* MySQL connection logic */
  }
  query(sql: string) {
    /* MySQL query execution */ return [];
  }
}

class MongoDBConnection implements NoSQLDatabaseConnection {
  connect() {
    /* MongoDB connection logic */
  }
  find(query: object) {
    /* MongoDB find operation */ return [];
  }
}
```

In this improved version, we've created specialized interfaces for different types of databases, allowing each to implement their own query methods while maintaining substitutability for the common `connect()` method.
