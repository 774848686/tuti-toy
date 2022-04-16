/** 
 * 取值的时候开始收集依赖，即收集effect
 */
const targetMap = new WeakMap();
let activeEffect = null,
    effectStack = [];

function track(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, []);
    }
    if (activeEffect) {
        depsMap.get(key).push(activeEffect);
    }

}

function trigger(target, prop) {
    let depsMap = targetMap.get(target);
    if (depsMap) {
        depsMap.get(prop).forEach(effect => {
            effect();
        });
    }
}

function reactive(target) {
    let oldValue = null;
    const proxy = new Proxy(target, {
        get(obj, prop) {
            oldValue = obj[prop];
            track(obj, prop);
            if (typeof obj[prop] === 'object') {
                return reactive(obj[prop])
            }
            return obj[prop]
        },
        set(obj, prop, value) {
            oldValue = obj[prop];
            if (oldValue != value) {
                obj[prop] = value;
                trigger(obj, prop)
            }
            return true
        }
    });
    return proxy;
}

function createReactiveEffect(fn, options = {}) {
    let effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) {
            try {
                // 在取值之前将当前effect放到栈顶并标记为activeEffect
                effectStack.push(effect); // 将自己放到effectStack的栈顶
                activeEffect = effect; // 同时将自己标记为activeEffect
                return fn(); // 执行effect的回调就是一个取值的过程
            } finally {
                effectStack.pop(); // 从effectStack栈顶将自己移除
                activeEffect = effectStack[effectStack.length - 1]; // 将effectStack的栈顶元素标记为activeEffect
            }
        }
    }
    effect.options = options;
    return effect;
}

function effect(fn, options = {}) {
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) { // 如果不是计算属性的effect，那么会立即执行该effect
        effect();
    }
    return effect;
}

function computed(fn) {
    // computed 不是刚开始就执行fn 而是再取返回的这个计算值的时候触发
    let computed;
    let getter = fn;
    let dirty = true;
    let runner = effect(getter, {
        lazy: true, // 默认是非立即执行，等到取值的时候再执行
    });
    let value;
    computed = {
        get value() {
            if (dirty) {
                value = runner(); // 等到取值的时候再执行计算属性内部创建的effect
                // dirty = false; // 取完值后数据就不是脏的了
            }
            return value;
        }
    }
    return computed; //取值的时候 需要取.value
}
export {
    computed,
    effect,
    reactive
}
// let test = {
//     a: 1,
//     b: 2
// }
// const proxyData = reactive(test)
// let watchValue, watchValue2;
// effect(() => watchValue = proxyData.a + 1)
// effect(() => watchValue = proxyData.a + 1)
// console.log(watchValue)
// proxyData.a = 2;
// console.log(watchValue)
// effect(() => {
//     watchValue2 = proxyData.b + 1
// })
// console.log(watchValue2)
// let computedValue = computed(() => proxyData.a + 10)
// setTimeout(() => {
//     proxyData.a = 6;
//     console.log('computed', proxyData.a, computedValue.value)
// }, 1000)