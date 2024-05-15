(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  // 重写数组中的部分方法
  var oldArrayProto = Array.prototype; // 获取数组原型

  var newArrayProto = Object.create(oldArrayProto);
  var methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"]; // concat slice 不改变原数组

  methods.forEach(function (method) {
    // arr.push(1,2,3)
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // 重写数组方法
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 内部调用原来的方法，函数劫持 切片编程

      // 需要对新增的数据再次进行劫持
      var inserted;
      var ob = this.__ob__; // 这里的 this 指向 data，因为最后是 data 调用了数组里面的方法
      // this.__ob__ 为 Observe 的实例
      console.log('this');
      console.log(this);
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
      }
      if (inserted) {
        // 对新增内容再次观测
        ob.observeArray(inserted);
      }
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      // Object.defineProperty 只能劫持已经存在的属性(vue里面会为此单独写一些api $set $delete)
      // 给数据加了一个标识 如果数据上有 __ob__ 则说明这个属性被观测过了
      Object.defineProperty(data, "__ob__", {
        value: this,
        // 这个 this 为 Observer 实例
        enumerable: false // 将 __ob__ 变成不可枚举(循环的时候无法获取到)
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
    return _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 循环对象 对属性依次劫持
        // "重新定义"属性 性能差
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);
  }();
  function defineReactive(target, key, value) {
    observe(value); // 对所有的对象都进行属性劫持
    // 闭包 属性劫持
    Object.defineProperty(target, key, {
      get: function get() {
        //   console.log(value);
        // 取值的时候 会执行 get
        return value;
      },
      set: function set(newValue) {
        // 修改的时候 会执行set
        if (newValue === value) return;
        observe(newValue); // newValue为object时需要重新绑定
        value = newValue;
      }
    });
  }
  function observe(data) {
    // 对这个对象进行劫持
    if (_typeof(data) !== "object" || data == null) {
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

  function initState(vm) {
    var opts = vm.$options; // 获取所有的选项
    if (opts.data) {
      initData(vm);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }
  function initData(vm) {
    var data = vm.$options.data; //data 可能是函数和对象

    data = typeof data === "function" ? data.call(vm) : data;
    vm._data = data; // 我将返回的对象放到了_data上
    // 对数据进行劫持 vue2 里采用了一个 api defineProperty
    observe(data);

    // 将vm._data 用vm来代理就可以了
    for (var key in data) {
      proxy(vm, "_data", key);
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // vue vm.$options 就是获取用户配置

      // 我们使用 Vue 的时候 $nextTick $data $attr ....
      var vm = this;
      vm.$options = options;

      // 初始化状态
      initState(vm);
    };
  }

  // 将所有的方法都耦合在一起
  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
