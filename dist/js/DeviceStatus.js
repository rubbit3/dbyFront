$(function () {
    platformname();
    DeviceBasicInformation()
    DeviceRuntimeInformation()
});
var url = window.location.href;
var obj = {};
str = url.split("?")[1].split("&");
for (let i = 0; i < str.length; i++) {
    let a = str[i].split('=');
    obj[a[0]] = a[1];
}
var token = $.cookie('token');
var building = obj.building;
var type = obj.type
var username = obj.name;

$(document).ready(function () {
    // 为每个Tab链接添加点击事件监听器  
    $('#nav-tab a').on('click', function (e) {
        e.preventDefault();

        $('#nav-tab a').removeClass('active');
        $('.tab-pane').removeClass('show active');

        var target = $(this).attr('href');


        $(this).addClass('active');
        $(target).addClass('show active');

        if ($(target).find('table').length > 0) {
            var tableId = $(target).find('table').attr('id');
        }
    });

    // $('#DeviceBasicInformationTable').bootstrapTable({  
    //     columns: [{  
    //         field: 'name',  
    //         title: '设备名'  
    //     }, {  
    //         field: 'status',  
    //         title: '状态'  
    //     }, {  
    //         field: 'latitude',  
    //         title: '经度'  
    //     }, {
    //         field: 'longitude',
    //         title: '纬度'
    //     },{
    //         field: 'location',
    //         title:'位置信息'
    //     }],  
    //     data: [{   
    //         name: '设备A',  
    //         status: '在线',
    //         latitude: '120.0',
    //         longitude: '30.0',
    //         location:'浙江省杭州市'
    //     }, {   
    //         name: '设备B',  
    //         status: '离线',
    //         latitude: '120.0',
    //         longitude: '30.0',
    //         location:'浙江省杭州市'
    //     }]  
    // });

    // $('#DeviceRuntimeInformationTable').bootstrapTable({  
    //     columns: [{  
    //         field: 'name',  
    //         title: '设备名'  
    //     }, {  
    //         field: '4G',  
    //         title: '4G信号强度'  
    //     }, {  
    //         field: 'battery',  
    //         title: '电量'  
    //     }, {  
    //         field: 'samplerate',  
    //         title: '采集间隔(秒)'  
    //     },{
    //         field: 'sleep',
    //         title:'是否休眠'
    //     }
    // ],  
    // data:
    // [{
    //     name: '设备A',
    //     '4G': '80%',
    //     battery: '100%',
    //     samplerate: '5',
    //     sleep: '否'
    // },{
    //     name: '设备B',
    //     '4G': '80%',
    //     battery: '100%',
    //     samplerate: '5',
    //     sleep: '否'
    // }]
    // }); 
});

// function DeviceBasicInformation() {
//     $('#DeviceBasicInformationTable').bootstrapTable({
//         ajax: function (request) {
//             $.ajax({
//                 type: "GET",
//                 url: wz[8] + "?ID_project=" + building,
//                 contentType: "application/json;charset=utf-8",
//                 dataType: "json",
//                 async: true,
//                 jsonp: 'callback',
//                 success: function (msg) {
//                     request.success({
//                         row: msg["data"]
//                     });
//                     console.log(msg["data"]);
//                     $('#DeviceBasicInformationTable').bootstrapTable('load', msg["data"]);
//                 },
//                 error: function (res) {
//                     console.log(res);
//                 }
//             });
//         },

//         ajax: function (request) {
//             $.ajax({
//                 type: "GET",
//                 url: wz[48] + "?ID_project=" + building,
//                 contentType: "application/json;charset=utf-8",
//                 dataType: "json",
//                 async: true,
//                 jsonp: 'callback',
//                 success: function (msg) {
//                     request.success({
//                         row: msg["data"]
//                     });
//                     console.log(msg["data"]);
//                     $('#DeviceBasicInformationTable').bootstrapTable('load', msg["data"]);
//                 },
//                 error: function (res) {
//                     console.log(res);
//                 }
//             });
//         },


//         showloading: false,
//         pagination: true,//是否分页
//         sidePagination: 'client',//server:服务器端分页|client：前端分页
//         pageSize: 10,//单页记录数
//         pageList: [10],
//         columns: [{
//             field: 'No_dev',
//             title: '设备编号',
//         },
//         {
//             field: 'jihao',
//             title: '机号',
//         },
//         {
//             field: 'isOnline',
//             title: '是否在线',
//             formatter: function (value, row, index) {  
//                 var color = value === '1' ? 'green' : 'red';  
//                 return '<span style="color: ' + color + '">' + (value === '1' ? '在线' : '离线') + '</span>';  
//             }  
//         },
//         {
//             field: 'longitude',
//             title: '经度',
//         },
//         {
//             field: 'latitude',
//             title: '纬度',
//         },
//         // {
//         //     field: 'status',
//         //     title: '状态',
//         // },
//         // {
//         //     field: 'location_info',
//         //     title: '位置信息',
//         // }
//         {
//             field: 'isOnline',
//             title: '运行率',
//         },
//         ]
//     });
// }


function DeviceBasicInformation() {
    var deviceData = []; // 用于存储设备基本信息
    var runpData = {}; // 用于存储运行率信息

    // 请求设备基本信息
    $.ajax({
        type: "GET",
        url: wz[8] + "?ID_project=" + building,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: true,
        jsonp: 'callback',
        success: function (msg) {
            deviceData = msg["data"];
            // 设备基本信息加载完成后，尝试合并数据
            mergeDataAndLoadTable();
        },
        error: function (res) {
            console.log(res);
        }
    });

    // 请求运行率信息
    $.ajax({
        type: "GET",
        url: wz[48] + "?ID_project=" + building,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: true,
        jsonp: 'callback',
        success: function (msg) {
            // 将运行率信息存储在一个字典中，方便后续匹配
            msg["data"].forEach(function (item) {
                runpData[item.channelname] = item.runp;
            });
            // 运行率信息加载完成后，尝试合并数据
            mergeDataAndLoadTable();
        },
        error: function (res) {
            console.log(res);
        }
    });

    // 合并设备基本信息和运行率信息，并加载表格
    function mergeDataAndLoadTable() {
        if (deviceData.length === 0 || Object.keys(runpData).length === 0) {
            // 如果数据未完全加载，则不进行合并
            return;
        }

        // 将运行率信息添加到设备基本信息中
        deviceData.forEach(function (item) {
            item.runp = runpData[item.jihao] || 'N/A'; // 将运行率添加到设备信息中
        });

        // 初始化 Bootstrap Table
        $('#DeviceBasicInformationTable').bootstrapTable({
            data: deviceData,
            showloading: false,
            pagination: true, // 是否分页
            sidePagination: 'client', // server:服务器端分页 | client：前端分页
            pageSize: 10, // 单页记录数
            pageList: [10],
            columns: [{
                field: 'No_dev_discern',
                title: '设备具体位置',
            },
            {
                field: 'type',
                title: '设备类型',
            },
            {
                field: 'isOnline',
                title: '是否在线',
                formatter: function (value, row, index) {
                    var color = value === '1' ? 'green' : 'red';
                    return '<span style="color: ' + color + '">' + (value === '1' ? '在线' : '离线') + '</span>';
                }
            },
            {
                field: 'longitude',
                title: '经度',
            },
            {
                field: 'latitude',
                title: '纬度',
            },
            {
                field: 'runp',
                title: '运行率',
                // formatter: function (value) {
                //     // 转换为百分比并保留两位小数
                //     if (typeof value === 'number') {
                //         return (value * 100).toFixed(2) + '%';
                //     }
                //     return 'N/A'; // 对于无效数据返回 N/A
                // }
                formatter: function (value) {
                    // 转换为百分比并保留两位小数
                    if (typeof value === 'number') {
                        var percentage = (value * 100).toFixed(2) + '%';
                        if (value > 0.95) {
                            return '<span style="color: green;">' + percentage + '</span>';
                        }
                        return percentage;
                    }
                    return 'N/A'; // 对于无效数据返回 N/A
                }
            }
        
        ]
        });
    }
}


function DeviceRuntimeInformation() {
    $('#DeviceRuntimeInformationTable').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[8] + "?ID_project=" + building,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                async: true,
                jsonp: 'callback',
                success: function (msg) {
                    request.success({
                        row: msg["data"]
                    });
                    console.log(msg["data"]);
                    $('#DeviceRuntimeInformationTable').bootstrapTable('load', msg["data"]);
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
            {
                field: 'jihao',
                title: '机号',
            },
            // {
            //     field: '4G',
            //     title: '4G信号强度',
            //     formatter: function (value, row, index) {   
            //         return  "%";
            //     }
            // }, 
            {
                field: 'battery',
                title: '电量',
                formatter: function (value, row, index) {   
                    return  "100%";
                }
            }, 
             {
                field: 'sleep',
                title: '是否休眠',
                formatter: function (value, row, index) {   
                    return  "否";
                }
            }
        ]
    });
}
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
