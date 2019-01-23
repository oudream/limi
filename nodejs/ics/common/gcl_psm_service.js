'use strict';

const ProtocolPsm = require('./../../common/csm/protocol_psm.js');
const PsmProtocol = ProtocolPsm;
const PsmDefine = ProtocolPsm.PsmDefine;
const PsmRealtimeDataStruct = ProtocolPsm.PsmRealtimeDataStruct;

let _psmProtocol = new PsmProtocol();

exports = module.exports = GclPsmService;

function GclPsmService() {
}

GclPsmService.init = function(httpServer) {
    httpServer.route.all(/\/(.){0,}\.rtdata\.cgi/, Cc4kRtService.dealRequestRtdata);
    httpServer.route.all(/\/(.){0,}\.rtdata\.cgi/, GclPsmService.dealRequest);
};

GclPsmService.dealRequest = function(req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', function(chunk) {
            body += chunk;
        });
        req.on('end', function() {
            // CjLog.log('rtdata.cgi:',JSON.stringify(body));
            let reqSession = null;
            let reqStructtype = null;
            let reqMeasures = null;
            if (body) {
                try {
                    let reqBody = JSON.parse(body);
                    reqSession = reqBody.session;
                    reqStructtype = reqBody.structtype;
                    reqMeasures = reqBody.params;
                } catch (e) {
                    r = null;
                    console.log('error: JSON.parse(body)');
                }
            }
            if (reqSession && reqStructtype && reqMeasures) {
                let resMeasures = {
                    session: reqSession,
                    structtype: reqStructtype,
                    data: function() {
                        let data = [];
                        for (let i = 0; i < reqMeasures.length; i++) {
                            let reqMeasure = reqMeasures[i];
                            let neno = reqMeasure.neno;
                            let code = reqMeasure.code;
                            let resMeasure = rtdb.findMeasureByNenoCode(neno, code);
                            if (resMeasure) {
                                data.push(resMeasure);
                            }
                        }
                        return data;
                    }(),
                };
                res.writeHead(200);
                // res.write('HELLO');
                res.end(JSON.stringify(resMeasures));
            } else {
                res.writeHead(404);
                res.end();
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
};


// ### psm protocol
// all in
_psmProtocol.onReceivedMessage = function(sCommand, sParam, attach) {
    console.log(sCommand, sParam);
};

_psmProtocol.start({
    LocalIpAddress: '127.0.0.1',
    LocalPort: 9105,
    RemoteIpAddress: '127.0.0.1',
    RemotePort: 9005,
    FileSavePath: 'd:/temp',
});