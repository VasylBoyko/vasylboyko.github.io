export default class Reducer {
    constructor(defaultState={}, reducers={}) {
        this.defaultState = defaultState;
        this.reducers = reducers;
    }
    
    reducer() {
        function handler(state, action) {
            state = state || this.defaultState;
            const reducer = this.reducers[action.type];
  
            if (typeof reducer === "function") {
                return reducer(state, action.payload);
            }
  
            return state;  
        }
      
        return handler.bind(this);
    }
    
    initState() {
        return Object.assign({}, this.defaultState);
    }
}
  