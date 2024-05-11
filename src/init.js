export function initMixin(Vue){
    Vue.prototype._init = function(options) {
        // vue vm.$options 就是获取用户配置
        
        // 我们使用 Vue 的时候 $nextTick $data $attr ....
        const vm = this
        this.$options = options

        initState(vm)
    }
}


function initState(vm){
    const opts = vm.$options; // 获取所有的选项
    if(opts.data){
        initData(vm)
    }
}

function initData(vm){
    let data = vm.$options.data //data 可能是函数和对象
    
    typeof data === 'function' ? data.call(vm) : data

    console.log(data)
}