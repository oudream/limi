/**
 * Created by oudream on 2017/7/3.
 */

// svg-editor.js at line 4972
var open = $('<input type="file">').change(function() {
  var f = this;
  editor.openPrep(function(ok) {
    if (!ok) {return;}
    svgCanvas.clear();
    if (f.files.length === 1) {
      $.process_cancel(uiStrings.notification.loadingImage);
      var reader = new FileReader();
      reader.onloadend = function(e) {
        loadSvgString(e.target.result);
        updateCanvas();
      };
      reader.readAsText(f.files[0]);
    }
  });
});
$('#tool_open').show().prepend(open);

