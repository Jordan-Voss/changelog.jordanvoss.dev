---
id: keyword
title: Keyword
slug: /glossary/keyword
---
import BackLink from '@site/src/components/BackLink';

# Keyword

**Definition:**  
A keyword in Java is a **reserved word** that has a predefined meaning in the language syntax and **cannot be used as an identifier** (e.g., for variable names, class names, or methods).

---

## Detailed Explanation
- Java keywords are part of the core language grammar.
- They define control structures, data types, access modifiers, and other fundamental features.
- Attempting to use a keyword as a variable or method name will cause a **compiler error**.
- Keywords are always written in **lowercase**.

---

## Complete List of Java Keywords

### Used in Code
```
abstract   assert     boolean    break      byte
case       catch      char       class      const*
continue   default    do         double     else
enum       extends    final      finally    float
for        goto*      if         implements import
instanceof int        interface  long       native
new        package    private    protected  public
return     short      static     strictfp   super
switch     synchronized this     throw      throws
transient  try        void       volatile   while
```

### Contextual Keywords (restricted identifiers, added in newer versions)
```
exports    module     open       opens      provides
requires   to         transitive uses       var
with       yield      record     sealed     non-sealed
permits
```

\* `const` and `goto` are **reserved but unused** in Java.  

---
## Contextual Keywords Explained

Unlike traditional keywords, **contextual keywords** (also called **restricted identifiers**) are **only reserved in specific contexts**.  
This allows Java to introduce new features without breaking older programs that may have used these names as identifiers.

Examples:

```java
// 'var' as contextual keyword (Java 10)
var name = "Jordan";   // here 'var' is special
int var = 5;           // still valid elsewhere
```
---

## Example

```java
public class Example {
    public static void main(String[] args) {
        int age = 30;   // 'int' and 'public' are keywords
        if (age > 18) { // 'if' is a keyword
            System.out.println("Adult");
        }
    }
}
```

---

## Related Terms
- [Identifier](/glossary/identifier)
- [Variable](/glossary/variable)

<BackLink />