import {
    reactive
} from "../reactive.js";
export function initMixin(Vue) {
    Vue.prototype._init = function (opts) {
        let vm = this;
        vm.$options = opts;
        initState(vm);
    }

    function initState(vm) {
        vm._template = null;
        if (vm.$options.data) {
            initData(vm)
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
            return data.call(vm, vm);
        }
        // 将data()中的数据代理到vm._data上,获取跟修改就会触发vm._data响应式数据；
        function proxy(target, sourceKey, key) {
            const sharedPropertyDefinition = {
                enumerable: true,
                configurable: true,
                get: null,
                set: null
            }
            sharedPropertyDefinition.get = function proxyGetter() {
                return this[sourceKey][key]
            }
            sharedPropertyDefinition.set = function proxySetter(val) {
                this[sourceKey][key] = val
            }
            Object.defineProperty(target, key, sharedPropertyDefinition)
        }

    }
}