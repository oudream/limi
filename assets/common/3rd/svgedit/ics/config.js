/**
 * Created by liuchaoyu on 2016-11-10.
 */


svgCommon = {
    // common namepaces constants in alpha order
    NS: {
        HTML: 'http://www.w3.org/1999/xhtml',
        MATH: 'http://www.w3.org/1998/Math/MathML',
        SE: 'http://svg-edit.googlecode.com',
        SVG: 'http://www.w3.org/2000/svg',
        XLINK: 'http://www.w3.org/1999/xlink',
        XML: 'http://www.w3.org/XML/1998/namespace',
        XMLNS: 'http://www.w3.org/2000/xmlns/' // see http://www.w3.org/TR/REC-xml-names/#xmlReserved
    }
};

var extendConfig = {

    'config_prefix' : 'ics-svg-edit-',
    'project_table_db' : 't_svg_editor_project',
    'page_table_db' : 't_svg_editor_page',

    'temp_svg_path' : './temp/svg/',

    'image_path' : 'image/',

    'propertyOptions' : {}
};

extendConfig.defaultConfig = {
    'page_width' : 1280,
    'page_height' : 720,
};


extendConfig.sql = {
    'projs_down' : "select * from t_svg_editor_project where F_AVAIL = 1",
    'pages_down' : "select * from t_svg_editor_page where F_AVAIL = 1 and F_PID = '%1'",
    'insert_proj' : "insert into t_svg_editor_project (F_ID,F_PID,F_NAME,F_AVAIL,F_UPDATE_TIME,F_RES0,F_RES1) values('%1','%2','%3',%4,%5,%6,'%7')",
    'insert_page' : "insert into t_svg_editor_page (F_ID,F_PID,F_NAME,F_SVG_TEXT,F_SVG_PATH,F_AVAIL,F_UPDATE_TIME,F_RES0,F_RES1) values('%1','%2','%3','%4','%5',%6,%7,%8,'%9')",
    'update_page' : "update t_svg_editor_page set F_PID = '%1',F_NAME = '%2',F_SVG_TEXT = '%3',F_SVG_PATH = '%4',F_PROPERTY_LIST = '%5',F_PROPERTY_PATH = '%6',F_UPDATE_TIME = '%7' where F_ID = '%8'",
    'delete_proj' : "delete from t_svg_editor_project where F_ID = '%1'",
    'delete_page' : "delete from t_svg_editor_page where F_ID = '%1'"
};


extendConfig.propertyOptions.module = [
    {
        propertyName: {
            name: 'id',
            title: '元素ID',
        },
        propertyValue:{
            type:'text',
            value:'',
            editable:false,
            subOptions:{

            }
        },
        group:{
            title:'基本属性',
            deletable:false,
        },
    },
    {
        propertyName: {
            name: 'name',
            title: '设备名',
        },
        propertyValue:{
            type:'text',
            value:'',
            editable:true,
            subOptions:{

            }
        },
        group:{
            title:'基本属性',
            deletable:false,
        },
    },
    {
        propertyName: {
            name: '',
            title: '是否显示',
        },
        propertyValue:{
            type:'checkbox',
            value:'true',
            editable:true,
            subOptions:{
                check:{
                    "on":true,
                    "off":false
                }
            }
        },
        group:{
            title:'附加属性',
            deletable:true,
        },
    },
];

/**
{
    propertyName:'',
    propertyValue:{
        type:'text',       // text,validatebox,combobox,checkbox
        value:'xxxx',
        editable:true,
        subOptions:{
            validType:"",   // 针对type = validatebox
            data:[
                {
                    text:'颜色改变',
                    fontColor:#000000,
                    bgColor:#FFFFFF
                },
                {
                    text:'大小改变',
                    fontColor:#000000,
                    bgColor:#FFFFFF
                }
                ],        // 针对type = combobox
            check:{         // 针对type = checkbox
                "on":true,
                "off":false
                }
            }
        },
    group:'界面响应',

}
*/
extendConfig.propertyOptions.elem = [
    {
        propertyName: {
            name: 'id',
            title: '元素ID',
        },
        propertyValue:{
            type:'text',
            value:'',
            editable:false,
            subOptions:{

            }
        },
        group:{
            title:'基本属性',
            deletable:false,
        },
    },
    {
        propertyName: {
            name: 'type',
            title: '元素类型',
        },
        propertyValue:{
            type:'combobox',
            value:'遥信',
            editable:true,
            subOptions:{
                data:[
                    {text:'遥信'},
                    {text:'遥测'},
                    {text:'遥文'}
                ]
            }
        },
        group:{
            title:'基本属性',
            deletable:false,
        },
    },
    {
        propertyName: {
            name: 'name',
            title: '元素名',
        },
        propertyValue:{
            type:'text',
            value:'',
            editable:true,
            subOptions:{

            }
        },
        group:{
            title:'基本属性',
            deletable:false,
        },
    },
    {
        propertyName: {
            name: 'mid',
            title: 'MeasureID',
        },
        propertyValue:{
            type:'text',
            value:'',
            editable:true,
            subOptions:{

            }
        },
        group:{
            title:'基本属性',
            deletable:false,
        },
    },
    {
        propertyName: {
            name: '',
            title: '是否显示',
        },
        propertyValue:{
            type:'checkbox',
            value:'true',
            editable:true,
            subOptions:{
                check:{
                    "on":true,
                    "off":false
                }
            }
        },
        group:{
            title:'附加属性',
            deletable:true,
        },
    },

];



