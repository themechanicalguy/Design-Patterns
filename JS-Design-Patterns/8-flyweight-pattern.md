# Flyweight Pattern

- A structural pattern that **saves memory and improves performance** by sharing immutable data (intrinsic state) across many objects, while keeping unique data (extrinsic state) separate and passed in when needed.

> **Core idea**: Instead of storing the same data in 50,000 objects, store it once and have all objects point to it.

## The Split: Intrinsic vs. Extrinsic State

| Intrinsic (Shared, Immutable) | Extrinsic (Unique, Passed In) |
| ----------------------------- | ----------------------------- |
| Values identical for all uses | Values that vary per consumer |
| Stored once in the flyweight  | Supplied at call time         |
| Should be frozen/immutable    | Can change freely             |

**Example (Chat app):**

- **Intrinsic**: author name, avatar, color, role (same for every message by that user)
- **Extrinsic**: message body, timestamp, screen position (unique per message)

## Simple Example

```javascript
// 1. Flyweight Factory - creates and caches shared objects
class AuthorFlyweightFactory {
  constructor() {
    this.authors = new Map(); // Cache
  }

  getAuthor(id, name, avatar, color) {
    // Return existing author if already created
    if (this.authors.has(id)) {
      return this.authors.get(id);
    }

    // Create new flyweight (intrinsic state)
    const author = Object.freeze({
      id,
      name,
      avatar,
      color,
      // All authors with same id share this exact object
    });

    this.authors.set(id, author);
    return author;
  }

  count() {
    return this.authors.size;
  }
}

// 2. Usage
const factory = new AuthorFlyweightFactory();

// Simulate 50,000 messages from 30 users
function createMessage(
  userId,
  userName,
  userAvatar,
  userColor,
  body,
  timestamp,
) {
  // Get shared flyweight author
  const author = factory.getAuthor(userId, userName, userAvatar, userColor);

  // Message stores only extrinsic state + reference to shared author
  return {
    author, // Reference to flyweight (intrinsic)
    body, // Extrinsic
    timestamp, // Extrinsic
  };
}

// Create messages
const messages = [];
for (let i = 0; i < 50000; i++) {
  const userId = Math.floor(Math.random() * 30) + 1; // 30 users
  messages.push(
    createMessage(
      userId,
      `User${userId}`,
      `/avatars/${userId}.jpg`,
      "#ff0000",
      `Message ${i}`,
      Date.now() - i * 1000,
    ),
  );
}

console.log("Total messages:", messages.length); // 50,000
console.log("Unique author objects:", factory.count()); // Only 30!
// Memory saved: 49,970 author objects not duplicated
```

## Where Flyweight Matters Today

| Use Case                  | What's Shared (Intrinsic)          | What's Unique (Extrinsic)             |
| ------------------------- | ---------------------------------- | ------------------------------------- |
| **Chat/virtual list**     | User profile data                  | Message content, timestamp            |
| **WebGL/Game rendering**  | Geometry, material                 | Transform matrix (position, rotation) |
| **Intl.NumberFormat**     | Formatter with locale/options      | The number to format                  |
| **Atomic CSS (Tailwind)** | CSS rule (`padding: 1rem`)         | Which element uses it                 |
| **Immutable.js/Immer**    | Unchanged tree branches            | Modified path only                    |
| **V8 Hidden Classes**     | Object shape (properties in order) | Actual property values                |


## When to Use

- Rendering **tens of thousands of similar objects** (virtual lists, canvas, WebGL)
- **Expensive construction** of shared objects (Intl formatters, regex compilation)
- **High GC pressure** from creating/destroying many objects
- When objects have clear **immutable shared data** and **mutable unique data**

## When NOT to Use

- Only **a few objects** — pool overhead costs more than savings
- **Shared data changes** — mutable flyweights cause bugs (always freeze!)
- **Construction is cheap** — `{x, y}` point pool is slower than just allocating
- **Keys are unbounded** — Map will leak memory without eviction strategy

## Advantages

- **Massive memory savings** — 50k objects share 30 flyweights instead of 50k copies.
- **Reduced GC pressure** — Fewer allocations = less work for garbage collector.
- **Faster rendering** — Hot path passes small extrinsic state; shared data is a pointer.
- **Identity works** — `author1 === author2` works if same key.
- **Enables optimization** — Engines optimize hidden classes when objects have identical shapes.

## Disadvantages

**Mutability bug risk** — `Object.freeze()` the flyweight.
**Cache invalidation/eviction** — Use `WeakMap` for automatic GC; implement LRU for bounded caches.
**Memory leaks** — Strong Map prevents GC; prefer `WeakMap` when keys are objects.
**Indirection/complexity** — Adds factory and lookup; don't use for simple cases.
**Harder to debug** — Shared object changed in one place affects all; freeze prevents this.

## Interview Tips

1. **Contrast with Object Pool**: Pool reuses objects to avoid allocation (e.g., database connections); Flyweight shares immutable data across many objects simultaneously.
2. **Name-drop modern variants**:
   - Intl.NumberFormat caching
   - Three.js InstancedMesh
   - Tailwind's atomic CSS
   - V8 hidden classes
3. **Key phrase**: "Flyweight is about **sharing** immutable data; Object Pool is about **reusing** any object."
4. **The factory is critical**: It enforces "one key → one flyweight" invariant. Without it, identity comparisons break.
5. **Watch for leaks**: If keys are unbounded (e.g., user IDs), use `WeakMap` (keys are objects) or implement LRU eviction.
6. **When asked for examples**:
   - Chat app with 50k messages, 30 authors
   - Currency formatter cache
   - Instanced mesh rendering in games
