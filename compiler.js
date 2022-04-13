import {
    NODE_TYPES
} from './constant.js';
import {
    getValueByPath
} from './utils.js';
import {
    addHandler
} from './instance/events.js'
const reg = /\{\{(.+?)\}\}/; // 取双括号里面的内容
export function compiler(template, data) {
    let childNodes = template.childNodes;
    // 递归遍历node节点 判断是否为文本节点 找到{{}} 然后进行数据替换
    for (let i = 0; i < childNodes.length; i++) {
        let nodeType = childNodes[i].nodeType;
        if (nodeType === NODE_TYPES.TEXT_NODE) {
            let textNodeValue = childNodes[i].nodeValue;
            let txt = textNodeValue.replace(reg, function (_, t) {
                const key = t.trim();
                return getValueByPath(data, key);
            });
            childNodes[i].nodeValue = txt;
        }
        if (nodeType === NODE_TYPES.ELEMENT_NODE) {
            processAttrs(childNodes[i], data);
            compiler(childNodes[i], data);
        }
    }
    return template;
}
export const dirRE = /^v-|^@|^:|^#/
export const onRE = /^@|^v-on:/

// 解析模板属性  用@click="doSomething"为例
function processAttrs(el, data) {
    const list = el.attributes // 获取所有属性列表
    let i, l, name, rawName, value;
    for (i = 0, l = list.length; i < l; i++) {
        name = rawName = list[i].name; // 这里是事件名称 @click
        value = list[i].value; // 这里是生命的函数名称 doSomething
        if (dirRE.test(name)) { // 匹配v-或者@开头的指令
            if (onRE.test(name)) { // v-on
                if (name.indexOf('@') > -1) {
                    name = name.substring(1);
                }
                if (name.indexOf('v-on') > -1) {
                    name = name.substring(5);
                }
                addHandler(el, name, value, data, false)
            }
        }
    }
}