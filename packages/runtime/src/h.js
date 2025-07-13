import { withoutNulls} from './utils/arrays.js'

 
// types of virtual nodes
export const DOM_TYPES = {
    TEXT: 'text',
    ELEMENT: 'element',
    FRAGMENT: 'fragment'
}
// h function to create virtual node for type: Element

export function h(tag, props = {}, children = []){
    return {
        tag,
        props,
        children: mapTextNodes(withoutNulls(children)),
        type: DOM_TYPES.ELEMENT,
    }
}
// h function to create virtual node for type: Text

export function hString(str){
    return {type: DOM_TYPES.TEXT, value: str}
}
// h function to create virtual node for type: Fragment
export function hFragment(vNodes){
    return {
        type: DOM_TYPES.FRAGMENT,
        children: mapTextNodes(withoutNulls(vNodes)),
    }
}

function mapTextNodes(children){
    return children.map((child) => 
    typeof child === 'string' ? hString(child) : child)
}

const vDOM = h('form', {class: 'login-form', action: 'login'}, 
    [
        h('input', {type: 'text', name: 'user'}),
        h('input', {type: 'password', name: 'pass'}),
        h('button', {type: 'submit'}, ['Login']),
    ]
)

