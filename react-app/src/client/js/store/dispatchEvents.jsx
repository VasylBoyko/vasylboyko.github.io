export default {
    preLoader : {
        start: "PRE_LOADER_START",
        end: "PRE_LOADER_END"
    },
    auth : {
        login: {
            pending: "AUTH_LOGIN_PENDING",
            fulfilled: "AUTH_LOGIN_FULFILLED",
            reject: "AUTH_LOGIN_REJECT"
        },
        logout: {
            pending: "AUTH_LOGOUT_PENDING",
            fulfilled: "AUTH_LOGOUT_FULFILLED",
            reject: "AUTH_LOGOUT_REJECT"
        }
    },
    videos : {
        getList: {
            pending: "GET_LIST_PENDING",
            fulfilled: "GET_LIST_FULFILLED",
            reject: "GET_LIST_REJECT"
        },
        getVideoDetails: {
            pending: "GET_VIDEO_DETAILS_PENDING",
            fulfilled: "GET_VIDEO_DETAILS_FULFILLED",
            reject: "GET_VIDEO_DETAILS_REJECT"
        }
    }
};