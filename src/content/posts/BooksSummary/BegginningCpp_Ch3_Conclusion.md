---
title: Beginning C++20 第3章总结 —— 运算符优先级、位运算与变量生命周期
Description: 《Beginning C++20》（第6版）第3章"运算符优先级、位运算与变量生命周期"的全面总结，涵盖运算符优先级表、位运算符详解、变量生命周期、全局变量、枚举和数据类型别名。
published: 2026-07-05
date: 2026-07-05
draft: false
tags: ["C++","Operator Precedence", "Bitwise Operators"]
category: "Cpp"
pinned: false
auther: Sharkerl
---

## **目录**

- [第3章：运算符优先级、位运算与变量生命周期](#第3章运算符优先级位运算与变量生命周期)
  - [运算符优先级与结合性 (Operator Precedence and Associativity)](#运算符优先级与结合性-operator-precedence-and-associativity)
  - [位运算符 (Bitwise Operators)](#位运算符-bitwise-operators)
  - [位移位运算符 (The Bitwise Shift Operators)](#位移位运算符-the-bitwise-shift-operators)
  - [移位有符号整数 (Shifting Signed Integers)](#移位有符号整数-shifting-signed-integers)
  - [位模式上的逻辑运算 (Logical Operations on Bit Patterns)](#位模式上的逻辑运算-logical-operations-on-bit-patterns)
  - [使用按位与 (Using the Bitwise AND)](#使用按位与-using-the-bitwise-and)
  - [使用按位或 (Using the Bitwise OR)](#使用按位或-using-the-bitwise-or)
  - [使用按位取反运算符 (Using the Bitwise Complement Operator)](#使用按位取反运算符-using-the-bitwise-complement-operator)
  - [使用按位异或 (Using the Bitwise Exclusive OR)](#使用按位异或-using-the-bitwise-exclusive-or)
  - [位运算符示例 (Using the Bitwise Operators: An Example)](#位运算符示例-using-the-bitwise-operators-an-example)
  - [变量的生命周期 (The Lifetime of a Variable)](#变量的生命周期-the-lifetime-of-a-variable)
  - [全局变量 (Global Variables)](#全局变量-global-variables)
  - [枚举数据类型 (Enumerated Data Types)](#枚举数据类型-enumerated-data-types)
  - [命名空间的 using (Using for Namespaces)](#命名空间的-using-using-for-namespaces)
  - [数据类型别名 (Aliases for Data Types)](#数据类型别名-aliases-for-data-types)
  - [练习 (Exercises)](#练习-exercises)

<a id="第3章运算符优先级位运算与变量生命周期"></a>

# 第3章：运算符优先级、位运算与变量生命周期

<a id="运算符优先级与结合性"></a>

## 运算符优先级与结合性 (Operator Precedence and Associativity)

在上一章中，我们已经见过很多运算符了——算术运算符 `+`、`-`、`*`、`/`、`%`，赋值运算符 `=`，自增 `++`，等等。但当多个运算符出现在同一个表达式中时，编译器如何决定先执行哪一个呢？这就涉及到了**运算符优先级(Operator Precedence)**和**结合性(Associativity)**的概念。

**运算符优先级**决定了表达式中不同运算符的分组方式。优先级高的运算符先求值，优先级低的后求值。例如在表达式 `x * y + z` 中，乘法 `*` 的优先级高于加法 `+`，所以它等价于 `(x * y) + z`，而不是 `x * (y + z)`。

**结合性(Associativity)** 决定的是当多个相同优先级的运算符连续出现时，是从左到右还是从右到左结合。绝大多数二元运算符是**左结合(Left-associative)**的，即从左到右求值。但也有例外——赋值运算符和条件运算符是**右结合(Right-associative)**的。

下面是 C++ 中完整的运算符优先级表，共 17 个层级：

**表 3-1. C++ 运算符优先级与结合性**

| 优先级 | 运算符 | 结合性 | 说明 |
|:---:|:---|:---:|:---|
| 1 | `::` | 左 | 作用域解析运算符(Scope Resolution Operator) |
| 2 | `++` `--` `()` `[]` `.` `->` | 左 | 后缀自增/自增、函数调用、数组下标、成员访问 |
| 3 | `++` `--` `+` `-` `!` `~` `(type)` `*` `&` `sizeof` `const_cast` `dynamic_cast` `reinterpret_cast` `static_cast` | 右 | 前缀自增/自减、一元正负、逻辑非、按位取反、类型转换、指针解引用、取地址 |
| 4 | `.*` `->*` | 左 | 指向成员的指针运算符 |
| 5 | `*` `/` `%` | 左 | 乘法、除法、取模 |
| 6 | `+` `-` | 左 | 加法、减法 |
| 7 | `<<` `>>` | 左 | 位移位运算符 |
| 8 | `<=>` | 左 | 三路比较运算符(Rich Comparison) |
| 9 | `<` `>` `<=` `>=` | 左 | 关系运算符 |
| 10 | `==` `!=` | 左 | 相等性运算符 |
| 11 | `&` | 左 | 按位与(Bitwise AND) |
| 12 | `^` | 左 | 按位异或(Bitwise XOR) |
| 13 | `\|` | 左 | 按位或(Bitwise OR) |
| 14 | `&&` | 左 | 逻辑与(Logical AND) |
| 15 | `\|\|` | 左 | 逻辑或(Logical OR) |
| 16 | `=` `+=` `-=` `*=` `/=` `%=` `<<=` `>>=` `&=` `^=` `\|=` | 右 | 赋值运算符 |
| 17 | `,` | 左 | 逗号运算符(Comma Operator) |

> :::tip
> 括号 `()` 始终拥有最高的优先级。当你不确定运算符的执行顺序时，**始终使用括号**来明确分组。这不仅让代码更安全，也让阅读者更容易理解你的意图。
> :::

让我们看一个具体的例子。表达式 `x * y / z - b + c - d` 的求值过程如下：

1. 首先，`*` 和 `/` 优先级相同（第 5 级），从左到右结合：`(x * y) / z`
2. 然后 `-` 和 `+` 优先级相同（第 6 级），从左到右结合：`((x * y) / z) - b`
3. 接着 `+ c`：`(((x * y) / z) - b) + c`
4. 最后 `- d`：`((((x * y) / z) - b) + c) - d`

所以这个表达式等价于：

```cpp
((((x * y) / z) - b) + c) - d
```

> :::caution
> 记住：优先级和结合性决定了表达式的**语法结构**，而不是**求值顺序**。在大多数情况下，运算符的操作数求值顺序是实现定义的。不要依赖特定的求值顺序来编写可移植代码。
> :::

<a id="位运算符"></a>

## 位运算符 (Bitwise Operators)

到目前为止，我们一直把数据当作"数值"来操作——加减乘除、比较大小。但计算机中的每一个值本质上都是一串二进制位。有时候，直接操作这些位比操作数值本身更有意义。这就是**位运算符(Bitwise Operator)**的用武之地。

位运算符最直接的应用场景是**标志(Flag)**。想象一下，你有一个字体(Font)数据，需要同时存储字形样式（粗体、斜体等）和字号大小。如果用单独的变量存储这些信息，数据结构会变得臃肿。但如果把这些信息打包到几个位中，一个字节的 8 位就能容纳多个独立的布尔标志。

一个经典的例子是 **RGBA 颜色值**。每个颜色通道（红、绿、蓝、透明度）用一个字节（8 位）存储，打包成一个 32 位整数：

```cpp
unsigned int color {0xFF0000FF}; // RGBA: 红=FF, 绿=00, 蓝=00, 透明=FF（纯红色，不透明）
```

再比如，把字体数据打包到 2 个字节（16 位）中：

```
| 高 5 位: 字号(Size) | 低 11 位: 样式标志(Style Flags) |
```

字号用 5 位可以表示 0~31 共 32 种大小，样式标志用 11 位可以容纳大量的组合标志。这种打包方式在嵌入式系统和游戏开发中非常常见。

> :::note
> 位运算符操作的是数据的**二进制表示(Bit Representation)**，而不是数值本身。理解这一点是使用位运算符的关键。
> :::

<a id="位移位运算符"></a>

## 位移位运算符 (The Bitwise Shift Operators)

**位移位运算符(Shift Operator)** `<<` 和 `>>` 将操作数的所有位向左或向右移动指定的位数。

`<<` 是**左移(Left Shift)**运算符，将操作数的所有位向左移动指定的位数，右侧补零。例如：

```cpp
unsigned short number {16387};
number << 2;  // 将所有位向左移动 2 位
```

`16387` 的二进制表示是 `0100 0000 0000 0011`，左移 2 位后变成 `0000 0000 0011 0000`，即十进制的 48（溢出被丢弃）。

> :::caution
> 左移有符号整数时，如果结果改变了符号位，行为是**未定义的(Undefined)**。尽量避免对有符号整数做左移操作。
> :::

右移 `>>` 将位向右移动。对于**无符号整数**，左侧补零。对于**有符号整数**，行为依赖于实现——大多数编译器执行**算术右移(Arithmetic Right Shift)**，即左侧复制符号位以保持符号不变。

还有复合赋值运算符 `<<=` 和 `>>=`：

```cpp
unsigned short number {16387};
number <<= 2;  // 等价于 number = number << 2
number >>= 1;  // 等价于 number = number >> 1
```

> :::caution
> 这里有一个经典陷阱：
>
> ```cpp
> cout << number << 2;
> ```
>
> 这条语句的含义是：将 `number` 的值插入到 `cout` 流中，然后再将字面量 `2` 插入到流中。输出结果是 `number` 的值后面跟着 `2`。**这不是位移位！** 如果你想输出 `number` 左移 2 位的结果，需要加括号：
>
> ```cpp
> cout << (number << 2);
> ```
>
> 这个陷阱之所以存在，是因为 `<<` 既是位移位运算符，也是流插入运算符。编译器通过优先级和上下文来区分它们——在 `cout` 后面的 `<<` 是流插入，在数值表达式中间的 `<<` 是位移位。
> :::

<a id="移位有符号整数"></a>

## 移位有符号整数 (Shifting Signed Integers)

对有符号整数进行位移时需要格外小心，因为涉及**符号扩展(Sign Extension)**的问题。

让我们看一个右移的例子。假设有一个 `signed char` 值为 `+104`：

```
+104 的二进制:  0110 1000
右移 2 位:      0001 1010  (= 26)
```

符号位是 `0`（正数），右移时左侧补 `0`，结果仍然是正数。

但如果 `signed char` 值为 `-104`：

```
-104 的二进制(补码):  1001 1000
右移 2 位:           1110 0110  (= -26)
```

符号位是 `1`（负数），右移时左侧补 `1`（符号扩展），结果仍然是负数。这就是**算术右移**的行为——保持了符号不变。

左移对符号的影响更加危险：

```cpp
signed char value {64};
value <<= 1;  // 结果变成 -128！
```

`64` 的二进制是 `0100 0000`，左移 1 位变成 `1000 0000`。在有符号的 `char` 中，最高位是符号位，`1` 开头表示负数，`1000 0000` 就是 `-128`。**左移改变了符号位**，这可能导致难以察觉的 bug。

> :::caution
> 对左移有符号整数且结果无法在原类型中表示时，C++ 标准规定其行为是**未定义的(Undefined)**。不要对有符号整数做左移操作——如果需要位移，请使用无符号类型。
> :::

<a id="位模式上的逻辑运算"></a>

## 位模式上的逻辑运算 (Logical Operations on Bit Patterns)

C++ 提供了四种**按位运算符(Bitwise Operator)**，直接对整数的二进制位进行操作：

**表 3-2. 按位运算符(Bitwise Operators)**

| 运算符 | 名称 | 说明 |
|:---:|:---|:---|
| `~` | 按位取反/补码(Bitwise Complement / One's Complement) | 一元运算符，将每个位翻转：0 变 1，1 变 0 |
| `&` | 按位与(Bitwise AND) | 二元运算符，两个位都为 1 时结果为 1 |
| `^` | 按位异或(Bitwise Exclusive OR / XOR) | 二元运算符，两个位不同时结果为 1 |
| `\|` | 按位或(Bitwise OR) | 二元运算符，任一位为 1 时结果为 1 |

这四个运算符的优先级顺序是：`~`（最高）> `&` > `^` > `\|`（最低）。

由于 `~` 是一元运算符，它的优先级很高（第 3 级）。`&`、`^`、`\|` 都是二元运算符，优先级分别为第 11、12、13 级。

```cpp
unsigned char a {0b10101010};
unsigned char b {0b11001100};

unsigned char result;

result = ~a;       // 按位取反: 0b01010101
result = a & b;    // 按位与:   0b10001000
result = a ^ b;    // 按位异或:  0b01100110
result = a | b;    // 按位或:    0b11101110
```

> :::note
> 按位运算符 `&`、`^`、`\|` 的优先级低于关系运算符（`<`、`>` 等）和相等性运算符（`==`、`!=`）。这意味着 `a & b == c` 等价于 `a & (b == c)`，而不是 `(a & b) == c`。如果需要按位运算后再比较，务必加括号。
> :::

<a id="使用按位与"></a>

## 使用按位与 (Using the Bitwise AND)

**按位与(Bitwise AND)** 最经典的用法是**提取位(Extracting Bits)**，也就是使用**掩码(Mask)**。

掩码是一个位模式，其中需要关注的位设置为 1，不需要关注的位设置为 0。通过 `&` 运算，掩码可以过滤掉不需要的位。

回到字体数据的例子。假设我们用一个 16 位的 `unsigned short` 存储字体信息：

- 高 5 位：字号大小（0-31）
- 低 11 位：样式标志（粗体、斜体、下划线等）

```cpp
unsigned short font {0x064C};  // 某个字体数据
```

`0x064C` 的二进制是 `0000 0110 0100 1100`。

要提取字号（高 5 位），我们需要一个掩码 `0x1F`（二进制 `0001 1111`），右移 11 位：

```cpp
unsigned short size_mask {0x1F};     // 0001 1111 — 只保留低 5 位
unsigned short size {font & size_mask};  // 提取字号（需要先右移调整位置）
```

实际上，字号在高 5 位，所以我们需要先用右移把高 5 位移到低位区域，再用掩码提取：

```cpp
unsigned short size_mask {0x1F000};  // 0001 1111 0000 0000 — 高 5 位的掩码
unsigned short size {font & size_mask};  // 得到 0x0600（字号部分的原始值）
unsigned short sizeValue {size >> 11};     // 右移 11 位得到实际字号值 3
```

同样，要提取样式标志（低 11 位）：

```cpp
unsigned short style_mask {0x07FF};  // 0000 0111 1111 1111 — 低 11 位的掩码
unsigned short style {font & style_mask};  // 得到 0x004C
```

按位与还可以用来**关闭位(Turning Bits Off)**。要将某些位设为 0，可以使用取反后的掩码：

```cpp
unsigned short bold_mask {0x0400};  // 粗体标志
font &= ~bold_mask;  // 关闭粗体标志，其他位保持不变
```

> :::tip
> 掩码的核心思想：`&` 保留掩码中为 1 的位，清零掩码中为 0 的位。`~` 反转掩码后用于清除特定位。
> :::

<a id="使用按位或"></a>

## 使用按位或 (Using the Bitwise OR)

**按位或(Bitwise OR)** 与按位与相反——它用来**设置位(Turning Bits On)**。

```cpp
unsigned short bold {0x0400};   // 粗体标志位
unsigned short italic {0x0200}; // 斜体标志位

unsigned short font {0x0000};   // 初始无任何样式

font |= bold;   // 设置粗体: font = 0x0400
font |= italic; // 设置斜体: font = 0x0600
```

`|=` 是复合赋值运算符，等价于 `font = font | bold`。

也可以一次性设置多个标志：

```cpp
unsigned short bold_and_italic {bold | italic}; // 0x0600
font |= bold_and_italic;  // 同时设置粗体和斜体
```

> :::caution
> 这里有一个经典的**语言陷阱(Language Trap)**：`&` 和 `\|` 看起来很像 `&&` 和 `||`（逻辑运算符），但它们完全不同。
>
> - `&` 是按位与，对每一位执行 AND 操作
> - `&&` 是逻辑与，对整个表达式的真假值执行 AND 操作
>
> 在条件判断中（`if`、`while`），使用 `&&` 和 `||`。在位操作（标志、掩码）中，使用 `&` 和 `\|`。混用它们会导致严重的逻辑错误。
> :::

<a id="使用按位取反运算符"></a>

## 使用按位取反运算符 (Using the Bitwise Complement Operator)

**按位取反运算符(Bitwise Complement Operator)** `~` 是一元运算符，将操作数的每一位翻转：0 变 1，1 变 0。

这个运算符最实用的场景是**创建反向掩码**来关闭特定的位。

假设我们要关闭粗体标志：

```cpp
unsigned short bold {0x0400};  // 粗体标志
unsigned short font {0x064C};  // 当前的字体数据

font &= ~bold;  // 关闭粗体标志
```

`~bold` 将 `0x0400` 翻转为 `0xFBFF`。然后 `font & 0xFBFF` 会保留 `font` 中除了粗体位以外的所有位。

> :::tip
> 按位取反运算符 `~` 的优先级非常高（第 3 级），高于 `&`（第 11 级）。因此 `font &= ~bold` 中的 `~bold` 会先求值，不需要额外的括号。但为了代码可读性，加括号也是一个好习惯：`font &= (~bold)`。
> :::

也可以组合多个取反掩码来同时关闭多个位：

```cpp
unsigned short bold {0x0400};
unsigned short italic {0x0200};

font &= ~(bold | italic);  // 同时关闭粗体和斜体
```

这里 `bold | italic` 得到 `0x0600`，取反后是 `0xF9FF`，与 `font` 进行按位与即可同时清除两个标志。

<a id="使用按位异或"></a>

## 使用按位异或 (Using the Bitwise Exclusive OR)

**按位异或(Bitwise Exclusive OR, XOR)** 运算符 `^` 的运算规则是：两个位不同时结果为 1，相同时结果为 0。

**表 3-3. 二元按位运算符的真值表(Truth Table)**

| x | y | x & y | x \| y | x ^ y |
|:-:|:-:|:-----:|:------:|:-----:|
| 0 | 0 |   0   |   0    |   0   |
| 0 | 1 |   0   |   1    |   1   |
| 1 | 0 |   0   |   1    |   1   |
| 1 | 1 |   1   |   1    |   0   |

XOR 有一个非常有趣的性质：**对一个值 XOR 两次同一个掩码，会恢复原值**。

```
A ^ B ^ B = A
```

这个性质在字体样式切换中非常实用：

```cpp
unsigned short font {0x0000};
unsigned short bold {0x0400};

font ^= bold;  // 设置粗体: font = 0x0400
font ^= bold;  // 取消粗体: font = 0x0000（恢复到原始状态）
```

如果某一位原来是 0，XOR 1 变成 1；如果原来是 1，XOR 1 又变回 0。这就是**切换(Toggle)**操作。

XOR 还有一个经典的应用场景是**RAID 备份系统**。假设有三个硬盘驱动器：

```
Drive A:  1101
Drive B:  1010
Drive C:  0111  // Drive C = Drive A ^ Drive B
```

Drive C 存储的是 A 和 B 的 XOR 结果。如果 Drive A 损坏了，可以用 B 和 C 恢复 A：

```
Recovered A = B ^ C = 1010 ^ 0111 = 1101 ✓
```

同理，如果 Drive B 损坏了：

```
Recovered B = A ^ C = 1101 ^ 0111 = 1010 ✓
```

如果有 4 个驱动器，只需要 2 个 XOR 校验盘就能恢复任意两个驱动器的数据。这种技术广泛应用于磁盘阵列(RAID)和纠删码(Erasure Coding)。

> :::tip
> XOR 的切换(Toggle)特性让它非常适合实现**开关式标志(Toggling Flags)**。如果你需要在"开启"和"关闭"之间切换某个位的状态，XOR 是最简洁的方式。
> :::

<a id="位运算符示例"></a>

## 位运算符示例 (Using the Bitwise Operators: An Example)

下面是一个完整的程序，演示如何使用位运算符来表示颜色和标志：

```cpp
// Ex3_01.cpp
// 使用位运算符表示颜色

import <iostream>;

int main()
{
    // 定义红、白两种颜色
    constexpr unsigned int red {0x0000FF};    // 蓝色通道 = FF, 绿色 = 00, 红色 = 00
    constexpr unsigned int white {0xFFFFFF};  // 蓝=FF, 绿=FF, 红=FF

    // 定义标志
    constexpr unsigned int highlight {0x01000000};  // 高亮标志
    constexpr unsigned int blink {0x02000000};      // 闪烁标志

    unsigned int color {red};
    unsigned int flags {0};

    // 设置高亮标志
    flags |= highlight;
    std::cout << std::format("颜色: {:08X}, 标志: {:08X}\n", color, flags);

    // 切换到白色
    color = white;
    std::cout << std::format("颜色: {:08X}, 标志: {:08X}\n", color, flags);

    // 设置闪烁标志
    flags |= blink;
    std::cout << std::format("颜色: {:08X}, 标志: {:08X}\n", color, flags);

    // 切换高亮标志（XOR 切换）
    flags ^= highlight;
    std::cout << std::format("颜色: {:08X}, 标志: {:08X}\n", color, flags);
}
```

输出：

```
颜色: 000000FF, 标志: 01000000
颜色: 00FFFFFF, 标志: 01000000
颜色: 00FFFFFF, 标志: 03000000
颜色: 00FFFFFF, 标志: 02000000
```

> :::note
> 格式说明符 `{:08X}` 的含义：
> - `:` 后面是格式说明的开始
> - `0` 表示用零填充(Zero Padding)
> - `8` 表示最小宽度为 8 个字符
> - `X` 表示以十六进制输出，使用大写字母
>
> 所以 `{:08X}` 输出一个 8 位宽的十六进制数，不足 8 位时用零补齐，字母使用大写。
> :::

<a id="变量的生命周期"></a>

## 变量的生命周期 (The Lifetime of a Variable)

在讨论变量时，有两个概念非常重要但经常被混淆：**作用域(Scope)** 和 **生命周期(Lifetime)**。

**作用域(Scope)** 决定了变量的名称在代码的哪些地方是可访问的。它回答的问题是："我在哪里可以找到这个名字？"

**生命周期(Lifetime)** 决定了变量在内存中存在多长时间。它回答的问题是："这个变量什么时候被创建，什么时候被销毁？"

C++ 中有四种**存储期限(Storage Duration)**：

1. **自动存储期限(Automatic Storage Duration)**：局部变量默认的生命周期。它们在进入作用域时创建，离开作用域时销毁。`main()` 函数中的局部变量就是典型的自动存储期限。

2. **静态存储期限(Static Storage Duration)**：全局变量、`static` 局部变量和命名空间作用域变量的生命周期。它们在程序启动时创建，程序结束时销毁。

3. **动态存储期限(Dynamic Storage Duration)**：通过 `new` 分配的内存的生命周期。它们在 `new` 时创建，`delete` 时销毁。

4. **线程存储期限(Thread Local Storage Duration)**：`thread_local` 修饰的变量，每个线程拥有自己的副本，在线程创建时创建，线程结束时销毁。

> :::note
> 作用域和生命周期是不同的概念。一个变量可能有局部作用域（只在某个代码块中可见），但拥有静态生命周期（整个程序运行期间都存在）。这就是 `static` 局部变量的特点。
> :::

<a id="全局变量"></a>

## 全局变量 (Global Variables)

**全局变量(Global Variable)** 是在所有函数之外定义的变量，具有**全局作用域(Global Scope)**。它们在整个程序中都是可见的。

要访问全局变量，可以使用**作用域解析运算符(Scope Resolution Operator)** `::`。如果局部变量和全局变量同名，`::` 可以消除歧义，明确访问的是全局变量。

来看一个完整的例子：

```cpp
// Ex3_02.cpp
// 演示作用域和全局变量

import <iostream>;

unsigned int number {1}; // 全局变量，初始值为 1

int main()
{
    unsigned int number {10}; // 局部变量，隐藏了同名的全局变量
    std::cout << "main() 中的 number = " << number << std::endl; // 输出 10

    {
        unsigned int number {100}; // 嵌套块中的局部变量
        std::cout << "嵌套块中的 number = " << number << std::endl; // 输出 100
        std::cout << "::number = " << ::number << std::endl; // 输出 1（全局变量）
    }

    std::cout << "回到 main() 中的 number = " << number << std::endl; // 输出 10
    std::cout << "::number = " << ::number << std::endl; // 输出 1（全局变量）
}
```

输出：

```
main() 中的 number = 10
嵌套块中的 number = 100
::number = 1
回到 main() 中的 number = 10
::number = 1
```

这个例子展示了几个重要的概念：

1. **变量隐藏(Variable Hiding)**：当局部变量和全局变量同名时，局部变量会"隐藏"全局变量。在 `main()` 中，`number` 引用的是局部变量 `10`，而不是全局变量 `1`。

2. **嵌套作用域(Nested Scope)**：在花括号 `{}` 内部定义的变量只在块内可见。当退出块后，该变量被销毁，外部变量重新可见。

3. **作用域解析运算符(Scope Resolution Operator)**：`::number` 明确表示访问全局变量，无论当前作用域中是否有同名局部变量。

4. **变量的生命周期**：`main()` 中的 `number` 在 `main()` 开始时创建，`main()` 结束时销毁。嵌套块中的 `number` 在进入块时创建，退出块时销毁。全局的 `number` 在程序启动时创建，程序结束时销毁。

> :::caution
> 全局变量虽然方便，但应该**尽量避免使用**。原因如下：
>
> - 任何函数都可以修改全局变量，使得追踪 bug 变得困难
> - 全局变量增加了代码的耦合度，降低了可维护性
> - 全局变量在多线程环境下可能导致竞态条件(Race Condition)
> - 全局变量的生命周期贯穿整个程序，浪费内存资源
>
> 现代 C++ 编程倾向于使用函数参数、返回值和类来组织数据，而不是依赖全局变量。
> :::

<a id="枚举数据类型"></a>

## 枚举数据类型 (Enumerated Data Types)

**枚举(Enumeration)** 是一种用户自定义的数据类型，它定义了一组命名的整型常量。**作用域枚举(Scoped Enumeration)** 是 C++11 引入的改进版本，使用 `enum class` 或 `enum struct` 语法。

作用域枚举的主要优点是：枚举成员被限制在枚举的作用域内，不会与外部命名空间中的同名标识符冲突。

```cpp
enum class Color // 作用域枚举(Scoped Enumeration)
{
    red,
    green,
    blue
};

Color myColor {Color::red}; // 必须使用 Color:: 前缀
```

枚举成员默认从 0 开始编号。你也可以指定起始值：

```cpp
enum class Priority : unsigned char // 指定底层类型
{
    low = 1,
    medium = 10,
    high = 100
};
```

这里 `: unsigned char` 指定了枚举的**底层类型(Underlying Type)**。如果不指定，默认是 `int`。

> :::tip
> 始终使用 `enum class`（作用域枚举）而不是旧的 `enum`（非作用域枚举）。作用域枚举避免了命名污染，并且更加类型安全。
> :::

来看一个完整的例子：

```cpp
// Ex3_03.cpp
// 枚举数据类型示例

import <iostream>;

enum class Color // 作用域枚举
{
    red,
    green,
    blue
};

enum class TrafficLight // 另一个枚举
{
    red,
    yellow,
    green
};

int main()
{
    Color myColor {Color::green};
    TrafficLight light {TrafficLight::red};

    // 注意：Color::red 和 TrafficLight::red 是不同的类型，不会冲突
    std::cout << "Color::green 的值: " 
              << static_cast<int>(myColor) << std::endl;
    std::cout << "TrafficLight::red 的值: " 
              << static_cast<int>(light) << std::endl;
}
```

在 C++20 中，可以使用 `using enum` 简化枚举成员的访问：

```cpp
enum class Color { red, green, blue };

void processColor()
{
    using enum Color;  // 在作用域内可以直接使用 red, green, blue
    Color c {red};     // 不需要 Color:: 前缀了
}
```

也可以使用 `using` 声明导入单个枚举成员：

```cpp
using Color::red;   // 只导入 red
Color c {red};      // 可以直接使用 red
```

> :::note
> `using enum` 是 C++20 引入的新特性，它让整个枚举的成员在当前作用域内可见。这比 `using namespace` 更安全，因为它不会引入命名空间的污染。
> :::

<a id="命名空间的 using"></a>

## 命名空间的 using (Using for Namespaces)

C++ 中的**命名空间(Namespace)** 提供了一种组织代码的方式，避免命名冲突。`using` 关键字有两种主要用法来处理命名空间：

1. **using 声明(Using Declaration)**：导入命名空间中的一个特定成员。

```cpp
using std::cout;  // 只导入 cout
cout << "Hello";  // 不需要 std:: 前缀
```

2. **using 指令(Using Directive)**：导入命名空间中的所有成员。

```cpp
using namespace std;  // 导入整个 std 命名空间
cout << "Hello";      // 不需要 std:: 前缀
```

> :::caution
> `using namespace` 指令应该谨慎使用，尤其是在头文件中。它会污染命名空间，可能导致意外的名称冲突。在源文件的局部作用域中使用 `using` 声明是更安全的选择。
>
> ```cpp
> // 推荐：在函数内部使用 using 声明
> void myFunction()
> {
>     using std::cout;
>     using std::endl;
>     cout << "Hello" << endl;
> }
>
> // 避免：在全局作用域使用 using 指令（尤其是在头文件中）
> using namespace std;  // 不推荐
> ```
> :::

<a id="数据类型别名"></a>

## 数据类型别名 (Aliases for Data Types)

C++ 提供了两种方式为数据类型创建别名：

1. **`using` 关键字（推荐）**：C++11 引入的**类型别名(Type Alias)**语法。

```cpp
using PhoneBook = std::vector<std::string>;
PhoneBook contacts;  // 等价于 std::vector<std::string> contacts;
```

2. **`typedef`（旧式）**：C 风格的传统方式。

```cpp
typedef std::vector<std::string> PhoneBook;  // 旧式语法
```

`using` 语法更加直观，特别是对于模板类型别名：

```cpp
// 旧式 typedef 无法处理模板
// typedef std::map<std::string, int> StringToIntMap; // 可以，但不够灵活

// using 可以创建模板别名（C++11）
template<typename T>
using StrPtr = std::shared_ptr<T>;  // 模板类型别名

StrPtr<int> pInt;  // 等价于 std::shared_ptr<int>
StrPtr<std::string> pString;  // 等价于 std::shared_ptr<std::string>
```

> :::caution
> 类型别名应该**有意义**，而不是为了缩短打字时间。以下是不好的例子：
>
> ```cpp
> using StrPtr = std::string*;  // 这是反模式——指针不应该隐藏在类型别名后面
> ```
>
> 如果 `StrPtr` 表示"字符串指针"，读者很难从名字中看出它是一个裸指针。更好的做法是直接写 `std::string*`，或者使用智能指针。
> :::

**何时使用类型别名？**

- 当你需要频繁使用一个复杂的类型时（如 `std::unordered_map<std::string, std::vector<int>>`）
- 当类型名称能更好地表达意图时（如 `using UserId = int;` 比裸 `int` 更清晰）
- 当你在抽象层的接口中需要替换底层实现类型时

> :::tip
> C++20 的**概念约束(Concept Constraints)**和**模块(Module)**系统进一步减少了类型别名的需求，但在合适的场景下，类型别名仍然是提高代码可读性的有力工具。
> :::

<a id="练习"></a>

## 练习 (Exercises)

以下是第 3 章的练习题：

**Exercise 3-1**

编写一个程序，声明三个 `double` 类型的变量 `x`、`y` 和 `z`，将它们初始化为特定的值。计算并输出以下表达式的结果：

```
(x + y) / z * (x - y) / (x * z)
```

然后去掉括号重新计算，观察结果差异。

> :::tip
> 这道题的目的是让你亲身体验运算符优先级和结合性的影响。先手动计算预期结果，再运行程序验证。
> :::

**Exercise 3-2**

编写一个程序，演示位移位运算符的使用。定义一个 `unsigned short` 变量，初始化为 `1`，然后依次左移 1 到 15 位，输出每一步的十进制和十六进制值。

**Exercise 3-3**

创建一个枚举类 `Suit` 表示扑克牌的花色（黑桃、红心、梅花、方块），再创建一个枚举类 `Rank` 表示牌的点数（A、2-10、J、Q、K）。编写一个程序，随机生成一张牌并输出。

**Exercise 3-4**

编写一个程序，使用按位运算符交换两个整数的值（不使用临时变量）。提示：使用 XOR 的切换特性。

```cpp
// 示例
int a {10};
int b {20};
a ^= b;
b ^= a;
a ^= b;
// 现在 a = 20, b = 10
```

**Exercise 3-5**

定义一个全局变量和一个同名局部变量，演示作用域解析运算符 `::` 的使用。输出两个变量的值，展示它们是如何区分的。

**Exercise 3-6**

使用 `using` 关键字为一个复杂的模板类型创建别名，例如 `std::map<std::string, std::vector<int>>`，然后使用该别名声明变量并进行操作。

**Exercise 3-7**

编写一个程序，模拟一个简单的标志系统。定义多个位标志（如 `READ = 1`、`WRITE = 2`、`EXECUTE = 4`），使用按位运算符设置、清除和查询这些标志。

**Exercise 3-8**

创建一个 RAID 风格的 XOR 校验程序。定义三个 `unsigned char` 变量 A、B、C，其中 C = A ^ B。然后演示当 A 损坏时，如何通过 B 和 C 恢复 A 的值。

> :::tip
> 动手实践是学习位运算的最好方式。位运算的概念看起来简单，但真正在实际项目中运用时，细节之处往往容易出错。多写几个小程序来测试各种边界情况。
> :::


> [!NOTE]
> 此文章由 AI 总结
> 但内容属实
