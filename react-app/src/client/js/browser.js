import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';


/*Warning: render(): Calling ReactDOM.render() to hydrate server-rendered markup 
will stop working in React v17. Replace the ReactDOM.render() call with 
ReactDOM.hydrate() if you want React to attach to the server HTML.
*/

var renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate
renderMethod(<App {...window.__APP_INITIAL_STATE__} />
, document.getElementById('root'));
