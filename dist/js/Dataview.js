$(function () {
    initTree();
    timerange();
    platformname();
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

function changenav4() {
    var obj = document.getElementById("panel4");
    obj.style.right = "0";
}

function closestation() {
    var obj = document.getElementById("panel4");
    obj.style.right = "-230px";
}

//时间间隔选择
var Begin = "";
var End = "";
var newbegin = '';
var newend = '';
function timerange() {
    var start = moment().subtract(29, 'days');
    console.log(start)
    var end = moment();
    function cb(start, end) {
        $('#daterange-btn span').html('开始时间：' + start.format('YYYY-MM-DD HH:mm:ss:SSS') + ' - 结束时间：' + end.format('YYYY-MM-DD HH:mm:ss:SSS'));
        console.log(start.format('YYYY-MM-DD HH:mm:ss:SSS') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss:SSS'));
        Begin = start.format('YYYYMMDDHHmmss');
        End = end.format('YYYYMMDDHHmmss');
        newbegin = timeToTimestamp(start.format('YYYY-MM-DD HH:mm:ss:SSS'));
        newend = timeToTimestamp(end.format('YYYY-MM-DD HH:mm:ss:SSS'))
    }

    $('#daterange-btn').daterangepicker({
        "showDropdowns": true,
        "timePicker": true,
        "timePickerSeconds": true,
        "autoApply": true,
        "timePicker24Hour": true,
        "linkedCalendars": false,
        "autoUpdateInput": true,
        "alwaysShowCalendars": true,
        "locale": {
            "format": 'YYYY-MM-DD HH:mm:ss:SSS',
            "separator": " - ",
            "applyLabel": "确定",
            "cancelLabel": "取消",
            "fromLabel": "起始时间",
            "toLabel": "结束时间'",
            "showCustomRangeLabel": true,
            "customRangeLabel": "自定义",
            "alwaysShowCalendars": true,
            "weekLabel": "W",
            "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
            "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            "firstDay": 1
        },
        ranges: {
            '今日': [moment().startOf('day'), moment()],
            '昨日': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
            '最近7日': [moment().subtract(6, 'days').startOf('day'), moment()],
            '最近30日': [moment().subtract(29, 'days').startOf('day'), moment()],
            '本月': [moment().startOf('month'), moment().endOf('month')],
            '上月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        "minDate": "YYYY-MM-DD HH:mm:ss:SSS",
        "maxDate": "YYYY-MM-DD HH:mm:ss:SSS",
        "opens": "right"
    }, cb);
    cb(start, end);
}

function timestampToTime(timestamp) {
    // console.log(typeof timestamp)
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds() + ':';
    var sm = date.getMilliseconds();
    return Y + M + D + h + m + s + sm;
}

function timeToTimestamp(time) {
    let timestamp = Date.parse(new Date(time).toString());
    timestamp = timestamp / 1000; //时间戳为13位需除1000，时间戳为13位的话不需除1000
    console.log(time + "的时间戳为：" + timestamp);
    return timestamp;
}

var start = '';
var end = '';
var echartsDataAll = [];
function ViewData() {
    console.log(newbegin);
    console.log(newend);
    console.log(nodes);

    // 计算时间差  
    var timeDiff = newend - newbegin;
    console.log(timeDiff)

    // 将时间差转换为小时  
    var diffHours = timeDiff / 3600;

    console.log(diffHours)

    // 检查时间差是否超过1小时  
    if (diffHours > 2) {
        alert("选择的时间段不能大于一小时，请重新选择！");
        return; 
    }

    showLoadingOverlay();

    var myChart = echarts.init(document.getElementById('dataview'));

    const promises = nodes.map(node => {
        return fetchDataForNode(projectID, node.id, newbegin, newend);
    });

    Promise.all(promises).then(results => {
        let seriesData = results.map((result, index) => ({
            name: result[0].name, // 假设每个结果数组的第一个元素包含name  
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: result.map(item => [Number(item.time), Number(item.value)]) // 注意这里直接生成 [time, value] 数组  
        }));
        var option = {
            tooltip: {//鼠标放在点上显示数据
                trigger: 'axis',//显示该列下所有坐标轴所对应的数据
            },
            legend: {
                name: "sss"
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                start: 50,
                end: 100,
                bottom: 35,
            }, {
                type: "inside",
            }],
            grid: {
                show: true,
                borderWidth: 0,
                left: 25,
                bottom: 35,
                right: 20,
                containLabel: true
            },
            xAxis: {
                name: "时间(s)",
                nameLocation: "center",
                type: 'time',
                nameGap: 30,
                splitLine: {
                    show: false,
                    rotate: 30,
                },
            },
            yAxis: {
                name: "幅值(cm/s^2)",
                nameLocation: 'center',
                type: 'value',
                nameGap: 30,
                scale: true
            },
            series: seriesData
        };
        // 使用配置项和数据显示图表  
        myChart.setOption(option, true); // 注意：setOption 的第二个参数通常不是必需的，除非您有特定需求  

        // 监听窗口大小变化，自适应图表大小  
        window.addEventListener("resize", function () {
            myChart.resize();
        });
        hideLoadingOverlay();  
    }).catch(error => {
        console.error("加载数据失败:", error);
        hideLoadingOverlay();  
    });
}


function showLoadingOverlay() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.innerHTML = '<span>加载中...</span>';
    document.body.appendChild(loadingOverlay);
}

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        document.body.removeChild(loadingOverlay);
    }
}

function updateSelectedSensors(nodes) {
    const selectedSensorList = document.getElementById('selectedSensorList');
    selectedSensorList.innerHTML = ''; // 清空现有列表  
    nodes.forEach(node => {
        const li = document.createElement('li');
        li.textContent = node.name;
        selectedSensorList.appendChild(li);
    });
}

//请求数据，生成传感器列表
var zTreeObj;
var zNodes = [];
var params = "";
var setting = {
    view: {
        dblClickExpand: false,  //双击节点时，是否自动展开父节点的标识
        showLine: true,         //设置ztree是否显示节点之间的连线
        selectedMulti: false,   //设置是否允许同时选中多个节点
    },
    check: {
        enable: true            //设置ztree的节点是否显示checkbox/radio
    },
    data: {
        simpleData: {
            enable: true,        //是否使用简单数据模式
            idKey: "id",        //节点数据中保存唯一标识的属性名称
            pIdKey: "pId",     //节点数据中保存其父节点唯一标识的属性名称
            rootPId: 0         //用于修正根节点父节点的数据，即pIdKey指定的属性值
        }
    }
};

function initTree() {
    $.ajax({
        url: wz[14] + "?ID_project=" + projectID,
        success: function (msg) {
            zNodes = msg.data.map(item => ({
                name: item.channel_name,
                id: item.id,
                idname: item.id,
                pId: 0,
            }));
            zTreeObj = $.fn.zTree.init($("#relationTree2"), setting, zNodes);
            zTreeObj.expandAll(true);
        },
        error: function (res) {
            console.log("错误:" + res);
        }
    });
}

//选择查看的station
$("#addBtn2").on("click", function SelectDevice() {
    var obj = document.getElementById("panel4");
    obj.style.right = "-230px";
    nodes = zTreeObj.getCheckedNodes(true);
    updateSelectedSensors(nodes);
    console.log(nodes)
})


function fetchDataForNode(projectID, nodes, newbegin, newend) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: wz[22],
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                "ID_project": projectID,
                "id": nodes,
                "startTime": newbegin,
                "endTime": newend
            }),
            success: function (response) {
                console.log(response);
                console.log(response.data);
                let echartsData = [];
                // 遍历response.data，为每个数据序列构建ECharts数据格式，并添加到option中  
                for (let i = 0; i < response.data.length; i++) {
                    console.log(response.data.length)
                    const startTimeMs = response.data[i].StartTime;
                    // 为了减半显示数据，我们可以只处理索引为偶数的数据点  
                    for (let j = 0; j < response.data[i].realData.length; j += 3) { // 注意这里的 j += 2  
                        console.log(response.data[i].realData.length)
                        const intervalMs = 1000 / response.data[i].SampleRate;
                        const timeStampMs = startTimeMs + j * intervalMs;

                        echartsData.push({
                            name: response.data[i].channel_name + "-" + response.data[i].dir + "(" + response.data[i].Unit+ ")",
                            time: timeStampMs,
                            value: response.data[i].realData[j]
                        });
                    }

                    // const startTimeMs = response.data[i].StartTime * 1000; // 假设StartTime是以秒为单位的  
                    // 遍历realData数组，为每个数据点计算时间戳和构建ECharts数据格式  
                    // for (let j = 0; j < response.data[i].realData.length; j++) {
                    //     const intervalMs = 1000 / response.data[i].SampleRate;
                    //     const timeStampMs = startTimeMs + j * intervalMs;

                    //     echartsData.push({
                    //         name: response.data[i].channel_name,
                    //         time: timeStampMs, // 使用time作为x轴数据  
                    //         value: response.data[i].realData[j] // 使用realData中的值作为y轴数据  
                    //     });
                    // }
                }
                console.log(echartsData)
                resolve(echartsData);
            },
            error: function (xhr, status, error) {
                console.error("AJAX请求失败: ", status, error);
            }
        });
    });

}


function jumptopdflist() {
    document.getElementById("pdflist").style.display = "block";
    document.getElementById("showpdf").style.display = "none";
}

function getExportFile(obj) {
    var zip_name = $(obj).html();
    window.open(wz[5] + '/?file=' + zip_name);
}