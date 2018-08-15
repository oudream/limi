function timer() {
    let time;
    setInterval(function() {
        time = new Date().toLocaleTimeString();
        postMessage(time);
    }, 1000);
}

timer();
