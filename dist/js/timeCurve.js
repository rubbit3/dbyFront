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

// 全局变量
let myCharts = []; // 存储所有的echarts实例
let chartIntervals = []; // 存储所有的定时器ID
let channelColors = {};

$(function () {
    initTree();
    getChannelList();
    platformname();
})

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

//打开、关闭右侧栏
function changenav1() {
    $("#panel2").css("right", "0");
}

function closestation() {
    $("#panel2").css("right", "-230px");
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
            zTreeObj = $.fn.zTree.init($("#relationTree3"), setting, zNodes);
            zTreeObj.expandAll(true);
        },
        error: function (res) {
            console.log("错误:" + res);
        }
    });
}

//默认通道列表，根据通道列表，生成echart的div
//1.获取通道列表
//2.如果大于6，显示前6个，其余的隐藏
//3.如果小于6，全部显示
// 获取通道列表并生成图表
function getChannelList() {
    $.ajax({
        url: wz[14] + "?ID_project=" + projectID,
        success: function (msg) {
            $('#chart-container').empty();
            myCharts = [];
            for (var i = 0; i < Math.min(msg.data.length, 6); i++) {
                createChart(i, msg.data[i],msg.data[i].channel_name);
            }
        },
        error: function (res) {
            console.log("错误:" + res);
        }
    });
}

// 创建单个图表
function createChart(index, channel,channel_name) {
    let timedata = []; // 初始化为空数组
    let y_data = [];   // 初始化为空数组

    for (let i = 0; i < 5000; i++) {
        timedata.push('');
        y_data.push(null);
    }

    let formattedTimestamp = Math.floor(new Date().getTime() / 1000);
    console.log("formattedTimestamp", formattedTimestamp);
    $('#chart-container').append('<div class="col-xl-6 grid-margin stretch-card"><div class="card"><div class="card-body"><div class="flot-chart-wrapper"><div class="flot-chart" id="chart-' + index + '"></div></div></div></div></div>');
    var chartDom = document.getElementById('chart-' + index);
    if (chartDom) {
        var myChart = echarts.init(chartDom);
        myCharts[index] = myChart;

        // 在此处调用getChannelData，并在获取数据后更新图表
        getChannelData(projectID, channel.id, formattedTimestamp, function (dataXzhou, dataYzhou, unit) {
            for (let i = 0; i < dataXzhou.length; i++) {
                timedata.push(dataXzhou[i]);
                y_data.push(dataYzhou[i]);

                // 如果数据点已经达到5000个，则移除最早的数据点  
                if (timedata.length > 5000) {
                    timedata.shift();
                    y_data.shift();
                }
            }

            var option = createChartOption(channel.id, timedata, y_data, unit,channel_name);
            myChart.setOption(option);

            // 设置定时器更新数据
            var intervalId = setInterval(function () {
                var currentTime = Math.floor(new Date().getTime() / 1000);
                getChannelData(projectID, channel.id, currentTime, function (dataXzhou, dataYzhou, unit) {
                    for (let i = 0; i < dataXzhou.length; i++) {
                        timedata.push(dataXzhou[i]);
                        y_data.push(dataYzhou[i]);

                        // 如果数据点已经达到5000个，则移除最早的数据点  
                        if (timedata.length > 5000) {
                            timedata.shift();
                            y_data.shift();
                        }
                    }
                    myChart.setOption(option);
                    window.addEventListener("resize", function () {
                        myChart.resize();
                    });
                });
            }, 3000);

            chartIntervals.push(intervalId);
        });
    }
}


// 生成图表的配置选项
function createChartOption(channelId, dataXzhou, dataYzhou, unit,channel_name) {
    let color = channelColors[channelId] || (channelColors[channelId] = getRandomColor());
    console.log(channelColors)
    console.log(channel_name)
    //生成随机颜色
    function getRandomColor() {
        var letters = '0123456789ABCDEF';  
        var color = '#';  
        for (var i = 0; i < 6; i++) {  
            color += letters[Math.floor(Math.random() * 16)];  
        }  
        return color;  
    }

    return {
        title: {
            // text: channel_name+"("+unit+")",
            text: channel_name,

        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {  
                return params[0].name + '<br/>' +  
                       channel_name + ' (' + unit + '): ' +  
                       params[0].value;  
            }  
        },

        //工具箱组件
        toolbox: {
            feature: {
                // restore: {}, // 还原
                saveAsImage: {}, // 保存为图片
                // dataView: {
                //     readOnly: false // 允许编辑数据
                // },
                magicType: {
                    type: ['line', 'bar'] // 切换图表类型
                },
                // dataZoom: {} // 缩放
            }
        },
        // dataZoom: [{
        //     type: 'slider',
        //     show: true,
        //     start: 50,
        //     end: 100,
        //     bottom: 35,
        // }, {
        //     type: "inside",
        // }],
        grid: {
            show: true,
            borderWidth: 0,
            left: 25,
            bottom: 35,
            right: 20,
            containLabel: true
        },
        calculable: false,
        xAxis: [{
            type: "time",
            name: "时间(s)",
            nameLocation: "center",
            nameTextStyle: {
                color: "#000000",
                fontSize: 14,
            },
            nameGap: 30,
            color: "#000000",
            type: "category",
            splitLine: {
                lineStyle: {
                    width: 0,
                    type: "solid",
                },
            },
            axisLabel: {
                textStyle: {
                    color: "#000000",
                    fontSize: 10,
                },
            },
            boundaryGap: false,
            data: dataXzhou,
        }],
        yAxis: [{
            name: '幅值('+unit+')',
            nameLocation: 'center',
            nameTextStyle: {
                color: "#000000",
                fontSize: 14,
            },
            nameGap: 40,
            type: "value",
            axisLabel: {
                formatter: function (value) {
                    return value.toFixed(3); // 保持小数点后4位
                },
                textStyle: {
                    color: "#000",
                    fontSize: 10,
                },
            },
            splitLine: {
                show: false,
                lineStyle: {
                    width: 0.5,
                    type: "solid",
                },
            },
            scale: true,
        }],
        series: [{
            type: "line",
            symbol: "none",
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 0.8,
                        color: color, 
                    },
                },
            },
            data: dataYzhou,
        }],
    };
}

// 获取通道数据
function getChannelData(ID_project, id, checkTime, callback) {
    $.ajax({
        type: "POST",
        url: wz[21],
        data: {
            ID_project: ID_project,
            id: id,
            checkTime: checkTime
        },
        success: function (msg) {
            let dataYzhou = [];
            let dataXzhou = [];
            let timeStampMs = []
            let unit = '';
            if (msg.data.length !== 0) {
                for (var i = 0; i < msg.data.length; i++) {
                    for (var n = 0; n < msg.data[i].realData.length; n++) {
                        dataYzhou.push(msg.data[i].realData[n]);
                    }
                    console.log(msg.data)
                    const startTimeMs = msg.data[i].StartTime;
                    console.log(startTimeMs)
                    // const startTimeMs = response.data[i].StartTime * 1000; // 假设StartTime是以秒为单位的  
                    // 遍历realData数组，为每个数据点计算时间戳和构建ECharts数据格式  
                    for (let j = 0; j < msg.data[i].realData.length; j++) {
                        const intervalMs = 1000 / msg.data[i].SampleRate;
                        const timeStampMs = startTimeMs + j * intervalMs;
                        // 转换为年月日时分秒毫秒格式的时间字符串
                        const date = new Date(timeStampMs);
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        const hours = date.getHours().toString().padStart(2, '0');
                        const minutes = date.getMinutes().toString().padStart(2, '0');
                        const seconds = date.getSeconds().toString().padStart(2, '0');
                        const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
                        const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

                        dataXzhou.push(formattedTime);
                    }
                    unit = msg.data[i].Unit;
                }
                if (typeof callback === 'function') {
                    callback(dataXzhou, dataYzhou, unit);
                }
            }
        },
        error: function (res) {
            console.log("错误:" + res);
        }
    });
}

// 选择新的设备
function confirmstation() {
    let obj = document.getElementById("panel2");
    obj.style.right = "-230px";
    if ($('#relationPanel3').is(":visible")) {
        $('#relationPanel3').hide();
    } else {
        $('#relationPanel3').show();
    }
    nodes = zTreeObj.getCheckedNodes(true);
    clearChartIntervals(); // 清除旧定时器
    $('#chart-container').empty();
    myCharts = []; // 清空之前的echarts实例数组
    for (var i = 0; i < nodes.length; i++) {
        createChart(i, nodes[i],nodes[i].name,nodes[i].Unit);
    }
}

// 清除所有图表的定时器
function clearChartIntervals() {
    chartIntervals.forEach(function (intervalId) {
        clearInterval(intervalId);
    });
    chartIntervals = [];
}

