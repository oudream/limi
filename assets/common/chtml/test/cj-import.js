/**
 * Created by liuchaoyu on 2017-03-15.
 */

function cjImport(file, params, parent) {
    let elem = null;
    if (file.indexOf('.js') != -1) {
        elem = document.createElement('script');
        elem.setAttribute('type', 'text/javascript');
        elem.setAttribute('src', file);
        elem.setAttribute('charset', 'utf-8');

        if (params) {
            for (let t in params) {
                elem.setAttribute(t, params[t]);
            }
        }

        if (parent) {
            parent.appendChild(elem);
        } else {
            document.head.appendChild(elem);
        }
        elem = null;
        // document.write('<script type=\\"text/javascript\\" src=\\"' + file + '\\"></script>');
    } else {

        // document.write('<style type=\\"text/css\\">@import \\"' + file + '\\" ;</style>');
    }
};
