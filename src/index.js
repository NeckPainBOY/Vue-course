import { initMixin } from "./init"

// 将所有的方法都耦合在一起
function Vue(options){
    this._init(options)
}

initMixin(Vue)

export default Vue