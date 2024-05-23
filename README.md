# Vue-course
视频链接：https://www.bilibili.com/video/BV1JW4y1j7yE

# 下面是自己做的笔记，有问题欢迎指出。
# P6-7 实现数组的函数劫持
调用`$mount`，执行了`compileToFunction`等函数，使用`startTagOpen(获取标签头)`,`endTag（结束标签）`,`attribute（标签属性）`等正则，再运用`栈`先入后出结构，将`DOM`结构转化为`ast语法树`（createASTElement）

## 一、 数据结构(栈:`Stack`,树：`tree`)
参考：
    [JavaScript 数据结构和算法](https://wangtunan.github.io/blog/books/javascript/algorithm.html)


### 1.定义：
栈：栈是一种遵从后进先出(`LIFO`)原则的有序集合，新添加或待删除的元素都保存在栈的同一端，称之为栈顶，另一端叫栈底。
树： 一个树结构包含一系列存在父子关系的节点，每个节点都有一个父节点(除顶部的第一个节点)以及零个或多个子节点。

#### 例子
```
  // 创建一个栈：JavaScript 数据结构和算法:创建一个基于数组的栈结构
  // 例子：十进制转二进制

  //
```