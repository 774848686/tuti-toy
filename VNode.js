class VNode {
    constructor(tag, el, attrs, nodetype) {
        this.tag = tag;
        this.el = el;
        this.attrs = attrs;
        this.nodetype = nodetype;
        this.children = [];
    }
    appendChild(vnode) {
        this.children.push(vnode);
    }
    getVNode(){
        
    }
}