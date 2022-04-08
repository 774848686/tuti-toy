import {
    compiler
} from '../utils.js'
export function initMount(Vue) {
    Vue.prototype.mount = function (el) {
        let vm = this;
        // 获取模版
        vm._el = el;
        vm._templateDOM = document.querySelector(vm._el);
        vm._realHTMLDOM = vm._templateDOM.cloneNode(true);
        vm._parent = vm._templateDOM.parentNode;
        vm._render();
        return vm;

    }
    Vue.prototype._render = function () {
        let vm = this;
        const real = compiler(vm._realHTMLDOM, vm.$data);
        vm.update(real);
    }
    Vue.prototype.update = function (real) {
        let vm = this;
        console.log(real.nodeType)
        if (real && real.nodeType) {
            vm._parent.replaceChild(real, vm._templateDOM);
        }
    }
}