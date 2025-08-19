---
id: stack
title: Stack
slug: /glossary/stack
---
import BackLink from '@site/src/components/BackLink';

# Stack

**Definition:**  
A region of memory that stores method calls and primitive variables, managed in a last-in-first-out manner.

---

## Detailed Explanation
- The stack is used for storing local variables and call frames.
- It automatically manages memory allocation and deallocation.
- Exceeding stack limits results in a stack overflow error.

---

## Example

// Stack usage example
```
// function callA() { callB(); }
// function callB() { /* stack frame for callB */ }
```
---

## Related Terms
- [Heap](/glossary/heap)
- [Primitive Type](/glossary/primitive-type)

<BackLink />
