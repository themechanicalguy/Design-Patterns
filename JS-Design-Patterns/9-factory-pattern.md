## Factory Pattern – Interview Notes

### What is it?

A **factory is a function** that creates and returns objects. Its job is to encapsulate object creation logic, allowing you to produce different types of objects based on input, without the caller needing to use `new` or know the concrete class.

> **Core idea**: Separate _what_ you create from _how_ it's created.

---

### Simple Example

```javascript
// 1. Simple Factory - creates different objects based on type
const createUser = ({ type, name, email }) => {
  // Base user object
  const baseUser = {
    name,
    email,
    createdAt: new Date(),
  };

  // Add type-specific properties/methods
  switch (type) {
    case "admin":
      return {
        ...baseUser,
        role: "admin",
        permissions: ["read", "write", "delete"],
        deleteUser: (id) => console.log(`Deleting user ${id}`),
      };
    case "editor":
      return {
        ...baseUser,
        role: "editor",
        permissions: ["read", "write"],
        publishPost: (post) => console.log(`Publishing ${post}`),
      };
    case "viewer":
      return {
        ...baseUser,
        role: "viewer",
        permissions: ["read"],
      };
    default:
      throw new Error(`Unknown user type: ${type}`);
  }
};

// Usage - caller doesn't know or care about the creation details
const admin = createUser({
  type: "admin",
  name: "Alice",
  email: "alice@company.com",
});

const editor = createUser({
  type: "editor",
  name: "Bob",
  email: "bob@company.com",
});

console.log(admin.permissions); // ['read', 'write', 'delete']
console.log(editor.publishPost("New Article")); // Publishing New Article
```

**Key improvement**: The caller just asks for a user of a certain type. The factory handles all the logic of what properties and methods that type should have.

---

### Lookup-Table Factory (Better than Switch)

Instead of a `switch` statement, use an object map — it's easier to extend:

```javascript
// 2. Lookup-Table Factory - no switch statement!
const userFactories = {
  admin: (base) => ({
    ...base,
    role: "admin",
    permissions: ["read", "write", "delete"],
  }),
  editor: (base) => ({
    ...base,
    role: "editor",
    permissions: ["read", "write"],
  }),
  viewer: (base) => ({
    ...base,
    role: "viewer",
    permissions: ["read"],
  }),
};

const createUser = ({ type, ...rest }) => {
  const factoryFn = userFactories[type];
  if (!factoryFn) throw new Error(`Unknown user type: ${type}`);

  const base = { ...rest, createdAt: new Date() };
  return factoryFn(base);
};
```

---

### When to Use

- **Creating different types** of objects based on input (e.g., user roles, UI components, API clients)
- **Encapsulating complex setup** or configuration (e.g., logger with thresholds, HTTP client with base URL)
- **Environment switching** — same interface, different implementations for dev/prod
- **When you want to avoid** `new` and `this` binding bugs
- **Trivial testing** — you can pass mock dependencies into the factory

---

### When NOT to Use

- You only ever create **one type** in **one way** — it's just extra noise
- You need **`instanceof`** checks — factories return plain objects
- You're creating **React/Vue components** dynamically — can break hooks/reactivity
- The factory is just `new X()` wrapped — that's not abstraction, it's unnecessary indirection

---

### Advantages

| Advantage                  | Explanation                                                                 |
| -------------------------- | --------------------------------------------------------------------------- |
| **Encapsulates creation**  | Callers don't need to know about `new`, classes, or implementation details  |
| **Easy to swap**           | Change how objects are made in one place — all callers get the new behavior |
| **Trivially testable**     | Pass mock dependencies via factory options                                  |
| **Flexible output**        | Can return different object shapes based on input (discriminated unions)    |
| **No `this`/binding bugs** | Just plain functions and object literals                                    |
| **Composable**             | Works well with closures, partial application, and currying                 |

---

### Disadvantages

| Disadvantage                  | Mitigation                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------- |
| **No shared prototype**       | Methods are re-created for each instance (use classes for hot paths)             |
| **No `instanceof`**           | Use a `type` field on the returned object for runtime checks                     |
| **Can hide complexity**       | If the factory does too much, it becomes a "God object" — split it               |
| **Harder to find references** | Lookup-table dispatch is harder to trace than class method calls — document well |

---

### Factory vs. Class vs. DI Container

| Aspect            | Class (`new`)                                      | Factory Function                             | DI Container                         |
| ----------------- | -------------------------------------------------- | -------------------------------------------- | ------------------------------------ |
| **Best for**      | Long-lived objects with identity, hot-path methods | Configuration capture, environment switching | Wiring large service graphs          |
| **Cost**          | `this` semantics, harder to mock                   | Methods recreated per instance               | Heavy setup, overkill for small apps |
| **Type checking** | `instanceof` works                                 | Use discriminated unions                     | Often requires decorators            |
| **Testability**   | Harder (need to mock class)                        | Easy (pass fakes)                            | Good, but complex                    |

---

### Interview Tips

1. **Contrast with Abstract Factory**: The **Factory Method** pattern creates one product per factory. The **Abstract Factory** creates a family of related products. This simple factory is the most common and flexible.

2. **Key phrase**: "The factory pattern is about **delegating object creation** to a single place. It's not about classes — a simple function can be a factory."

3. **ES6 improvement**: Use a **lookup table** (object map) instead of `switch` for type-based factories. It's easier to extend and introspect.

4. **Modern usage**:
   - **React hooks** are factories (e.g., `useState` returns state + setter)
   - **HTTP client factories** (e.g., `createApiClient({ baseUrl })`)
   - **Logger factories** (e.g., `createLogger({ level: 'warn' })`)

5. **When asked for examples**:
   - User factory (admin/editor/viewer)
   - API client factory (different environments)
   - Form field factory (text/email/number/checkbox)
