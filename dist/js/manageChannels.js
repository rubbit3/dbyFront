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

// 添加通道  
function createChannel() {
    var channelId = $("#channel_id").val(); // 通道ID   
    var channelName = $("#channel_name").val(); // 通道名字  
    var samplingRate = $("#sampling_rate").val(); // 采样率  
    var macAddress = $("#mac_address").val(); // MAC地址  
    var Dir = $("#status").val();
    var unit = $("#unit").val(); // 单位 
    var miaoshu_info = $("#miaoshu_info").val();
    var cedian = $("#cedian").val();
    var cedian_status = $("#cedian_status").val();
    var cedian_desc = $("#cedian_desc").val();

    $.ajax({
        type: "POST",
        url: wz[13], // 确保这个URL是正确的服务器端点  
        async: true, // 默认就是true，可以省略  
        data: {
            "ID_project": building, // 项目ID，确保building变量已定义并赋值  
            "id": channelId, // 通道ID  
            "channel_name": channelName, // 通道名字  
            "SampleRate": samplingRate, // 采样率 
            "MAC": macAddress, // MAC地址 
            "Channel": macAddress, // MAC地址  
            "Dir": Dir, // 通道编号（请确保这个字段名与服务器端的期望匹配）  
            "Unit": unit, // 单位  
            "token": token,
            "miaoshu_info": miaoshu_info,
            "cedian": cedian,
            "cedian_status": cedian_status,
            "cedian_desc": cedian_desc
        },
        beforeSend: function () {
            console.log({
                "ID_project": building, // 项目ID，确保building变量已定义并赋值  
                "id": channelId, // 通道ID  
                "channel_name": channelName, // 通道名字  
                "SampleRate": samplingRate, // 采样率 
                "MAC": macAddress, // MAC地址 
                "Channel": macAddress, // MAC地址  
                "Dir": Dir, // 通道编号（请确保这个字段名与服务器端的期望匹配）  
                "Unit": unit, // 单位  
                "token": token,
                "miaoshu_info": miaoshu_info,
                "cedian": cedian,
                "cedian_status": cedian_status,
                "cedian_desc": cedian_desc
            })
        },
        success: function (data) {
            console.log(data);
            $('#addMonModal').modal('hide'); // 隐藏模态框  
            $('#MonitorTable').bootstrapTable('refresh'); // 刷新表格数据  
        },
        error: function (error) {
            console.error("AJAX请求失败: " + error);
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
        columns: [{
            field: 'index', // 使用自定义字段  
            title: '序号',
            formatter: function (value, row, index) {
                return index + 1; // 返回序号，注意index是从0开始的，所以加1  
            }
        },
        {
            field: 'id',
            title: '通道ID',
        },
        // {
        //     field: 'Type',
        //     title: '通道类型',
        // },
        {
            field: 'channel_name',
            title: '通道名字',
        },
        {
            field: 'SampleRate',
            title: '采样率',
        },
        {
            field: 'MAC',
            title: 'MAC地址',
        },
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
            field: 'Dir',
            title: '方向',
        },
        {
            field: 'miaoshu_info',
            title: '描述信息'
        },
        {
            field: 'cedian',
            title: '测点'
        },
        {
            field: 'cedian_status',
            title: '测点状态',
            formatter: function (value, row, index) {
                if(value === '正常'){
                    return '<span style="color:green">正常</span>';  
                }
            }
        },
        {
            field: 'cedian_desc',
            title: '测点描述'
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
            title: '请问您是否要删除该通道?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确认删除',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(row.id)
                console.log(url)
                $.ajax({
                    type: 'POST',
                    url: wz[15],
                    dataType: "json",
                    data: {
                        "ID_project": projectID,
                        "id": row.id,
                        "Dir": row.Dir,
                        "token": token,
                    },
                    beforeSend: function () {
                        console.log({
                            "ID_project": projectID,
                            "id": row.id,
                            "Dir": row.Dir,
                            "token": token,
                        })
                    },
                    success: function (res) {
                        console.log(res)
                        $('#MonitorTable').bootstrapTable('refresh');
                        // $('#MonitorTable').bootstrapTable('refresh');
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

        document.getElementById("new_channel_id").value = row.id;
        document.getElementById("new_channel_name").value = row.channel_name;
        document.getElementById("new_sampling_rate").value = row.SampleRate;
        document.getElementById("new_mac_address").value = row.MAC;
        document.getElementById("new_channel").value = row.Channel;
        document.getElementById("new_unit").value = row.Unit;
        document.getElementById("new_status").value = row.Dir;
        document.getElementById("new_miaoshu_info").value = row.miaoshu_info;
        document.getElementById("new_cedian").value = row.cedian;
        document.getElementById("new_cedian_status").value = row.cedian_status;
        document.getElementById("new_cedian_desc").value = row.cedian_desc;
        $('#changedata').on('click', function () {

            var new_channel_name = document.getElementById("new_channel_name").value;
            var new_sampling_rate = document.getElementById("new_sampling_rate").value;
            var new_mac_address = document.getElementById("new_mac_address").value;
            var new_channel = document.getElementById("new_channel").value;
            var new_unit = document.getElementById("new_unit").value;
            var new_status = document.getElementById("new_status").value;
            var new_miaoshu_info = document.getElementById("new_miaoshu_info").value;
            var new_cedian = document.getElementById("new_cedian").value;
            var new_cedian_status = document.getElementById("new_cedian_status").value;
            var new_cedian_desc = document.getElementById("new_cedian_desc").value;
            $.ajax({
                url: wz[28],
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(
                    {
                        "ID_project": projectID,
                        "id": row.id,
                        "channel_name": new_channel_name,
                        "SampleRate": new_sampling_rate,
                        "MAC": new_mac_address,
                        "Channel": new_channel,
                        "Unit": new_unit,
                        "Dir": new_status,
                        "token": token,
                        "miaoshu_info": new_miaoshu_info,
                        "cedian": new_cedian,
                        "cedian_status": new_cedian_status,
                        "cedian_desc": new_cedian_desc
                    }),
                beforeSend: function () {
                    console.log(JSON.stringify({
                        "ID_project": projectID,
                        "id": row.id,
                        "channel_name": new_channel_name,
                        "SampleRate": new_sampling_rate,
                        "MAC": new_mac_address,
                        "Channel": new_mac_address,
                        "unit": new_unit,
                        "Dir": new_status,
                        "token": token,
                        "miaoshu_info": new_miaoshu_info,
                        "cedian": new_cedian,
                        "cedian_status": new_cedian_status,
                        "cedian_desc": new_cedian_desc
                    }))

                },
                dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）    
                success: function (data) {
                    console.log(data);
                    $('#upgradeDataModal').modal("hide");
                    $('#MonitorTable').bootstrapTable('destroy');
                    InitChannelTable();
                },
                error: function (err) {
                    console.log(err)
                }
            })
        });
    }
}