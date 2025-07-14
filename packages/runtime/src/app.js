import { mountDOM } from "./mount-dom";
import { destroyDOM } from "./destroy-dom";
import { Dispatcher } from "./dispatcher";
// This is the assembler of state manager and render
/* what createApp does:
--- subcribes renderApp/ renderer to afterhandlers via dispatcher instance, so that renderer exeecutes everytime when dispatch function is called. So when does dispatch is called? when an event is trigged!!

--- subscribes all the reducers functions via dispatcher.subscribe(commandName, handler)
 */

export function createApp({state, view, reducers = {}}){
    let parentEl = null;
    let vdom = null;

    
    function renderApp(){
        if(vdom){
            destroyDOM(vdom)
        }
        vdom = view(state)
        mountDOM(vdom, parentEl)
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
            renderApp()
        },
        unmount(){
            destroyDOM(vdom)
            vdom = null;
            subscriptions.forEach((unsubscribe) => unsubscribe())
        }
    }
}