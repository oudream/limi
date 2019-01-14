function timer() {
    let time = {};
    setInterval(function() {
        time['local'] = new Date().toLocaleTimeString();
        time['utc'] = new Date();
        postMessage(time);
    }, 1000);
}

timer();
