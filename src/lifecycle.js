export function initLifeCycle(Vue) {
  Vue.prototype._update = function () {
    console.log("update");
  };

  Vue.prototype._render = function () {
    console.log("render");
  };
}

export function mountComponent(vm, el) {
  // 1. 调用 render 方法产生虚拟节点 虚拟dom
  vm._update(vm._render()); // vm.$options.render() 虚拟节点
  // 2. 根据虚拟 dom 生成真实 dom

  // 3. 插入到 el 中
}

// vue 核心流程
// 1）创建了响应式数据
// 2）模板转换成 ast 树
// 3）将 ast 语法树转换了 render 函数
// 4）后续每次数据更新可以只执行 render 函数（无需再次执行 ast 转换过程）
// render 函数会去产生虚拟节点（使用响应式数据）
// 根据生成虚拟节点创造真实的 dom
