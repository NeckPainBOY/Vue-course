// 重写数组中的部分方法
let oldArrayProto = Array.prototype; // 获取数组原型

export let newArrayProto = Object.create(oldArrayProto);

let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"]; // concat slice 不改变原数组

methods.forEach((method) => {
  // arr.push(1,2,3)
  newArrayProto[method] = function (...args) {
    // 重写数组方法
    const result = oldArrayProto[method].call(this, ...args); // 内部调用原来的方法，函数劫持 切片编程

    // 需要对新增的数据再次进行劫持
    let inserted;
    let ob = this.__ob__; // 这里的 this 指向 data，因为最后是 data 调用了数组里面的方法
    // this.__ob__ 为 Observe 的实例
    // console.log('this')
    // console.log(this)
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }

    if (inserted) {
      // 对新增内容再次观测
      ob.observeArray(inserted);
    }
    return result;
  };
});
