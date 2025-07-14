import { h } from "./h"
import { mountDOM } from "./mount-dom"

const vDOM = h('form', {class: 'login-form', action: 'login'}, 
    [
        h('input', {type: 'text', name: 'user'}),
        h('input', {type: 'password', name: 'pass'}),
        h('button', {type: 'submit'}, ['Login']),
    ]
)

mountDOM(vDOM, document.body)