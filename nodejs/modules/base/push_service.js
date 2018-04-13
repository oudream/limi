/**
 * Created by liuchaoyu on 2017-05-09.
 */

const WebSocketServer = require('ws').Server;
const log = require('./../../common/log.js');
const utils = require('./../../common/utils.js').utils;

let socketList = {};

/** 全局事件对象 */
let event = global.globalEvent;

function init() {
    pushListener();
    socketListener();
}

/**
 * 终端socket监听器
 */
function socketListener() {
    const ws = new WebSocketServer({port: 9999});

    ws.on('connection', function connection(socket) {
    // const location = url.parse(socket.upgradeReq.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    // socket.on('open', function open() {
    //     console.log('socket open: %s', socket);
    //
    // });

    /** 接收终端上送的消息，目前接收“告警确认”，“取消告警确认” */
        socket.on('message', function incoming(msg) {
            let remoteIp = utils.net.getRemoteIpAddress(socket);
            console.log('received: %s', msg);
            let msgObj = JSON.parse(msg);
            let channel = msgObj.channel;
      /** 根据channel把消息转到对应的服务处理 */
            event.emit(channel, msg);
            cjs.log('接收到来自' + remoteIp + '终端的消息 : ' + msg);
      // log.writeLog('接收到来自' + remoteIp + '终端的消息 : ' + msg);
        });

        socket.on('close', function close() {
            let remoteIp = utils.net.getRemoteIpAddress(socket);
            let socketId = socket.socketId;
            console.log('socket close: %s', socketId);
            socketList[socketId] = undefined;
            delete socketList[socketId];
            cjs.log(remoteIp + '终端已断开连接');
      // log.writeLog(remoteIp + '终端已断开连接');
        });

        socket.on('error', function error(err) {
            console.log('socket error: %s', err);
            cjs.log(JSON.stringify(err));
            cjs.log(JSON.stringify(err.stack));
      // log.writeSysLog(err);
      // log.writeSysLog(err.stack);
      // TODO: 处理错误
        });

        let remoteIp = utils.net.getRemoteIpAddress(socket);
        let date = new Date();
        let curUtc = date.getTime();
        let socketId = remoteIp + '_' + curUtc.toString();
        let _index = 0;
        while (socketList[socketId]) {
            socketId = remoteIp + '_' + curUtc.toString() + '_' + _index.toString();
            _index++;
        }

        console.log('new socket : %s', socketId);
        socket['socketId'] = socketId;
        socketList[socketId] = socket;

        let msg = {
            err: null,
            data: 'connect_success',
            socketId: socketId,
        };

        cjs.log('来自' + remoteIp + '终端的接入');
    // log.writeLog('来自' + remoteIp + '终端的接入');

    /** 回复终端 */
        socket.send(JSON.stringify(msg));
    });
}

/**
 * 推送消息监听器
 * desc：接收各个服务的消息，再把消息推送到各个终端上。
 */
function pushListener() {
    event.on('push-message', function(msg) {
        console.log(msg);

        let msgObj = JSON.parse(msg);

        for (let socketId in socketList) {
            msgObj['socketId'] = socketId;

            let socket = socketList[socketId];
            if (socket) {
                socket.send(JSON.stringify(msgObj));
            }
        }
    });
}

init();
