$(function () {
    platformname();
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

var map = new AMap.Map('map', {
    center: [103.356283, 36.113009], // 甘肃省中心位置
    zoom: 6
});
//返回报警管理
function jumptoalarmmanagement(){
    window.location.href = "alarmmanagement.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}
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

        var circle = new AMap.Circle({
            center: new AMap.LngLat(point.lng, point.lat),
            radius: 20000, // 半径单位是米  
            fillColor: color,
            strokeColor: color,
            fillOpacity: 0.6,
            strokeWeight: 1
        });
        circle.setMap(map);

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
    var marker = new AMap. Marker({
        position: new AMap.LngLat(102.83333700000003,37.77330300000002),
        offset: new AMap.Pixel(-10, -30),
    });
    marker.setMap(map);

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
            map.setZoom(12.48);
        });
    });
}

function simulateEarthquakeWarning() {
    let interval; // Declare interval outside of Swal.fire to make it accessible

    Swal.fire({
        title: '地震横波即将到达，请注意避险',
      html: '剩余时间：<span id="countdown" style="color:red;font-size:30px"><b>35</b> </span>秒'+
      '</br><span>震中 ：武威市凉州区</span>'+
      '</br><span>距离：194公里</span>'+
      '</br><span>预警震级：5.1</span>'+
      '</br><span>预估烈度3.2：强烈震感</span>'+
      '</br><span>预估地震烈度远低于桥梁设防烈度，不会对桥梁结构造成影响，请沉着冷静，就近选择合适地点避险</span>',
        timer: 35000,
        timerProgressBar: true,
        didOpen: () => {
            let countdown = 35;
            const countdownElement = Swal.getHtmlContainer().querySelector('#countdown');
            
            interval = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;

                if (countdown <= 0) {
                    clearInterval(interval);
                    Swal.fire({
                        title: '地震预警',
                        text: '地震即将发生，请迅速采取保护措施！',
                        icon: 'error'
                    });
                }
            }, 1000);
        },
        willClose: () => {
            // Clear interval when the modal is closed
            clearInterval(interval);
        }
    });
}




// function simulateEarthquakeWarning() {
//     let interval; // Declare interval outside of Swal.fire to make it accessible

//     Swal.fire({
//         title: '地震横波即将到达，请注意避险！</br>剩余时间：<span id="countdown" style="color:red;">35</span>秒',
//         html: '剩余时间：<span id="countdown">35</span>秒',
//         timer: 35000,
//         timerProgressBar: true,
//         didOpen: () => {
//             let countdown = 35;
//             const countdownElement = Swal.getContent().querySelector('#countdown');
            
//             interval = setInterval(() => {
//                 countdown--;
//                 countdownElement.textContent = countdown;

//                 if (countdown <= 0) {
//                     clearInterval(interval);
//                     Swal.fire({
//                         title: '地震预警',
//                         text: '地震即将发生，请迅速采取保护措施！',
//                         icon: 'error'
//                     });
//                 }
//             }, 1000);
//         },
//         willClose: () => {
//             // Clear interval when the modal is closed
//             clearInterval(interval);
//         }
//     });
// }