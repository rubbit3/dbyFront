$(function () {
    platformname();
    singleDate();
    initMap();
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

function query() {
    var obj = document.getElementById("panel4");
    obj.style.right = "0";
}

function closestation() {
    var obj = document.getElementById("panel4");
    obj.style.right = "-230px";
}

//生成日期选择器
var starttime;
var endtime;
function singleDate() {
    $('input[name="date1"]').daterangepicker({
        locale: {
            applyLabel: '确定', //确定按钮文本
            cancelLabel: '取消', //取消按钮文本
            format: "YYYY-MM-DD",
            separator: " - ",
            daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
            monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
        }
    }, function (start, end, label) {
        starttime = start.format('YYYY-MM-DD');
        endtime = end.format('YYYY-MM-DD');
        console.log("选择了一个新的日期: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
}

function timeToTimestamp(time) {
    let timestamp = Date.parse(new Date(time).toString());
    timestamp = timestamp / 1000; //时间戳为13位需除1000，时间戳为13位的话不需除1000
    console.log(time + "的时间戳为：" + timestamp);
    return timestamp;
}

function showLoadingOverlay() {  
    var loadingOverlay = document.getElementsByClassName('loadingOverlay'); 
    loadingOverlay.style.display = 'block';  
}  
  
function hideLoadingOverlay() {  
    var loadingOverlay = document.getElementsByClassName('loadingOverlay'); 
    loadingOverlay.style.display = 'none'; 
} 

var weidu01;
var weidu02;
var jingdu01;
var jingdu02;
var shendu01;
var shendu02;
var zhenji01;
var zhenji02;
var totaldata;
var earthquakedata;
var ttearthquakedata;
var flag;
function earthquake() {
    earthquakedata = [];
    weidu01 = document.getElementById("weidu01").value;
    weidu02 = document.getElementById("weidu02").value;
    jingdu01 = document.getElementById("jingdu01").value;
    jingdu02 = document.getElementById("jingdu02").value;
    zhenji01 = document.getElementById("zhenji01").value;
    zhenji02 = document.getElementById("zhenji02").value;
    shendu01 = document.getElementById("shendu01").value;
    shendu02 = document.getElementById("shendu02").value;
    var pagenumber = 1;
    var flag = "true";
    do {
        $.ajax({
            type: "GET",
            url: 'http://10.62.213.53:1448/data/disExt' + "?page=" + pagenumber + "&jingdu=" + jingdu01 + "&jingdu2=" + jingdu02 + "&weidu1=" + weidu01 +
                "&weidu2=" + weidu02 + "&height1=" + shendu01 + "&height2=" + shendu02 + "&zhenji1=" + zhenji01 + "&zhenji2=" + zhenji02
                + "&start=" + starttime + "&end=" + endtime,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            data: '',
            jsonp: 'callback',
            async: false,
            success: function (msg) {
                console.log(msg);
                tempdata = dataa;
                dataa = msg.data;
            },
            error: function () {
                console.log("错误");
            },
        });
        if (typeof tempdata != "undefined") {
            for (var i = 0; i < tempdata.length; i++) {
                dizhendata = {};
                dizhendata.id = tempdata[i].id;
                dizhendata.time = tempdata[i].O_TIME;
                dizhendata.lat = tempdata[i].EPI_LAT;
                dizhendata.long = tempdata[i].EPI_LON;
                dizhendata.deep = tempdata[i].EPI_DEPTH + "千米";
                dizhendata.grade = tempdata[i].M;
                dizhendata.distract = tempdata[i].LOCATION_C;
                earthquakedata.push(dizhendata);
            }
            if (JSON.stringify(tempdata) == JSON.stringify(dataa)) {
                flag = "false";
            }
        }
        pagenumber++; 

    } while (flag == "true" && pagenumber < 200)
    if (earthquakedata.length == 0) {
        hideLoadingOverlay()
        alert("没有相关记录")
    }
    var obj = document.getElementById("panel4");
    obj.style.right = "-230px";
    initMap();
}

var map;
var dataa;
function initMap() {
    map = new BMap.Map("world-map"); // 创建Map实例
    map.centerAndZoom(new BMap.Point(107.40, 39), 5);
    var size1 = new BMap.Size(10, 50);
    map.addControl(
        new BMap.MapTypeControl({
            offset: size1,
            mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
        })
    );
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    var size = new BMap.Size(10, 50);
    map.addControl(
        new BMap.CityListControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            offset: size,
        })
    );

    var bridges = [  
        { name: "庄浪河大桥", lng: 103.1100, lat: 37.0222  },  
        { name: "清水北大桥", lng: 98.7203, lat: 39.5917 }, 
        { name: "嘉峪关桥", lng: 98.5115, lat: 39.7077 }, 
        { name: "疏勒河桥", lng: 96.5851, lat: 40.5439 },
        { name: "张掖南大桥", lng: 100.5760, lat: 38.8239 },
        { name: "临泽桥", lng: 100.1390, lat: 39.1202 }, 
        { name: "八盘峡大桥", lng: 103.356283, lat: 36.113009 } 
    ];

    bridges.forEach(function(bridge) {  
        var point = new BMap.Point(bridge.lng, bridge.lat);  
        var marker = new BMap.Marker(point);  
        map.addOverlay(marker);  
        var label = new BMap.Label(bridge.name, { offset: new BMap.Size(20, -10) });  
        marker.setLabel(label);  
    });  


    if (earthquakedata.length != 0) {
        for (let i = 0; i < earthquakedata.length; i++) {
            var pointlon = earthquakedata[i].long;
            var pointlat = earthquakedata[i].lat;
            var mark = new BMap.Marker(new BMap.Point(pointlon, pointlat));
            map.addOverlay(mark);
            mark.addEventListener("click", function () {
                $("#disasterModal").modal("show");
                document.getElementById("diaster_time").innerHTML = earthquakedata[i].time;
                document.getElementById("diaster_lat").innerHTML = earthquakedata[i].lat;
                document.getElementById("diaster_long").innerHTML = earthquakedata[i].long;
                document.getElementById("diaster_deep").innerHTML = earthquakedata[i].deep + "千米";
                document.getElementById("diaster_grade").innerHTML = earthquakedata[i].grade;
                document.getElementById("diaster_district").innerHTML = earthquakedata[i].distract;
            });
        }
    }
    $('#earthquaketable').bootstrapTable('destroy');
    $("#earthquaketable").bootstrapTable({
        data: earthquakedata,
        columns: [
            {
                field: 'grade',
                title: "震级(M)"
            },
            {
                field: 'time',
                title: "发震时刻(UTC+8)"
            },
            {
                field: 'lat',
                title: "纬度(°)"
            },
            {
                field: 'long',
                title: "经度(°)"
            },
            {
                field: 'deep',
                title: "深度(千米)"
            },
            {
                field: 'distract',
                title: "参考位置",
            }
        ]
    })
}

function jumptopdflist() {
    document.getElementById("pdflist").style.display = "block";
    document.getElementById("showpdf").style.display = "none";
}

function getExportFile(obj) {
    var zip_name = $(obj).html();
    window.open(wz[5] + '/?file=' + zip_name);
}