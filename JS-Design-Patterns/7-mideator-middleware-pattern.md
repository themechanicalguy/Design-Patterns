# Mediator Pattern

- A mediator is an object that sits in the middle of components, coordinating communication between them.
- Instead of components knowing about each other directly (which creates **N² connections**), every component talks **only to the mediator** — each has exactly one line of communication.

> **Analogy**: A moderator in a chat room — every message goes through them, they enforce rules, and participants don't need to know each other by name.

## Core Idea

- The mediator **owns the workflow logic** — it decides what happens next based on current state. 
- Components have a tiny contract with the mediator (e.g., call `notify()` with an event), but they don't know which component comes next or make decisions about the flow.

## Mediator vs. Related Patterns

| Pattern                 | Direction                       | Owns Logic?                  | Components Know About It?        |
| ----------------------- | ------------------------------- | ---------------------------- | -------------------------------- |
| **Mediator**            | Multidirectional — talks back   | ✅ Yes — workflow lives here | ✅ Yes — they call its API       |
| **Event Bus (Pub/Sub)** | Fire-and-forget                 | ❌ No — just routing         | ✅ Yes — they publish/subscribe  |
| **Facade**              | Unidirectional — caller invokes | ❌ No — just delegation      | Usually only caller's side knows |

**Quick test**: If the middle thing **makes decisions**, it's a mediator. If it just routes messages without inspecting them, it's a bus. If it simplifies access to something complicated without coordinating multiple parties, it's a facade.

## When to Use

- **3+ components** that interact with non-trivial rules
- **Multi-step workflows:** form wizards, checkout flows, upload with pause/resume/cancel
- When adding/removing a component shouldn't require changes to other components
- When the coordination logic is complex enough to centralize

**Progressive complexity**: Start with a simple mediator → evolve to middleware pipeline → graduate to a **state machine** (like XState) for genuinely complex coordination.

## When NOT to Use

- Only **2 components** that always talk to each other — direct call is simpler
- One-off events with no coordination — plain event bus or callback is enough
- Pipelines where every step always runs in order — simple function composition is clearer
- The mediator adds more overhead than value — "below 3 components, it's overhead"

## Advantages

**Reduces coupling** — Components don't import each other; change one component doesn't ripple through the system.
**Centralized logic** — Business rules / workflow live in one place — easy to change (e.g., skip address step for B2B accounts in one branch).
**Improves testability** — Mediator can be tested in isolation; components can be tested with a mock mediator.
**Single responsibility** — Each component focuses on its own UI/presentation; mediator handles coordination.

## Disadvantages

**God-object risk** — mediator becomes a 4,000-line monolith. Split by domain (`CheckoutMediator`, `UploadMediator`, `ChatMediator`).
**Hard to trace at runtime** — "what happens when I click this?" becomes a detective story. Structured logging with correlation IDs; state-machine visualizers (XState).
**Re-entrant notifications** — synchronous emits cause surprising recursion. Queue events with `queueMicrotask` so each finishes before the next starts.
**Components secretly knowing each other** (importing for "just the type," event names encoding other components) — Watch for it in code reviews.

## Example

### Without Mediator (Tight Coupling)

```javascript
class User {
  constructor(name) {
    this.name = name;
    this.friends = [];
  }

  addFriend(friend) {
    this.friends.push(friend);
  }

  sendMessage(message, recipient) {
    // User knows about recipient directly
    recipient.receiveMessage(message, this.name);
  }

  receiveMessage(message, sender) {
    console.log(`${this.name} received from ${sender}: ${message}`);
  }
}

// Usage - N² connections
const alice = new User("Alice");
const bob = new User("Bob");
const charlie = new User("Charlie");

alice.addFriend(bob);
alice.addFriend(charlie);
bob.addFriend(alice);
bob.addFriend(charlie);
charlie.addFriend(alice);
charlie.addFriend(bob);

alice.sendMessage("Hi Bob!", bob); // Direct to Bob
bob.sendMessage("Hi Alice!", alice); // Direct to Alice
// Adding a new user? Need to connect to everyone!
```

**Problems:**

- Every user needs to know every other user
- Adding a 4th user means 3 new connections
- No central control (can't moderate, log, or broadcast)

---

### With Mediator (Loose Coupling)

```javascript
// 1. Mediator - central coordinator
class ChatRoom {
  constructor() {
    this.users = {};
    this.messageLog = [];
  }

  register(user) {
    this.users[user.name] = user;
    user.chatRoom = this; // Give user reference to mediator
  }

  // The mediator controls ALL communication
  sendMessage(sender, message, recipientName) {
    // Centralized logic in one place
    this.messageLog.push({
      from: sender,
      to: recipientName,
      message,
      time: new Date(),
    });

    // Moderation check
    if (this.containsSpam(message)) {
      console.log(`🚫 Message from ${sender} blocked (spam)`);
      return;
    }

    // Find recipient
    const recipient = this.users[recipientName];
    if (!recipient) {
      console.log(`❌ User "${recipientName}" not found`);
      return;
    }

    // Deliver message
    recipient.receive(message, sender);

    // Optional: broadcast to admin
    this.notifyAdmin(sender, recipientName, message);
  }

  broadcast(sender, message) {
    // Broadcast to ALL users
    Object.keys(this.users).forEach((name) => {
      if (name !== sender) {
        this.users[name].receive(`[BROADCAST] ${message}`, sender);
      }
    });
  }

  containsSpam(message) {
    return message.includes("buy now") || message.includes("$$$");
  }

  notifyAdmin(sender, recipient, message) {
    console.log(`📋 Admin log: ${sender} → ${recipient}: "${message}"`);
  }

  getHistory() {
    return this.messageLog;
  }
}

// 2. User - knows ONLY about the mediator
class User {
  constructor(name) {
    this.name = name;
    this.chatRoom = null; // Set by mediator
  }

  send(message, recipientName) {
    // User doesn't know recipient - mediator handles everything
    this.chatRoom.sendMessage(this.name, message, recipientName);
  }

  broadcast(message) {
    this.chatRoom.broadcast(this.name, message);
  }

  receive(message, sender) {
    console.log(`💬 ${this.name} received from ${sender}: "${message}"`);
  }
}

// 3. Usage - only N connections to mediator
const chatRoom = new ChatRoom();

const alice = new User("Alice");
const bob = new User("Bob");
const charlie = new User("Charlie");

chatRoom.register(alice);
chatRoom.register(bob);
chatRoom.register(charlie);

// Users only talk to mediator
alice.send("Hi Bob!", "Bob");
bob.send("Hey Alice!", "Alice");
charlie.send("Hello everyone!", "Bob");

// Broadcast
alice.broadcast("Good morning all!");

// Spam gets blocked
bob.send("Buy now $$$", "Alice");
// 🚫 Message from Bob blocked (spam)

// Check history
console.log("📜 Chat history:", chatRoom.getHistory());
```

## What's Better?

| Aspect             | Without Mediator                   | With Mediator                       |
| ------------------ | ---------------------------------- | ----------------------------------- |
| **Connections**    | N² (6 for 3 users)                 | N (3 connections to mediator)       |
| **Add new user**   | Must connect to all existing users | Just `register()` once              |
| **Add moderation** | Modify every user class            | Change one method: `containsSpam()` |
| **Add logging**    | Modify every user                  | Add one line in mediator            |
| **Broadcast**      | Each user needs list of all users  | Mediator handles it                 |
| **Testing**        | Need all users present             | Test mediator in isolation          |

---

## Key Takeaway

**Components (Users) → talk ONLY to Mediator (ChatRoom) → Mediator owns all coordination logic**

- ✅ Easy to add features (logging, spam filter, broadcast)
- ✅ Easy to add new users
- ✅ Single place to change business rules
- ❌ Mediator can become bloated (split into `SpamFilter`, `Logger`, `Router` if needed)

### Interview Tips

1. **Contrast with Observer/Event Bus**: Mediator is **centralized and decision-making**; Event Bus is **decentralized routing**.
2. **Know the "N² → N" reduction**: Without mediator, N components have N² connections; with mediator, N connections to the center.
3. **Middleware is Mediator in pipeline form**: Redux middleware, Express middleware, Apollo Link — all are mediators dressed as a pipeline.
4. **State machines are Mediator 2.0**: For complex coordination, the mediator becomes a finite state machine (XState).
5. **Beware the God-object**: The mediator coordinates — it doesn't do everything. Split by domain.
