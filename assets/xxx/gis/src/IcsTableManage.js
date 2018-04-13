/**
 * Created by ygct on 2016/1/11.
 */


SVG.svgjs = 'http://svgjs.com/svgjs';
let icsTable = {
    version: '1.0.0',
    d3: 'http://d3js.org/d3.v3.min.js',
    width: 900,
    height: 600,

};

icsTable.draw = function(svgElementId) {
    let svg = icsTable.d3.selectAll('[id='+svgElementId+']'); ;
    icsTable.height = svg.height;
    icsTable.width = svg.width;
};
