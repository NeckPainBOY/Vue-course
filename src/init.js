import { compileToFunction } from "./compiler/index";
import { mountComponent } from "./lifecycle";
import { initState } from "./state";
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // vue vm.$options 就是获取用户配置

    // 我们使用 Vue 的时候 $nextTick $data $attr ....
    const vm = this;
    vm.$options = options;

    // 初始化状态
    initState(vm);

    if (options.el) {
      vm.$mount(options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    const vm = this;
    el = document.querySelector(el);
    let ops = vm.$options;
    if (!ops.render) {
      // 先进行查找有没有 render 函数
      let template; // 没有 render 看一下是否写了 template, 没写 template 采用外部的 template
      if (!ops.template && el) {
        // 没有写模板但是写了 el
        template = el.outerHTML;
      } else {
        if (el) {
          template = ops.template;
        }
      }
      if (template && el) {
        const render = compileToFunction(template);
        ops.render = render; // jsx 最终会被编译成 h('xxx')
      }
      // console.log(template);
    }
    // ops.render; // 最终可以获取 render 方法

    mountComponent(vm, el); // 组件挂载

    // script 标签引用的 vue.global.js 这个编译过程是在浏览器运行的
    // runtime 是不包含模板编译的, 整个编译时打包的时候通过 loader 来转义 .vue 文件的，用 runtime 的时候不能使用 template
  };
}
