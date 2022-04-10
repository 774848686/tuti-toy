export function noop() {} // 什么也不做, 用来占位置
// 解决多层对象取值问题
export function getValueByPath(obj, path) {
    let paths = path.split('.'); // [ xxx, yyy, zzz ]
    let res = obj;
    let prop; // 每次取第一个 然后赋值res 直到最后一个
    while (prop = paths.shift()) {
        res = res[prop];
    }
    return res;
}