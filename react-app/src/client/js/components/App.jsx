import React, {Component} from 'react';
import {Route,
    /*IndexRoute,*/
    Switch
    //Router
} from "react-router-dom";
import Home from "./Home";
import Help from "./Help";
import AboutUs from "./AboutUs";
import Navigation from "./Navigation";

//import PropTypes from 'prop-types';

if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

export default class App extends Component {
    render() {
    //    const { isMobile } = this.props; /<h1>Player {isMobile ? 'mobile' :
    // 'desktop'}</h1>
    //
        return (
            <div>
                <Navigation></Navigation>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/help" component={Help}/>
                    <Route exact path="/about_us" component={AboutUs}/>
                </Switch>
            </div>
        );
    }
}
/*
App.propTypes = {
  isMobile: PropTypes.bool.isRequired
};*/