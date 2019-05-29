import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import {Provider} from "react-redux";
import {ConnectedRouter} from "react-router-redux";
import {createBrowserHistory, } from "history";

import Store from "./store/Store";
//import * as authStore from "./store/authStore";
//import dispatchEvents from "./store/dispatchEvents";

const app = document.getElementById('root');
const history = createBrowserHistory();
const storage = Store(history);

/*
if (location.hash.length > 0 && location.hash.substring(0, 2) === '#!') {
    history.replace(location.hash.substring(2));
}
*/

/*Warning: render(): Calling ReactDOM.render() to hydrate server-rendered markup
will stop working in React v17. Replace the ReactDOM.render() call with
ReactDOM.hydrate() if you want React to attach to the server HTML.

var renderMethod = module.hot
    ? ReactDOM.render
    : ReactDOM.hydrate
*/


var renderMethod = ReactDOM.render;

renderMethod(
    <Provider store={storage}>
        <ConnectedRouter history={history}>
            <App {...window.__APP_INITIAL_STATE__}/>
        </ConnectedRouter>
    </Provider>
    , app
);