import { reactive } from "../reactive.js";
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        let vm = this;
        vm._template = null;
        vm.$options = options;
        vm.$data = {};
        if (options.data && typeof options.data === 'function') {
            vm.$data = reactive(options.data())
        }
    }
}