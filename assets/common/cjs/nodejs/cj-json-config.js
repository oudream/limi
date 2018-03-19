/**
 * Created by liuchaoyu on 2017-03-08.
 */
"use strict";


const path = require('path');
const fs = require('fs');

function loadConfigFile (filePath) {

    if (!filePath) {
        return -1;
    }

    if (!fs.existsSync(filePath)) {
        return -2;
    }

    if (filePath.indexOf('.json') == -1) {
        return -3;
    }

    return JSON.parse(fs.readFileSync(filePath));
}

function saveConfigFile (filePath, config) {

    if (!filePath || !config) {
        return -1;
    }

    return fs.writeFileSync(filePath, JSON.stringify(config,null,2));

}


module.exports = {
    load : loadConfigFile,
    save : saveConfigFile,
};