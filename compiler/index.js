import {parseHtml} from './parser.js'
export function compileToFunctions(template){
    // console.log(template)
    // 实现模板的编译

    let ast = parseHtml(template);

    return null;
    // 模板编译原理 
    // 1.先把我们的代码转化成ast语法树 （1）  parser 解析  (正则)
    // 2.标记静态树  （2） 树得遍历标记 markup  只是优化
    // 3.通过ast产生的语法树 生成 代码 =》 render函数  codegen
}