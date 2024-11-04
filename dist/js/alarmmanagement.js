$(function () {
    platformname();
    getstatus();
    emailtable();
    phonetable();
    InitWarnSettingTable();
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

document.getElementById('emailAlarm').addEventListener('change', submitUpdates);
document.getElementById('phoneAlarm').addEventListener('change', submitUpdates);
document.getElementById('alarmInterval').addEventListener('change', submitUpdates);

function submitUpdates() {
    // 收集数据  
    var emailAlarm = document.getElementById('emailAlarm').checked ? 1 : 0;
    var phoneAlarm = document.getElementById('phoneAlarm').checked ? 1 : 0;
    var pushTime = document.getElementById('alarmInterval').value;

    // 构造要发送的数据对象  
    var dataToSend = {
        ID_project: projectID,
        open_email: emailAlarm,
        open_phone: phoneAlarm,
        push_time: pushTime
    };

    // 发送AJAX请求  
    $.ajax({
        type: "POST",
        url: wz[31],
        data: JSON.stringify(dataToSend),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log("更新成功:", response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("更新失败:", textStatus, errorThrown);
        }
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
            console.logs("错误");
        }
    });
}

$(document).ready(function () {
    $('#nav-tab a').on('click', function (e) {
        e.preventDefault();

        $('#nav-tab a').removeClass('active');
        $('.tab-pane').removeClass('show active');

        var target = $(this).attr('href');


        $(this).addClass('active');
        $(target).addClass('show active');
    });
});

function addemail() {
    var newemail = $('#newemail').val();
    var newUUID = generateUUID();
    $.ajax({
        type: "POST",
        url: wz[32],
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "ID_project": projectID,
            "ID": newUUID,
            // "name":2,
            "email": newemail
        }),
        success: function (res) {
            console.log(res);
            $('#emailtable').bootstrapTable('destroy');
            emailtable();
        },
        error: function (res) {
            console.log(res);
        }
    });
}

function emailtable() {
    var emailtalbe = [];
    $('#emailtable').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[33] + "?ID_project=" + projectID,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: '',
                async: true,
                jsonp: 'callback',
                success: function (msg) {
                    console.log(msg.data);
                    let filteredArrayWithEmptyEmails = msg.data.filter(obj => obj.email !== undefined);
                    console.log(filteredArrayWithEmptyEmails);
                    request.success({
                        row: filteredArrayWithEmptyEmails
                    });
                    $('#emailtable').bootstrapTable('load', filteredArrayWithEmptyEmails);
                },
                error: function (res) {
                    console.log(res);
                }
            });
        },
        pagination: true,//是否分页
        sidePagination: 'client',//server:服务器端分页|client：前端分页
        pageSize: 10,//单页记录数
        pageList: [10],
        clickToSelect: true,
        singleSelect: true,
        sortable: true,
        searchAlign: 'left',
        columns: [
            {
                field: 'email',
                title: '邮箱',
                sortable: true
            },
            {
                field: 'status',
                title: '操作',
                formatter: email_comoperateFormatter,
                events: email_operatealarmEvents,
                sortable: true
            }
        ]
    });
}

function email_comoperateFormatter(value, row, index) {
    return [
        "<a class='delete' style='color:red' href='#'>删除</a>"
    ]
}

window.email_operatealarmEvents = {
    'click .delete': function (e, value, row, index) {
        Swal.fire({
            title: '请问您是否要删除该邮箱?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '删除',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'GET',
                    url: wz[34] + "?ID_project=" + projectID + "&ID=" + row.ID,
                    dataType: "json",
                    // data: {
                    //     "ID": row.id,
                    //     "ID_projcet": projectID
                    // },
                    success: function (res) {
                        console.log(res);
                        $('#emailtable').bootstrapTable('destroy');
                        emailtable();
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            }
        })
    }
}


function addphone() {
    var newphone = $('#newphone').val();
    var newUUID = generateUUID();
    $.ajax({
        type: "POST",
        url: wz[32],
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "ID_project": projectID,
            "ID": newUUID,
            // "name":2,
            "phone": newphone
        }),
        success: function (res) {
            console.log(res);
            $('#phonetable').bootstrapTable('destroy');
            phonetable();
        },
        error: function (res) {
            console.log(res);
        }
    });
}

function phonetable() {
    var phonetalbe = [];
    $('#phonetable').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[33] + "?ID_project=" + projectID,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: '',
                async: true,
                jsonp: 'callback',
                success: function (msg) {
                    console.log(msg.data);
                    let filteredArrayWithEmptyphone = msg.data.filter(obj => obj.phone !== undefined);
                    console.log(filteredArrayWithEmptyphone);
                    request.success({
                        row: filteredArrayWithEmptyphone
                    });
                    $('#phonetable').bootstrapTable('load', filteredArrayWithEmptyphone);
                },
                error: function (res) {
                    console.log(res);
                }
            });
        },
        pagination: true,//是否分页
        sidePagination: 'client',//server:服务器端分页|client：前端分页
        pageSize: 10,//单页记录数
        pageList: [10],
        clickToSelect: true,
        singleSelect: true,
        sortable: true,
        searchAlign: 'left',
        columns: [
            {
                field: 'phone',
                title: '手机号码',
                sortable: true
            },
            {
                field: 'status',
                title: '操作',
                formatter: phone_comoperateFormatter,
                events: phone_operatealarmEvents,
                sortable: true
            }
        ]
    });
}

function phone_comoperateFormatter(value, row, index) {
    return [
        "<a class='delete' style='color:red' href='#'>删除</a>"
    ]
}

window.phone_operatealarmEvents = {
    'click .delete': function (e, value, row, index) {
        Swal.fire({
            title: '请问您是否要删除该手机号码?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '删除',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'GET',
                    url: wz[34] + "?ID_project=" + projectID + "&ID=" + row.ID,
                    dataType: "json",
                    success: function (res) {
                        console.log(res);
                        $('#phonetable').bootstrapTable('destroy');
                        phonetable();
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            }
        })
    }
}

//获取按钮状态
function getstatus() {
    $.ajax({
        type: "GET",
        url: wz[30] + "?ID_project=" + projectID,
        beforeSend: function () {
            console.log(wz[30] + "?ID_project=" + projectID)
        },
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        jsonp: 'callback',
        success: function (msg) {
            console.log(msg)
            // 根据open_email的值设置邮件报警复选框的选中状态  
            if (msg.data.open_email === 1) {
                document.getElementById('emailAlarm').checked = true;
            } else {
                document.getElementById('emailAlarm').checked = false;
            }

            // 根据open_phone的值设置短信报警复选框的选中状态  
            if (msg.data.open_phone === 1) {
                document.getElementById('phoneAlarm').checked = true;
            } else {
                document.getElementById('phoneAlarm').checked = false;
            }

            // 设置连续报警时间间隔  
            var selectElement = document.getElementById('alarmInterval');
            var pushTimeStr = msg.data.push_time.toString(); // 将push_time转换为字符串  
            for (var i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].value === pushTimeStr) {
                    selectElement.selectedIndex = i;
                    break;
                }
            }
        },
        error: function () {
            console.log("错误");
        }
    });
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function addWarnSetting() {
    // 获取表单数据  
    var channelName = document.getElementById('channel_name').value;
    var type = document.getElementById('type').value;
    var level = document.getElementById('station-typechannel').value;
    var alarmColor = document.getElementById('alarm-color').value;
    var channelValue = document.getElementById('name').value;
    var first_upperThreshold = document.getElementById('first-upper-threshold').value;
    var first_lowerThreshold = document.getElementById('first-lower-threshold').value;
    var second_upperThreshold = document.getElementById('second-upper-threshold').value;
    var second_lowerThreshold = document.getElementById('second-lower-threshold').value;
    var third_upperThreshold = document.getElementById('third-upper-threshold').value;
    var third_lowerThreshold = document.getElementById('third-lower-threshold').value;
    var upperThresholdSwitch = document.getElementById('upper-threshold-switch').checked;
    var lowerThresholdSwitch = document.getElementById('lower-threshold-switch').checked;

    var upperThresholdSwitchNum = upperThresholdSwitch ? 1 : 0;
    var lowerThresholdSwitchNum = lowerThresholdSwitch ? 1 : 0;

    $.ajax({
        type: "POST",
        url: wz[35],
        data: {
            ID_project: projectID,
            channel_name: channelName,
            type: type,
            color: alarmColor,
            name: channelValue,
            level: level,
            up1: first_upperThreshold,
            down1: first_lowerThreshold,
            up2: second_upperThreshold,
            down2: second_lowerThreshold,
            up3: third_upperThreshold,
            down3: third_lowerThreshold,
            switchUp: upperThresholdSwitchNum,
            switchDown: lowerThresholdSwitchNum
        },
        beforeSend: function () {
            console.log(JSON.stringify({
                ID_project: projectID,
                channel_name: channelName,
                type: type,
                color: alarmColor,
                name: channelValue,
                level: level,
                up1: first_upperThreshold,
                down1: first_lowerThreshold,
                up2: second_upperThreshold,
                down2: second_lowerThreshold,
                up3: third_upperThreshold,
                down3: third_lowerThreshold,
                switchUp: upperThresholdSwitchNum,
                switchDown: lowerThresholdSwitchNum
            }));
        },
        success: function (response) {
            console.log("更新成功:", response);
            $('#addWarnSettingModal').modal('hide');
            $('#WarnSettingtable').bootstrapTable('refresh');
        },
        error: function (error) {
            console.error("更新失败:", error);
            $('#addWarnSettingModal').modal('hide');
        }
    });
}

function InitWarnSettingTable() {
    $('#WarnSettingtable').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[41] + "?ID_project=" + building,
                beforeSend: function () {
                    console.log(wz[41] + "?ID_project=" + building)
                },
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                async: true,
                jsonp: 'callback',
                success: function (msg) {
                    request.success({
                        row: msg["data"]
                    });
                    console.log("WarnSettingtable", msg["data"]);
                    $('#WarnSettingtable').bootstrapTable('load', msg["data"]);
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
        singleSelect: true,
        clickToSelect: true, // 点击行即可选中 
        columns: [{
            field: 'state',
            checkbox: true,
            formatter: function (value, row, index) {
                return value;
            }
        }, {
            field: 'channel_name',
            title: '通道名称',
        },
        {
            field: 'type',
            title: '告警类型',
        },
        {
            field: 'level',
            title: '告警级别',
        },
        {
            field: 'color',
            title: '颜色',
        },
        {
            field: 'name',
            title: '通道值',
        },
        {
            field: 'up1',
            title: '一级上限',
        },
        {
            field: 'down1',
            title: '一级下限',
        },
        {
            field: 'up2',
            title: '二级上限',
        },
        {
            field: 'down2',
            title: '二级下限',
        },
        {
            field: 'up3',
            title: '三级上限',
        },
        {
            field: 'down3',
            title: '三级下限',
        },
        {
            field: 'switchUp',
            title: '阈值上限开关',
            formatter: function (value, row, index) {
                console.log(value);
                if(value === 1){return '开'}
                if(value === 0){return '关'}
            }
        },
        {
            field: 'switchDown',
            title: '阈值下限开关',
            formatter: function (value, row, index) {
                console.log(value);
                if(value === 1){return '开'}
                if(value === 0){return '关'}
            }
        }
        ]
    });
}

function updateSelectedRows_modal() {
    var rows = $('#WarnSettingtable').bootstrapTable('getSelections');
    if (rows.length === 0) {
        alert('请选择要更新的行！');
        return;
    }
    $('#update_channel_name').val(rows[0].channel_name);
    $('#update_type').val(rows[0].type);
    $('#update_station-typechannel').val(rows[0].level); // 注意：id中的连字符可能需要处理，但这里简化了  
    $('select[id="update_alarm-color"]').val(rows[0].color);
    $('#update_name').val(rows[0].name);
    $('#update_first-upper-threshold').val(rows[0].up1); // 假设你的上限和下限字段在数据库中是这样命名的  
    $('#update_first-lower-threshold').val(rows[0].down1);
    $('#update_second-upper-threshold').val(rows[0].up2);
    $('#update_second-lower-threshold').val(rows[0].down2);
    $('#update_third-upper-threshold').val(rows[0].up3);
    $('#update_third-lower-threshold').val(rows[0].down3);
    $('#update_upper-threshold-switch').prop('checked', rows[0].switchUp === 1); // 假设switchUp是字符串'1'或'0'  
    $('#update_lower-threshold-switch').prop('checked', rows[0].switchDown === 1);

    $('#updateWarnSettingModal').modal('show');
}

// 更新选中行  
function updateSelectedRows() {
    //修改数据，然后提交
    var channelName = document.getElementById('update_channel_name').value;
    var type = document.getElementById('update_type').value;
    var level = document.getElementById('update_station-typechannel').value;
    var alarmColor = document.getElementById('update_alarm-color').value;
    var channelValue = document.getElementById('update_name').value;
    var first_upperThreshold = document.getElementById('update_first-upper-threshold').value;
    var first_lowerThreshold = document.getElementById('update_first-lower-threshold').value;
    var second_upperThreshold = document.getElementById('update_second-upper-threshold').value;
    var second_lowerThreshold = document.getElementById('update_second-lower-threshold').value;
    var third_upperThreshold = document.getElementById('update_third-upper-threshold').value;
    var third_lowerThreshold = document.getElementById('update_third-lower-threshold').value;
    var upperThresholdSwitch = $('#update_upper-threshold-switch').is(':checked') ? 1 : 0
    var lowerThresholdSwitch = $('#update_lower-threshold-switch').is(':checked') ? 1 : 0  

    var data = {
        ID_project: projectID,
        channel_name: channelName,
        type: type,
        color: alarmColor,
        name: channelValue,
        level: level,
        up1: first_upperThreshold,
        down1: first_lowerThreshold,
        up2: second_upperThreshold,
        down2: second_lowerThreshold,
        up3: third_upperThreshold,
        down3: third_lowerThreshold,
        switchUp: upperThresholdSwitch,
        switchDown: lowerThresholdSwitch
    };

    $.ajax({
        type: "POST",
        url: wz[40],
        data: data, 
        dataType: "json",
        beforeSend:function(){
            console.log({
                ID_project: projectID,
                channel_name: channelName,
                type: type,
                color: alarmColor,
                name: channelValue,
                level: level,
                up1: first_upperThreshold,
                down1: first_lowerThreshold,
                up2: second_upperThreshold,
                down2: second_lowerThreshold,
                up3: third_upperThreshold,
                down3: third_lowerThreshold,
                switchUp: upperThresholdSwitch,
                switchDown: lowerThresholdSwitch
            })
        },
        success: function (response) {
            console.log("更新成功:", response);
            $('#WarnSettingtable').bootstrapTable('refresh');
            $('#updateWarnSettingModal').modal('hide');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("更新失败:", textStatus, errorThrown);
            $('#updateWarnSettingModal').modal('hide');
        }
    });

}

//删除选中行
function deleteSelectedRows(){
    var rows = $('#WarnSettingtable').bootstrapTable('getSelections');
    if (rows.length === 0) {
        alert('请选择要更新的行！');
        return;
    }
    Swal.fire({
        title: '请问您是否要删除该阈值设置?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                url: wz[42],
                dataType: "json",
                data: {
                    "ID_project": projectID,
                    "name": rows[0].name,
                    "level": rows[0].level
                },
                beforeSend:function(){console.log({
                    "ID_projcet": projectID,
                    "name": rows[0].name,
                    "level": rows[0].level
                })},
                success: function (res) {
                    console.log(res);
                    $('#WarnSettingtable').bootstrapTable('refresh');
                },
                error: function (res) {
                    console.log(res);
                }
            });
        }
    })
}