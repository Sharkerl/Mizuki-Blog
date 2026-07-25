---
title: C/C++ Weak Zero "I/O"
Description: Learn c&cpp together
published: 2026-07-25
date: 2026-07-25
draft: false
tags: ["C++", "C"]
category: "Cpp"
pinned: false
auther: Sharkerl
location: 32.0, 118.9
---

各位好, 现在我们一起进行从零开始的 `C/C++` 学习之旅吧.

**事先说明:** `C/C++` 已经有一段历史了, 其中一部分的语言设计已经落后于时代 (当然,在新的 Cpp规范 中我们已经可以看到Cpp委员会往其中添加了很多现代设计, 他们在努力改进), 比如 C/Cpp 中的 `include` 与现代语言的 `import`(虽然 Cpp23 规范已经可以导入模块了, 但现在是 2026 年, 谁知道你什么时候能用上 Cpp23 ?).<br>
正是由于 Cpp新规范频繁加东西, 所以 Cpp语法非常混乱, 那些神奇的令人费解的命名, 以及一堆看以来相似的函数, 还有庞大的标准库...<br>
这里有一个长达**2个小时**狂喷Cpp的视频: <br>
Bilibili: [有史以来最烂的编程语言](https://www.bilibili.com/video/BV1xYUtB5Evr/ "有史以来最烂的编程语言")<br>
Youtube: [The worst programming language of all time](https://www.youtube.com/watch?v=7fGB-hjc2Gc "The worst programming language of all time")<br>
如果真的要学 C++, 那么, 祝你好运 !

### 0. **第一个程序**
   
```cpp title = "main.cpp"
#include <iostream>

int main()
{
    std::cout << "Hello World" << std::endl;
}
```

### 1. **Cpp head file 头文件**
   
   我们可以通过 `include` 关键字来导入头文件, 头文件的后缀名通常为 `.h`. C/Cpp 标准库为我们提供了多种头文件, 完整列表参看 [C/C++ 标准库头文件](https://cppreference.cn/w/cpp/header)<br>

   **头文件是如何实现的**
   就这样, 每当编译时, 把头文件内容复制粘贴到源文件中, 示例:

```cpp title = "example.h"
#pragma once
std::cout << "Hello World" << std::endl;
```
<br>

```cpp title = "main.cpp"
#include <iostream>

int main()
{
    #include "example.h"
}
```

### 2. **Compiler 编译器**

### 3. **Linker 链接器**

### 4. **Input and Output 输入与输出**

### 5. **Terminal 终端**

### 6. **Function 函数**

### 7. **main 主函数**