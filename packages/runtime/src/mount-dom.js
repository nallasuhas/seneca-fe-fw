import {DOM_TYPES} from './h.js'
import {setAttributes} from './attributes.js'
import {addEventListeners} from './events.js'

// create element node; vdom: {tag, props, children, type}
function createElementNode(vdom, parentEl){
    const {tag, props, children} = vdom;

    const element = document.createElement(tag)
    addProps(element, props, vdom)

    vdom.el = element;

    children.forEach((child) => mountDOM(child, element))

    parentEl.append(element)
}

function addProps(el ,props, vdom){
    const {on: events, ...attrs} = props;

    vdom.listeners = addEventListeners(events, el)

    setAttributes(el, attrs)
}

// create text node: vdom: {type, value}
function createTextNode(vdom, parentEl){
    const {value} = vdom;

    const textNode = document.createTextNode(value);

    vdom.el = textNode;

    parentEl.append(textNode)
}
// create fragment node; vdom: {type, children}
function createFragmentNode(vdom, parentEl){
    const {children} = vdom;
    vdom.el = parentEl;

    children.forEach((child) => mountDOM(child, parentEl))
}

// Takes Vdom, parentEl as input and calls appropriate functions based on vdom.type
export function mountDOM(vdom, parentEl){
    switch(vdom.type){
        case DOM_TYPES.TEXT: {
            createTextNode(vdom, parentEl)
            break;
        }
        case DOM_TYPES.ELEMENT: {
            createElementNode(vdom, parentEl)
            break;
        }
        case DOM_TYPES.FRAGMENT: {
            createFragmentNode(vdom, parentEl)
            break;
        }
        default: {
            throw new Error(`can't mount DOM of type: ${vdom.type}`)
        }
    }
}