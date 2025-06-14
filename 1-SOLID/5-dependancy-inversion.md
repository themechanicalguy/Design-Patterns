# **Dependency Inversion Principle (DIP) in SOLID**

Classes should depend on interfaces rather than concrete classes

The **Dependency Inversion Principle (DIP)** states that:

1. **High-level modules should not depend on low-level modules. Both should depend on abstractions.**
2. **Abstractions should not depend on details. Details (concrete implementations) should depend on abstractions.**

This principle promotes **loose coupling** by ensuring that classes depend on **interfaces or abstract classes** rather than concrete implementations.

---

## **TypeScript Example**

### **Violation of DIP (Bad Design)**

Here, a high-level `OrderService` directly depends on a low-level `MySQLDatabase`.

```typescript
class MySQLDatabase {
  save(order: Order) {
    console.log("Saving order to MySQL...");
  }
}

class OrderService {
  private database: MySQLDatabase;

  constructor() {
    this.database = new MySQLDatabase(); // Tight coupling
  }

  processOrder(order: Order) {
    this.database.save(order);
  }
}
```

**Problem:**

- If we switch to `MongoDB`, we must modify `OrderService`.
- Violates **Open/Closed Principle (OCP)** since changes require modifying existing code.

---

### **Following DIP (Good Design)**

We introduce an **abstraction (`Database` interface)** that both high-level and low-level modules depend on.

```typescript
// Abstraction (Interface)
interface Database {
  save(order: Order): void;
}

// Low-level module (depends on abstraction)
class MySQLDatabase implements Database {
  save(order: Order) {
    console.log("Saving order to MySQL...");
  }
}

// Another low-level module
class MongoDB implements Database {
  save(order: Order) {
    console.log("Saving order to MongoDB...");
  }
}

// High-level module (depends on abstraction)
class OrderService {
  private database: Database;

  constructor(database: Database) {
    // Dependency Injection
    this.database = database;
  }

  processOrder(order: Order) {
    this.database.save(order);
  }
}

// Usage
const mySQLDb = new MySQLDatabase();
const orderService = new OrderService(mySQLDb); // Works with MySQL

const mongoDb = new MongoDB();
const orderService2 = new OrderService(mongoDb); // Works with MongoDB
```

**Key Improvements:**  
✅ **Decoupled:** `OrderService` no longer depends on a specific database.  
✅ **Extensible:** Easily swap databases without changing `OrderService`.  
✅ **Testable:** Can inject a mock database for unit testing.

---

## **Use Cases of DIP**

1. **Dependency Injection (DI)** – Passing dependencies (like databases, APIs) from outside.
2. **Swappable Services** (e.g., Payment Gateways, Logging Services).
3. **Testing** – Mocking dependencies in unit tests.
4. **Plugin Architectures** – Allowing interchangeable modules.

---

## **Advantages**

✔ **Loose Coupling** – Changes in low-level modules don’t affect high-level modules.  
✔ **Better Testability** – Easy to mock dependencies.  
✔ **Flexibility** – Easily switch implementations (e.g., MySQL → MongoDB).  
✔ **Follows Open/Closed Principle (OCP)** – Extend without modifying existing code.

---

## **Disadvantages**

❌ **Increased Complexity** – More interfaces and dependency management.  
❌ **Boilerplate Code** – Requires defining abstractions for everything.  
❌ **Learning Curve** – Developers must understand DI and abstractions.

---

## **Real-World Example: Payment Gateway**

```typescript
// Abstraction
interface PaymentGateway {
  processPayment(amount: number): boolean;
}

// Concrete implementations
class StripeGateway implements PaymentGateway {
  processPayment(amount: number) {
    console.log(`Processing $${amount} via Stripe...`);
    return true;
  }
}

class PayPalGateway implements PaymentGateway {
  processPayment(amount: number) {
    console.log(`Processing $${amount} via PayPal...`);
    return true;
  }
}

// High-level module
class PaymentService {
  constructor(private paymentGateway: PaymentGateway) {}

  checkout(amount: number) {
    return this.paymentGateway.processPayment(amount);
  }
}

// Usage
const stripe = new StripeGateway();
const paymentService = new PaymentService(stripe);
paymentService.checkout(100); // Uses Stripe

const paypal = new PayPalGateway();
const paymentService2 = new PaymentService(paypal);
paymentService2.checkout(200); // Uses PayPal
```

**Key Takeaway:**

- **PaymentService** doesn’t care which gateway is used.
- New gateways (e.g., Crypto) can be added **without modifying `PaymentService`.**

---

## **Conclusion**

DIP ensures **flexible, maintainable, and testable** code by:

1. **Depending on abstractions, not concretions.**
2. **Using Dependency Injection (DI) to pass dependencies.**
3. **Making systems more modular and extensible.**

By following DIP, you can build **scalable** applications that adapt to changes without major refactoring. 🚀
