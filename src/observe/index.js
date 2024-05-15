import { newArrayProto } from "./array";

class Observer {
  constructor(data) {
    // Object.defineProperty 只能劫持已经存在的属性(vue里面会为此单独写一些api $set $delete)
    // 给数据加了一个标识 如果数据上有 __ob__ 则说明这个属性被观测过了
    Object.defineProperty(data, "__ob__", {
      value: this, // 这个 this 为 Observer 实例
      enumerable: false, // 将 __ob__ 变成不可枚举(循环的时候无法获取到)
    });
    // data.__ob__ = this;
    if (Array.isArray(data)) {
      // 这里我们可以重写数组中的方法 7个变异方法 时可以修改数组本身的
      // console.log(data);
      data.__proto__ = newArrayProto;
      this.observeArray(data); // 如果数组中放置的是对象，可以监控到对象的变化
    } else {
      this.walk(data);
    }
  }
  walk(data) {
    // 循环对象 对属性依次劫持
    // "重新定义"属性 性能差
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }

  observeArray(data) {
    data.forEach((item) => observe(item));
  }
}

export function defineReactive(target, key, value) {
  observe(value); // 对所有的对象都进行属性劫持
  // 闭包 属性劫持
  Object.defineProperty(target, key, {
    get() {
      //   console.log(value);
      // 取值的时候 会执行 get
      return value;
    },
    set(newValue) {
      // 修改的时候 会执行set
      if (newValue === value) return;
      observe(newValue); // newValue为object时需要重新绑定
      value = newValue;
    },
  });
}

export function observe(data) {
  // 对这个对象进行劫持
  if (typeof data !== "object" || data == null) {
    return; // 只对对象进行劫持
  }

  if (data.__ob__ instanceof Observer) {
    // 说明对象已经被检测过
    return data.__ob__;
  }
  // 如果一个对象被劫持过了，那就不需要在劫持了
  // （要判断一个对象是否被劫持过，可以增加一个实例，
  // 用实例来判断是否被劫持过）

  return new Observer(data);
}
