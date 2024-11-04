document.getElementById('goToIndex').addEventListener('click', function(event) {  
    event.preventDefault(); 
    gotoIndex(); 
});  


function gotoProjectlist() {
    window.location.href = "projectlist.html?" + "name=" + username;
}

function gotoDashboard() {
    window.location.href = "dashboard.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

function gotoIndex() {
    window.location.href = "index.html?" + "&type=" + type + "&name=" + username;
}

//返回工程信息
function jumptoprojectconfig() {
    window.location.href = "projectconfig.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回设备管理
function jumptodevicemangment() {
    window.location.href = "devicemangment.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回测点管理
function jumptomeasurementpointmanagement(){
    window.location.href = "measurementpointmanagement.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回实时视图
function jumptorealtimeview(){
    window.location.href = "realtimeview.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回报警管理
function jumptoalarmmanagement(){
    window.location.href = "alarmmanagement.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回视频监控
function jumptovideomonitoring(){
    window.location.href = "VideoMonitor.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回频道管理
function jumptomanageChannels(){
    window.location.href = "manageChannels.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}