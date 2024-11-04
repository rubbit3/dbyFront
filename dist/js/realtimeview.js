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