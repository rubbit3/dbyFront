$(function () {
    getData()
});

var tokenname = $.cookie('token');
var url = window.location.href;
var obj = {};
str = url.split("?")[1].split("&");
for (let i = 0; i < str.length; i++) {
    let a = str[i].split('='); // 小1
    obj[a[0]] = a[1];  // 小2
}

var username = obj.name;
var building = obj.building;
var type = obj.type;
const $table = $('#table');

//获取data数据
function getData() {
    // 获取分组
    console.log(building)
    $.ajax({
        type: "GET",
        url: wz[11] + "?ID_project=" + building,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: true,
        jsonp: 'callback',
        success: function (response) {
            var transformedData = [];
            console.log(response.data);
            for (let i = 0; i < response.data.length; i++) {
                let item = response.data[i];
                if (item.cedian && item.cedian.length > 0) {
                    for (let y = 0; y < item.cedian.length; y++) {
                        let cedianItem = item.cedian[y];
                        let mergedItem = {
                            ...item,
                            ...cedianItem
                        };
                        delete mergedItem.cedian;
                        transformedData.push(mergedItem);
                    }
                } else {
                    let newItem = { ...item };
                    delete newItem.cedian;
                    transformedData.push(newItem);
                }
            }
            console.log(transformedData); 
            $table.bootstrapTable('load', transformedData);
            $('#table').bootstrapTable({
                groupBy: true,
                groupByField: 'ID_group',
                data: transformedData
            });
        },
        error: function (res) {
            console.log(res);
        }
    });
}

// 添加分组
$('#addGroupForm').on('submit', function (e) {
    e.preventDefault();
    const newGroup = {
        ID_project: building, // 假设 building 是一个全局变量，包含项目 ID
        name: $('#name').val(),
        ID_group: $('#ID_group').val()
    };
    $.ajax({
        url: wz[10] + "?ID_project=" + building + "&name=" + $('#name').val() + "&ID_group=" + $('#ID_group').val(),
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            $('#addGroupModal').modal('hide');
            $('#addGroupForm')[0].reset();
        },
        error: function () {
            alert('请求失败，请稍后再试。');
        }
    });
});

// 添加测点
$('#addPointForm').on('submit', function (e) {
    e.preventDefault();
    const newPoint = {
        ID_project: building,
        ID_group: $('#ID_group_cedian').val(),
        ID_cedian: $('#ID_cedian').val(),
        name: $('#cedian_name').val(),
        No_device: $('#No_device').val(),
        No_channel: $('#No_channel').val(),
        content: $('#content').val(),
        unit: $('#unit').val(),
        formula: $('#formula').val(),
        decimal: $('#decimal').val(),
        status: $('#status').val()
    };
    console.log(newPoint)
    $.ajax({
        url: wz[12],
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newPoint),
        success: function (response) {
            console.log(response)
        },
        error: function () {
            alert('请求失败，请稍后再试。');
        }
    });
});