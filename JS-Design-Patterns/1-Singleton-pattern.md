# Singleton Pattern

## 1. CORE CONCEPT & DEFINITION

### What to Say:

"A Singleton is an object that exists exactly once for the lifetime of your application. Every caller gets the same instance—same state, same methods, same identity. It ensures centralized control over a shared resource."

### Real-World Use Cases:

- **Database connection pool** — You never want two pools draining the same database
- **Feature flag service** — Loaded once, served everywhere
- **Analytics client** — Batches events before flushing (race condition risk with 2+ instances)
- **WebSocket connection** — One connection broadcasting to multiple subscribers
- **Logger** — Consistent logging configuration across the app

### Interview Tip:

**Always lead with the problem it solves, not the implementation**. This shows architectural thinking, not just coding knowledge.

---

## 2. IMPLEMENTATION APPROACHES

### A. Class-Based Singleton (Traditional)

```javascript
class FeatureFlags {
  // Private static instance
  static #instance = null;

  // Private state
  #flags = new Map();
  #loaded = false;

  constructor() {
    if (FeatureFlags.#instance) {
      return FeatureFlags.#instance;
    }
    FeatureFlags.#instance = this;
  }

  static getInstance() {
    return (FeatureFlags.#instance ??= new FeatureFlags());
  }

  async load(url) {
    if (this.#loaded) return;
    const res = await fetch(url);
    const data = await res.json();
    for (const [key, value] of Object.entries(data)) {
      this.#flags.set(key, value);
    }
    this.#loaded = true;
  }

  isEnabled(name) {
    return this.#flags.get(name) === true;
  }
}
```

**Key Implementation Details to Highlight:**

- **Private static field (`#instance`)** — ES2022 feature prevents external tampering
- **Constructor guard** — Returns existing instance if already created
- **Lazy initialization (`??=`)** — Instance created only when first requested
- **Identity guarantee** — `===` comparison always returns true for the same instance

---

### B. Module-Scoped State (Modern Approach) ⭐

```javascript
// feature-flags.js
const flags = new Map();
let loaded = false;

export async function load(url) {
  if (loaded) return;
  const res = await fetch(url);
  const data = await res.json();
  for (const [key, value] of Object.entries(data)) {
    flags.set(key, value);
  }
  loaded = true;
}

export function isEnabled(name) {
  return flags.get(name) === true;
}
```

**Why This is Better:**

- **ESM guarantee** — Module evaluated exactly once per realm
- **No boilerplate** — No constructor, `getInstance`, or class overhead
- **Encapsulation** — Private variables by definition; no need for `#` syntax
- **Simpler testing** — Can reset with `vi.resetModules()` or `jest.resetModules()`

### Interview Position:

"For 90% of 'I need one of these' problems, I'd use module-scoped state. It's simpler, more testable, and leverages JavaScript's module system rather than fighting against it."

---

## 3. CRITICAL INTERVIEW PITFALLS & TRADE-OFFS

### A. Testing Is Hard (Major Issue)

**The Problem:**
Singletons hold state across tests. Test A flips a flag, Test B reads it → order-dependent flakiness.

**How to Address This (Show You Know Solutions):**

```javascript
// ❌ BAD: Tests are coupled through global state
describe("Feature Flags", () => {
  it("should enable feature", () => {
    FeatureFlags.getInstance().load("/config.json");
    expect(FeatureFlags.getInstance().isEnabled("newCheckout")).toBe(true);
  });

  it("should disable feature", () => {
    // State from previous test may leak here!
    expect(FeatureFlags.getInstance().isEnabled("newCheckout")).toBe(false);
  });
});

// ✅ GOOD: Reset state between tests
describe("Feature Flags", () => {
  beforeEach(() => {
    FeatureFlags.getInstance().reset(); // Expose reset method
  });

  it("should enable feature", () => {
    // ...
  });
});

// ✅ BETTER: Use module reset (only works with module-scoped state)
import { afterEach } from "vitest";

afterEach(() => {
  vi.resetModules(); // Clears all cached modules
});
```

**What to Say in Interview:**

"The biggest challenge with Singletons is testability. I address this by either:

1. Exposing a `reset()` method for test cleanup
2. Using dependency injection instead of `getInstance()`
3. Leveraging module resets if using module-scoped state
4. Or better yet, avoiding the pattern entirely when possible"

---

### B. Hidden Coupling & Implicit Dependencies

**The Problem:**

```javascript
// ❌ HIDDEN DEPENDENCY
function processOrder(order) {
  Logger.getInstance().info("processing", order.id);
}

// ✅ EXPLICIT DEPENDENCY
function processOrder(order, logger) {
  logger.info("processing", order.id);
}
```

**Why It Matters:**

- Function signature doesn't reveal all dependencies
- Harder to reuse in different contexts
- Difficult for junior developers to debug

**Interview Quote:**
"I avoid using `getInstance()` calls buried deep in code. It violates the explicit dependency principle. Instead, I inject dependencies through constructor or function parameters—the contract is visible in the signature."

---

### C. Server-Side State Leakage (Critical for Full-Stack Roles)

**The Scenario:**

```javascript
// ❌ DANGEROUS in Node.js with multiple requests
let userCache = null; // Shared across ALL requests!

app.get("/user/:id", (req, res) => {
  if (!userCache) {
    userCache = fetchUser(req.params.id);
  }
  res.json(userCache);
  // User A's data could leak to User B's request!
});

// ✅ SAFE: Use AsyncLocalStorage or per-request scope
import { AsyncLocalStorage } from "async_hooks";

const userContext = new AsyncLocalStorage();

app.get("/user/:id", async (req, res) => {
  let userCache = userContext.getStore();
  if (!userCache) {
    userCache = await fetchUser(req.params.id);
    userContext.run(userCache, () => {});
  }
  res.json(userCache);
});
```

**What to Say:**
"In SSR or serverless environments, module-level state is a landmine. I'm careful to distinguish between:

- **Stateless utilities** (logger, configs) — Safe as Singletons
- **Request-scoped state** — Must use AsyncLocalStorage or context-specific storage

This is especially critical in Next.js apps where both server and client code might coexist."

---

## 4. WHEN NOT TO USE SINGLETON

### Clear Red Flags:

| Scenario                                  | Why It's Bad                                  | Alternative                             |
| ----------------------------------------- | --------------------------------------------- | --------------------------------------- |
| **Per-request/per-user state**            | State leaks across requests in SSR/serverless | AsyncLocalStorage, React Context, or DI |
| **Need to swap implementations in tests** | `getInstance()` is hardcoded, can't mock      | Dependency injection                    |
| **"Single instance" is just convention**  | Nothing breaks with 2 instances               | Use a normal object                     |
| **Kitchen sink for app state**            | Becomes an unmanageable global bag            | State container (Redux, Zustand)        |
| **Inheritance/polymorphism needed**       | Hard to subclass a Singleton correctly        | Factory pattern instead                 |

### Interview Position:

"I default to **NOT** using Singleton. It's a pattern for specific problems. Before reaching for it, I ask: 'Can this be module-scoped state? Can I use a state container? Can DI solve this?' If the answer is yes to any, I avoid Singleton."

---

## 5. MODERN ALTERNATIVES (What Sets You Apart)

### A. Dependency Injection Containers

**Best for:** Large applications, frameworks, enterprise code

```typescript
import { container, singleton, inject } from "tsyringe";

@singleton()
class AnalyticsClient {
  track(event: string, props: Record<string, unknown>) {
    /* ... */
  }
}

class CheckoutService {
  constructor(@inject(AnalyticsClient) private analytics: AnalyticsClient) {}

  complete(orderId: string) {
    this.analytics.track("order_completed", { orderId });
  }
}

// Tests can register a fake:
container.reset();
container.registerInstance(AnalyticsClient, new FakeAnalytics());
const checkout = container.resolve(CheckoutService);
```

**Advantages:**

- Single instance guarantee + test mockability
- Composition root pattern (configure once, use everywhere)
- Decouples from hardcoded `getInstance()` calls

---

### B. React Context (Component-Tree Scope)

```javascript
const FeatureFlagsContext = createContext(null);

export function FeatureFlagsProvider({ client, children }) {
  return (
    <FeatureFlagsContext.Provider value={client}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlag(name) {
  const client = useContext(FeatureFlagsContext);
  return client.isEnabled(name);
}

// In tests: mount a different provider with fake data
<FeatureFlagsProvider client={mockClient}>
  <YourComponent />
</FeatureFlagsProvider>;
```

**Advantages:**

- Scoped to component tree (not truly global)
- Easily overrideable in tests
- React-native pattern

---

### C. Modern State Management (Zustand, Jotai, Valtio)

```javascript
import { create } from "zustand";

export const useSession = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Usage in component:
const { user, login, logout } = useSession();

// Testing: trivially mockable
vi.mock("./store", () => ({
  useSession: () => ({ user: { id: "test" } }),
}));
```

**Advantages:**

- Hook-based (idiomatic React)
- Built-in persistence/devtools
- No Provider boilerplate
- Excellent testability

---

## 6. COMPARISON TABLE (Use This in Interview)

| Aspect            | Singleton Class      | Module-Scoped     | DI Container    | State Store    |
| ----------------- | -------------------- | ----------------- | --------------- | -------------- |
| **One instance**  | Yes ✅               | Yes ✅            | Yes ✅          | Yes ✅         |
| **Encapsulation** | Strong               | Strong            | Medium          | Strong         |
| **Lazy init**     | Yes                  | Yes               | Yes             | No             |
| **Testability**   | ⚠️ Hard              | Medium            | ✅ Excellent    | ✅ Excellent   |
| **Boilerplate**   | High                 | Low               | Medium          | Low            |
| **Inheritance**   | Possible             | No                | Yes             | No             |
| **Best for**      | Legacy, complex init | Most modern cases | Enterprise apps | React/UI state |

---

## 7. ARCHITECTURE & LEADERSHIP TALKING POINTS

### A. When You'd Champion Singleton:

"If we need a resource that's genuinely shared, expensive to create, and must be identical across the application—like a database connection pool or a configured logger—I'd implement it as module-scoped state first. Only if I need polymorphism or complex initialization would I consider a class-based Singleton. And I'd always pair it with dependency injection for testability."

### B. When You'd Reject It:

"In modern JavaScript, especially with ESM, I rarely see a case where Singleton is better than module-scoped state. And for app-wide behavior (feature flags, user session), I prefer a state container or React Context. The burden of testing isn't worth the abstraction cost."

### C. Code Review Perspective:

"During code reviews, I look for:

- `getInstance()` calls buried in functions → Suggest DI
- Shared state in SSR → Check for request leakage
- No reset/cleanup in tests → Red flag for test pollution
- Overuse as a 'global dumping ground' → Suggest state container"

---

## 8. SAMPLE INTERVIEW SCENARIOS & Responses

### Scenario 1: "Explain Singleton and when you'd use it"

**Strong Answer:**
"A Singleton ensures one instance of an object exists for the entire application. I'd use it for genuinely shared resources—like a logger or database pool—where multiple instances would cause problems.

However, I prefer module-scoped state in modern JavaScript. ES modules guarantee exactly one evaluation, so top-level variables are automatically Singletons without boilerplate.

I'd only use a class-based Singleton if I need inheritance or complex initialization logic. And critically, I'd always inject it through a DI container or constructor to keep tests isolated. Hardcoding `getInstance()` calls is a code smell."

---

### Scenario 2: "We have unit tests that are randomly failing. Suspecting global state issues."

**Strong Answer:**
"This screams Singleton state leakage. Tests are coupled through shared global state, causing order-dependent failures.

I'd start by:

1. Adding a `beforeEach` that resets the Singleton state
2. Or switching to module-scoped state + `vi.resetModules()` for module reset
3. Better yet, refactoring to inject dependencies so each test gets a fresh instance
4. Long-term: migrating away from Singleton pattern entirely if possible

The root cause is usually that the Singleton isn't designed for test isolation. That's a design debt I'd prioritize fixing."

---

### Scenario 3: "Should we use Singleton for our user session state?"

**Strong Answer:**
"No. Absolutely not.

In a server-rendered or full-stack app, session state is per-request or per-user, not application-wide. A Singleton would leak User A's session into User B's request—a critical security issue.

I'd use:

- **SSR context**: AsyncLocalStorage for per-request scope
- **React**: Context API or state container (Zustand) for per-tree scope
- **Node**: Request-scoped dependency injection

Session data should never be global. That's a hard rule."

---

### Scenario 4: "How do you test Singleton-heavy code?"

**Strong Answer:**
"It's difficult, which is why I avoid it. But when forced to:

1. **Expose reset()**: `beforeEach(() => { MyService.getInstance().reset(); })`
2. **Module reset**: `afterEach(() => { vi.resetModules(); })` for module-scoped state
3. **DI injection**: Pass the Singleton through constructor/factory, enabling test substitution
4. **Dependency injection container**: Use libraries like tsyringe so tests can register fakes

The cleanest solution is to not hardcode `getInstance()` calls in the first place. Make it injectable, and tests become trivial."

---

## 9. RED FLAGS & ANTI-PATTERNS

### ❌ Anti-Pattern: Singleton as a Kitchen Sink

```javascript
// DON'T DO THIS
class AppState {
  static #instance = null;
  userSession = null;
  featureFlags = null;
  analytics = null;
  notifications = null;
  // 20 more properties...

  static getInstance() {
    return (AppState.#instance ??= new AppState());
  }
}
```

**Better:** Separate concerns. Use a state container if you need multiple global objects.

---

### ❌ Anti-Pattern: Hardcoded getInstance() Throughout Code

```javascript
// DON'T DO THIS
function validateOrder(order) {
  const flags = FeatureFlags.getInstance();
  const logger = Logger.getInstance();
  const analytics = Analytics.getInstance();
  // ...
}
```

**Better:** Inject dependencies explicitly.

---

### ❌ Anti-Pattern: Singleton in Serverless/SSR Without Scoping

```javascript
// DON'T DO THIS in a Node.js app
let dbConnection = null;

app.get("/users", async (req, res) => {
  if (!dbConnection) {
    dbConnection = await createConnection();
  }
  // ALL requests share the same connection!
});
```

**Better:** Use connection pooling scoped to each request or a persistent pool designed for multiple requests.

---

## 10. FINAL CHECKLIST FOR INTERVIEW PREP

### ✅ You Should Be Able To:

- [ ] Define Singleton and explain the problem it solves
- [ ] Write both class-based and module-scoped implementations
- [ ] Articulate why module-scoped state is preferable in modern JS
- [ ] Identify the 4 major pitfalls (testing, coupling, SSR leakage, kitchen sink)
- [ ] Explain the testing gotchas and how to mitigate them
- [ ] Name 3+ alternatives and when to use each
- [ ] Discuss trade-offs between Singleton, DI, Context, and state stores
- [ ] Recognize anti-patterns in code reviews
- [ ] Relate personal experience with Singleton problems you've solved

### ✅ Interview Positioning:

- **Avoid:** Talking about Singleton as "just use the pattern"
- **Do:** Show skepticism and nuance ("I'd avoid it if possible")
- **Do:** Position yourself as an architect who thinks about trade-offs
- **Do:** Discuss testing and maintainability implications
- **Do:** Show familiarity with modern alternatives

### ✅ Key Quotes to Deploy:

1. "For 90% of cases, module-scoped state is the right answer."
2. "Singletons are a code smell in tests—that tells me something's wrong architecturally."
3. "I avoid hardcoding `getInstance()` calls. Dependencies should be explicit."
4. "In SSR, global state is dangerous. It's a security/data-leak risk."

---

## Quick Reference: One-Liner Definitions

| Pattern           | Definition                                          |
| ----------------- | --------------------------------------------------- |
| **Singleton**     | One instance, application lifetime, shared resource |
| **Module-scoped** | ESM module = one instance, simpler, preferred       |
| **DI Container**  | Register once, resolve anywhere, test-friendly      |
| **React Context** | Scope to component tree, not truly global           |
| **State Store**   | Modern hook-based state, Zustand/Jotai              |

---

## Additional Resources to Mention in Interview

- **ESM modules**: Understand ESM guarantees for singleton behavior
- **Dependency Injection**: Martin Fowler's articles on DI
- **AsyncLocalStorage**: Node.js docs for request scoping
- **Testing strategies**: Vitest/Jest module reset documentation
- **State management**: Zustand, Jotai, Valtio documentation

**Interview Closer:**
"I've learned that Singleton is more about understanding when _not_ to use it than about the implementation. In 8 years, I've migrated away from Singletons in favor of simpler patterns. That experience informs how I guide teams toward maintainable architectures."
