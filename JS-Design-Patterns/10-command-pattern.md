## Command Pattern – Interview Notes

### What is it?

The **Command pattern** turns a request (like "delete this" or "move that") into a first-class object. This object encapsulates the action, including all information needed to perform it and, crucially, **how to undo it**. This allows you to store, queue, log, or replay actions.

> **Core idea**: Separate the _decision_ to perform an action from the _execution_ of that action.

---

### Simple Example: Text Editor Undo/Redo

```javascript
// 1. The Receiver (the thing being acted upon)
class Document {
  constructor(text = "") {
    this.text = text;
  }
}

// 2. Command Interface: execute() and undo()
class InsertText {
  constructor(position, payload) {
    this.position = position;
    this.payload = payload;
  }

  execute(doc) {
    doc.text =
      doc.text.slice(0, this.position) +
      this.payload +
      doc.text.slice(this.position);
  }

  undo(doc) {
    // Reverse the insert by deleting the inserted text
    doc.text =
      doc.text.slice(0, this.position) +
      doc.text.slice(this.position + this.payload.length);
  }
}

class DeleteText {
  constructor(position, length) {
    this.position = position;
    this.length = length;
    this.removed = ""; // Store removed text for undo
  }

  execute(doc) {
    this.removed = doc.text.slice(this.position, this.position + this.length);
    doc.text =
      doc.text.slice(0, this.position) +
      doc.text.slice(this.position + this.length);
  }

  undo(doc) {
    // Re-insert the removed text
    doc.text =
      doc.text.slice(0, this.position) +
      this.removed +
      doc.text.slice(this.position);
  }
}

// 3. The Invoker (manages command history)
class History {
  constructor(doc) {
    this.doc = doc;
    this.past = []; // Undo stack
    this.future = []; // Redo stack
  }

  run(command) {
    command.execute(this.doc);
    this.past.push(command);
    this.future = []; // New action clears redo history
  }

  undo() {
    const command = this.past.pop();
    if (!command) return;
    command.undo(this.doc);
    this.future.push(command);
  }

  redo() {
    const command = this.future.pop();
    if (!command) return;
    command.execute(this.doc);
    this.past.push(command);
  }
}

// Usage
const doc = new Document("Hello world");
const history = new History(doc);

history.run(new InsertText(5, ",")); // "Hello, world"
history.run(new DeleteText(6, 6)); // "Hello,"
history.undo(); // "Hello, world"
history.redo(); // "Hello,"
```

**Key insight**: The `History` class doesn't know _how_ to insert or delete text. It just knows that every command has `execute()` and `undo()` methods. This decoupling is the pattern's power.

---

### Modern Variants You're Already Using

| Variant                  | Example                                              | How It's a Command                                                   |
| ------------------------ | ---------------------------------------------------- | -------------------------------------------------------------------- |
| **Redux Actions**        | `{ type: 'todos/add', payload: 'Learn Redux' }`      | Action is the command, reducer is the receiver, store is the invoker |
| **GraphQL Mutations**    | `mutation { addTodo(text: "Learn GraphQL") { id } }` | Mutation name + payload is the command                               |
| **State Machine Events** | `machine.send({ type: 'SUBMIT' })`                   | Event is the command, transition table is the receiver               |
| **Job Queues**           | BullMQ job with `name: 'send-email'` and `data`      | Job spec is a serialized command                                     |

---

### When to Use

- **Undo/Redo** is required (the classic case)
- **Queuing, scheduling, or logging** actions (e.g., background jobs, analytics events)
- **Sending actions across a network** (commands as serializable objects)
- **Macro recording** (record a sequence of commands to replay later)
- **You need to support "optimistic updates"** (apply locally, reconcile later)

---

### When NOT to Use

- A simple **function callback** does the job (no need for the object overhead)
- **Only one place** calls the action and you never need undo/queue/logging
- Commands become **too large/complex** (e.g., capturing entire application state for undo)

---

### Advantages

| Advantage                           | Explanation                                                                               |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| **Decouples invoker from receiver** | The invoker (e.g., `History`) doesn't need to know about specific actions or their logic. |
| **Makes undo/redo straightforward** | Each command carries its own undo logic, enabling a simple stack.                         |
| **Enables queuing and logging**     | Commands are objects you can store, serialize, and replay.                                |
| **Supports macro commands**         | Combine multiple commands into one (e.g., "MacroCommand") for bulk operations.            |
| **Facilitates optimistic UI**       | Apply a command locally, then reconcile with server response.                             |

---

### Disadvantages

| Disadvantage                               | Mitigation                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Adds complexity and boilerplate**        | Use simple functions for fire-and-forget actions; only wrap in command when needed.                          |
| **Memory overhead** (history stack grows)  | Limit history size; store only minimal data needed for undo (e.g., store `removed` text, not full document). |
| **Stale undo** issues                      | Store snapshots of the minimal affected data at execution time.                                              |
| **Class explosion** (many command classes) | Use a discriminated union object (`{ type, payload }`) instead of separate classes.                          |

---

### Command vs. Strategy vs. Callback

| Aspect             | Command                           | Strategy                                    | Callback                               |
| ------------------ | --------------------------------- | ------------------------------------------- | -------------------------------------- |
| **Intent**         | Capture a request as an object    | Pick an algorithm at runtime                | Call a function when something happens |
| **When to use**    | Need undo/redo, queue, log        | Interchangeable algorithms (sort, compress) | Fire-and-forget actions                |
| **Has state?**     | Yes (holds payload and undo data) | Usually stateless                           | Encloses scope                         |
| **Supports undo?** | Yes (core feature)                | No                                          | No                                     |

---

### Interview Tips

1. **Key phrase**: "The Command pattern turns actions into objects, which gives you the ability to **store, queue, log, and undo** them."

2. **Classic example**: Always mention **undo/redo in a text editor**. It's the textbook example and clearly demonstrates the `execute`/`undo` interface.

3. **Modern equivalents**: Point out that Redux actions, GraphQL mutations, and state machine events are all commands. This shows you recognize the pattern beyond the GoF book.

4. **When to choose a simple callback**: Emphasize that you _wouldn't_ use a command for everything. A plain function is better when you don't need the extra capabilities.

5. **Handling serialization**: Commands should be serializable (JSON) for network transmission or persistent storage. Avoid storing large object graphs or functions in them.
