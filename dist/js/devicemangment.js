$(function () {
    devicetable();
    platformname();
})

var tokenname = $.cookie('token');
var lat;
var lng;

var subproject = {};

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
            // document.getElementById("adeditpname").value = platname;
        },
        error: function () {
            alert("错误");
        }
    });
}

//添加设备
function createdev() {
    var no_dev = $("#no_dev").val();
    var no_dev_discern = $("#no_dev_discern").val();
    var is_online = $("#is_online").val();
    var type = $("#type").val();
    var jihao = $("#jihao").val();
    var status = $("#status").val();
    var longitude = $("#longitude").val();
    var latitude = $("#latitude").val();
    var location_info = $("#location_info").val(); // 位置信息  

    $.ajax({
        type: "POST",
        url: wz[7],
        async: true,
        data: {
            "ID_project": building, // 项目ID  
            "No_dev": no_dev, // 设备编号  
            "No_dev_discern": no_dev_discern, // 设备识别码  
            "isOnline": is_online, // 设备状态
            "type": type, // 设备类型  
            "jihao": jihao, // 机号  
            "addTime": new Date().getTime(), // 添加时间
            "status": status, // 设备状态
            "longitude": longitude, // 经度  
            "latitude": latitude, // 纬度  
            "locationInfo": location_info, // 位置信息  
            "token": tokenname
        },
        beforeSend: function () {
            console.log({
                "ID_project": building, // 项目ID  
                "No_dev": no_dev, // 设备编号  
                "No_dev_discern": no_dev_discern, // 设备识别码  
                "isOnline": is_online, // 设备状态
                "type": type, // 设备类型  
                "jihao": jihao, // 机号  
                "addTime": new Date().getTime(), // 添加时间
                "status": status, // 设备状态
                "longitude": longitude, // 经度  
                "latitude": latitude, // 纬度  
                "locationInfo": location_info, // 位置信息  
                "token": tokenname
            })
        },
        success: function (data) {
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
            field: 'xuhao', // 使用自定义字段  
            title: '序号',  
            formatter: function (value, row, xuhao) {  
                return xuhao + 1; // 返回序号，注意index是从0开始的，所以加1  
            }  
        },{
            field: 'No_dev',
            title: '设备编号',
        },
        {
            field: 'No_dev_discern',
            title: '设备位置',
        },
        // {
        //     field: 'addTime',
        //     title: '添加时间',
        // },
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
        // {
        //     field: 'jihao',
        //     title: '机号',
        // },
        {
            field: 'longitude',
            title: '经度',
            visible: false
        },
        {
            field: 'latitude',
            title: '纬度',
            visible: false
        },
        {
            field: 'status',
            title: '状态',
            visible: false
        },
        {
            field: 'location_info',
            title: '位置信息',
            visible: false
        },
        {
            field: 'type',
            title: '类型',
        },
        {
            field: 'index',
            title: '操作',
            formatter: comoperateFormatter,
            events: operatealarmEvents,
            sortable: true
        }
        ]
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
        console.log(row);
        Swal.fire({
            title: '请问您是否要删除该设备?',
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
                    url: wz[9],
                    dataType: "json",
                    data: {
                        "ID_project": building,
                        // "No_dev": row.No_dev,
                        "jihao": row.jihao,
                        "token": tokenname
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
        // 填充表单字段  
        document.getElementById("new_no_dev").value = row.No_dev;
        document.getElementById("new_no_dev_discern").value = row.No_dev_discern;
        document.getElementById("new_is_online").value = row.isOnline;
        document.getElementById("new_type").value = row.type;
        document.getElementById("new_jihao").value = row.jihao;
        document.getElementById("new_status").value = row.status;
        document.getElementById("new_longitude").value = row.longitude;
        document.getElementById("new_latitude").value = row.latitude;
        document.getElementById("new_location_info").value = row.locationInfo;
        // 假设其他字段不需要从row中直接填充，保持为空或用户输入  

        $('#changedata').on('click', function () {
            var no_dev = document.getElementById("new_no_dev").value;
            var new_no_dev_discern = document.getElementById("new_no_dev_discern").value;
            var new_type = document.getElementById("new_type").value;
            var new_jihao = document.getElementById("new_jihao").value;
            var new_is_online = document.getElementById("new_is_online").value; // 新增设备状态  
            var new_status = document.getElementById("new_status").value; // 这里的status可能与新表单中的意义不同，确认后可能需要调整  
            var new_longitude = document.getElementById("new_longitude").value;
            var new_latitude = document.getElementById("new_latitude").value;
            var new_location_info = document.getElementById("new_location_info").value;

            $.ajax({
                url: wz[29],
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    "ID_project": projectID,
                    "No_dev": no_dev, // 设备编号  
                    "No_dev_discern": new_no_dev_discern, // 设备识别码  
                    "isOnline": new_is_online, // 设备状态  
                    "type": new_type, // 设备类型  
                    "jihao": new_jihao, // 机号  
                    "status": new_status, // 保留或根据实际需要调整  
                    "longitude": new_longitude,
                    "latitude": new_latitude,
                    "locationInfo": new_location_info,
                    "addTime": row.addTime,
                    "token": token
                }),
                // beforeSend: function () {
                //     console.log(JSON.stringify({
                //         "ID_project": projectID,
                //         "No_dev": no_dev, // 设备编号  
                //         "No_dev_discern": new_no_dev_discern, // 设备识别码  
                //         "isOnline": new_is_online, // 设备状态  
                //         "type": new_type, // 设备类型  
                //         "jihao": new_jihao, // 机号  
                //         "status": new_status, // 保留或根据实际需要调整  
                //         "longitude": new_longitude,
                //         "latitude": new_latitude,
                //         "locationInfo": new_location_info,
                //         // "addTime": row.addTime,
                //         "token": token
                //     }));
                // },
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    $('#upgradeDataModal').modal("hide");
                    $('#devicetable').bootstrapTable('destroy');
                    devicetable();
                },
                error: function (err) {
                    console.log(err);
                }
            });
        });
    }
}