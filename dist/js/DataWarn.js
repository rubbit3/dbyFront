$(function () {
    platformname();
    timerange();
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

//时间间隔选择
var Begin = "";
var End = "";
var newbegin = '';
var newend = '';
function timerange() {
    var start = moment().subtract(29, 'days');
    var end = moment();
    function cb(start, end) {
        $('#daterange4-btn span').html('开始时间：' + start.format('YYYY-MM-DD HH:mm:ss:SSS') + ' - 结束时间：' + end.format('YYYY-MM-DD HH:mm:ss:SSS'));
        Begin = start.format('YYYYMMDDHHmmss');
        End = end.format('YYYYMMDDHHmmss');
        newbegin = Math.floor(start.valueOf() / 1000);
        newend = Math.floor(end.valueOf() / 1000);
    }

    $('#daterange4-btn').daterangepicker({
        "showDropdowns": true,
        "timePicker": true,
        "timePickerSeconds": true,
        "autoApply": true,
        "timePicker24Hour": true,
        "linkedCalendars": false,
        "autoUpdateInput": true,
        "alwaysShowCalendars": true,
        "locale": {
            "format": 'YYYY-MM-DD HH:mm:ss:SSS',
            "separator": " - ",
            "applyLabel": "确定",
            "cancelLabel": "取消",
            "fromLabel": "起始时间",
            "toLabel": "结束时间'",
            "showCustomRangeLabel": true,
            "customRangeLabel": "自定义",
            "alwaysShowCalendars": true,
            "weekLabel": "W",
            "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
            "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            "firstDay": 1
        },
        ranges: {
            '今日': [moment().startOf('day'), moment()],
            '昨日': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
            '最近7日': [moment().subtract(6, 'days').startOf('day'), moment()],
            '最近30日': [moment().subtract(29, 'days').startOf('day'), moment()],
            '本月': [moment().startOf('month'), moment().endOf('month')],
            '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "minDate": "YYYY-MM-DD HH:mm:ss:SSS",
        "maxDate": "YYYY-MM-DD HH:mm:ss:SSS",
        "opens": "right"
    }, cb);
    cb(start, end);
}
// function search() {  
//     $.ajax({  
//         type: "POST",  
//         url: wz[43],  
//         contentType: "application/json; charset=utf-8",  
//         // data: JSON.stringify({  
//         //     "start_answer": newbegin,  
//         //     "end_answer": newend  
//         // }),  
//         data: JSON.stringify({}),  
//         beforeSend: function () {  
//             console.log({  
//                 "start_answer": newbegin,  
//                 "end_answer": newend  
//             });  
//         },  
//         success: function (data) {  
//             console.log(data);  
//         },  
//         error: function (xhr, status, error) {  
//             console.log("Error: " + error);  
//             console.log("Status: " + status);  
//             console.log("XHR: " + xhr.responseText);  
//         }  
//     });  
// }

// function search() {
//     $('#datawarntable').bootstrapTable('destroy');
//     $('#datawarntable').bootstrapTable({
//         ajax: function (request) {
//             $.ajax({
//                 type: "POST",
//                 url: wz[43],
//                 data: {},
//                 // data: {
//                 //     "start_answer": newbegin,
//                 //     "end_answer": newend,
//                 // },
//                 beforeSend: function () {
//                     console.log({
//                         "start_answer": newbegin,
//                         "end_answer": newend,
//                     })
//                 },
//                 // async: true,
//                 jsonp: 'callback',
//                 success: function (msg) {
//                     request.success({
//                         row: msg["data"]
//                     });
//                     console.log(msg["data"]);
//                     $('#datawarntable').bootstrapTable('load', msg["data"]);
//                 },
//                 error: function (res) {
//                     console.log(res);
//                 }
//             });
//         },
//         rowStyle: function (row, index) {
//             console.log(row.color);
//             if (row.color == "blue") {
//                 return { css: { "background-color": "#0d6efd" } };
//             } else if (row.color == "yellow") {
//                 return { css: { "background-color": "#ffc107" } };
//             } else if (row.color == "red") {
//                 return { css: { "background-color": "#dc3545" } };
//             }
//             return "";
//         },
//         pagination: true,
//         sidePagination: 'client',
//         pageSize: 10,
//         pageList: [10],
//         search: true,
//         clickToSelect: true,
//         singleSelect: true,
//         sortable: true,
//         searchAlign: 'left',
//         showExport: true,
//         toolbar: '#toolbar',
//         exportDataType: "all",
//         showExport: true,
//         Icons: 'glyphicon-export icon-share',
//         exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
//         exportOptions: {
//             ignoreColumn: [4],
//             worksheetName: 'sheet1',
//             fileName: '未处理报警日志',
//         },
//         columns: [
//             {
//                 field: 'alertTime',
//                 title: '报警时间',
//                 sortable: true
//             },
//             {
//                 field: 'answer',
//                 title: '是否解决',
//                 sortable: true,
// 				formatter: function(value, row, index) {
//                     return value === 1 ? '已处理' : '未处理';
//                 }
//             },
//             {
//                 field: 'channel_name',
//                 title: '通道',
//                 sortable: true
//             },
//             {
//                 field: 'color',
//                 title: '颜色',
//                 sortable: true
//             },
//             {
//                 field: 'level',
//                 title: '级别',
//                 sortable: true
//             },
//             {
//                 field: 'type',
//                 title: '实时数据',
//                 sortable: true
//             },
//             {
//                 field: 'status',
//                 title: '操作',
//                 formatter: operateFormatter,
//                 events: operateEvents,
//                 sortable: true
//             },
//         ]
//     });
// }


function search() {
    $('#datawarntable').bootstrapTable('destroy');
    $('#datawarntable').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "POST",
                url: wz[43],
                data: {},
                beforeSend: function () {
                    console.log({
                        "start_answer": newbegin,
                        "end_answer": newend,
                    });
                },
                jsonp: 'callback',
                success: function (msg) {
                    request.success({
                        row: msg["data"]
                    });
                    console.log(msg["data"]);
                    $('#datawarntable').bootstrapTable('load', msg["data"]);
                },
                error: function (res) {
                    console.log(res);
                }
            });
        },
        rowStyle: function (row, index) {
            console.log(row.color);
            if (row.color == "blue") {
                return { css: { "background-color": "#0d6efd" } };
            } else if (row.color == "yellow") {
                return { css: { "background-color": "#ffc107" } };
            } else if (row.color == "red") {
                return { css: { "background-color": "#dc3545" } };
            }
            return "";
        },
        pagination: true,
        sidePagination: 'client',
        pageSize: 10,
        pageList: [10],
        search: true,
        clickToSelect: true,
        singleSelect: true,
        sortable: true,
        searchAlign: 'left',
        showExport: true,
        toolbar: '#toolbar',
        exportDataType: "all",
        showExport: true,
        Icons: 'glyphicon-export icon-share',
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
        exportOptions: {
            ignoreColumn: [4],
            worksheetName: 'sheet1',
            fileName: '未处理报警日志',
        },
        columns: [
            {
                field: 'alertTime',
                title: '报警时间',
                sortable: true,
                formatter: function(value, row, index) {
                    console.log('Formatter called with timestamp:', value); // Debug log
                    var date = new Date(value * 1000); // Unix timestamp to milliseconds
                    var year = date.getFullYear();
                    var month = ('0' + (date.getMonth() + 1)).slice(-2);
                    var day = ('0' + date.getDate()).slice(-2);
                    var hours = ('0' + date.getHours()).slice(-2);
                    var minutes = ('0' + date.getMinutes()).slice(-2);
                    var seconds = ('0' + date.getSeconds()).slice(-2);
                    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
                }
            },
            {
                field: 'answer',
                title: '是否解决',
                sortable: true,
                formatter:  function(value, row, index) {
                    console.log('Formatter called with value:', value); // Debug log
                    return value === 1 ? '已处理' : '未处理';
                }
                
            },
            // {
            //     field: 'channel_name',
            //     title: '通道',
            //     sortable: true
            // },
            {
                field: 'name',
                title: '通道',
                sortable: true
            },
            {
                field: 'color',
                title: '颜色',
                sortable: true
            },
            {
                field: 'level',
                title: '级别',
                sortable: true
            },
            {
                field: 'type',
                title: '实时数据',
                sortable: true
            },
            {
                field: 'status',
                title: '操作',
                formatter: operateFormatter,
                events: operateEvents,
                sortable: true
            },
        ]
    });
}

function handleAnswer(value, row, index){
    console.log(value,answer)
    return answer == 1 ? '已处理' : '未处理';
    
}

function operateFormatter(value, row, index) {
    return [
        " <a class='operate' style='color:#212a3a' href='#'>处理告警</a>"
    ]
}

var warningID = "";
//处理报警
window.operateEvents = {
    'click .operate': function (e, value, row, index) {
        $('#HandleAlarmModal').modal("show");
        warningID = row.id;
    }
}

//处理报警
function HandleAlarm() {
    var staffname = document.getElementById("processors").value;
    var handsuggestion = document.getElementById("handsuggestion").value;
    var push = document.getElementById('push').checked ? 1 : 0;
    console.log(push)
    console.log(Math.floor(Date.now() / 1000))
    $.ajax({
        url: wz[44],
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "ID_project": projectID,
            "id": warningID,
            "answer": "1",
            "start_answer": Math.floor(Date.now() / 1000),
            "end_answer": Math.floor(Date.now() / 1000),
            "solution_P": staffname,
            "solution_desc": "已经查看数据",
            "detail": handsuggestion,
            "push": push
        }),
        beforeSend: function () {
            console.log(JSON.stringify({
                "ID_project": projectID,
                "id": warningID,
                "answer": "1",
                "start_answer": Math.floor(Date.now() / 1000),
                "end_answer": Math.floor(Date.now() / 1000),
                "solution_P": staffname,
                "solution_desc": "已经查看数据",
                "detail": handsuggestion,
                "push": push
            }))
        },
        dataType: "json",
        success: function (data) {
            console.log(data);
            $('#HandleAlarmModal').modal("hide");
        },
        error: function (err) {
            console.log(err);
        }
    });
}


function jumptopdflist() {
    document.getElementById("pdflist").style.display = "block";
    document.getElementById("showpdf").style.display = "none";
}

function getExportFile(obj) {
    var zip_name = $(obj).html();
    window.open(wz[5] + '/?file=' + zip_name);
}