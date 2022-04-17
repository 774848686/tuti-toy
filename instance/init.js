import {
    reactive,
    computed,
    popTarget,
    pushTarget
} from "../reactive.js";
import {
    noop
} from '../utils.js';
import {
    warn
} from '../debug.js'
export function initMixin(Vue) {
    Vue.prototype._init = function (opts) {
        let vm = this;
        vm.$options = opts;
        initState(vm);
    }

    function initState(vm) {
        vm._template = null;
        const opts = vm.$options;
        if (opts.data) {
            initData(vm)
        }
        if (opts.computed) {
            initComputed(vm)
        }
        if (opts.methods) {
            initMethods(vm)
        }
    }

    function initComputed(vm) {
        let computed = vm.$options.computed;
        vm._computed = {};
        Object.keys(computed).forEach(key => {
            if (key in vm) {
                warn(`不能添加一个已经存在的变量名`)
            } else {
                //定义一个key到vm实例上，然后把这个回调函数添加到compuetd监听方法中
                defineComputed(vm, key, computed[key]);
            }
        })
    }

    function initMethods(vm) {
        let methods = vm.$options.methods;
        for (let key in methods) {
            vm[key] = typeof methods[key] === 'function' ? methods[key].bind(vm) : noop
        }
    }

    function initData(vm) {
        let data = vm.$options.data;
        data = vm._data = typeof data === 'function' ?
            getData(data, vm) : {};

        const keys = Object.keys(data);
        const props = vm.$options.props
        const methods = vm.$options.methods
        let i = keys.length;
        while (i--) {
            const key = keys[i];
            proxy(vm, `_data`, key);
        }
        vm._data = reactive(vm._data)

        function getData(data, vm) {
            try {
                pushTarget(null) // 由于此时是 Vue 的初始化, 还没有进行模板渲染, 所以不需要进行依赖收集, 在 pushTarget 的时候传入 空
                return data.call(vm, vm);
            } finally {
                popTarget()
            }

        }
    }

    function defineComputed(vm, key, computedFn) {
        vm._computed[key] = computed(computedFn.bind(vm));
        proxy(vm, `_computed`, key, true);
    }
    // 将data()中的数据代理到vm._data上,获取跟修改就会触发vm._data响应式数据；
    function proxy(target, sourceKey, key, isValue = false) {
        const sharedPropertyDefinition = {
            enumerable: true,
            configurable: true,
            get: noop,
            set: noop
        }
        sharedPropertyDefinition.get = function proxyGetter() {
            return isValue ? this[sourceKey][key].value : this[sourceKey][key]
        }
        sharedPropertyDefinition.set = function proxySetter(val) {
            if (isValue) {
                this[sourceKey][key].value = val
            } else {
                this[sourceKey][key] = val
            }
        }
        Object.defineProperty(target, key, sharedPropertyDefinition)
    }
}