$(function () {
    platformname() 
    loaddatatable()
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

document.addEventListener('DOMContentLoaded', function () {
    // 页面加载时恢复滚动位置  
    var scrollPosition = localStorage.getItem('sidebarNavScrollPosition');
    if (scrollPosition) {
      document.getElementById('sidebarNav').scrollTop = parseInt(scrollPosition, 10);
    }
  });

window.addEventListener('beforeunload', function () {
    // 页面卸载前记录滚动位置  
    var scrollPosition = document.getElementById('sidebarNav').scrollTop;
    localStorage.setItem('sidebarNavScrollPosition', scrollPosition);
  });
