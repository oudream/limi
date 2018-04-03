/**
 * Created by liuchaoyu on 2016-10-27.
 *
 * new-element.js
 *
 * 针对新建的页面
 */

var newElement = {};

newElement.init = function () {
    var labelForInput = document.getElementById('input_label');
    //var typeSelect = document.getElementById('type_select');
    var nameInput = document.getElementById('name_input');
    var namePromptBar = document.getElementById('name_prompt_bar');
    //var parentSelectOption = document.getElementById('parent_select_option');
    //var projSelect = document.getElementById('parent_select');
    var okBtn = window.parent.document.getElementById('button_ok');


    //var curIndex = typeSelect.selectedIndex;
    //var curText = typeSelect.options[curIndex].text;
    //var curValue = typeSelect.options[curIndex].value;

    //labelForInput.textContent = curText + "名：";
    //labelForInput.value = curValue;

    var curProj = window.parent.dataInteraction.getCurProjectId();
    var pages = window.parent.dataInteraction.local.getPages(curProj);

    //for (var i = 0; i < projs.length; i++) {
    //    var option = document.createElement('option');
    //
    //    option.value = projs[i].id;
    //    option.textContent = projs[i].name;
    //    option.className = 'project_select_option';

        //projSelect.appendChild(option);
    //}

    //if (curValue == "page") {
        //parentSelectOption.style.display = "table-row";
    //}

    nameInput.value = "";

    nameInput.oninput = function (evt) {

        var name = nameInput.value;
        if (name == "") {
            namePromptBar.textContent = "";
            okBtn.disabled = 'disabled';
        }
        else {
            if (dataProcess.hasRepeatName(name,pages) == false) {
                namePromptBar.textContent = "可使用";
                namePromptBar.style.color = 'green';
                okBtn.disabled = false;
            }
            else {
                namePromptBar.textContent = "该名字已存在";
                namePromptBar.style.color = 'red';
                okBtn.disabled = 'disabled';
            }
        }

    };

    //typeSelect.onchange = function () {
    //    curIndex = typeSelect.selectedIndex;
    //    curText = typeSelect.options[curIndex].text;
    //    curValue = typeSelect.options[curIndex].value;
    //
    //    labelForInput.textContent = curText + "名：";
    //    labelForInput.value = curValue;

        //if (curValue == "page") {
        //    parentSelectOption.style.display = "table-row";
        //}
        //else{
        //    parentSelectOption.style.display = "none";
        //}

    //}

};

window.onload = newElement.init;