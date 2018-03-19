const url = require('url')

const utils = require('./../../common/utils.js').utils
const ShareCache = require('./../../common/share-cache.js').ShareCache

let sessionList = []

function init () {
  /**
   * 获取初始化数据的路由响应
   */
  global.httpServer.route.all(/\/(.){0,}\.test/, function (req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/json',
      'Access-Control-Allow-Origin': '*' /* ,'Content-Length' : dataLength */
    })
    res.write('test', 'utf-8')
    res.end()
  })

  global.httpServer.route.all(/\/(.){0,}.omcinitdata/, function (req, res) {
    let paramsObj = url.parse(req.url, true).query
    let remoteIp = utils.net.getRemoteIpAddress(req)
    let sessionId = paramsObj.sessionId
    let fncode = paramsObj.fncode
    let terminalType = paramsObj.terminalType
    let date = new Date()
    let curUtc = date.getTime()
    let newSessionId = remoteIp + '_' + curUtc.toString() + '_' + '0'
    if ((!sessionId) || (sessionId === '')) {
      let _index = 1
      while (sessionList.indexOf(newSessionId) !== -1) {
        newSessionId = remoteIp + '_' + curUtc.toString() + '_' + _index.toString()
        _index++
      }
      sessionId = newSessionId
    }

    let returnData = {
      sessionId: sessionId
    }

    let sReturnData = ''
    if (fncode.indexOf('.data.svrinfo') !== -1) {
      let serverInfo = ShareCache.get('server-config')
      let neConfig = ShareCache.get('ne-config')
      let alarmConfig = ShareCache.get('alarm-config')
      let omcConfig = ShareCache.get('omc-server-config')
      for (let t in omcConfig) {
        serverInfo[t] = omcConfig[t]
      }
      let info = {
        serverInfo: serverInfo,
        neConfig: neConfig,
        alarmConfig: alarmConfig
      }
      returnData['data'] = info
      returnData['error'] = null
    } else {
      returnData['data'] = null
      returnData['error'] = 'fncode error'
    }

    sReturnData = JSON.stringify(returnData)

    cjs.omc.log('一个' + terminalType + '终端来自' + remoteIp + ',获取初始化数据...')
    // log.writeLog('一个' + terminalType + '终端来自' + remoteIp + ',获取初始化数据...');

    res.writeHead(200, {
      'Content-Type': 'text/json',
      'Access-Control-Allow-Origin': '*' /* ,'Content-Length' : dataLength */
    })
    res.write(sReturnData, 'utf-8')
    res.end()
  })
}

init()
