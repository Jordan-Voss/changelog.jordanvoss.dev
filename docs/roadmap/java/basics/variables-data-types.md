---
id: variables-data-types
title: Variables and Data Types
sidebar_label: Variables & Data Types
slug: /roadmap/java/basics/variables-data-types
---
# ☕ Java Variables & Data Types

Understanding variables and data types is foundational to programming in Java. This section breaks down what they are, how they're used, and some common pitfalls.

---

## 🧮 What is a Variable?

A **variable** is a container that holds data during the execution of a program. In Java, every variable must be declared with a **type**. **Declaring a variable** means telling the compiler what type of data you want to store and what you want to name that storage location.

### Syntax

```java
type variableName = value;
```
`type` -> the **data type** of the variable (e.g. `int`, `String`)

`variableName` -> the **identifier** or **name** you assign to the variable.

### Example

```java
int age = 27;
String name = "Jordan";
```
This example will:

* Create a variable called `age` that will store the `int` `27`.

* Create a variable called `name` that will store the `String` (object) `'Jordan'`

---

## 📦 Java Data Types

Java is a **statically typed** language, which means each variable’s type must be known at compile time. Java’s data types are divided into two groups:

* Primitive Types
* Object References

The key difference is where and how the value is stored:

* Primitive values live on the **stack**

* Objects live in the **heap**, and the variable holds a reference to the heap in the stack.

### 1. **Primitive Types**

There are 8 primitive types:

| Type     | Size     | Range / Notes                                                                  | Example                | Description                   |
|----------|----------|----------------------------------------------------------------------------------|------------------------|-------------------------------|
| `boolean`| 1-bit    | `true` or `false`                                                                | `boolean isTrue = true;` | A binary true/false value    |
| `byte`   | 8-bit    | -128 to 127                                                                      | `byte b = 1;`           | Very small integer            |
| `short`  | 16-bit   | -32,768 to 32,767                                                                | `short s = 2;`          | Small integer                 |
| `int`    | 32-bit   | -2,147,483,648 to 2,147,483,647                                                  | `int i = 10;`           | Most common integer type      |
| `long`   | 64-bit   | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807                          | `long l = 100000L;`     | Large integer                 |
| `float`  | 32-bit   | Approx. ±3.4e38, 6–7 decimal digits precision                                     | `float f = 3.14f;`      | Decimal (requires `f` suffix) |
| `double` | 64-bit   | Approx. ±1.8e308, 15 decimal digits precision                                    | `double d = 3.14;`      | More precise decimal          |
| `char`   | 16-bit   | Unicode characters, e.g., `'A'`, `'1'`, `'\u0041'`                               | `char c = 'A';`         | A single character            |

When declaring a variable that is a **primitive type** the actual value is stored in the memory allocated to that variable

```java int a = 10;
int b = a;
b = 20;
// 'a' is still 10, because 'b' is a separate piece of memory copied from 'a'
```
![Primitive Types](/img/primitive.png)

### 2. **Reference Types** (objects)

Reference types store a **reference (memory address)** that points to the actual object stored in the **heap**. The reference itself is stored in the **stack**, but the object it refers to lives in the heap.


| Type        | Size   | Mutability | Example                  | Description                    |
| ----------- | ------ | ---------- | ------------------------ | ------------------------------ |
| `Boolean`   | 1-bit  | Immutable  | `Boolean isTrue = true;` | Wrapper for `boolean`          |
| `Byte`      | 8-bit  | Immutable  | `Byte b = 1;`            | Wrapper for `byte`             |
| `Short`     | 16-bit | Immutable  | `Short s = 2;`           | Wrapper for `short`            |
| `Character` | 16-bit | Immutable  | `Character c = 'A';`     | Wrapper for `char`             |
| `Integer`   | 32-bit | Immutable  | `Integer i = 10;`        | Wrapper for `int`              |
| `Long`      | 64-bit | Immutable  | `Long l = 100000L;`      | Wrapper for `long`             |
| `Float`     | 32-bit | Immutable  | `Float f = 3.14f;`       | Wrapper for `float`            |
| `Double`    | 64-bit | Immutable  | `Double d = 3.14;`       | Wrapper for `double`           |
| `String`    | N/A    | Immutable  | `String s = "hello";`    | Textual data                   |
| `Array`     | N/A    | Mutable    | `int[] arr = {1, 2, 3};` | Fixed-size, ordered collection |

🧠 Mutability Notes:

* Wrapper classes (Integer -> int, Double -> double, etc.) is an object representation of a primitive data type. These classes as well as Strings are immutable, meaning their value cannot be changed after creation. Any operation creates a new object.

* Arrays are mutable, you can change their contents even though the reference points to the same memory.

**Immutable Example**
```java
String name = "Jordan";
String anotherName = name;

anotherName = "Alex";

// 'name' is still "Jordan" because 'String' is immutable
System.out.println(name);        // Jordan
System.out.println(anotherName); // Alex

```
**Mutable Example**
```java
int[] numbers = {1, 2, 3};
int[] moreNumbers = numbers;

moreNumbers[0] = 99;

// Both variables now point to the same array in memory
System.out.println(numbers[0]);     // 99
System.out.println(moreNumbers[0]); // 99
```


---

## 🔄 Type Conversion

### Implicit Conversion (Widening)

Java automatically converts smaller types to larger types.

```java
int a = 10;
long b = a; // OK

```

### Explicit Conversion (Narrowing)

Requires casting.

```java
double pi = 3.14;
int rounded = (int) pi; // 3

```

---

## 🧠 Final Keyword (Constants)

Use `final` to make a variable **constant**.

```java
final double PI = 3.14159;

```

Once assigned, it can’t be changed.

---

## ✅ Summary

- Variables store data and must be typed.
- Java has **8 primitive types** and many reference types.
- Use `final` to declare constants.
- Be careful with **type conversions** to avoid data loss.

---

[⬅ Back to Java Basics](notion://www.notion.so/roadmap/java/basics)