import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
//import {Router, Route, IndexRout, hashHistory} from "react-router"

/*Warning: render(): Calling ReactDOM.render() to hydrate server-rendered markup 
will stop working in React v17. Replace the ReactDOM.render() call with 
ReactDOM.hydrate() if you want React to attach to the server HTML.
*/

const app =  document.getElementById('root'); 
var renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate

renderMethod(<App {...window.__APP_INITIAL_STATE__} />, app);
/*
renderMethod(, 
    <Router>
        <Route path = "/"> component={App}
            <IndexRout component={p1} />
            <Route component={p2}>
            <Route component={p3}>
    </Router>
app);
*/