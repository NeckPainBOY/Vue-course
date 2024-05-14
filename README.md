# Vue-course

主要是自学 Vue 源码做的笔记，大多数代码跟着B站视频写的
链接：https://www.bilibili.com/video/BV1JW4y1j7yE

# 下面是自己做的笔记，有问题欢迎指出。
# P4 实现对象的响应式原理

主要用`Object.defineProperty`进行数据劫持，现在只对`对象`进行劫持。
第一次劫持：设置了`set`和`get`
第二次劫持：用`vm`代理`vm._data`


## 一、 闭包
参考：
    [MDN 闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)
    [彻底理解js闭包:前端自学驿站](https://juejin.cn/post/6844903470839906311)


### 1.定义：
```
1. 《你不知道的javaScript》对于闭包是这么定义的：函数创建和函数执行不在同一个作用域下就会形成闭包。
2. MDN对于闭包的定义为：闭包是指那些能够访问 自由变量① 的函数。
3. 《JS高级程序设计-第3版》对于闭包的定义:  闭包是指有权访问另外一个函数作用域中的变量的函数

①自由变量：不是函数参数arguments，也不是函数内部声明的变量。
```
#### 闭包例子
```
// 例子1：
function fun() {
  var count = 1;
  return function () {
    count++; // 自由变量
    console.log(count);
  }
}

var fun2 = fun(); // fun2 => 返回的匿名函数
fun2(); // 函数在全局作用域调用，创建的时候是在fun作用域中创建的

// 例子2(面试题)：
function fun(n, o) {
  console.log(o);
  return {
    fun: function (m) {
      return fun(m, n);
    }
  };
}

var a = fun(0); // ?
a.fun(1); // ?
a.fun(2); // ?
a.fun(3); // ?
var b = fun(0).fun(1).fun(2).fun(3); // ?
var c = fun(0).fun(1); // ?
c.fun(2); // ?
c.fun(3); // ?

解析可以去看:
彻底理解js闭包 (https://juejin.cn/post/6844903470839906311)
```

### 2.闭包作用：
    1. 闭包最大的作用就是用来 变量私有
    （外部不能直接通过实例进行访问）
    2. 实现函数式编程

### 3.闭包缺点
    不正确使用可能会导致内存泄漏



## 二、 Object.defineProperty
参考：
[MDN Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)    
`Object.defineProperty()` 允许精确地添加或修改对象上的属性

语法：`Object.defineProperty(obj, prop, descriptor)`
```
obj：要定义属性的对象。（vm）
prop:一个字符串或 Symbol，指定了要定义或修改的属性键。(key)
descriptor:要定义或修改的属性的描述符。({get(){...},set(){...},})
```

