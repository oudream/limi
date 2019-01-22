'use strict';

const CjDbBase = require('./../../common/cjs/cjdb_base.js');
const CjDbMysql = require('./../../common/cjs/cjdb_mysql.js');

exports = module.exports = Cc4kDbService;

function Cc4kDbService() {
}

Cc4kDbService.init = function(httpServer) {
    httpServer.route.all(/\/(.){0,}\.rtdata\.cgi/, Cc4kDbService.dealRequest);
};

Cc4kDbService.dealRequest = function(req, res) {
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

