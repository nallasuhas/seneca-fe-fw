// State manager
/* A dispatcher contains two variables: subs, afterhandlers 
--- subs is an object of type: 
subs = {
  commandName: handler
}
--- handler is called reducer which is of form: 
    reducer(state, payload) returns new state
--- these reducers can be subscribed via dispatcher.subscribe(commandName, handler) function

--- afterhandlers is an array of handler function(s) that is/are executed afer executing reducer function(s)

--- dispatch(commandName, payload) is a function that is to be called by components via dispatcher.dispatch() 
  -- dispatch takes commandName, payload and executes the corresponding reducer function(s)  and executes afterhandler function(s)


 */
export class Dispatcher {
    // private variable
    #subs = new Map();

    #afterhandlers = []

    // used to subscribe commands and thier handlers
    subscribe(commandName, handler){
         // create an array if there is no command already
        if(!this.#subs.has(commandName)){
            this.#subs.set(commandName, [])
        }
   
        const handlers = this.#subs.get(commandName)

        if(handlers.includes(handler)) {
            return () => {}
        }
 // Register a handler
        handlers.push(handler)
  // return a function to unregister
        return () => {
            const idx = handlers.indexOf(handler)
            if (idx !== -1) {  // Only splice if handler exists
                handlers.splice(idx, 1)
            }
        }
    }

    // used to notify renders
    afterEveryCommand(handler){
        this.#afterhandlers.push(handler)

        return () => {
            const idx = this.#afterhandlers.indexOf(handler)
            this.#afterhandlers.splice(idx, 1)
        }
    }
  // used to dispatch the command and payload with the context of running application
    dispatch(commandName, payload){
          if(this.#subs.has(commandName)){
            this.#subs.get(commandName).forEach((handler) => handler(payload))
          }else {
            console.warn(`No handler for command: ${commandName}`)
          }

          this.#afterhandlers.forEach((handler) => handler())
    }
}