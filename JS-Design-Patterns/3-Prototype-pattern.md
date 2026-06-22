# Prototype Pattern

## Quick Definition

The Prototype Pattern shares properties and methods among multiple objects of the same type through the **prototype chain**—avoiding duplication and saving memory.

In JavaScript, this is not optional—it's how the language fundamentally works.

---

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

**Key insight:** Methods are shared; properties are unique per instance.

---

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

---

### Scenario 4: "When would you use Object.create vs ES6 classes?"

**Strong Answer:**
"ES6 classes are clearer and the modern standard. I use them 99% of the time.

```javascript
// ✅ Modern - Use this
class Dog {
  constructor(name) {
    this.name = name;
  }
  bark() {
    return "Woof!";
  }
}
```

But `Object.create` is useful for:

**1. Simple object inheritance:**

```javascript
const dog = {
  bark() {
    return "Woof!";
  },
};

const pet = Object.create(dog);
pet.bark(); // Inherited via prototype
```

**2. Legacy code or lightweight objects:**

```javascript
const shape = {
  getArea() {
    /* ... */
  },
};

const circle = Object.create(shape);
circle.radius = 5;
```

I've used `Object.create` in:

- Framework internals (simplifying inheritance without class boilerplate)
- Testing (creating lightweight mock objects)
- Plugin systems (dynamic prototype assignment)

But for regular code? Classes are clearer."

---

## Key Implementation Details

### ES6 Classes (Modern):

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog("Max");
dog.speak(); // "Max barks"
```

### Object.create (Legacy Pattern):

```javascript
const animal = {
  speak() {
    console.log(`${this.name} makes a sound`);
  },
};

const dog = Object.create(animal);
dog.name = "Max";
dog.speak(); // Inherited via prototype chain
```

### Adding Methods After Instance Creation:

```javascript
class Dog {
  constructor(name) {
    this.name = name;
  }
  bark() {
    return "Woof!";
  }
}

const dog1 = new Dog("Daisy");

// Add method to ALL instances (added to prototype)
Dog.prototype.play = () => console.log("Playing!");
dog1.play(); // ✅ Works - all instances get it
```

---

## Red Flags in Code Review

### ❌ Methods in Constructor (Creates Duplicates):

```javascript
class Dog {
  constructor(name) {
    this.name = name;
    this.bark = () => "Woof!"; // ❌ Each instance gets its own copy
  }
}

// Creates 1000 separate bark functions in memory
const dogs = Array(1000)
  .fill(0)
  .map((_, i) => new Dog(`Dog${i}`));
```

**Better:**

```javascript
class Dog {
  constructor(name) {
    this.name = name;
  }
  bark() {
    return "Woof!";
  } // ✅ Shared via prototype
}
```

### ❌ Modifying Object.prototype (Breaks Everything):

```javascript
// DON'T EVER DO THIS
Object.prototype.customMethod = () => {}; // Pollutes ALL objects
```

### ❌ Confusion Between **proto** and prototype:

```javascript
// Confusing code
dog1.__proto__ = somethingElse; // Don't manually reassign __proto__
```

**Better:**

```javascript
// Use Object.setPrototypeOf if you must
Object.setPrototypeOf(dog1, newProto);
```

---

## Interview Talking Points

### What to Say:

✅ "The Prototype Pattern is fundamental to JavaScript—all objects use it through the prototype chain."

✅ "Methods should be on the prototype to avoid duplication and save memory."

✅ "Instance properties go in the constructor; methods go on the prototype."

✅ "ES6 classes handle prototypes automatically and are clearer than Object.create."

✅ "The prototype chain enables inheritance elegantly."

### What NOT to Say:

❌ "Prototypes are optional" (they're not—all objects have them)

❌ "Put methods in the constructor" (memory waste)

❌ "Object.create is the modern way" (ES6 classes are)

---

## Memory Efficiency Example (Real Impact)

```javascript
// ❌ WITHOUT prototype (wasteful)
class BadUser {
  constructor(name) {
    this.name = name;
    this.login = () => console.log("Login"); // Duplicated
    this.logout = () => console.log("Logout"); // Duplicated
    this.validate = () => true; // Duplicated
  }
}

// Create 100k users
const badUsers = Array(100000)
  .fill(0)
  .map((_, i) => new BadUser(`user${i}`));
// Memory: 300,000+ function copies (100k × 3 methods)

// ✅ WITH prototype (efficient)
class GoodUser {
  constructor(name) {
    this.name = name;
  }
  login() {
    console.log("Login");
  }
  logout() {
    console.log("Logout");
  }
  validate() {
    return true;
  }
}

const goodUsers = Array(100000)
  .fill(0)
  .map((_, i) => new GoodUser(`user${i}`));
// Memory: 3 function copies (shared via prototype)
```

**The difference matters at scale.**

---

## Quick Reference: Prototype vs Direct Properties

| Aspect           | Instance Property        | Prototype Property            |
| ---------------- | ------------------------ | ----------------------------- |
| **Location**     | On the object itself     | On Constructor.prototype      |
| **Memory**       | Duplicated per instance  | Shared among all instances    |
| **Access**       | Direct: `obj.prop`       | Via prototype chain           |
| **Modification** | Affects one instance     | Affects all instances         |
| **Use case**     | Data (name, email, etc.) | Methods (login, logout, etc.) |

---

## Interview Closer

"The Prototype Pattern is so fundamental in JavaScript that you're using it all the time. My job as a lead is making sure my team puts data in constructors and methods on prototypes. When I see methods in the constructor, that's a red flag—it's wasting memory and suggests a misunderstanding of how JavaScript works."

---

## Checklist Before Interview

✅ Understand the prototype chain and how lookups work  
✅ Know `__proto__` vs `prototype` property  
✅ Explain why methods on prototype save memory  
✅ Can write both ES6 class and Object.create patterns  
✅ Know when to put properties in constructor vs prototype  
✅ Understand inheritance via extends  
✅ Can identify memory wasteful patterns in code  
✅ Know Object.create use cases (few and specific)

---

## One-Liner Summary

"The Prototype Pattern shares methods across instances via the prototype chain—it's how JavaScript works, and understanding it is essential for writing efficient code."
