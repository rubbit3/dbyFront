$(function () {
    platformname();
    // 然后获取新的accessToken并初始化player  
    fetchAccessToken().then(accessToken => {
        initializePlayer(accessToken);
    }).catch(error => {
        console.error("初始化失败:", error);
    });
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

async function fetchAccessToken() {
    try {
        const response = await $.ajax({
            type: "GET",
            url: wz[25]+'?ID_project='+projectID, 
            dataType: "json"
        });
        console.log(response.data[0].accessToken)
        console.log(response.data[0].accessToken)
        return response.data[0].accessToken; 

    } catch (error) {
        console.error("获取accessToken失败:", error);
        throw new Error("无法获取accessToken");
    }
}

// 初始化EZUIKitPlayer的函数，它接受一个accessToken作为参数  
async function initializePlayer(accessToken) {  
    var playr = new EZUIKit.EZUIKitPlayer({
        id: 'video-container', // 视频容器ID
        accessToken: accessToken,
        url: 'ezopen://wang1515@open.ys7.com/FE7336855/1.live',
        template: 'simple', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
        autoplay: true,
        // 视频上方头部控件
        header: ['capturePicture', 'save', 'zoom'],            // 如果templete参数不为simple,该字段将被覆盖
        // 视频下方底部控件
        footer: ['talk', 'broadcast', 'hd', 'fullScreen'],      // 如果template参数不为simple,该字段将被覆盖
        // audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
        // plugin: ['talk'],                       // 加载插件，talk-对讲
        // controls: true, //['play','voice','hd','fullScreen'], // 视频控制相关控件，如果template参数不为simple,该字段将被覆盖
        openSoundCallBack: (data) => console.log("开启声音回调", data),
        closeSoundCallBack: (data) => console.log("关闭声音回调", data),
        startSaveCallBack: (data) => console.log("开始录像回调", data),
        stopSaveCallBack: (data) => console.log("录像回调", data),
        capturePictureCallBack: (data) => console.log("截图成功回调", data),
        fullScreenCallBack: (data) => console.log("全屏回调", data),
        getOSDTimeCallBack: (data) => console.log("获取OSDTime回调", data),
        handleSuccess: (data) = function () { console.log("播放成功回调", data) },
        handleError: (data) => console.log("播放失败回调", data),
        handleTalkSuccess: () => console.log("对讲成功回掉"),
        handleTalkError: (data) = function () { console.log("对讲失败", data) },
        width: 375,
        height: 400,
    });
    function play() {
        var playPromise = playr.play();
        playPromise.then((data) => {
            console.log("promise 获取 数据", data)
        })
    }
    function stop() {
        var stopPromise = playr.stop();
        stopPromise.then((data) => {
            console.log("promise 获取 数据", data)
        })
    }
    function getOSDTime() {
        var getOSDTimePromise = playr.getOSDTime();
        getOSDTimePromise.then((data) => {
            console.log("promise 获取 数据", data)
        })
    }
    function getOSDTime2() {
        var getOSDTimePromise = playr2.getOSDTime();
        getOSDTimePromise.then((data) => {
            console.log("promise 获取 数据", data)
        })
    }
    function capturePicture() {
        var capturePicturePromise = playr.capturePicture();
        capturePicturePromise.then((data) => {
            console.log("promise 获取 数据", data)
        })
    }
    function openSound() {
        var openSoundPromise = playr.openSound();
        openSoundPromise.then((data) => {
            console.log("promise 获取 数据", data)
        })
    }
    function closeSound() {
        var closeSoundPromise = playr.closeSound();
        closeSoundPromise.then((data) => {
            console.log("promise 获取 数据", data)
        })
    }
    function startSave() {
        var startSavePromise = playr.startSave();
        startSavePromise.then((data) => {
            console.log("promise 获取 数据", data)
        })
    }
    function stopSave() {
        var stopSavePromise = playr.stopSave();
        stopSavePromise.then((data) => {
            console.log("promise 获取 数据", data)
        })
    }
}

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



