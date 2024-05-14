import { initState } from "./state";
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // vue vm.$options 就是获取用户配置

    // 我们使用 Vue 的时候 $nextTick $data $attr ....
    const vm = this;
    vm.$options = options;

    // 初始化状态
    initState(vm);
  };
}
