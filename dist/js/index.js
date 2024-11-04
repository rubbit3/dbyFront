$(function () {
    var str = "";
    var url = window.location.href;
    var obj = {};
    if (url.charAt(url.length - 1) == "#") {
        url = url.substring(0, url.length - 1);
    }
    str = url.split("?")[1].split("&");
    for (let i = 0; i < str.length; i++) {
        let a = str[i].split('=');
        obj[a[0]] = a[1];
    }
    username = obj.name;
    type = obj.type;

    platformname();
    var userole = $.cookie('userrole');
    console.log(userole)
    if (userole == "s") {
        document.getElementById("usermanagement").style.visibility = "visible";
    }
    if (userole == "a") {
        document.getElementById("usermanagement").style.visibility = "hidden";
    }
    if (userole == 'u') {
        document.getElementById("usermanagement").style.visibility = "hidden";
    }

    var typeToText = {
        "1": "风机",
        "2": "油气管道",
        // "3": "海湾港口",
        "3": "桥梁",
        "4": "隧道",
        "5": "桥梁",
        "6": "建筑",
        "7": "输电塔",
        "8": "边坡基坑",
        "9": "水库大坝"
    };

    if (typeToText.hasOwnProperty(type)) {
        document.getElementById("typename").innerHTML = typeToText[type];
        document.getElementById("typename-page-content").innerHTML = typeToText[type] + "位置分布图";
    } else {
        document.getElementById("typename").innerHTML = "未知";
        document.getElementById("typename-page-content").innerHTML = "未知";
    }
    FindSubProject(type);
    initMap();
});

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

var partproject = [];

function initMap() {
    map = new BMap.Map("world-map");
    var map2 = new BMap.Map("world-map2");
    map.centerAndZoom(new BMap.Point(103.823557, 36.058039), 7);
    map2.centerAndZoom(new BMap.Point(103.823557, 36.058039), 7);

    var size1 = new BMap.Size(10, 50);
    map.addControl(
        new BMap.MapTypeControl({
            offset: size1,
            mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
        })
    );
    map.enableScrollWheelZoom(true);
    var size = new BMap.Size(10, 50);
    map.addControl(
        new BMap.CityListControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            offset: size,
        })
    );

    map2.enableScrollWheelZoom();
    var localSearch = new BMap.LocalSearch(map2);
    var ac = new BMap.Autocomplete(
        {
            "input": "suggestCity"
            , "location": map2
        });
    $("#suggestCity").blur(function () {
        map2.clearOverlays();//清空原来的标注
        var keyword = document.getElementById("suggestCity").value;
        localSearch.setSearchCompleteCallback(function (searchResult) {
            var poi = searchResult.getPoi(0);
            document.getElementById("suggestLong").value = poi.point.lng;
            document.getElementById("suggestLat").value = poi.point.lat;
            map2.centerAndZoom(poi.point, 13);
            var marker2 = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地方对应的经纬度
            map2.addOverlay(marker2);
        });
        localSearch.search(keyword);
    })
    var bridges = [  
        // { name: "庄浪河大桥", lng: 103.1100, lat: 37.0222, number: 3.8 },  
        // { name: "清水北大桥", lng: 98.7203, lat: 39.5917, number: 3.6 }, 
        // { name: "嘉峪关桥", lng: 98.5115, lat: 39.7077, number: 4.5 }, 
        // { name: "疏勒河桥", lng: 96.5851, lat: 40.5439, number: 4.5 },
        // { name: "张掖南大桥", lng: 100.5760, lat: 38.8239, number: 2.8 },
        // { name: "临泽桥", lng: 100.1390, lat: 39.1202, number: 2.5 }, 
        // { name: "八盘峡大桥", lng: 103.356283, lat: 36.113009, number: 3.2 } 
    ];

    bridges.forEach(function(bridge) {  
        var point = new BMap.Point(bridge.lng, bridge.lat);  
        var marker = new BMap.Marker(point);  
        map.addOverlay(marker);  
        var label = new BMap.Label(bridge.name, { offset: new BMap.Size(20, -10) });  
        marker.setLabel(label);  
    });  


    ac.addEventListener("onhighlight", function (e) {
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });

    var myValue;
    ac.addEventListener("onconfirm", function (e) {
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        setPlace();
    });

    function G(id) {
        return document.getElementById(id);
    }

    function setPlace() {
        map2.clearOverlays();
        function myFun() {
            var pp = local.getResults().getPoi(0).point;
            map2.centerAndZoom(pp, 18);
            map2.addOverlay(new BMap.Marker(pp));
        }
        var local = new BMap.LocalSearch(map2, {
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

    getInfo();
}

function getInfo() {
    var point = new Array(); //存放标注点经纬信息的数组
    var marker = new Array(); //存放标注点对象的数组
    for (var i = 0; i < partproject.length; i++) {
        var lng = partproject[i].lng;
        var lat = partproject[i].lat;
        // var rentStr = partproject[i].title;
        point[i] = new window.BMap.Point(lng, lat); //循环生成新的地图点
        marker[i] = new window.BMap.Marker(point[i]);
        map.addOverlay(marker[i]);
        var label = new window.BMap.Label(partproject[i].name, { offset: new window.BMap.Size(17, -17) });
        label.setStyle({
            border: "1px solid #FF6A00",
            borderRadius: "5px",
            color: "#333",
            width: "auto",
            "height": "auto",
            "max-width": "none",
        });
        marker[i].setLabel(label);
        marker[i].addEventListener("click", jumpmark(partproject[i]));
    }
}

function generateUUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function AddProject() {
    let projectName = $("#newproject_name").val();
    let projectDesc = $("#newproject_Desc").val();
    let projectLocation = $("#suggestLong").val() + "," + $("#suggestLat").val();
    let token = $.cookie('token');
    let projectID = generateUUIDv4();
    $.ajax({
        url: wz[2],
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "ID_project": projectID,
            "type": type,
            "name": projectName,
            "description": projectDesc,
            "location": projectLocation,
            "token": token
        }),
        success: function () {
            alert("项目创建成功");
            $("#dg_projects").empty();
            $('#exampleModal').modal('hide');
            FindSubProject(type);
            initMap();
        },
        error: function (res) {
            console.log(res);
            alert("项目创建失败");
        }
    });
}

function jumptohome() {
    window.location.href = "projectlist.html?name=" + username;
}

function logout() {
    Swal.fire({
        title: '请问您是否要退出系统?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '确认登出',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "./login.html";
        }
    })
}

function FindSubProject(type) {
    $.ajax({
        type: 'get',
        url: wz[3] + username,
        async: false,
        dataType: "json",
        success: function (res) {
            upgradeproject = [];
            for (i = 0; i < res.data.length; i++) {
                upgradeproject[i] = {};
                upgradeproject[i].name = res.data[i].name;
                upgradeproject[i].id = res.data[i].id;
                upgradeproject[i].type = res.data[i].type;
                upgradeproject[i].lng = res.data[i].location.split(",")[0];
                upgradeproject[i].lat = res.data[i].location.split(",")[1];
            }
            if (type == "1") {
                partproject = filterByName(upgradeproject, '1');
            }
            if (type == "2") {
                partproject = filterByName(upgradeproject, '2');
            }
            if (type == "3") {
                partproject = filterByName(upgradeproject, '3');
            }
            if (type == "4") {
                partproject = filterByName(upgradeproject, '4');
            }
            if (type == "5") {
                partproject = filterByName(upgradeproject, '5');
            }
            if (type == "6") {
                partproject = filterByName(upgradeproject, '6');
            }
            if (type == "7") {
                partproject = filterByName(upgradeproject, '7');
            }
            if (type == "8") {
                partproject = filterByName(upgradeproject, '8');
            }
            if (type == "9") {
                partproject = filterByName(upgradeproject, '9');
            }
            refreshProjectTable(partproject);
        },
        error: function (res) {
            console.log(res);
        }
    });
}

function filterByName(aim, type) {
    return aim.filter(item => item.type == type)
}

function jumpalarm(data) {
    alert("该功能暂未开放")
    // window.location.href = "pages/SafeWarn/DataWarn.html?building=" + data + "&" + str;
}

function deleteproject(data) {
    let token = $.cookie('token');
    Swal.fire({
        title: '请问您是否要删除该建筑物?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'DELETE',
                url: wz[4],
                dataType: "json",
                data: {
                    "ID_project": data,
                    "token": token
                },
                success: function (res) {
                    $("#dg_projects").empty();
                    FindSubProject(type);
                },
                error: function (res) {
                    console.log(res);
                }
            });
            // window.location.href = "../../../login.html?" + hrefcity + "&" + hrefname;
        }
    })

}

function refreshProjectTable(data) {
    let userole = $.cookie('userrole');
    if (userole == 'u') {
        for (i in data) {
            $("#dg_projects").append($("<tr VALIGN=TOP>" + "<td VALIGN=TOP>" + (Number(i) + 1) + "、" + "</td>" + "<td><a style='cursor: pointer;' onclick = setpar(" + JSON.stringify(data[i].id) + ");>" + data[i].name + "</a><td></tr>" +
                "<tr><td></td><td><span id='dddd' style='cursor: pointer;'><i class='fa fa-map-marker'style='color: white;margin-left: 1rem;' onclick=test(" + JSON.stringify(data[i].lng) + "," + JSON.stringify(data[i].lat) + ")></i></span>" +
                "<span style='cursor: pointer;'><i class='fa fa-bell' style='color: green;margin-left: 1rem; 'onclick=jumpalarm(" + JSON.stringify(data[i].id) + ");></i></span>" +
                "</td></tr> "
            ));
        }
    }
    if (userole != 'u') {
        for (i in data) {
            $("#dg_projects").append($("<tr VALIGN=TOP>" + "<td VALIGN=TOP>" + (Number(i) + 1) + "、" + "</td>" + "<td><a style='cursor: pointer;' onclick = setpar(" + JSON.stringify(data[i].id) + ");>" + data[i].name + "</a><td></tr>" +
                "<tr><td></td><td><span id='dddd' style='cursor: pointer;'><i class='fa fa-map-marker'style='color: white;margin-left: 1rem;' onclick=test(" + JSON.stringify(data[i].lng) + "," + JSON.stringify(data[i].lat) + ")></i></span>" +
                "<span style='cursor: pointer;'><i class='fa fa-bell' style='color: green;margin-left: 1rem; 'onclick=jumpalarm(" + JSON.stringify(data[i].id) + ");></i></span>" +
                "<span id='deletepart' style ='cursor: pointer;'><i class='fa fa-trash'  style='color: red;margin-left: 1rem; ' onclick=deleteproject(" + JSON.stringify(data[i].id) + ");></i></span>" +
                + "</td></tr> "
            ));
        }
    }
}

function test(x, y) {
    map.centerAndZoom(new BMap.Point(x, y), 17);
}

var jumpmark = function (obj) {
    return function (evt) {
        var url = window.location.href;
        str = url.split("?")[1];
        window.location.href = "dashboard.html?" + "building=" + obj.id + "&" + str;
    }
}

function setpar(res) {
    var url = window.location.href;
    str = url.split("?")[1];
    window.location.href = "dashboard.html?" + "building=" + res + "&" + str;
}
