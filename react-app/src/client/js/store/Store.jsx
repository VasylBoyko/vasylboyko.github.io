import {createStore, combineReducers, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {routerReducer, routerMiddleware} from "react-router-redux";

import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import {createLogger} from "redux-logger";
import dispatchEvents from "./dispatchEvents";

import videoReducer from "./reducers/videos";

const initialState = () => {
    return {
        videos: videoReducer.initState()
    };
};

const appReducer = combineReducers({
    router: routerReducer,
    videos: videoReducer.reducer()
});

const rootReducer = (state, action) => {
    if (action.type === dispatchEvents.auth.logout.fulfilled) {
        return appReducer(initialState(), action);
    }

    return appReducer(state, action);
};

export default function (history) {
    const middlewares = composeWithDevTools(
        applyMiddleware(
            routerMiddleware(history), promise(), thunk, createLogger()
        )
    );
  
    return createStore(rootReducer, initialState(), middlewares);
}
