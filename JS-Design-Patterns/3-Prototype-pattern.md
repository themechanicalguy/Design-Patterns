# Prototype Pattern

- In Prototype Pattern objects share properties / methods by delegating lookups to another object ([[Prototype]]) instead of each instance carrying its own copy.
- Properties and methods are delegated to objected linked to a Prototype. It can be looked up in prototype chain.

## Core mechanic

Every object has an internal [[Prototype]] slot pointing to another object or null. On a property read, the engine checks own properties first, then walks the chain until found or null.

## Core Concept: How It Works

### The Prototype Chain:

When you access a property on an object that doesn't exist directly on it, JavaScript walks down the **prototype chain** looking for that property:

```javascript
class Dog {
  constructor(name) {
    this.name = name; // Instance property
  }

  bark() {
    // Shared via prototype
    return "Woof!";
  }
}

const dog1 = new Dog("Daisy");
const dog2 = new Dog("Max");

// Both dogs share the same bark method
// dog1 and dog2 each have their own 'name'
// But bark() lives only once in Dog.prototype
```

- Methods are shared; properties are unique per **instance**.

## Interview Scenarios & Responses

### Scenario 1: "Explain the Prototype Pattern and its benefit"

**Strong Answer:**
"The Prototype Pattern lets objects share methods and properties through the prototype chain, reducing memory usage.

Here's why it matters: If I create 10,000 `User` objects, I don't want 10,000 copies of the `login()` method. Instead, all instances reference the same method on `User.prototype`. This is automatic in JavaScript—ES6 classes do this by default.

```javascript
class User {
  constructor(email) {
    this.email = email; // Each user gets their own email
  }

  login() {
    // All users share this one method
    console.log(`${this.email} logged in`);
  }
}

// Memory efficiency: 10,000 instances, 1 login method
const users = Array(10000)
  .fill(0)
  .map((_, i) => new User(`user${i}@example.com`));
```

This is one reason prototypal inheritance is so efficient in JavaScript."

---

### Scenario 2: "Explain the prototype chain and how it impacts lookups"

**Strong Answer:**
"The prototype chain is JavaScript's lookup mechanism. When you access a property, JavaScript searches:

1. The object itself
2. The object's `__proto__` (which is `Constructor.prototype`)
3. The prototype's `__proto__` (parent class)
4. And so on... until it reaches `Object.prototype`

```javascript
dog1.bark();
// Lookup:
// 1. Look for bark on dog1 → Not found
// 2. Look on dog1.__proto__ (Dog.prototype) → Found! Call it
```

This is why inheritance works:

```javascript
class Animal {
  eat() {
    return "Eating";
  }
}

class Dog extends Animal {
  bark() {
    return "Woof!";
  }
}

const dog = new Dog();
dog.bark(); // Found on Dog.prototype
dog.eat(); // Not on Dog.prototype, found on Animal.prototype ✅
```

The chain goes: dog → Dog.prototype → Animal.prototype → Object.prototype"

---

### Scenario 3: "What's the difference between instance properties and prototype properties?"

**Strong Answer:**

"Instance properties are unique per object. Prototype properties are shared.

```javascript
class User {
  constructor(name) {
    this.name = name; // Instance property (unique)
    this.created = Date.now(); // Instance property (unique)
  }

  login() {
    // Prototype method (shared)
    console.log(this.name + " logged in");
  }
}

const user1 = new User("Alice");
const user2 = new User("Bob");

// Instance properties are different
user1.name !== user2.name; // true

// Prototype methods are the same
user1.login === user2.login; // true - same function in memory
```

**Why it matters:** Don't put methods in the constructor. They should be on the prototype to save memory."

## Advantages

- Memory efficiency — one shared method reference across 10,000 instances, not 10,000 copies.
- Runtime flexibility — add a method to the prototype and every existing instance gets it immediately.
- No class ceremony — `Object.create` gives inheritance without constructors.
- Cheap object creation — <template> + cloneNode(true) avoids re-parsing HTML; far faster than innerHTML in a loop.

## Disadvantages

- Readability — long chains make it non-obvious where a property actually lives; debugging gets harder.
- Prototype pollution — writing to **proto**/constructor from untrusted input can poison the global chain (real CVEs in lodash.merge, set-value, dot-prop). Mitigate with Object.create(null) or Map.
- Lookup cost — deep chains mean more hops per read.
- Shared mutable state trap — putting objects/arrays on the prototype means all instances mutate the same reference.
- Extending built-ins (Array.prototype.foo = ...) is a classic anti-pattern.

## When to use

- Many objects need the same behavior → prototype delegation via class or Object.create.
- Reusing a DOM subtree repeatedly → <template> + cloneNode(true).
- Test data builders with sensible defaults → base object + spread overrides.
- Config variants → spread for one level, structuredClone for nested.
- Duplicating a class instance while keeping instanceof → Object.create(Object.getPrototypeOf(x)) + deep copy of own props.

## When NOT to use

- Objects need independent state, not shared behavior — delegation shares behavior, cloning shares state. Wrong tool.
- Keys come from user input — use Map or Object.create(null).
- A plain factory function or module would do — don't add a chain for its own sake.
- Deep-cloning functions, DOM nodes, or class instances with structuredClone — it drops the prototype and returns a plain object.

## Likely follow-ups

- Difference between **proto** and prototype? — prototype is a property on constructor functions used to set up new instances; **proto** is the accessor for an object's actual [[Prototype]]. Prefer Object.getPrototypeOf / setPrototypeOf.
- Why is Object.setPrototypeOf slow? — it de-optimizes engine inline caches; set the prototype at creation time instead.
- `structuredClone` vs `JSON.parse(JSON.stringify())`? — the former handles Date, Map, Set, RegExp, typed arrays, and cyclic references; the latter silently destroys all of them.
- Spread gotcha — { ...base } is one level deep, so copy.headers === base.headers; mutating the nested object hits the original too

## One-Liner Summary

"The Prototype Pattern shares methods across instances via the prototype chain—it's how JavaScript works, and understanding it is essential for writing efficient code."
