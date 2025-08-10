---
id: twos-complement
title: Two’s Complement
slug: /glossary/twos-complement
---
import BackLink from '@site/src/components/BackLink';

# Two’s Complement

Two’s complement is a way to represent signed integers in binary so that addition, subtraction, and negation can use the same binary arithmetic rules.

**How it works**:
- The most significant bit (MSB) is the sign bit: `0` for positive, `1` for negative.
- Negative numbers are stored by inverting all bits of the number and adding 1.

**Example**:
```
8-bit: 00000010 = 2
Invert: 11111101
+1: 11111110 = -2
```

**Why Java uses it**:
- Simpler CPU operations
- Consistent arithmetic rules

<!-- ![Two’s Complement Diagram](/img/twos-complement.png) -->

---

<BackLink />

