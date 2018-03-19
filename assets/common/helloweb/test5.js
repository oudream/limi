
var fs = require("fs");

var test1 = function() {
    var sFilePath = "z:/000.txt";
    fs.open(sFilePath, 'a+', function(err, fd) {
        if (err) return;
        var iPosition = 0;
        for (var i = 0; i < 1000 * 10; i++) {
            var data = new Buffer([i % 0xFF]);
            fs.writeSync(fd,data,0,1,iPosition);
            iPosition++;
        }
        fs.close(fd, function(err) {
            if (err) return;
        });
    });
};
test1();


    https://10.31.16.253/svn/ygct_ics_cc4000/trunk
    https://10.31.16.253/svn/ygct_ics_cpp/trunk
    https://10.31.16.253/svn/ygct_ics_cpp/trunk
    https://10.31.16.253/svn/ygct_ics_csharp/trunk
    https://10.31.16.253/svn/ygct_ics_doc/trunk
    https://10.31.16.253/svn/ygct_ics_qt/trunk
    https://10.31.16.253/svn/ygct_ics_research/trunk
    https://10.31.16.253/svn/ygct_ics_w3/trunk
    https://10.31.16.253/svn/ygct_ics_web/trunk
    https://10.31.16.253/svn/ygct_ics_misc/trunk