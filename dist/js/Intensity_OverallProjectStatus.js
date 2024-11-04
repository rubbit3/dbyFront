$(function () {
    platformname();
    IntensityTable();
    points()
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


// 初始化地图
var map = new AMap.Map('map', {
    center: [103.8343, 36.0611], // 甘肃省中心位置
    zoom: 6
});

// 定义颜色梯度
function getColor(level) {
    return level > 9 ? '#800026' :
        level > 8 ? '#BD0026' :
            level > 7 ? '#E31A1C' :
                level > 6 ? '#FC4E2A' :
                    level > 5 ? '#FD8D3C' :
                        level > 4 ? '#FEB24C' :
                            level > 3 ? '#FED976' :
                                level > 2 ? '#FFEDA0' :
                                    '#FFFFCC';
}

function addnumber(){
        // 定义多个点的位置和对应的数字
        var points = [  
            { name: "庄浪河大桥", lng: 103.1100, lat: 37.0222, number: 3.8 },  
            { name: "清水北大桥", lng: 98.7203, lat: 39.5917, number: 3.6 }, 
            { name: "嘉峪关桥", lng: 98.5115, lat: 39.7077, number: 4.5 }, 
            { name: "疏勒河桥", lng: 96.5851, lat: 40.5439, number: 4.5 },
            { name: "张掖南大桥", lng: 100.5760, lat: 38.8239, number: 2.8 },
            { name: "临泽桥", lng: 100.1390, lat: 39.1202, number: 2.5 }, 
            { name: "八盘峡大桥", lng: 103.356283, lat: 36.113009, number: 3.2 } 
        ];
    points.forEach(function (point) {
        var color = getColor(point.number);

        // var circle = new AMap.Circle({
        //     center: new AMap.LngLat(point.lng, point.lat),
        //     radius: 20000, // 半径单位是米  
        //     fillColor: color,
        //     strokeColor: color,
        //     fillOpacity: 0.6,
        //     strokeWeight: 1
        // });
        // circle.setMap(map);

        var markerContent = document.createElement('div');
        markerContent.className = 'circle-label';
        markerContent.innerHTML = point.number;
        markerContent.style.backgroundColor = color;

        var marker = new AMap.Marker({
            position: new AMap.LngLat(point.lng, point.lat),
            offset: new AMap.Pixel(-10, -30),
            content: markerContent
        });
        marker.setMap(map);
    });
}

function points() {
    // 定义多个点的位置和对应的数字
    var points = [  
        { name: "庄浪河大桥", lng: 103.1100, lat: 37.0222, number: 3.8 },  
        { name: "清水北大桥", lng: 98.7203, lat: 39.5917, number: 3.6 }, 
        { name: "嘉峪关桥", lng: 98.5115, lat: 39.7077, number: 4.5 }, 
        { name: "疏勒河桥", lng: 96.5851, lat: 40.5439, number: 4.5 },
        { name: "张掖南大桥", lng: 100.5760, lat: 38.8239, number: 2.8 },
        { name: "临泽桥", lng: 100.1390, lat: 39.1202, number: 2.5 }, 
        { name: "八盘峡大桥", lng: 103.356283, lat: 36.113009, number: 3.2 } 
    ];

    // 假设存在一个getColor函数用于根据数字获取颜色  
    function getColor(number) {
        // 示例颜色，您可以根据需要调整  
        const colors = ['#FF0000', '#00FF00', '#0000FF'];
        return colors[number - 1] || '#000000';
    }

    // 在每个点的位置添加一个圆圈和一个标签  

    points.forEach(function (point) {
        var color = getColor(point.number);
        var marker = new AMap.Marker({
            position: new AMap.LngLat(point.lng, point.lat),
            offset: new AMap.Pixel(-10, -30),
            // content: markerContent
        });
        marker.setMap(map);

        // 创建一个文本标记来表示桥梁的名称  
        var text = new AMap.Text({
            text: point.name, // 文本内容  
            anchor: 'bottom-center', // 设置文本标记锚点  
            draggable: false,
            cursor: 'pointer',
            angle: 0,
            style: {
                fontSize: 16,
                fontWeight: 'bold',
                fillColor: color, // 文本填充颜色  
                strokeColor: '#ffffff', // 文本描边颜色  
                strokeWidth: 2 // 文本描边宽度  
            },
            position: [point.lng, point.lat],
            offset: new AMap.Pixel(10, 35),
        });

        text.setMap(map); // 将文本标记添加到地图中  

        text.on('click', function () {
            map.setCenter([point.lng, point.lat]); // 设置地图中心为标签的位置  
            map.setZoom(8);
        });
    });
}


function caculate() {
    let startTime = document.getElementById('startTime').value;
    let endTime = document.getElementById('endTime').value;
    console.log(startTime, endTime);

    if (!startTime || !endTime) {
        alert('开始时间和结束时间不能为空');
        return;
    }
    startTime = Math.floor(new Date(startTime).getTime() / 1000);
    endTime = Math.floor(new Date(endTime).getTime() / 1000);
    console.log(startTime, endTime);
    setTimeout(addnumber, 1000);  
}

function IntensityTable() {  
    $.ajax({  
        type: "POST",  
        url: wz[47],  
        success: function (msg) {  
            console.log(msg);  
            mockData = msg.data;  
            // 获取表格的tbody元素    
            const tbody = document.getElementById('bridgeTable').getElementsByTagName('tbody')[0];  
  
            // 遍历模拟数据，为每条数据创建一个表格行    
            mockData.forEach(bridge => {  
                const row = tbody.insertRow();  
  
                row.insertCell(0).textContent = bridge.id;  
                row.insertCell(1).textContent = bridge.bridgeName;  
                row.insertCell(2).textContent = bridge.station.longitude;  
                row.insertCell(3).textContent = bridge.station.latitude;  
                row.insertCell(4).textContent = bridge.siteCondition;  
                row.insertCell(5).textContent = bridge.pga.ew;  
                row.insertCell(6).textContent = bridge.pga.ns;  
                row.insertCell(7).textContent = bridge.pga.ud;  
                row.insertCell(8).textContent = bridge.pgv.ew;  
                row.insertCell(9).textContent = bridge.pgv.ns;  
                row.insertCell(10).textContent = bridge.pgv.ud;  
                row.insertCell(11).textContent = bridge.instrumentIntensity;  
            });  
        },  
        error: function (res) {  
            console.log("错误:" + res);  
        }  
    });  
}
// function IntensityTable() {
//     $.ajax({
//         type: "POST",
//         url: wz[47],
//         success: function (msg) {
//             console.log(msg)
//             mockData = msg.data
//                 // 获取表格的tbody元素  
//     const tbody = document.getElementById('bridgeTable').getElementsByTagName('tbody')[0];

//     // 遍历模拟数据，为每条数据创建一个表格行  
//     mockData.forEach(bridge => {
//         const row = tbody.insertRow();

//         row.insertCell(0).textContent = bridge.id;
//         row.insertCell(1).textContent = bridge.bridgeName;
//         row.insertCell(2).textContent = bridge.station.longitude;
//         row.insertCell(3).textContent = bridge.station.latitude;
//         row.insertCell(4).textContent = bridge.siteCondition;
//         row.insertCell(5).textContent = bridge.pga.ew;
//         row.insertCell(6).textContent = bridge.pga.ns;
//         row.insertCell(7).textContent = bridge.pga.ud;
//         row.insertCell(8).textContent = bridge.pga.calculatedValue;
//         row.insertCell(9).textContent = bridge.pgv.ew;
//         row.insertCell(10).textContent = bridge.pgv.ns;
//         row.insertCell(11).textContent = bridge.pgv.ud;
//         row.insertCell(12).textContent = bridge.pgv.calculatedValue;
//         row.insertCell(13).textContent = bridge.instrumentIntensity;
//     });
//         },
//         error: function (res) {
//             console.log("错误:" + res);
//         }
//     });
// }

