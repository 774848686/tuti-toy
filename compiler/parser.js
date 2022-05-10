// parseHtml的大致的思路是这样的
// 首先获取到当前的outHtml字符串，再根据正则匹配标签以及attrs，进行字符串截取，
// 利用advance函数进行字符串往前移动一直匹配到最后一个闭合的标签
// 最后生成一个对象来对这个html字符串进行描述
import {
    startTagOpen,
    startTagClose,
    attribute,
    endTag
} from './RegExp.js';
export function parseHtml(html) {
    let root;
    let curentParent = null;
    let stack = []; // 存储解析的每个标签

    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            attrs,
            children: [],
            type: 1,
            parent: null
        }
    }
    // 根据开始标签push到stack中 然后根据匹配到的结束标签进行确定父子关系
    function start(tagName, attrs) {
        let element = createASTElement(tagName, attrs);
        if (!root) {
            root = element; // vue2 仅有一个根节点 
        }
        curentParent = element;
        stack.push(element);
    }
    // 匹配到结束标签后 比如 <div><span>ceshi</span></div> [div,span]
    function end() {
        let element = stack.pop();
        let curentParent = stack[stack.length - 1];
        if (curentParent) {
            element.parent = curentParent;
            curentParent.children.push(element)
        }
    }
    // 处理文本节点
    function chars(text) {
        text = text.replace(/\s/g, '');
        if (text) {
            curentParent.children.push({
                type: 3,
                text
            });
        }
    }

    while (html) {
        let textEnd = html.indexOf('<'); // 首先看是否有开始标签符号<
        if (textEnd == 0) { // 如果为0 则说明刚开始就是一个开始标签
            const startTagMatch = parseStartTag();
            if (startTagMatch) {
                // 解析开始标签 然后依次压入到stack中
                start(startTagMatch.tagName, startTagMatch.attrs)
            }
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                // 解析结束标签然后开始出stack 并确定父子关系；最后出栈的是子，前一个就是父
                end(endTagMatch[1])
            }
        }
        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd);
            chars(text)
        }
        if (text) {
            advance(text.length); // 删除文本内容
        }
    }

    // 字符串截取 前进函数
    function advance(n) {
        html = html.substring(n)
    }

    function parseStartTag() {
        // 解析出开始标签
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length);
            let end, attr;
            // 继续前进 解析出attrs 遇到开始标签的'>';则结束开始标签的解析
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                });
            }
            if (end) {
                advance(end[0].length);
                return match;
            }
        }

    }
    console.log(root)
    return root;

}