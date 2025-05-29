# 2. Open/Closed Principle (OCP)

- The Open/Closed Principle (OCP) is one of the five SOLID principles of object-oriented design, introduced by Robert C. Martin.
- It states that software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.
- This means you should be able to extend a system's behavior without modifying its existing code, thereby reducing the risk of introducing bugs into stable, tested code.

## Explanation of OCP

**Open for Extension:** You can add new functionality by creating new classes, modules, or components (e.g., through inheritance, interfaces, or composition).
**Closed for Modification:** The existing code (e.g., a base class or module) should not need to be changed when new functionality is added.

The OCP promotes designing systems that are flexible and maintainable by relying on abstractions (like interfaces or abstract classes) rather than concrete implementations.

## Use Case

- Imagine you're building an e-commerce system that calculates discounts for different types of customers (e.g., regular, premium, or VIP customers).
- Initially, you might hardcode discount logic for each customer type. However, if a new customer type (e.g., "student") is introduced, you’d need to modify the existing discount calculator class, which violates OCP.(Apple Student Discount Plan)
- Instead, OCP encourages designing the system so you can add new discount types without altering the existing code.

## Real-Life Analogy

Think of a power strip (extension cord):

- **Open for Extension:** You can plug in new devices (e.g., a phone charger, laptop charger) without changing the power strip itself.
- **Closed for Modification:** The power strip’s internal wiring doesn’t need to be altered to accommodate new devices, as long as they use the standard plug interface.

Similarly, in software, you define an interface or abstract class (like the power strip’s plug socket) that new components can "plug into" without changing the core system.

### Example: Without OCP (Bad Design)

```typescript
// Violating OCP
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

### Example: With OCP (Good Design)

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

## Advantages of OCP

**Maintainability:** Existing code remains untouched, reducing the risk of breaking stable functionality.
**Scalability:** New features (e.g., new discount types) can be added easily by creating new classes.
**Reusability:** Components (e.g., discount strategies) can be reused across different contexts.
**Testability:** Each strategy can be tested independently, improving unit testing.

## Disadvantages of OCP

**Increased Complexity:** Introducing abstractions (e.g., interfaces, new classes) can make the codebase more complex, especially for simple systems.
**Upfront Design Effort:** Designing for OCP requires anticipating future changes, which may lead to over-engineering.
**Performance Overhead:** Using polymorphism (e.g., interfaces, virtual functions) may introduce slight performance costs in some languages, though this is negligible in most cases.

## When to Use OCP

- Use OCP when you expect the system to evolve with new features or behaviors (e.g., new discount types, payment methods, or report formats).
- Avoid OCP in very simple systems where changes are unlikely, as it may introduce unnecessary complexity.
