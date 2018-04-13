/**
 * Created by liuchaoyu on 2017-03-15.
 */
'use strict';

let electron = null;
let ipc = null;
let remote = null;
if (window.nodeRequire) {
    electron = nodeRequire('electron');
    ipc = electron.ipcRenderer;
    remote = electron.remote;
}
