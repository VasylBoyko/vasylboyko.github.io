import Config from "Config";
const baseUrl = Config.apiUrl;

export default {
    VideoList: {
        getList: function() {
            return {
                url: baseUrl + "getVideosList",
                method: "GET"
            };
        }
    }
};