$(function () {
    loadProjInfo();
    owl_localpicture();
    platformname();
    // var userole = $.cookie('userrole');
    // document.getElementById("dashpage").text = mappointsname;
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
var type = obj.type
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

//获取建筑物名称、建筑物概述
function loadProjInfo() {
    $.ajax({
        type: 'get',
        url: wz[3] + username,
        dataType: "json",
        beforeSend: function () {
            console.log(wz[3] + username)
        },
        success: function (res) {
            console.log(res.data);
            for (var i = 0; i < res["data"].length; i++) {
                console.log(res["data"][i]);
                if (res["data"][i].id == building) {
                    subproject = res["data"][i];
                    subproject.lng = subproject.location.split(",")[0];
                    subproject.lat = subproject.location.split(",")[1];
                }
            }
            document.getElementById("nameInfo").innerHTML = subproject.name;
            document.getElementById("buidingInfo").innerHTML = subproject.description;
        },
        error: function (res) {
            console.log(res);
        }
    });
}

//获取项目图片
function owl_localpicture() {  
    $.ajax({  
        type: 'GET',  
        url: wz[6] + projectID,  
        dataType: "json",  
        beforeSend: function () {  
            console.log(projectID);  
        },  
        success: function (res) {  
            console.log(res.data);  
            $("#imgInfo").append("<div id='testing' class='owl-carousel owl-theme owl-fadeout'></div>");  
            var carouselContent = '';  
            for (var i = 0; i < res['data'].length; i++) {  
                carouselContent += "<div class='item'><h7>" + res['data'][i].name + "</h7><br><img src='http://10.62.213.53:9000" + res['data'][i].file + "' alt='item-image'></div>";  
            }  
            console.log(carouselContent);
            $("#testing").html(carouselContent);  
  
            $("#testing").owlCarousel({  
                items: 1,  
                loop: true,  
                margin: 10,  
                autoplay: true,  
                autoplayTimeout: 2000,  
                autoplayHoverPause: true  
            });  
        },  
        error: function (res) {  
            console.log(res);  
        }  
    });  
}