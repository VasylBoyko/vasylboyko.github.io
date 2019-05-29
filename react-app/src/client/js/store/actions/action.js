import * as axios from "axios";
//import dispatchEvents from "../dispatchEvents";

export function fetch(options) {
    //TODO chech there some auth stuff
    return axios.default(options);
}