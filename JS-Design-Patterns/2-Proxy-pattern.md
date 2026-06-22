# Proxy Pattern

## Quick Definition

- A Proxy is an object that acts as a stand-in or intermediary for another object, allowing you to intercept and control how properties are accessed or modified.

## Core Use Cases (What You Should Know)

### ✅ Valid Use Cases:

1. **Validation** — Enforce data constraints (type checking, ranges)
2. **Logging/Debugging** — Track property access and modifications
3. **Formatting** — Transform data on read/write
4. **Notifications** — Trigger side effects when state changes
5. **Lazy Loading** — Defer expensive computations
6. **Access Control** — Restrict or gate access to properties

### ❌ Avoid When:

- **Performance-critical code** — Proxies add overhead to every property access
- **Simplicity would suffice** — Use regular getter/setter methods instead
- **Hot loops** — Don't proxy in tight loops (benchmarks show 2-10x slowdown)
- **Complex logic better in class** — Heavy validation belongs in setters/methods, not proxies

---

## Interview Scenario & Responses

### Scenario 1: "Explain the Proxy pattern and a real use case"

**Strong Answer:**
"A Proxy intercepts property access and modification. I'd use it for validation or logging, but rarely in production code.

**Example:** Validating that a user object only accepts valid emails and ages:

```javascript
const user = { email: "", age: 0 };

const userProxy = new Proxy(user, {
  set: (obj, prop, value) => {
    if (prop === "email" && !value.includes("@")) {
      throw new Error("Invalid email");
    }
    if (prop === "age" && typeof value !== "number") {
      throw new Error("Age must be a number");
    }
    obj[prop] = value;
    return true;
  },
});

userProxy.email = "test@example.com"; // ✅ Works
userProxy.age = "25"; // ❌ Throws error
```

But honestly—for most cases, a simple setter method on a class is clearer and performs better."

---

### Scenario 2: "When would you actually use Proxy in production?"

**Strong Answer:**
"Rarely. Here's my decision tree:

1. **Do I need to intercept property access programmatically?** → Maybe Proxy
2. **Will this be called millions of times?** → Use class setters/getters instead
3. **Is this for a framework (Vue reactivity, MobX)?** → Yes, Proxy is perfect
4. **Is this for simple validation?** → A class with validation in the setter is clearer

Real example I've used: **API response caching**

```javascript
const apiCache = new Proxy(new Map(), {
  get: (cache, endpoint) => {
    if (cache.has(endpoint)) {
      console.log(`Cache hit for ${endpoint}`);
      return cache.get(endpoint);
    }
    console.log(`Cache miss for ${endpoint}`);
    return null;
  },
});
```

Another: **Framework-level reactivity** (Vue uses this heavily). But for business logic? Class methods are usually clearer."

---

### Scenario 3: "What's the performance impact of using Proxy?"

**Strong Answer:**
"Significant. Each property access goes through the handler—benchmarks show **2-10x slowdown** depending on handler complexity.

**When it matters:**

- Real-time data processing (thousands of updates/sec) → Avoid Proxy
- Web workers with tight loops → Avoid Proxy
- Framework reactivity (Vue, MobX) → Acceptable cost for the benefit

**When it doesn't matter:**

- User event handlers (click, form submission)
- API calls
- Occasional config object access

**My rule:** Profile first. If it's not a bottleneck, the code clarity matters more than 1ms overhead."

---

## Key Implementation Details

### Basic Structure:

```javascript
const target = {
  /* ... */
};

const proxy = new Proxy(target, {
  get: (obj, prop) => {
    // Called on: proxy.prop or proxy[prop]
    console.log(`Reading ${prop}`);
    return obj[prop];
  },
  set: (obj, prop, value) => {
    // Called on: proxy.prop = value
    console.log(`Setting ${prop} to ${value}`);
    obj[prop] = value;
    return true; // IMPORTANT: must return true
  },
});
```

### Use Reflect for Cleaner Code:

Reflect API provides methods (Reflect.get, Reflect.set) that align with Proxy handler methods, making it easier to manipulate the target object.

```javascript
// ❌ Old way
const proxy = new Proxy(obj, {
  get: (target, prop) => target[prop],
  set: (target, prop, value) => {
    obj[prop] = value; // Direct access
    return true;
  },
});

// ✅ Better way with Reflect
const proxy = new Proxy(obj, {
  get: (target, prop) => Reflect.get(target, prop),
  set: (target, prop, value) => Reflect.set(target, prop, value),
});
```

---

## Red Flags in Code Review

### ❌ Using Proxy for Simple Validation:

```javascript
// DON'T DO THIS
const userProxy = new Proxy(user, {
  set: (obj, prop, value) => {
    if (prop === "age" && value < 0) throw Error("Invalid");
    obj[prop] = value;
    return true;
  },
});
```

**Better:**

```javascript
class User {
  set age(value) {
    if (value < 0) throw Error("Invalid");
    this._age = value;
  }
}
```

### ❌ Deep Proxies in Loops:

```javascript
// DON'T DO THIS
for (let item of millionItems) {
  const proxy = new Proxy(item, {
    get: () => {
      /* expensive */
    },
  });
}
```

### ❌ Proxying Everything:

```javascript
// DON'T DO THIS - Proxy kitchen sink
const appState = new Proxy(
  {},
  {
    get: (obj, prop) => {
      /* logging, caching, etc */
    },
    set: (obj, prop, value) => {
      /* validation, notifications */
    },
  },
);
```

---

## Interview Talking Points

### What to Say:

✅ "Proxies are powerful but overused. I reach for them only when intercepting property access is genuinely necessary."

✅ "Performance matters. Proxy adds overhead—I benchmark if it's in a hot path."

✅ "For frameworks like Vue, Proxy enables reactivity elegantly. But for app code, class setters/methods are usually clearer."

✅ "If a Proxy handler does heavy work, that's a code smell. The logic should probably live elsewhere."

### What NOT to Say:

❌ "Proxies are great for everything" (they're not)

❌ "I use Proxy for all object validation" (overkill)

❌ "Performance isn't a concern with Proxy" (it is)

---

## Quick Decision Tree

| Situation                         | Use Proxy?  | Alternative                       |
| --------------------------------- | ----------- | --------------------------------- |
| Simple validation on one object   | No          | Class setter                      |
| API response caching layer        | Yes         | But consider a Map + function     |
| Framework reactivity (Vue)        | Yes         | Built-in mechanism                |
| Logging property access           | Conditional | Use class methods + middleware    |
| Tight loop, thousands/sec updates | No          | Direct object mutations           |
| Protecting against invalid data   | Conditional | Type system (TypeScript)          |
| Observing all property changes    | Yes         | Observer pattern or event emitter |

---

## Real-World Example Worth Mentioning

**Vue 3 Reactivity (Framework Use):**
Vue uses Proxies to track property access and trigger re-renders:

```javascript
// Simplified version of what Vue does
function reactive(target) {
  return new Proxy(target, {
    get(obj, prop) {
      // Track that this property was accessed
      track(obj, prop);
      return Reflect.get(obj, prop);
    },
    set(obj, prop, value) {
      const result = Reflect.set(obj, prop, value);
      // Trigger reactivity
      trigger(obj, prop);
      return result;
    },
  });
}
```

**Why this works:** Frameworks control the context. The overhead is worth it for automatic reactivity.

---

## Interview Closer

"I'd use Proxy when the problem specifically requires intercepting property access—frameworks do this well. For business logic, I prefer explicit class methods. It's clearer, performs better, and teammates can easily understand what's happening."

---

## Checklist Before Interview

✅ Understand `get` and `set` handlers  
✅ Know `Reflect` API basics  
✅ Be able to name 2-3 realistic use cases  
✅ Understand performance implications  
✅ Know when to avoid it (hot loops, premature optimization)  
✅ Can explain why Vue uses it for reactivity  
✅ Can articulate the difference between Proxy and class setters

---

## One-Liner Summary

"Proxy intercepts property access for validation, logging, or framework reactivity—but avoid it in performance-critical code and favor simpler patterns when possible."
