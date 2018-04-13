(function() {
    // we want this at global scope so outside callers can find it. In a more realistic implementation we
    // should probably put it in a namespace.
    window.getCoverageByLine = function(silent) {
        let key = null;
        let lines = null;
        let source = null;
        // look for code coverage data
        if (typeof window._$jscoverage === 'object') {
            for (key in _$jscoverage) {}
            lines = _$jscoverage[key];
        }

        if (!lines && !silent) {
            console.log('code coverage data is NOT available');
        }

        return {'key': key, 'lines': lines};
    };

    QUnit.done = function(t) {
        let cvgInfo = getCoverageByLine(true);
        if (!!cvgInfo.key) {
            let testableLines = 0;
            let testedLines = 0;
            let untestableLines = 0;
            for (lineIdx in cvgInfo.lines) {
                let cvg = cvgInfo.lines[lineIdx];
                if (typeof cvg === 'number') {
                    testableLines += 1;
                    if (cvg > 0) {
                        testedLines += 1;
                    }
                } else {
                    untestableLines += 1;
                }
            }
            let coverage = '' + Math.floor(100 * testedLines / testableLines) + '%';

            let result = document.getElementById('qunit-testresult');
            if (result != null) {
                result.innerHTML = result.innerHTML + ' ' + coverage + ' test coverage of ' + cvgInfo.key;
            } else {
                console.log('can\'t find test-result element to update');
            }
        }
    };
}());
