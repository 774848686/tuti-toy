import {
    computed,
    effect,
    reactive
}
from './reactive.js';
class Vue {
    constructor(options) {
        this.template = null;
        this.$options = options;
        this.$data = {};
        if (options.data && typeof options.data === 'function') {
            this.$data = reactive(options.data())
        }
        console.log(this.$data)
    }
    mount(el) {
        console.log(reactive)
        this.template = document.querySelector(el);
        console.log(this.template)
    }
}

function createApp(options) {
    return new Vue(options);
}
export {
    createApp,
    computed,
    effect,
    reactive
}