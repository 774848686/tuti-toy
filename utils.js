import {
    NODE_TYPES
} from './constant.js';
const reg = /\{\{(.+?)\}\}/; // 取双括号里面的内容
export function compiler(template, data) {
    let childNodes = template.childNodes;
    // 递归遍历node节点 判断是否为文本节点 找到{{}} 然后进行数据替换
    for (let i = 0; i < childNodes.length; i++) {
        let nodeType = childNodes[i].nodeType;
        if (nodeType === NODE_TYPES.TEXT_NODE) {
            let textNodeValue = childNodes[i].nodeValue;
            console.log(textNodeValue)
        }
        if(nodeType === NODE_TYPES.ELEMENT_NODE){
            compiler(childNodes[i],data);
        }
    }
    return template;
}