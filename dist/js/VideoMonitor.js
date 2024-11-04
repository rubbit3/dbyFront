$(function () {
    platformname();
    devicetable();
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

//添加设备
function createdev() {
    var live_url = $("#live_url").val();
    var description = $("#description").val();
    var No_dev = $("#No_dev").val(); // 注意这里使用了HTML中的id，即No_dev（大写N）  
    var appKey = $("#appKey").val();
    var appSecret = $("#appSecret").val();
    var changjia = $("#changjia").val();

    $.ajax({
        type: "POST",
        url: wz[24],
        async: true,
        data: {
            "ID_project": building,
            "live_url": live_url,
            "description": description,
            "No_dev": No_dev,
            "appKey": appKey,
            "appSecret": appSecret,
            "changjia": changjia,
        },
        success: function (data) {
            console.log(data)
            $('#addDEVModal').modal('hide');
            $('#devicetable').bootstrapTable('refresh');
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function devicetable() {
    $('#devicetable').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[25],
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                async: true,
                jsonp: 'callback',
                success: function (msg) {
                    console.log(msg)
                    request.success({
                        row: msg["data"]
                    });
                    $('#devicetable').bootstrapTable('load', msg["data"]);
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
        columns: [{
            field: 'live_url',
            title: '直播地址',
        },
        {
            field: 'description',
            title: '摄像头信息描述',
        },
        {
            field: 'No_dev',
            title: '摄像头设备编号',
        },
        {
            field: 'appKey',
            title: 'appKey',
        },
        {
            field: 'appSecret',
            title: 'appSecret',
        },
        {
            field: 'changjia',
            title: '摄像头厂家',
        },

        {
            field: 'status',
            title: '操作',
            formatter: comoperateFormatter,
            events: operatealarmEvents,
            sortable: true
        }
        ],
    });
}

function comoperateFormatter(value, row, index) {
    return [
        " <a class='remove pointer' title='Remove' style='color:red' href='#'>删除</a>" + " " +
        "<a class='change' href='#'>修改</a>"
    ]
}


window.operatealarmEvents = {
    'click .remove': function (e, value, row, index) {
        Swal.fire({
            title: '请问您是否要删除该摄像头?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确认删除',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',
                    url: wz[26],
                    dataType: "json",
                    data: {
                        "No_dev": row.No_dev,
                    },
                    beforeSend: function (request) {
                        console.log(row.No_dev)
                    },
                    success: function (res) {
                        $('#devicetable').bootstrapTable('refresh');
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            }
        })
    },
    'click .change': function (e, value, row, index) {
        $('#upgradeDataModal').modal("show");

        document.getElementById("new_live_url").value = row.live_url;
        document.getElementById("new_description").value = row.description;
        document.getElementById("new_No_dev").value = row.No_dev;
        document.getElementById("new_appKey").value = row.appKey;
        document.getElementById("new_appSecret").value = row.appSecret;
        document.getElementById("new_changjia").value = row.changjia;
        $('#changedata').on('click', function () {

            var new_live_url = document.getElementById("new_live_url").value;
            var new_description = document.getElementById("new_description").value;
            // var new_No_dev = document.getElementById("new_No_dev").value;
            var new_appKey = document.getElementById("new_appKey").value;
            var new_appSecret = document.getElementById("new_appSecret").value;
            var new_changjia = document.getElementById("new_changjia").value;
            $.ajax({
                url: wz[27],
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(
                    {
                        "ID_project": projectID,
                        "live_url": new_live_url,
                        "description": new_description,
                        "No_dev": row.No_dev,
                        "appKey": new_appKey,
                        "appSecret": new_appSecret,
                        "changjia": new_changjia
                    }),
                beforeSend: function () {
                    console.log({
                        "ID_project": projectID,
                        "live_url": new_live_url,
                        "description": new_description,
                        "No_dev": row.No_dev,
                        "appKey": new_appKey,
                        "appSecret": new_appSecret,
                        "changjia": new_changjia
                    })

                },
                dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）    
                success: function (data) {
                    console.log(data);
                    $('#upgradeDataModal').modal("hide");
                    $('#devicetable').bootstrapTable('destroy');
                    devicetable();
                },
                error: function (err) {
                    console.log(err)
                }
            })
        });

    }
}
