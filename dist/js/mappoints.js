$(function () {
  var str = "";
  var url = window.location.href;
  var obj = {};
  console.log(url);
  if (url.charAt(url.length - 1) == "#") {
    url = url.substring(0, url.length - 1);
  }
  console.log(url.split("?")[1]);
  console.log(url.split("?")[1].split("&"));
  str = url.split("?")[1].split("&");
  console.log(str)
  for (let i = 0; i < str.length; i++) {
    let a = str[i].split('='); // 小1
    obj[a[0]] = a[1];  // 小2
    console.log(obj);
  }
  mappointsname = obj.name;
  mappointcity = obj.city;
  mappointscity = mappointcity;
  var userole = $.cookie('userrole');
  console.log(userole)
  if (userole == 'u') {
    document.getElementById("showap").style.display = "none";
    // document.getElementById("deletepart").style.display = "none";
  } else {
    document.getElementById("showap").style.display = "block";
    // document.getElementById("deletepart").style.display = "block";
  }
  document.getElementById("mappage").text = mappointsname;
  var weather = document.getElementById("weather");
  if (mappointcity == "%E5%8C%97%E4%BA%AC") {
    document.getElementById("mapcityname").innerHTML = "北京市监测建筑物";
    document.getElementById("mapcitytitle").innerHTML = "北京市监测建筑物";
    document.getElementById("cityweather").src = "https://i.tianqi.com?py=beijing&c=code&id=72&color=%23FFFFFF&icon=1&site=14"
  }
  if (mappointcity == "%E5%A4%A9%E6%B4%A5") {
    document.getElementById("mapcityname").innerHTML = "天津市监测建筑物";
    document.getElementById("mapcitytitle").innerHTML = "天津市监测建筑物";
    document.getElementById("cityweather").src = "https://i.tianqi.com?py=tianjin&c=code&id=72&color=%23FFFFFF&icon=1&site=14"

  }
  if (mappointcity == "%E5%94%90%E5%B1%B1") {
    document.getElementById("mapcityname").innerHTML = "唐山市监测建筑物";
    document.getElementById("mapcitytitle").innerHTML = "唐山市监测建筑物";
    document.getElementById("cityweather").src = "https://i.tianqi.com?py=tangshan&c=code&id=72&color=%23FFFFFF&icon=1&site=14"

  }
  if (mappointcity == "%E5%BA%B7%E5%AE%9A") {
    document.getElementById("mapcityname").innerHTML = "康定市监测建筑物";
    document.getElementById("mapcitytitle").innerHTML = "康定市监测建筑物";
    document.getElementById("cityweather").src = "https://i.tianqi.com?py=kangding&c=code&id=72&color=%23FFFFFF&icon=1&site=14"

  }
  if (mappointcity == "%E8%A5%BF%E6%98%8C") {
    document.getElementById("mapcityname").innerHTML = "西昌市监测建筑物";
    document.getElementById("mapcitytitle").innerHTML = "西昌市监测建筑物";
    document.getElementById("cityweather").src = "https://i.tianqi.com?py=xichang&c=code&id=72&color=%23FFFFFF&icon=1&site=14"

  }
  if (mappointcity == "%E5%A4%A7%E7%90%86") {
    document.getElementById("mapcityname").innerHTML = "大理市监测建筑物";
    document.getElementById("mapcitytitle").innerHTML = "大理市监测建筑物";
    document.getElementById("cityweather").src = "https://i.tianqi.com?py=dali1&c=code&id=72&color=%23FFFFFF&icon=1&site=14"

  }
  if (mappointcity == "%E6%98%86%E6%98%8E") {
    document.getElementById("mapcityname").innerHTML = "昆明市监测建筑物";
    document.getElementById("mapcitytitle").innerHTML = "昆明市监测建筑物";
    document.getElementById("cityweather").src = "https://i.tianqi.com?py=kunming&c=code&id=72&color=%23FFFFFF&icon=1&site=14"

  }
  if (mappointcity == "%E6%B7%B1%E5%9C%B3") {
    document.getElementById("mapcityname").innerHTML = "深圳市监测建筑物";
    document.getElementById("mapcitytitle").innerHTML = "深圳市监测建筑物";
    document.getElementById("cityweather").src = "https://i.tianqi.com?py=shenzhen&c=code&id=72&color=%23FFFFFF&icon=1&site=14"

  }
  if (mappointcity == "%E6%B2%B3%E6%BA%90") {
    document.getElementById("mapcityname").innerHTML = "河源市监测建筑物";
    document.getElementById("mapcitytitle").innerHTML = "河源市监测建筑物";
    document.getElementById("cityweather").src = "https://i.tianqi.com?py=heyuan&c=code&id=72&color=%23FFFFFF&icon=1&site=14"

  }
  initMap();
  platformname();
});

//获取平台名称
function platformname() {
  var platname = "";
  $.ajax({
    type: "GET",
    url: wz[33],
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    data: '',
    jsonp: 'callback',
    success: function (msg) {
      platname = msg.name;
      document.getElementById("platername").innerHTML = platname;
    },
    error: function () {
      alert("错误");
    }
  });
}


var Ids = [];
var tokenname = $.cookie('token');
var project = [];
var partproject = [];
var mappointscity = "";

var url = window.location.href;
str = url.split("?")[1];
hrefcity = str.split("&")[1];
hrefname = str.split("&")[2];


function func1() {
  if (mappointscity == "%E5%8C%97%E4%BA%AC") {
    mappointscity = "北京";
  }
  if (mappointscity == "%E5%A4%A9%E6%B4%A5") {
    mappointscity = "天津";

  }
  if (mappointscity == "%E5%94%90%E5%B1%B1") {
    mappointscity = "唐山";

  }
  if (mappointscity == "%E5%BA%B7%E5%AE%9A") {
    mappointscity = "康定";

  }
  if (mappointscity == "%E8%A5%BF%E6%98%8C") {
    mappointscity = "西昌";

  }
  if (mappointscity == "%E5%A4%A7%E7%90%86") {
    mappointscity = "大理";

  }
  if (mappointscity == "%E6%98%86%E6%98%8E") {
    mappointscity = "昆明";

  }
  if (mappointscity == "%E6%B7%B1%E5%9C%B3") {
    mappointscity = "深圳";

  }
  if (mappointscity == "%E6%B2%B3%E6%BA%90") {
    mappointscity = "河源";

  }
  console.log(mappointscity);
}


function FindSubProject(x) {
  if (x == "Admin") {
    $.ajax({
      type: 'get',
      url: wz[10] + tokenname,
      async: false,
      dataType: "json",
      success: function (res) {
        project = res["data"];
        console.log(project);
        upgradeproject = [];
        for (i = 0; i < project.length; i++) {
          upgradeproject[i] = {};
          upgradeproject[i].name = project[i].name;
          upgradeproject[i].id = project[i].id;
          upgradeproject[i].city = project[i].city.split("+")[0];
          upgradeproject[i].address = project[i].city.split("+")[1];
          upgradeproject[i].lng = project[i].location.split(",")[0];
          upgradeproject[i].lat = project[i].location.split(",")[1];
        }
        console.log(upgradeproject);
        if (mappointcity == "%E5%8C%97%E4%BA%AC") {
          partproject = filterByName(upgradeproject, '北京');
        }
        if (mappointcity == "%E5%A4%A9%E6%B4%A5") {
          partproject = filterByName(upgradeproject, '天津');
        }
        if (mappointcity == "%E5%94%90%E5%B1%B1") {
          partproject = filterByName(upgradeproject, '唐山');
        }
        if (mappointcity == "%E5%BA%B7%E5%AE%9A") {
          partproject = filterByName(upgradeproject, '康定');
        }
        if (mappointcity == "%E8%A5%BF%E6%98%8C") {
          partproject = filterByName(upgradeproject, '西昌');
        }
        if (mappointcity == "%E5%A4%A7%E7%90%86") {
          partproject = filterByName(upgradeproject, '大理');
        }
        if (mappointcity == "%E6%98%86%E6%98%8E") {
          partproject = filterByName(upgradeproject, '昆明');
        }
        if (mappointcity == "%E6%B7%B1%E5%9C%B3") {
          partproject = filterByName(upgradeproject, '深圳');
        }
        if (mappointcity == "%E6%B2%B3%E6%BA%90") {
          partproject = filterByName(upgradeproject, '河源');
        }
        refreshProjectTable(partproject);
        console.log(partproject);
      },
      error: function (res) {
        console.log(res);
      }
    });
  } else {
    $.ajax({
      type: 'GET',
      url: wz[10] + tokenname,
      async: false,
      dataType: "json",
      success: function (res) {
        project = res["data"];
        console.log(project);
        upgradeproject = [];
        for (i = 0; i < project.length; i++) {
          upgradeproject[i] = {};
          upgradeproject[i].name = project[i].name;
          upgradeproject[i].id = project[i].id;
          upgradeproject[i].city = project[i].city.split("+")[0];
          upgradeproject[i].address = project[i].city.split("+")[1];
          upgradeproject[i].lng = project[i].location.split(",")[0];
          upgradeproject[i].lat = project[i].location.split(",")[1];
        }
        console.log(upgradeproject);
        if (mappointcity == "%E5%8C%97%E4%BA%AC") {
          partproject = filterByName(upgradeproject, '北京');
        }
        if (mappointcity == "%E5%A4%A9%E6%B4%A5") {
          partproject = filterByName(upgradeproject, '天津');
        }
        if (mappointcity == "%E5%94%90%E5%B1%B1") {
          partproject = filterByName(upgradeproject, '唐山');
        }
        if (mappointcity == "%E5%BA%B7%E5%AE%9A") {
          partproject = filterByName(upgradeproject, '康定');
        }
        if (mappointcity == "%E8%A5%BF%E6%98%8C") {
          partproject = filterByName(upgradeproject, '西昌');
        }
        if (mappointcity == "%E5%A4%A7%E7%90%86") {
          partproject = filterByName(upgradeproject, '大理');
        }
        if (mappointcity == "%E6%98%86%E6%98%8E") {
          partproject = filterByName(upgradeproject, '昆明');
        }
        if (mappointcity == "%E6%B7%B1%E5%9C%B3") {
          partproject = filterByName(upgradeproject, '深圳');
        }
        if (mappointcity == "%E6%B2%B3%E6%BA%90") {
          partproject = filterByName(upgradeproject, '河源');
        }
        refreshProjectTable(partproject);
        console.log(partproject);
      },
      error: function (res) {
        console.log(res);
      }
    });
  }
}

function filterproject() {
  console.log(partproject);
}

function filterByName(aim, city) {
  return aim.filter(item => item.city == city)
}

function jumpalarm(data) {
  func1();
  window.location.href = "pages/SafeWarn/DataWarn.html?building=" + data + "&" + str;
}



function deleteproject(data) {
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
        url: wz[10],
        dataType: "json",
        data: {
          "id": data,
          "token": tokenname
        },
        beforeSend: function () {
          console.log(data);
          console.log(tokenname);
        },
        success: function (res) {
          console.log(res);
          $("#dg_projects").empty();
          console.log(mappointsname);
          FindSubProject(mappointsname);
          // refreshProjectTable(partproject);
        },
        error: function (res) {
          console.log(res);
        }
      });
      // window.location.href = "../../../login.html?" + hrefcity + "&" + hrefname;
    }
  })


  // if (confirm('确定删除吗？')) {
  //   $.ajax({
  //     type: 'DELETE',
  //     url: wz[10],
  //     dataType: "json",
  //     data: {
  //       "id": data,
  //       "token": tokenname
  //     },
  //     beforeSend: function () {
  //       console.log(data);
  //       console.log(tokenname);
  //     },
  //     success: function (res) {
  //       console.log(res);
  //       $("#dg_projects").empty();
  //       console.log(mappointsname);
  //       FindSubProject(mappointsname);
  //       // refreshProjectTable(partproject);
  //     },
  //     error: function (res) {
  //       console.log(res);
  //     }
  //   });
  // }
}

function refreshProjectTable(data) {
  // $("#dg_projects").append($("<br>"))
  // for (i in data) {
  //   $("#dg_projects").append($("<li style='list-style: none;'>" + "<span style='margin-left: 20px;cursor: pointer;color: white;white-space:pre-wrap'>" + "<a onclick = setpar(" + JSON.stringify(data[i].id) + ");>" + (Number(i) + 1) + "、 " + data[i].name + "</a></span>" +
  //     "<span id='dddd' style='cursor: pointer;'><i class='fa fa-map-marker'style='color: white;margin-left: 1rem;' onclick=test(" + JSON.stringify(data[i].lng) + "," + JSON.stringify(data[i].lat) + ")></i></span>"
  //     + "<span style='cursor: pointer;''><i class='fa fa-bell'style='color: rgb(5, 163, 89);margin-left: 1rem;'onclick=jumpalarm(" + JSON.stringify(data[i].id) + ");></i></span>"
  //     + "<span style='cursor: pointer;''><i class='fa fa-trash' style='color: red;margin-left: 1rem;' onclick=deleteproject(" + JSON.stringify(data[i].id) + ");></i></span>" + "</li>"));
  // }
  let userole = $.cookie('userrole');
  console.log(userole);
  if (userole == 'u') {
    for (i in data) {
      $("#dg_projects").append($("<tr VALIGN=TOP>" + "<td VALIGN=TOP>" + (Number(i) + 1) + "、" + "</td>" + "<td><a style='cursor: pointer;' onclick = setpar(" + JSON.stringify(data[i].id) + ");>" + data[i].name + "</a><td></tr>" +
        "<tr><td></td><td><span id='dddd' style='cursor: pointer;'><i class='fa fa-map-marker'style='color: white;margin-left: 1rem;' onclick=test(" + JSON.stringify(data[i].lng) + "," + JSON.stringify(data[i].lat) + ")></i></span>" +
        "<span style='cursor: pointer;'><i class='fa fa-bell' style='color: green;margin-left: 1rem; 'onclick=jumpalarm(" + JSON.stringify(data[i].id) + ");></i></span>" +
        "</td></tr> "
        // +
        //   "<span id='dddd' style='cursor: pointer;'><i class='fa fa-map-marker'style='color: white;margin-left: 1rem;' onclick=test(" + JSON.stringify(data[i].lng) + "," + JSON.stringify(data[i].lat) + ")></i></span>"
        //   + "<span style='cursor: pointer;''><i class='fa fa-bell'style='color: rgb(5, 163, 89);margin-left: 1rem;'onclick=jumpalarm(" + JSON.stringify(data[i].id) + ");></i></span>"
        //   + "<span style='cursor: pointer;''><i class='fa fa-trash' style='color: red;margin-left: 1rem;' onclick=deleteproject(" + JSON.stringify(data[i].id) + ");></i></span>" + "</li>"
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
        // +
        //   "<span id='dddd' style='cursor: pointer;'><i class='fa fa-map-marker'style='color: white;margin-left: 1rem;' onclick=test(" + JSON.stringify(data[i].lng) + "," + JSON.stringify(data[i].lat) + ")></i></span>"
        //   + "<span style='cursor: pointer;''><i class='fa fa-bell'style='color: rgb(5, 163, 89);margin-left: 1rem;'onclick=jumpalarm(" + JSON.stringify(data[i].id) + ");></i></span>"
        //   + "<span style='cursor: pointer;''><i class='fa fa-trash' style='color: red;margin-left: 1rem;' onclick=deleteproject(" + JSON.stringify(data[i].id) + ");></i></span>" + "</li>"
      ));
    }
  }
}


function test(x, y) {
  map.centerAndZoom(new BMap.Point(x, y), 17);
}


function setpar(res) {
  var url = window.location.href;
  str = url.split("?")[1];
  console.log(str);
  console.log(res);
  console.log(url);
  window.location.href = "dashboard.html?" + "building=" + res + "&" + str;
  // window.location.href = "pages/charts/flot.html?" + "building=" + res + "&" + str;
}

function fanhui() {
  var url = window.location.href;
  str = url.split("?")[1];
  ssss = str.split("&")[1];
  console.log(ssss);
  window.location.href = "index.html?" + ssss;
}

function aproject() {
  var url = window.location.href;
  str = url.split("?")[1];
  console.log(str);
  window.location.href = "pages/examples/addProject.html?" + str;
}

var mappointcity = "";
var mappointsname = "";



function addpoints(x, y, location) {
  var myIcon = new BMap.Icon("img/position.png", new BMap.Size(28, 28));
  var SensorPoint = new BMap.Point(x, y);
  var marker = new BMap.Marker(SensorPoint, {
    icon: myIcon,
  });
  marker.imei = "传感器初始点";

  var label = new BMap.Label(location, {
    offset: new BMap.Size(17, -17),
  });
  label.setStyle({
    border: "1px solid #FF6A00",
    borderRadius: "5px",
    padding: "3px 57px 3px 7px",
    color: "#333",
    // backgroundColor: "White",
    width: "90px",
    // length: "90px",
  });
  marker.setLabel(label);
  marker.addEventListener("click", function () {
    window.location.href = "pages/charts/flot.html?" + "building=中震大厦&code=2";
  });
  map.addOverlay(marker);
}

var map;
var map2;
var mark = [];
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

var jumpmark = function (obj) {
  return function (evt) {
    console.log(evt, obj);
    var url = window.location.href;
    str = url.split("?")[1];
    console.log(str);
    // console.log(res);
    console.log(url);
    window.location.href = "dashboard.html?" + "building=" + obj.id + "&" + str;
    // window.location.href = "dashboard.html?" + str + "&building=" + obj.id;
    // window.location.href = "pages/charts/flot.html?" + "building=" + obj.id;
    // var lng = obj.lng;
    // var lat = obj.lat;
    // alert(obj.id + "  ,  " + lng + "  , " + lat);
  }
}

function initMap() {
  console.log(mappointsname);
  FindSubProject(mappointsname);
  // 百度地图API功能
  map = new BMap.Map("world-map"); // 创建Map实例
  var map2 = new BMap.Map("world-map2"); //设置卫星图为底图

  console.log(mappointcity);
  if (mappointcity == "%E5%8C%97%E4%BA%AC") {
    map.centerAndZoom(new BMap.Point(116.411794, 39.9068), 10); // 初始化地图,设置中心点坐标和地图级别
    map2.centerAndZoom(new BMap.Point(116.411794, 39.9068), 10); // 初始化地图,设置中心点坐标和地图级别
  }
  if (mappointcity == "%E5%A4%A9%E6%B4%A5") {
    map.centerAndZoom(new BMap.Point(117.200983, 39.084158), 10); // 初始化地图,设置中心点坐标和地图级别
    map2.centerAndZoom(new BMap.Point(117.200983, 39.084158), 10); // 初始化地图,设置中心点坐标和地图级别
  }
  if (mappointcity == "%E5%94%90%E5%B1%B1") {
    map.centerAndZoom(new BMap.Point(118.176114, 39.645031), 10); // 初始化地图,设置中心点坐标和地图级别
    map2.centerAndZoom(new BMap.Point(118.176114, 39.645031), 10); // 初始化地图,设置中心点坐标和地图级别
  }
  if (mappointcity == "%E5%BA%B7%E5%AE%9A") {
    map.centerAndZoom(new BMap.Point(101.959535, 30.063438), 10); // 初始化地图,设置中心点坐标和地图级别
    map2.centerAndZoom(new BMap.Point(101.959535, 30.063438), 10); // 初始化地图,设置中心点坐标和地图级别
  }
  if (mappointcity == "%E8%A5%BF%E6%98%8C") {
    map.centerAndZoom(new BMap.Point(102.227211, 27.916414), 11); // 初始化地图,设置中心点坐标和地图级别
    map2.centerAndZoom(new BMap.Point(102.227211, 27.916414), 11); // 初始化地图,设置中心点坐标和地图级别
  }
  if (mappointcity == "%E5%A4%A7%E7%90%86") {
    map.centerAndZoom(new BMap.Point(100.260354, 25.723681), 11); // 初始化地图,设置中心点坐标和地图级别
    map2.centerAndZoom(new BMap.Point(100.260354, 25.723681), 11); // 初始化地图,设置中心点坐标和地图级别
  }
  if (mappointcity == "%E6%98%86%E6%98%8E") {
    map.centerAndZoom(new BMap.Point(102.845767, 24.886272), 10); // 初始化
    map2.centerAndZoom(new BMap.Point(102.845767, 24.886272), 10); // 初始化
  }
  if (mappointcity == "%E6%B7%B1%E5%9C%B3") {
    map.centerAndZoom(new BMap.Point(114.057868, 22.543099), 11); // 初始化
    map2.centerAndZoom(new BMap.Point(114.057868, 22.543099), 11); // 初始化
  }
  if (mappointcity == "%E6%B2%B3%E6%BA%90") {
    map.centerAndZoom(new BMap.Point(114.704567, 23.753919), 10); // 初始化
    map2.centerAndZoom(new BMap.Point(114.704567, 23.753919), 10); // 初始化
  }
  //添加地图类型控件
  var size1 = new BMap.Size(10, 50);
  map.addControl(
    new BMap.MapTypeControl({
      offset: size1,
      mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
    })
  );
  map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

  //加载城市控件
  var size = new BMap.Size(10, 50);
  map.addControl(
    new BMap.CityListControl({
      anchor: BMAP_ANCHOR_TOP_LEFT,
      offset: size,
    })
  );

  //描绘红色图层
  var bdary = new BMap.Boundary();
  if (mappointcity == "%E5%8C%97%E4%BA%AC") {
    filterproject();
    bdary.get("北京市", function (rs) {
      var count = rs.boundaries.length;
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {
          strokeWeight: 3,
          strokeColor: "#0080FF",
          fillColor: "#F8F8FF",
          fillOpacity: 0.2,
        }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
      }
    });
    getInfo();

  }
  if (mappointcity == "%E5%A4%A9%E6%B4%A5") {
    bdary.get("天津市", function (rs) {
      //获取行政区域
      //用Polygon方法接口把得到的边界点循环绘制，
      //strokeWeight
      var count = rs.boundaries.length;
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {
          strokeWeight: 3,
          strokeColor: "#0080FF",
          fillColor: "#F8F8FF",
          fillOpacity: 0.2,
        }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
      }
    });
    getInfo();
  }
  if (mappointcity == "%E5%94%90%E5%B1%B1") {
    bdary.get("唐山市", function (rs) {
      //获取行政区域
      //用Polygon方法接口把得到的边界点循环绘制，
      //strokeWeight
      var count = rs.boundaries.length;
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {
          strokeWeight: 3,
          strokeColor: "#0080FF",
          fillColor: "#F8F8FF",
          fillOpacity: 0.2,
        }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
      }
    });
    getInfo();
  }
  if (mappointcity == "%E5%BA%B7%E5%AE%9A") {
    bdary.get("康定市", function (rs) {
      //获取行政区域
      //用Polygon方法接口把得到的边界点循环绘制，
      //strokeWeight
      var count = rs.boundaries.length;
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {
          strokeWeight: 3,
          strokeColor: "#0080FF",
          fillColor: "#F8F8FF",
          fillOpacity: 0.2,
        }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
      }
    });
    getInfo();
  }
  if (mappointcity == "%E8%A5%BF%E6%98%8C") {
    bdary.get("西昌市", function (rs) {
      //获取行政区域
      //用Polygon方法接口把得到的边界点循环绘制，
      //strokeWeight
      var count = rs.boundaries.length;
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {
          strokeWeight: 3,
          strokeColor: "#0080FF",
          fillColor: "#F8F8FF",
          fillOpacity: 0.2,
        }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
      }
    });
    getInfo();
  }
  if (mappointcity == "%E5%A4%A7%E7%90%86") {
    bdary.get("大理市", function (rs) {
      //获取行政区域
      //用Polygon方法接口把得到的边界点循环绘制，
      //strokeWeight
      var count = rs.boundaries.length;
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {
          strokeWeight: 3,
          strokeColor: "#0080FF",
          fillColor: "#F8F8FF",
          fillOpacity: 0.2,
        }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
      }
    });
    getInfo();
  }
  if (mappointcity == "%E6%98%86%E6%98%8E") {
    bdary.get("昆明市", function (rs) {
      //获取行政区域
      //用Polygon方法接口把得到的边界点循环绘制，
      //strokeWeight
      var count = rs.boundaries.length;
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {
          strokeWeight: 3,
          strokeColor: "#0080FF",
          fillColor: "#F8F8FF",
          fillOpacity: 0.2,
        }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
      }
    });
    getInfo();
  }
  if (mappointcity == "%E6%B7%B1%E5%9C%B3") {
    bdary.get("深圳市", function (rs) {
      //获取行政区域
      //用Polygon方法接口把得到的边界点循环绘制，
      //strokeWeight
      var count = rs.boundaries.length;
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {
          strokeWeight: 3,
          strokeColor: "#0080FF",
          fillColor: "#F8F8FF",
          fillOpacity: 0.2,
        }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
      }
    });
    getInfo();
  }
  if (mappointcity == "%E6%B2%B3%E6%BA%90") {
    bdary.get("河源市", function (rs) {
      //获取行政区域
      //用Polygon方法接口把得到的边界点循环绘制，
      //strokeWeight
      var count = rs.boundaries.length;
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], {
          strokeWeight: 3,
          strokeColor: "#0080FF",
          fillColor: "#F8F8FF",
          fillOpacity: 0.2,
        }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
      }
    });
    getInfo();
  }
  map2.enableScrollWheelZoom();

  var localSearch = new BMap.LocalSearch(map2);

  var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
    {
      "input": "suggestCity"
      // "input": "suggestaddress"
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

  ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
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
  ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
    var _value = e.item.value;
    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
    G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
    setPlace();
  });

  function G(id) {
    return document.getElementById(id);
  }

  function setPlace() {
    map2.clearOverlays();    //清除地图上所有覆盖物
    function myFun() {
      var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
      map2.centerAndZoom(pp, 18);
      map2.addOverlay(new BMap.Marker(pp));    //添加标注
    }
    var local = new BMap.LocalSearch(map2, { //智能搜索
      onSearchComplete: myFun
    });
    local.search(myValue);
  }

  function searchByStationName() {
    map2.clearOverlays();//清空原来的标注
    var keyword = document.getElementById("address").value;
    localSearch.setSearchCompleteCallback(function (searchResult) {
      var poi = searchResult.getPoi(0);
      map2.centerAndZoom(poi.point, 16);
      var marker2 = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地方对应的经纬度
      map2.addOverlay(marker2);
      var content = document.getElementById("text_").value + "<br/><br/>经度：" + poi.point.lng + "<br/>纬度：" + poi.point.lat;
      var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
      marker2.addEventListener("click", function () { this.openInfoWindow(infoWindow); });
    });
    localSearch.search(keyword);
  }

  function theLocation() {
    if (document.getElementById("suggestLong").value != "" && document.getElementById("suggestLat").value != "") {
      map2.clearOverlays();
      var new_point = new BMap.Point(document.getElementById("suggestLong").value, document.getElementById("suggestLat").value);
      var marker2 = new BMap.Marker(new_point);  // 创建标注
      map2.addOverlay(marker2);              // 将标注添加到地图中
      map2.panTo(new_point);
    }
  }
  //中震大厦定位
  // var zhongzhen = document.getElementById("zhongzhen");
  // console.log(zhongzhen);
  // zhongzhen.onclick = function () {
  //   map2.centerAndZoom(new BMap.Point(114.153436, 22.551218), 17);
  // };




  /*  //天地图
  var map;
  var zoom = 5;
  map = new T.Map("world-map", {
    projection: "EPSG:4326",
  });
  // map.centerAndZoom(new T.LngLat(106.840549, 34.303369), zoom);
  map.centerAndZoom(new T.LngLat(107.840549, 25.303369), zoom);
 
  //创建图片对象
  var icon = new T.Icon({
    iconUrl: "img/position.png",
    iconSize: new T.Point(28, 28),
    iconAnchor: new T.Point(10, 25),
  });
  //向地图上添加自定义标注
  var marker2 = new T.Marker(new T.LngLat(116.411794, 39.9068), { icon: icon });
  var marker1 = new T.Marker(new T.LngLat(117.363803, 39.15769), {
    icon: icon,
  }); //天津
  var marker2 = new T.Marker(new T.LngLat(114.14185, 22.547843), {
    icon: icon,
  }); //深圳
  var marker3 = new T.Marker(new T.LngLat(102.845767, 24.886272), {
    icon: icon,
  }); //昆明
  var marker4 = new T.Marker(new T.LngLat(100.260354, 25.723681), {
    icon: icon,
  }); //大理
  var marker5 = new T.Marker(new T.LngLat(102.227211, 27.916414), {
    icon: icon,
  }); //西昌
  var marker6 = new T.Marker(new T.LngLat(101.959535, 30.063438), {
    icon: icon,
  }); //康定
  var marker7 = new T.Marker(new T.LngLat(118.176114, 39.645031), {
    icon: icon,
  }); //唐山
  var marker8 = new T.Marker(new T.LngLat(114.704567, 23.753919), {
    icon: icon,
  }); //河源
  map.addOverLay(marker);
  map.addOverLay(marker1);
  map.addOverLay(marker2);
  map.addOverLay(marker3);
  map.addOverLay(marker4);
  map.addOverLay(marker5);
  map.addOverLay(marker6);
  map.addOverLay(marker7);
  map.addOverLay(marker8);
  var markerInfoWin = new T.InfoWindow("北京");
  label = new T.Label({
    text: "<b>北京<b>",
    position: marker.getLngLat(),
    offset: new T.Point(3, -20),
  });
  label1 = new T.Label({
    text: "<b>天津<b>",
    position: marker1.getLngLat(),
    offset: new T.Point(3, -20),
  });
  label2 = new T.Label({
    text: "<b>深圳<b>",
    position: marker2.getLngLat(),
    offset: new T.Point(3, -20),
  });
  label3 = new T.Label({
    text: "<b>昆明<b>",
    position: marker3.getLngLat(),
    offset: new T.Point(3, -30),
  });
  label4 = new T.Label({
    text: "<b>大理<b>",
    position: marker4.getLngLat(),
    offset: new T.Point(3, -20),
  });
  label5 = new T.Label({
    text: "<b>西昌<b>",
    position: marker5.getLngLat(),
    offset: new T.Point(3, -20),
  });
  label6 = new T.Label({
    text: "<b>康定<b>",
    position: marker6.getLngLat(),
    offset: new T.Point(3, -20),
  });
  label7 = new T.Label({
    text: "<b>唐山<b>",
    position: marker7.getLngLat(),
    offset: new T.Point(3, -20),
  });
  label8 = new T.Label({
    text: "<b>河源<b>",
    position: marker8.getLngLat(),
    offset: new T.Point(3, -20),
  });
 
  map.addOverLay(label);
  map.addOverLay(label1);
  map.addOverLay(label2);
  map.addOverLay(label3);
  map.addOverLay(label4);
  map.addOverLay(label5);
  map.addOverLay(label6);
  map.addOverLay(label7);
  map.addOverLay(label8);
  marker.addEventListener("click", function () {
    map.centerAndZoom(new T.LngLat(116.411794, 39.9068), 14);
 
    // window.location.href = "pages/charts/flot.html";
  }); // 将标注添加到地图中
  marker1.addEventListener("click", function () {
    map.centerAndZoom(new T.LngLat(117.363803, 39.15769), 14);
    // window.location.href = "pages/charts/flot.html";
  });
  marker2.addEventListener("click", function () {
    map.centerAndZoom(new T.LngLat(114.14185, 22.547843), 14);
    // window.location.href = "pages/charts/flot.html";
  });
  marker3.addEventListener("click", function () {
    map.centerAndZoom(new T.LngLat(116.411794, 39.9068), 14);
    // window.location.href = "pages/charts/flot.html";
  });
  marker4.addEventListener("click", function () {
    map.centerAndZoom(new T.LngLat(116.411794, 39.9068), 14);
    // window.location.href = "pages/charts/flot.html";
  });
  marker5.addEventListener("click", function () {
    map.centerAndZoom(new T.LngLat(116.411794, 39.9068), 14);
    // window.location.href = "pages/charts/flot.html";
  });
  marker6.addEventListener("click", function () {
    map.centerAndZoom(new T.LngLat(116.411794, 39.9068), 14);
    // window.location.href = "pages/charts/flot.html";
  });
  marker7.addEventListener("click", function () {
    map.centerAndZoom(new T.LngLat(116.411794, 39.9068), 14);
    // window.location.href = "pages/charts/flot.html";
  });
  marker.addEventListener("click", function () {
    map.centerAndZoom(new T.LngLat(116.411794, 39.9068), 14);
    // window.location.href = "pages/charts/flot.html";
  });
 */
}

function AddProject() {
  func1();
  // $("#create").click(function () {
  let projectName = $("#newproject_name").val();
  let projectDesc = $("#newproject_Desc").val();
  console.log(projectName);
  // let projectDesc = editor.getPlainTxt();
  // let projectDesc = editor.getContentTxt();
  // let projectDesc = editor.getContent();
  // var myselect = document.getElementById("suggestaddress");
  // var index = myselect.selectedIndex;
  // var suggestcity = myselect.options[index].text;
  var suggestcity = mappointscity;
  console.log(suggestcity);
  let projectCity = suggestcity;
  projectCity += "+";
  projectCity += $("#suggestCity").val();
  let projectLocation = $("#suggestLong").val() + "," + $("#suggestLat").val();
  // let projectLocation = $("haha").val();
  let token = $.cookie('token');
  $.ajax({
    url: wz[10],
    type: "post",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      "name": projectName,
      "description": projectDesc,
      "city": projectCity,
      "location": projectLocation,
      "token": token
    }),
    success: function () {
      alert("项目创建成功");
      console.log(mappointsname);
      window.location.href = "mappoints.html?city=" + mappointcity + "&name=" + mappointsname;//跳转到login.html页面
      // FindSubProject(mappointsname);
      // window.history.back(-1);
      // console.log(projectLocation);
      // console.log(projectCity);
    },
    error: function (res) {//请求错误的回调函数，返回res
      console.log(res);
      alert("项目创建失败");
    }
  });
  // });
}

// function createProject() {
//   let projectName = $("#newproject_name").val();
//   let projectDesc = $("#building-description").val();
//   // let projectDesc = editor.getContent();
//   // var myselect = document.getElementById("suggestaddress");
//   // var index = myselect.selectedIndex;
//   // var suggestcity = myselect.options[index].text;
//   var suggestcity = mappointscity;
//   console.log(suggestcity);
//   let projectCity = suggestcity;
//   projectCity += "+";
//   projectCity += $("#suggestCity").val();
//   let projectLocation = $("#suggestLong").val() + "," + $("#suggestLat").val();
//   // let projectLocation = $("haha").val();
//   let token = $.cookie('token');
//   $.ajax({
//     url: wz[10],
//     type: "post",
//     contentType: "application/json",
//     dataType: "json",
//     data: JSON.stringify({
//       "name": projectName,
//       "description": projectDesc,
//       "city": projectCity,
//       "location": projectLocation,
//       "token": token
//     }),
//     success: function () {
//       alert("项目创建成功");
//       console.log(mappointsname);

//       // window.location.href = "../../mappoints.html";//跳转到login.html页面
//       FindSubProject(mappointsname);
//       window.history.back(-1);
//       console.log(projectLocation);
//       console.log(projectCity);
//     },
//     error: function (res) {//请求错误的回调函数，返回res
//       console.log(res);
//       alert("项目创建失败");
//     }
//   });
// }
// function sentpar() {
//   // alert("wwww");
//   // window.open("pages/charts/flot.html?"+"中震大厦");//这是另外打开窗口
//   window.location.href = "pages/charts/flot.html?" + "building=中震大厦&code=2";//这是在当前窗口进行跳转
//   // window.location.href="pages/charts/blankflot.html?";
// }


function jumptohome() {
  window.location.href = "index.html?name=" + mappointsname;
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
      window.location.href = "../login.html";
    }
  })
}
