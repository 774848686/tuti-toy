// parseHtml的大致的思路是这样的
// 首先获取到当前的outHtml字符串，再根据正则匹配标签以及attrs，进行字符串截取，
// 利用advance函数进行字符串往前移动一直匹配到最后一个闭合的标签
// 最后生成一个对象来对这个html字符串进行描述
import {startTagOpen,startTagClose,attribute} from './RegExp.js';
export function parseHtml(html){
    function createASTElement(tagName,attrs){
        return {
            tag:tagName,
            attrs,
            children:[],
            type:1,
            parent:null
        }   
    }
   console.log( parseStartTag())
    // 字符串截取 前进函数
    function advance(n){
        html = html.substring(n)
    }
    function parseStartTag(){
        // 解析出开始标签
        const start = html.match(startTagOpen);
        if(start){
            const match = {
                tagName:start[1],
                attrs: []
            }
            advance(start[0].length);
            let end,attr;
            // 继续前进 解析出attrs 遇到开始标签的'>';则结束开始标签的解析
            while(!(end=html.match(startTagClose)) && (attr=html.match(attribute))){
                advance(attr[0].length);
                match.attrs.push(
                    { name: attr[1], value: attr[3] || attr[4] || attr[5] }
                );
            }
            if(end){
                advance(end[0].length);
                return match;
            }
        }

    }

}

