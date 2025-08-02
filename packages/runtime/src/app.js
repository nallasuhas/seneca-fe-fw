import { mountDOM } from "./mount-dom.js";
import { destroyDOM } from "./destroy-dom.js";
import { Dispatcher } from "./dispatcher.js";
import { patchDOM } from "./patch-dom.js";
// This is the assembler of state manager and render
/* what createApp does:
--- subcribes renderApp/ renderer to afterhandlers via dispatcher instance, so that renderer exeecutes everytime when dispatch function is called. So when does dispatch called? when an event is trigged!!

--- subscribes all the reducers functions via dispatcher.subscribe(commandName, handler)
 */

export function createApp({state, view, reducers = {}}){
    let parentEl = null;
    let vdom = null;

    
    function renderApp(){
       const newvdom = view(state, emit)
       vdom = patchDOM( vdom,newvdom,  parentEl)
    }
    const dispatcher = new Dispatcher()
    const subscriptions  = [dispatcher.afterEveryCommand(renderApp)]

    function emit(eventName, payload){
        dispatcher.dispatch(eventName, payload)
    }

    for(const actionName in reducers){
        const reducer = reducers[actionName]

        const subs = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload)
        })
        subscriptions.push(subs)
    }

    return {
        mount(_parentEl){
            parentEl = _parentEl
            vdom = view(state, emit)
            mountDOM(vdom, parentEl)
            
        },
        unmount(){
            destroyDOM(vdom)
            vdom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe())
        }
    }
}