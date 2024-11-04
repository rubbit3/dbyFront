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

$(function () {
    initTree();
    getChannelList();
})

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
                name: item.id,
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
                createChart(i, msg.data[i]);
            }
        },
        error: function (res) {
            console.log("错误:" + res);
        }
    });
}

// 创建单个图表
function createChart(index, channel) {
    let timedata = []; // 初始化为空数组
    let y_data = [];   // 初始化为空数组
    let formattedTimestamp = Math.floor(new Date().getTime() / 1000);
    console.log("formattedTimestamp", formattedTimestamp);
    $('#chart-container').append('<div class="col-xl-6 grid-margin stretch-card"><div class="card"><div class="card-body"><div class="flot-chart-wrapper"><div class="flot-chart" id="chart-' + index + '"></div></div></div></div></div>');
    var chartDom = document.getElementById('chart-' + index);
    if (chartDom) {
        var myChart = echarts.init(chartDom);
        myCharts[index] = myChart;

        // 在此处调用getChannelData，并在获取数据后更新图表
        getChannelData(projectID, channel.id, formattedTimestamp, function (dataXzhou, dataYzhou, unit) {
            // 直接赋值更新timedata和y_data
            timedata = dataXzhou;
            y_data = dataYzhou;
            console.log("X轴数据:", dataXzhou);  
            console.log("Y轴数据:", dataYzhou);
            var option = createChartOption(channel.id, timedata, y_data, unit);
            myChart.setOption(option);

            // 设置定时器更新数据
            var intervalId = setInterval(function () {
                var currentTime = Math.floor(new Date().getTime() / 1000);
                getChannelData(projectID, channel.id, currentTime, function (dataXzhou, dataYzhou, unit) {
                    updateChartData(myChart, option, dataXzhou, dataYzhou); 
                });
            }, 3000);

            chartIntervals.push(intervalId);
        });
    }
}

// 更新图表数据
function updateChartData(chart, option, newDataX, newDataY) {
    // 将新数据追加到已有数据末尾
    option.xAxis[0].data.push(...newDataX);
    option.series[0].data.push(...newDataY);
    
    // 控制显示的数据长度，假设显示最近10秒的数据
    const maxLength = 10 * 100; // 假设每秒100个数据点，显示最近10秒的数据
    if (option.xAxis[0].data.length > maxLength) {
        option.xAxis[0].data = option.xAxis[0].data.slice(-maxLength);
        option.series[0].data = option.series[0].data.slice(-maxLength);
    }

    chart.setOption(option);
}

// 生成图表的配置选项
function createChartOption(channelId, dataXzhou, dataYzhou, unit) {
    return {
        title: {
            text: '通道 ' + channelId
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var tooltipItem = params[0];
                var date = new Date(tooltipItem.name * 1000);
                return '时间：' + date.toLocaleString() + '<br />' + '幅值：' + tooltipItem.value;
            }
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
        calculable: false,
        xAxis: [{
            name: "时间",
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
                formatter: function (value) {
                    return new Date(value * 1000).toLocaleString();
                },
                textStyle: {
                    color: "#000000",
                    fontSize: 10,
                },
            },
            boundaryGap: false,
            data: dataXzhou,
        }],
        yAxis: [{
            name: unit,
            nameLocation: 'center',
            nameTextStyle: {
                color: "#000000",
                fontSize: 14,
            },
            nameGap: 60,
            type: "value",
            axisLabel: {
                formatter: function (value) {
                    return value.toExponential(3);
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
            let unit = '';
            if (msg.data.length !== 0) {
                for (var i = 0; i < msg.data.length; i++) {
                    for (var n = 0; n < msg.data[i].realData.length; n++) {
                        dataYzhou.push(msg.data[i].realData[n]);
                    }
                    dataXzhou = generateTimeDataForLast5Seconds(checkTime, msg.data[i].SampleRate);
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

// 生成时间数据
function generateTimeDataForLast5Seconds(now, sampleRate) {
    const durationInSeconds = 5;
    const points = sampleRate * durationInSeconds;
    const interval = 1000 / sampleRate;
    const startTime = now - (durationInSeconds * 1000);
    const timeData = [];

    for (let i = 0; i < points; i++) {
        const timestamp = startTime + (i * interval);
        timeData.push(timestamp);
    }

    return timeData;
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
        createChart(i, nodes[i]);
    }
}

// 清除所有图表的定时器
function clearChartIntervals() {
    chartIntervals.forEach(function (intervalId) {
        clearInterval(intervalId);
    });
    chartIntervals = [];
}

