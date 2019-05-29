import dispatchEvents from "../dispatchEvents";
import api from "../api";
import * as action from "./action";

export function getList() {
    return function (dispatch) {
        dispatch({type: dispatchEvents.videos.getList.pending});

        return action.fetch(api.VideoList.getList())
            .then((data) => {
                dispatch({type: dispatchEvents.videos.getList.fulfilled, payload: data});
            })
            .catch((error) => {
                dispatch({type: dispatchEvents.videos.getList.reject, payload: error});
            });
    };
}