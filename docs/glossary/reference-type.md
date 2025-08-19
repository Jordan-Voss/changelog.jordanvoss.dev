---
id: reference-type
title: Reference Type
slug: /glossary/reference-type
---
import BackLink from '@site/src/components/BackLink';

# Reference Type

**Definition:**  
A data type that stores a reference to an object in memory, rather than the object itself.

---

## Detailed Explanation
- The reference points to a memory address where the object is stored (usually in the heap).
- Variables of reference types do not contain the actual value.
- Changes through one reference affect all references to the same object.

---

## Example

// Example in a generic language
// Person p1 = new Person("Alex");
// Person p2 = p1; // both refer to the same object

---

## Related Terms
- [Heap](/glossary/heap)
- [Mutable](/glossary/mutable)

<BackLink />
