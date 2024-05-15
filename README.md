# Vue-course
视频链接：https://www.bilibili.com/video/BV1JW4y1j7yE

# 下面是自己做的笔记，有问题欢迎指出。
# P5 实现数组的函数劫持
**复习**：
初始化时会先对传入`data`中所有变量进行劫持，利用`Object.defineProperty`重写`get()、set()`，当变量被修改（调用`set()`）时，判断新变量是否为`object`或`array`类型，对其进行重新绑定。


这节主要是重写了`Array`中的数组方法，增加了`__ob__（Observe实例）`监测标识。
> 重写的方法(7个)：push, pop, shift, unshift, reverse, sort, splice
> 通过新增一个指向`Array.prototype`的对象，重写指定方法，没重写函数会通过原型链去找到原数组的方法。
> `object`用`walk()`劫持,`array`用`observeArray()`劫持。


## 一、 原型链
参考：
    [MDN 原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)


### 1.定义：
每个对象（object）都有一个私有属性指向另一个名为原型（prototype）的对象。原型对象也有一个自己的原型，层层向上直到一个对象的原型为 null。根据定义，null 没有原型，并作为这个原型链（prototype chain）中的最后一个环节。

![原型链](./src/image/Javscript%20原型详细.png)
#### 例子
```
  // 实例
  function Person(name,age){
    this.name = name;
    this.age = age;
  }

  Person.prototype.getName = function(){
    console.log(`我的名字是：${this.name}`);
  }

  let SPB = new Person('SPB',18);
  let PersonProtype = Person.prototype;
  SPB.__proto__ === PersonProtype; // 实例的__proto__指向构造函数原型
  Person === PersonProtype.constructor; // 构造函数原型的constructor指向构造函数

```

### 2.作用：
  主要用来继承(原型继承)

## 二、instanceof
1. 语法
> object instanceof constructor
> 
> object：某个实例对象
> constructor: 某个构造函数

2. 作用

`instanceof`运算符用来检测`constructor.prototype` 是否存在于参数`object`的原型链上。

