(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

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
    function initState(vm) {
      var opts = vm.$options; // 获取所有的选项
      if (opts.data) {
        initData(vm);
      }
    }
    function initData(vm) {
      var data = vm.$options.data; //data 可能是函数和对象

      typeof data === 'function' ? data.call(vm) : data;
      console.log(data);
    }

    // 将所有的方法都耦合在一起
    function Vue(options) {
      this._init(options);
    }
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
