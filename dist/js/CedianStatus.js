$(function () {
    InitChannelTable();
    platformname();
})

var url = window.location.href;
var obj = {};
str = url.split("?")[1].split("&");
for (let i = 0; i < str.length; i++) {
    let a = str[i].split('=');
    obj[a[0]] = a[1];
}
var token = $.cookie('token');
var building = obj.building;
var type = obj.type;
var username = obj.name;
var projectID = obj.building;

//获取平台名称
function platformname() {
    var platname = "";
    $.ajax({
        type: "GET",
        url: wz[19],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: '',
        jsonp: 'callback',
        success: function (msg) {
            console.log(msg.name)
            platname = msg.name;
            document.getElementById("platername").innerHTML = platname;
        },
        error: function () {
            alert("错误");
        }
    });
}


// 初始化通道表格
function InitChannelTable() {
    $('#MonitorTable').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[14] + "?ID_project=" + building,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                async: true,
                jsonp: 'callback',
                success: function (msg) {
                    console.log(msg.data)
                    request.success({
                        row: msg["data"].data
                    });
                    $('#MonitorTable').bootstrapTable('load', msg["data"]);
                },
                error: function (res) {
                    console.log(res);
                }
            });
        },
        showloading: false,
        pagination: true,//是否分页
        sidePagination: 'client',//server:服务器端分页|client：前端分页
        pageSize: 10,//单页记录数
        pageList: [10],
        columns: [
        //     {
        //     field: 'Channel',
        //     title: '通道ID',
        // },

        {
            field: 'channel_name',
            title: '通道名字',
        },
        // {
        //     field:'cedian',
        //     title:'测点'
        // },
        
        {
            field: 'SampleRate',
            title: '采样率',
        },
        // {
        //     field: 'Type',
        //     title: '通道类型',
        // },
        
        {
            field: 'Dir',
            title: '方向',
        },

        // {
        //     field: 'MAC',
        //     title: 'MAC地址',
        // },
        // {
        //     field: 'name', // 假设这是通道编号的新字段名  
        //     title: '通道编号',
        // },
        // {
        //     field: 'status', // 假设这是通道状态的新字段名，以避免与设备状态混淆  
        //     title: '通道状态',
        // },
        {
            field: 'Unit',
            title: '单位'
        },

        {
            field:'miaoshu_info',
            title:'描述信息'
        },

        {
            field:'cedian_status',
            title:'测点状态',
            formatter: function (value, row, index) {
                if(value === '正常'){
                    return '<span style="color:green">正常</span>';  
                }
            }
        },        
        {
            field:'cedian_desc',
            title:'测点描述'
        }
        ],
    });
}
