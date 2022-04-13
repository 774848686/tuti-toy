export function addHandler(el, name, value, data, flag) {
    el.addEventListener(name, data[value], flag);
}