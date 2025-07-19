import { createApp, h, hFragment } from "https://unpkg.com/seneca-fe-fwk-runtime"

const state = {
    currentTodo : "",
    edit: {
        idx: null,
        original: null,
        edited: null
    },
    todos: ['lunch', 'snacks', 'dinner']
}


const reducers = {
    'update-todo': (state, currentTodo) => {
        return { 
            ...state,
            currentTodo
        }
    },
     'add-todo': (state) => {
            return {
                 ...state,
                 currentTodo: "",
                 todos: [...state.todos, state.currentTodo]
            }
        },
    'start-editing': (state, idx) => {
        return {
            ...state,
            edit: {
                idx,
                original: state.todos[idx],
                edited: state.todos[idx]
            }
        }
    },
    'edit-todo': (state, edited) => {
            return {
                ...state,
                edit: {
                     ...state.edit,
                     edited
                }
            }
    },
    'save-edited-todo': (state) => {
        return {
            ...state,
            edit: {
                idx: null,
                original: null,
                edited: null
            },
            todos: state.todos.map((todo, idx) => {
                if (idx === state.edit.idx) {
                    return state.edit.edited
                }
                return todo
            })
        }
    },
    'cancel-editing-todo': (state) => {
        return {
            ...state,
            edit: {
                idx: null,
                original: null,
                edited: null,
            },
            
        }
    },
    'remove-todo': (state, idx) => {
        return {
            ...state,
            todos: state.todos.filter((todo, i) => i !== idx)
        }
    }
    
}
// view function
function App(state,emit){
    return hFragment([
        h('h1', {}, ['TODOs']),
        createTodo(state, emit),
        todoList(state,emit)

    ]
    )
}

function createTodo(state, emit){
    return h('div', {}, [
        h('label', {for: 'todo-input'}, ['New TODO:']),
        h('input', {
            id: 'todo-input',
            type: 'text',
            value: state.currentTodo,
            on : {
                input: (e) => emit('update-todo', e.target.value),
                keydown: (e) => {
                    if( e.key === 'Enter' && state.currentTodo.length > 1){
                        emit('add-todo')
                    }
                }
            }}),
        h('button', { 
             disabled: state.currentTodo.length < 2,
             on: { click: () => emit('add-todo') }
        }, ['Add'])
    ])
}

function todoList({todos, edit}, emit){
    return h('ul', {}, todos.map((todo, idx) => todoItem({todo, idx, edit}, emit)))
}

function todoItem({todo, idx, edit}, emit){
 const isEditing = edit.idx === idx;
 return  isEditing ? 
       h('li', {}, [
        h('input', {
            value: edit.edited,
            on: {
                input: (e) => emit('edit-todo', e.target.value),

            }
        }),
        h('button', {
            on: {
                click: () => emit('save-edited-todo')
            }
        }, ['Save']),
        h('button', {
            on: {
                click: () => emit('cancel-editing-todo')
            }
        }, ['Cancel'])
       ]) : h('li', {}, [
        h('span', {}, [todo]),
        h('button', {
            on: {
                click: () => emit('start-editing', idx)
            }
        }, ['Edit']),
        h('button', {
            on: {
                click: () => emit('remove-todo', idx)
            }
        }, ['Done'])
       ])
}

createApp({state, view: App, reducers}).mount(document.body)