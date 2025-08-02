import {DOM_TYPES} from './h.js'
import {setAttributes} from './attributes.js'
import {addEventListeners} from './events.js'

// create element node; vdom: {tag, props, children, type}
function createElementNode(vdom, parentEl, index){
    const {tag, props, children} = vdom;

    const element = document.createElement(tag)
    addProps(element, props, vdom)

    vdom.el = element;

    children.forEach((child) => mountDOM(child, element))

   insert(element, parentEl, index)
}

function addProps(el ,props, vdom){
    const {on: events, ...attrs} = props;

    vdom.listeners = addEventListeners(events, el)

    setAttributes(el, attrs)
}

// create text node: vdom: {type, value}
function createTextNode(vdom, parentEl, index){
    const {value} = vdom;

    const textNode = document.createTextNode(value);

    vdom.el = textNode;

    insert(textNode, parentEl, index)

    
}
// create fragment node; vdom: {type, children}
function createFragmentNode(vdom, parentEl, index){
    const {children} = vdom;
    vdom.el = parentEl;

    children.forEach((child, i) => mountDOM(child, parentEl, index ? index + i: null))
}

function insert(el, parentEl, index) {
  if(index == null) {
    parentEl.append(el)
    return; 
  }
  if(index < 0){
    throw new Error (`Index cannot be negative: ${index}`)
  }
  const children =  parentEl.childNodes
  if(index >= children.length){
    parentEl.append(el) 
  }else {
    parentEl.insertBefore(el, children[index])
  }
  
}

// Takes Vdom, parentEl as input and calls appropriate functions based on vdom.type
export function mountDOM(vdom, parentEl, index){
    switch(vdom.type){
        case DOM_TYPES.TEXT: {
            createTextNode(vdom, parentEl, index)
            break;
        }
        case DOM_TYPES.ELEMENT: {
            createElementNode(vdom, parentEl, index)
            break;
        }
        case DOM_TYPES.FRAGMENT: {
            createFragmentNode(vdom, parentEl, index)
            break;
        }
        default: {
            throw new Error(`can't mount DOM of type: ${vdom.type}`)
        }
    }
}