import {
    computed,
    effect,
    reactive
}
from './reactive.js';
import {
    initMixin
} from './instance/init.js';
import {
    initMount
} from './instance/mount.js'

function Vue(options) {
    this._init(options)
}
initMixin(Vue);
initMount(Vue);

function createApp(options) {
    return new Vue(options);
}
export {
    createApp,
    computed,
    effect,
    reactive
}