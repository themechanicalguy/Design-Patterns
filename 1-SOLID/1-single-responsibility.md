# 1. Single Responsibility Principle (SRP)

SOLID is an acronym for five object-oriented design principles that help create more maintainable, flexible, and scalable software. Let's explore each principle with TypeScript examples, use cases, advantages, and disadvantages.

**Definition**:

- The Single Responsibility Principle (SRP) is one of the five SOLID principles of object-oriented design, which aim to make software designs more understandable, flexible, and maintainable.
- SRP states that a class should have only one reason to change, meaning it should have only one responsibility or job.
- This principle promotes high cohesion and low coupling in code, making it easier to maintain and extend.

**Key Idea**:

- Each class should focus on a single task or concern, such as handling business logic, data persistence, or user interface rendering. If a class does too many things, it becomes harder to test, maintain, and modify.

## Real-World Analogy

Think of a restaurant kitchen:

- Without SRP: One chef handles cooking, serving, and cleaning. If the menu changes, the chef’s workflow is disrupted, and they’re overwhelmed.
- With SRP: One chef cooks, a waiter serves, and a cleaner handles dishes. Each person focuses on their job, making the kitchen more efficient and adaptable.

## Use Case:

**Scenario:** Imagine you’re building an e-commerce application where you need to manage orders. An order might involve:

- Calculating the total price.
- Saving the order to a database.
- Sending a confirmation email to the customer.

Without SRP, you might create a single Order class that handles all these tasks. However, this violates SRP because the class has multiple responsibilities (price calculation, database operations, and email sending). Applying SRP, you’d split these responsibilities into separate classes, each handling one task.

### Example: Violating SRP

```typescript
// Violating SRP
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
- The class is tightly coupled to multiple concerns, making it fragile and hard to maintain.

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

- Order: Responsible only for managing order data and calculating the total.
- OrderRepository: Responsible only for saving orders to the database.
- EmailService: Responsible only for sending emails.
- OrderProcessor: Coordinates the workflow, ensuring loose coupling between components.

**Advantages**:

- **Improved Maintainability:**

  - Each class has a single responsibility, so changes to one responsibility (e.g., email logic) don’t affect others (e.g., database logic).
  - Example: You can test Order.calculateTotal() without mocking database or email services.

- **Easier Testing:**

  - Classes are smaller and focused, making unit tests simpler.
  - Example: If you switch email providers, only EmailService needs to change.

- **Reusability:**

  - Components like EmailService can be reused in other parts of the application (e.g., for sending promotional emails).
  - Example: EmailService can be reused for other notification types.

- **Loose Coupling:**

  - Classes are independent, reducing dependencies between modules.
  - Example: OrderRepository doesn’t care about how emails are sent.

- **Scalability:**
  - Adding new features (e.g., logging orders to a file) requires creating a new class, not modifying existing ones.

**Disadvantages**:

- **Increased Complexity:**

  - Splitting responsibilities creates more classes, which can make the codebase seem more complex, especially for small projects.
  - Example: The refactored code has four classes instead of one, which might feel like over-engineering for a simple app.

- **Overhead in Small Projects:**

  - For small scripts or prototypes, applying SRP may add unnecessary boilerplate code.
  - Example: If the app only processes one order, the extra classes might not justify the effort.

- **Potential for Misinterpretation:**

  - Developers might split responsibilities too finely, leading to excessive fragmentation (e.g., one class per tiny function).
  - Example: Creating a separate class for every small calculation in Order could make the code harder to follow.

- **Learning Curve:**
  - Junior developers may find it challenging to decide how to split responsibilities appropriately.
