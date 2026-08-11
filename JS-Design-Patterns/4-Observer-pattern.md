# Observer Pattern

- The Observer Pattern allows a subject (publisher) to maintain a list of observers (subscribers) and automatically notify them when something changes.
- It decouples the subject from observers, -- each observer doesn't need to know about the others.
- The Observer pattern defines a one-to-many dependency between objects
- This pattern already exists in many JS concepts like - `addEventListner`, `IntersectionObserver`, `MutationObserver`, `ResizeObserver`, `Promise.then`.
- In Redux `Store.subscribe` and in React re-render on state change logic.

## Core Concept: Subject + Observers

- Subject keeps a list of observers and exposes `subscribe / unsubscribe / notify`.
- Observers only expose an update callback. Neither side knows the other's concrete type.

**Pattern components:-**

- **Subject**: Maintains observers and notifies them
- **Observers**: Functions/objects that react to notifications
- **Key benefit**: Decoupling—subject doesn't know what observers do

## Example

```javascript
// 1. Subject — knows how to manage and notify observers
class Subject {
  #observers = new Set();

  subscribe(observer) {
    this.#observers.add(observer);
    // Return unsubscribe function for easy cleanup
    return () => this.#observers.delete(observer);
  }

  notify(payload) {
    for (const observer of this.#observers) {
      observer(payload);
    }
  }
}

// 2. Observers — small, focused functions that react to updates
const drawChart = (tick) => {
  /* redraw chart with new price */
};
const flashRow = ({ symbol, price, previous }) => {
  if (symbol === "AAPL") {
    document
      .querySelector('[data-symbol="AAPL"]')
      ?.classList.toggle("up", price > previous);
  }
};
const logTick = (tick) => console.debug("[tick]", tick);

// 3. Wire it up
const ticker = new Subject();

const unsubChart = ticker.subscribe(drawChart);
const unsubRow = ticker.subscribe(flashRow);
const unsubLog = ticker.subscribe(logTick);

// 4. When data arrives, subject notifies all observers
socket.addEventListener("message", (event) => {
  const tick = JSON.parse(event.data);
  ticker.notify(tick); // All observers react automatically
});

// 5. Cleanup when done
unsubRow(); // Row stops receiving updates
```

**Key insight:** The ticker doesn't know about charts, rows, or logs. It just broadcasts ticks. Each observer decides what to do with the data.

**Why the unsubscribe function matters:** Cleaner ergonomics—caller doesn't need to store references.

## Interview Scenarios & Responses

### Scenario 1: "Explain the Observer Pattern with a real example"

**Strong Answer:**
"Observer is used when you need one-to-many relationships where multiple consumers react to the same event without the source knowing about them.

**Real example:** Stock ticker with multiple consumers:

```javascript
const ticker = new Subject();

// Chart redraws every frame
const drawChart = (tick) => {
  requestAnimationFrame(() => renderChart(tick));
};

// Watchlist flashes
const flashRow = (tick) => {
  if (tick.symbol === "AAPL") flashElement(tick);
};

// Audit log records
const logTick = (tick) => console.log("[tick]", tick);

// All subscribe independently
const unsubChart = ticker.subscribe(drawChart);
const unsubRow = ticker.subscribe(flashRow);
const unsubLog = ticker.subscribe(logTick);

// Ticker broadcasts—doesn't care who's listening
socket.on("tick", (data) => ticker.notify(data));
```

Key insight: The ticker doesn't know about chart, watchlist, or logger. Each observer is focused and independent. If I need to change how the chart works, the ticker is untouched."

---

### Scenario 2: "Observer vs Pub/Sub—what's the difference?"

**Strong Answer:**
"They're often confused, but the distinction matters architecturally:

| Aspect             | Observer                     | Pub/Sub                                 |
| ------------------ | ---------------------------- | --------------------------------------- |
| **Coupling**       | Observer knows the subject   | Publisher & subscriber know only broker |
| **Topics**         | All observers get all events | Subscribers pick specific topics        |
| **Implementation** | Subject.subscribe()          | EventBus.publish(topic, data)           |
| **Typical use**    | Domain object (ticker, user) | App-wide event bus across modules       |

**Example Observer (direct coupling to subject):**

```javascript
ticker.subscribe(drawChart); // Observer knows it's ticker
```

**Example Pub/Sub (decoupled via broker):**

```javascript
eventBus.subscribe("stock/AAPL", drawChart); // No direct subject reference
eventBus.publish("stock/AAPL", tickData);
```

I use Pub/Sub when modules are unrelated; Observer when there's a clear subject that owns the data."

---

### Scenario 3: "What about memory leaks with Observer?"

**Strong Answer:**
"Memory leaks are the biggest risk. Every subscription is a reference from subject to observer. If you don't unsubscribe, the observer and its closure stay alive.

**Problem:**

```javascript
class Dashboard {
  constructor() {
    ticker.subscribe(this.handleTick); // Reference held forever
    // If Dashboard is destroyed, ticker still holds reference!
  }
}
```

**Solutions I use:**

1. **AbortSignal with EventTarget (best):**

```javascript
const controller = new AbortController();

ticker.addEventListener("tick", drawChart, { signal: controller.signal });
ticker.addEventListener("tick", flashRow, { signal: controller.signal });

// On cleanup, removes all listeners instantly
controller.abort();
```

2. **Return unsubscribe function:**

```javascript
const unsub = ticker.subscribe(drawChart);
// Later:
unsub(); // Done, no reference tracking needed
```

3. **Tie to component lifecycle:**

```javascript
useEffect(() => {
  const unsub = ticker.subscribe(drawChart);
  return () => unsub(); // Cleanup on unmount
}, []);
```

I always ask: 'How will we clean this up?' If there's no clear cleanup, it's a memory leak waiting to happen."

---

### Scenario 4: "When would you NOT use Observer?"

**Strong Answer:**
"Observer is powerful but not always right:

❌ **Don't use when:**

- **One-shot operations:** A promise is better—`notify()` returns no value
- **Subject and observer always live together:** Direct method call is simpler
- **Need request/response:** Observer is fire-and-forget. If you need an answer back, use promises or a command bus
- **Just a few notifications:** Adding a custom method is clearer

✅ **Do use when:**

- Multiple independent consumers react to the same event
- Subject doesn't know or care who's listening
- Events repeat over time (not one-time)
- Consumers are created/destroyed dynamically

````javascript
// ❌ Overkill - just call the function
const result = doSomething();
observer.notify(result);  // Use: const result = observer.doSomething();

// ✅ Perfect - multiple independent consumers
socket.on('message', (msg) => bus.notify(msg));  // Lots of listeners
```"

---

### Modern Alternative: EventTarget + AbortSignal
Since 2017, every browser ships constructable EventTarget—the same machinery the DOM uses for addEventListener:

```javascript
class Ticker extends EventTarget {
  push(tick) {
    this.dispatchEvent(new CustomEvent('tick', { detail: tick }));
  }
}

const ticker = new Ticker();
const controller = new AbortController();

ticker.addEventListener('tick', drawChart, { signal: controller.signal });
ticker.addEventListener('tick', flashRow, { signal: controller.signal });

// Cleanup is one line, removes all listeners
controller.abort();
````

**Advantages:**

- Built-in browser API
- AbortSignal cleanup is elegant
- No custom Subject class needed

## Common Pitfalls Summary

| Pitfall               | Impact         | Solution                                       |
| --------------------- | -------------- | ---------------------------------------------- |
| Forgotten unsubscribe | Memory leaks   | Use AbortSignal or return unsub function       |
| Relying on order      | Silent bugs    | Model dependencies explicitly                  |
| Synchronous storms    | Frame drops    | Batch notifications, use requestAnimationFrame |
| Re-entrant calls      | Recursion bugs | Queue notifications or avoid recursion         |
| No cleanup plan       | Data leaks     | Plan cleanup before subscribing                |

---

## Interview Closer

"Observer is elegant for decoupling, but it requires discipline around cleanup. I always ask: 'How will this get cleaned up?' and plan it upfront. With AbortSignal, that's now simple. And honestly, for most cases, I reach for EventTarget rather than building a custom Subject—why not use the browser's built-in?"

---

## Checklist Before Interview

✅ Understand subject-observer relationship and decoupling benefit  
✅ Know memory leak risks and 3+ solutions (AbortSignal, unsub, lifecycle)  
✅ Can explain Observer vs Pub/Sub with examples  
✅ Know when NOT to use it (one-shot, tight coupling, no answer needed)  
✅ Familiar with EventTarget + AbortSignal pattern  
✅ Aware of modern variants (signals, RxJS, async iterators)  
✅ Can identify red flags (no cleanup, order assumptions, storms)  
✅ Can articulate synchronous vs queued notification trade-offs

---

## One-Liner Summary

"Observer decouples subjects from multiple independent consumers—but requires planning cleanup upfront to avoid memory leaks. Use EventTarget + AbortSignal in modern code."
