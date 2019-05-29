import update from "immutability-helper";

import dispatchEvents from "../dispatchEvents";
import Reducer from "./Reducer";

const defaultState = {
    byId: {},
    array: [],
    count: 0,
    search: ""
};

const reducers = {
    [dispatchEvents.videos.getList.fulfilled]: (state, payload) => {
        console.log(payload);
        return update(state, {
            array: {
                $set: payload.data
            }
        });
    },
    [dispatchEvents.videos.getVideoDetails.fulfilled]: (state, payload) => {
        console.log(payload);
        //TODO find item by "payload.id" in state.array; updated property "fetched" and "details"
        return state;
    /*update(state, {
      array: {
        $set: payload
      }
    });*/
    
    }
  
};


const videoReducer = new Reducer(defaultState, reducers);
console.log(new Reducer());

export default videoReducer;
