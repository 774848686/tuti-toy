import {
    compiler
} from '../compiler.js';
import {
    effect
} from '../reactive.js';
export function initMount(Vue) {
    Vue.prototype.mount = function (el) {
        let vm = this;
        // 获取模版
        vm._el = el;
        vm._templateDOM = document.querySelector(vm._el);
        vm._oldHTMLDOM = vm._templateDOM;
        vm._parent = vm._templateDOM.parentNode;
        // 数据改变跟视图更新进行绑定
        effect(() => {
            vm._render.call(vm);
            vm.update(vm, vm.rnode);
        });
        return vm;
    }
    Vue.prototype._render = function () {
        let vm = this;
        const _realHTMLDOM = vm._templateDOM.cloneNode(true);
        vm.rnode = compiler(_realHTMLDOM, vm);
    }
    Vue.prototype.update = function (vm, real) {
        if (real && real.nodeType) {
            // replaceChild 需要是新节点跟老节点的替换
            vm._parent.replaceChild(real, vm._oldHTMLDOM);
            vm._oldHTMLDOM = real;
        }
    }
}