# Module Pattern

- The Module Pattern in modern JavaScript means **ES modules**—a file-based scoping system where anything not exported is private by default.
- No closures tricks needed; the language provides privacy built-in.

**Core principles:**

1. A module is a file. The file has its own scope.
2. Anything not exported is private.
3. A module evaluates once per realm. Every importer sees the same bindings.
4. Imports are static (hoisted); `import()` is dynamic (promise-based).

---

## Interview Scenarios & Responses

### Scenario 1: "Explain the Module Pattern and why it matters"

**Strong Answer:**

"In modern JavaScript, the Module Pattern is simply ES modules—the language gives you privacy for free through file scope.
No need for closures or naming conventions.

```javascript
// inventory.js
const cache = new Map(); // Private—unreachable outside this file

export function get(sku) {
  return cache.get(sku);
}

export async function refresh() {
  const response = await fetch("/api/inventory");
  const items = await response.json();
  cache.clear();
  for (const item of items) cache.set(item.sku, item);
}
```

**Why this matters:**

- `cache` is truly private; no way to access it externally
- Only `get` and `refresh` are available to consumers
- Clear API surface—fewer exports = easier to refactor and reason about

**As a lead, I focus on:**

- Using named exports by default (easier to tree-shake and refactor)
- Default exports only for single-concept files (React components, classes)
- Keeping exports minimal—if a module has 20 exports, it probably contains multiple concepts"

---

### Are ES6 Modules hoisted ?

- Yes, static imports are hoisted. Dynamic imports are NOT..
- However, because they are evaluated during the compilation phase (before any code actually runs), their behavior feels a bit different from traditional var or function hoisting.

**How ES6 Module Hoisting Works**

When the JavaScript engine loads a file containing ES6 modules, it splits the process into two main phases:

1. _Compilation/Parsing Phase:_ The engine scans the file, finds all import statements, and loads the required modules. The imported bindings are created in memory before a single line of your actual code executes.
2. _Execution Phase:_ Your code runs sequentially from top to bottom.

Because of this, import statements are effectively moved to the top of the file's scope.

```javascript
// These run BEFORE any code in the module executes
import { login } from "./auth.js";
import { Router } from "./router.js";

console.log("This runs after imports are evaluated");
login(); // ✅ Works - import already processed
```

**Key Difference from Function Hoisting:**

- Unlike var, you can't access imports before the import statement—they're in a TDZ.

```javascript
// ❌ ERROR - Can't use foo before import
console.log(foo); // ReferenceError
import { foo } from "./module.js";

// This is the "Temporal Dead Zone" (TDZ)
// Import exists but isn't accessible yet
```

Refer Dynamic Exports as well after this section

---

### Scenario 2: "What's the difference between named and default exports?"

**Strong Answer:**

- Named exports are for multi-function modules
- default exports for single-concept files.

```javascript
// ❌ Too many defaults - confusing API
export default function login() { }
export default function logout() { }  // Can't have two defaults!

// ✅ Named exports - clearer
export function login() { }
export function logout() { }

// ✅ Default export - single concept
export default class Router { }
```

**Practical difference:**

```javascript
// Named imports - explicit, tree-shakeable
import { login, logout } from "./auth.js";

// Default import - less clear what you're getting
import AuthModule from "./auth.js";
```

**My stance as a lead:** Named exports are the standard from 2024 onward. Default exports still have a place (React components, library entry points), but utility modules should use named exports. They're easier to refactor and bundlers can tree-shake unused functions."

---

### Scenario 3: "How would you structure exports in a Node.js package?"

**Strong Answer:**

"The `package.json` `exports` field is the modern replacement for `main`. It controls:

1. Which subpaths consumers can import
2. What files they get based on environment

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "browser": "./dist/index.browser.js",
      "node": "./dist/index.node.js",
      "default": "./dist/index.js"
    },
    "./utils": "./dist/utils.js",
    "./package.json": "./package.json"
  },
  "imports": {
    "#config": "./src/config.js",
    "#helpers/*": "./test/helpers/*.js"
  }
}
```

**What this achieves:**

- **Conditional exports:** TypeScript gets types, browser gets browser build, Node gets Node build
- **Subpath control:** Only listed paths are importable; everything else is internal
- **Internal aliases:** Use `#config` instead of `../../../../config.js`

**Key insight for leads:** This is security and API control. You're saying 'consumers can import these specific things' and everything else is yours to refactor freely."

---

### Scenario 4: "When would you use dynamic imports?"

**Strong Answer:**

"Dynamic imports are for route-based or interaction-based code splitting—loading code only when needed.

```javascript
// Route-based: load editor only when user navigates to /edit
router.on("/edit/:id", async ({ id }) => {
  const { mount } = await import("./editor.js");
  mount(document.querySelector("#root"), { id });
});

// Interaction-based: load heavy library on click
button.addEventListener("click", async () => {
  const { default: confetti } = await import("canvas-confetti");
  confetti();
});

// Parallel loading
const [moduleA, moduleB] = await Promise.all([
  import("./heavy-a.js"),
  import("./heavy-b.js"),
]);
```

**Why it matters:** Bundlers automatically split these into separate chunks. Without dynamic imports, your main bundle is bloated with code users might never run.

**Performance win:** A user visiting only the dashboard never downloads the editor code. That's significant savings at scale."

---

### Scenario 5: "What's the ESM/CJS interop situation? Can I mix them?"

**Strong Answer:**
"Yes, but with caveats. The rules:

1. **ESM importing CJS:** ✅ Allowed. The CommonJS `module.exports` becomes the ESM default export.

```javascript
// old-lib.cjs
module.exports = { foo: 1 };

// app.js
import lib from "./old-lib.cjs"; // ✅ lib = { foo: 1 }
```

2. **CJS requiring ESM:** ⚠️ Historically forbidden. Node 22+ allows it for side-effect-free modules, but use `await import()` instead.

```javascript
// Inside an async function
const { utils } = await import("./utils.js");
```

3. **Dual packages (supporting both):** Use conditional exports in package.json:

```json
"exports": {
  ".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.cjs"
  }
}
```

**Critical gotcha:** The 'dual package hazard'—if each version (ESM and CJS) has state, you end up with two instances at runtime. Keep state out of the package entry point."

---

## Key Implementation Patterns

### Modern Named Exports:

```javascript
// auth.js
export async function login(email, password) {
  /* ... */
}
export async function logout() {
  /* ... */
}
export function isAuthenticated() {
  /* ... */
}

// Usage
import { login, logout, isAuthenticated } from "./auth.js";
```

### Node Package Exports Field:

```json
{
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./utils": "./dist/utils.js"
  }
}
```

### Dynamic Imports for Code Splitting:

```javascript
const { Component } = await import(`./pages/${page}.js`);
Component.render();
```

### Browser Import Maps (Skip bundler for dependencies):

```html
<script type="importmap">
  {
    "imports": {
      "lit": "https://cdn.jsdelivr.net/npm/lit@3/index.js",
      "@app/": "/src/app/"
    }
  }
</script>

<script type="module">
  import { html } from "lit";
  import { Router } from "@app/router.js";
</script>
```

### Module Preload (Warm the Cache):

```html
<link rel="modulepreload" href="/app.js" />
<link rel="modulepreload" href="/router.js" />
<!-- Browser fetches these in parallel, ready when app.js runs -->
```

---

## Red Flags in Code Review

### ❌ Too Many Named Exports

```javascript
// DON'T DO THIS
export function login() {}
export function logout() {}
export function signup() {}
export function validate() {}
export function parseJWT() {}
// ... 20 more exports
```

**Better:** Split into multiple focused modules: `auth.js`, `validation.js`, `jwt.js`.

### ❌ Mixing Default and Named Exports Confusingly

```javascript
// CONFUSING
export default function doThing() {}
export function helperThing() {}
export function anotherThing() {}
```

**Better:** Either all named exports OR a single default.

### ❌ Barrel Files Defeating Tree-Shaking

```javascript
// index.js - re-exports everything
export * from "./slow-module.js"; // Has side effects
export * from "./utils.js";
```

If any module in the barrel has side effects, tree-shaking fails. Either mark as side-effect-free or import directly from leaf files.

### ❌ Top-Level Await Without Justification

```javascript
// DON'T DO THIS IN EVERY MODULE
const data = await fetch("/api/config").then((r) => r.json());
export default data;
```

Every importer waits for this fetch—serializes startup. Only use for critical initialization.

### ❌ Deep Import Paths (Should Use Exports Field)

```javascript
// DON'T ENCOURAGE THIS
import { utils } from "@company/lib/dist/helpers/utils.js";
```

**Better:** Define in package.json exports, let consumers do `import { utils } from '@company/lib/utils'`.

---

## Common Pitfalls

### Live Bindings (Counter-intuitive from CommonJS)

```javascript
// counter.js
export let count = 0;
export function inc() {
  count++;
}

// app.js
import { count, inc } from "./counter.js";
inc();
console.log(count); // 1, not 0 - bindings are LIVE
```

**This is usually correct, but surprises people from CommonJS.**

### Circular Dependencies

```javascript
// a.js
import { b } from "./b.js";
export const a = () => b();

// b.js
import { a } from "./a.js";
export const b = () => a(); // May see 'undefined' during init
```

**Solution:** Refactor to avoid initialization-time access across a cycle. Access inside functions is fine.

### Top-Level Await Blocks Importers

```javascript
// config.js
export const config = await fetch("/config").then((r) => r.json());

// app.js
import { config } from "./config.js"; // Waits for fetch!
```

**Only use top-level await for critical setup, not in every module.**

---

## Interview Talking Points

### What to Say:

✅ "ES modules are built-in; no closures tricks needed for privacy."

✅ "Named exports by default—clearer API, better tree-shaking."

✅ "The `exports` field in package.json controls API surface and conditional builds."

✅ "Dynamic imports are for route-based code splitting—significant performance wins."

✅ "Bundlers handle the complexity; I focus on logical module boundaries."

### What NOT to Say:

❌ "CommonJS is outdated" (Node still supports it; interop matters)

❌ "Split every function into its own file" (premature modularization)

❌ "I don't care about exports field" (it's security + API control)

---

## When to Split Into a New Module

**One concept per file.** Heuristics:

| Signal                               | Action                                                   |
| ------------------------------------ | -------------------------------------------------------- |
| **Reusable in multiple places**      | Split into a module                                      |
| **Can't name the file in 3-4 words** | Contains multiple concepts; split it                     |
| **Three related functions**          | Keep in one file; not every function needs its own       |
| **Different export frequency**       | Some exports change often, others rarely; consider split |
| **Testing requires mocking**         | Might indicate tight coupling; split to make mockable    |

**Avoid pre-splitting.** Split when reuse is real, not theoretical.

---

## Bundlers & Tree-Shaking

Modern bundlers all handle ESM similarly. Pick based on your framework:

| Bundler       | Best For                    | Notes                               |
| ------------- | --------------------------- | ----------------------------------- |
| **Vite**      | SPAs (React, Vue, Svelte)   | Native ESM in dev; Rollup for build |
| **esbuild**   | Library builds              | Extremely fast Go engine            |
| **Rspack**    | Drop-in webpack replacement | Rust, much faster                   |
| **Turbopack** | Next.js                     | Incremental, persistent cache       |

**Tree-shaking requirement:** Modules must be side-effect-free or marked `"sideEffects": false` in package.json.

---

## Interview Closer

"The Module Pattern in modern JavaScript is just ES modules—file-based scoping with explicit privacy. As a lead, I focus on logical module boundaries: one concept per file, minimal exports, and using the `exports` field to control what consumers can access. Dynamic imports are a free performance win for code splitting, and bundlers handle the rest."

---

## Checklist Before Interview

✅ Understand ES modules are file-scoped with built-in privacy  
✅ Know named vs default exports and when to use each  
✅ Familiar with `package.json` exports field and conditional exports  
✅ Know when to use dynamic `import()` for code splitting  
✅ Understand ESM/CJS interop basics and dual package hazard  
✅ Can spot over-exported modules (red flag for design issues)  
✅ Aware of live bindings vs CommonJS value copies  
✅ Know circular dependency risks and how to mitigate  
✅ Understand top-level await implications  
✅ Can articulate module boundaries decision criteria

---

## One-Liner Summary

"ES modules provide built-in privacy through file scope. As a lead, I focus on logical boundaries: one concept per file, named exports by default, and using the `exports` field to control API surface."
