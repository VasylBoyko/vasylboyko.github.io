const esLintRcJSON = require(`./.eslintrc.json`);


module.exports = (function (esLintRcJSON) {
    esLintRcJSON.settings = {
        "import/resolver": {
            "webpack": {
                "config": 'webpack.config.js'
            }
        }
    }
    return esLintRcJSON;
})(esLintRcJSON);
