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
    // initTree();
    // getChannelList();
    platformname();
})

let myChart; // 在外部声明 myChart

document.getElementById('query-button').addEventListener('click', function () {
    const channelSelect = document.getElementById('channel-select');
    const selectedChannel = channelSelect.value;

    let startTime = document.getElementById('startTime').value;
    let endTime = document.getElementById('endTime').value;

    if (!startTime || !endTime) {
        alert('开始时间和结束时间不能为空');
        return;
    }
    startTime = Math.floor(new Date(startTime).getTime() / 1000);
    endTime = Math.floor(new Date(endTime).getTime() / 1000);

    // 调用发起请求的函数
    sendRequest(selectedChannel, startTime, endTime);
});

function sendRequest(channelId, startTime, endTime) {
    const data = {
        id: channelId,
        startTime: startTime,
        endTime: endTime
    };

    // 发起 AJAX 请求
    $.ajax({
        type: "POST",
        url: "http://10.62.213.53:9000/weiyi/get", // 替换为实际的 API 地址
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        success: function (response) {
            console.log('查询结果:', response);
            if (response.data && response.data.length > 0) {
                generateChart(response.data);
            } else {
                console.warn('没有可用的数据');
            }
        },
        error: function (res) {
            console.error('请求错误:', res);
        }
    });
}


function generateChart(data) {
    const container = document.getElementById('chart-container');
    console.log('更新图的数据是1')
    // 如果 myChart 尚未初始化，则初始化它
    if (!myChart) {
        myChart = echarts.init(container);
    }
    console.log('更新图的数据是2')



    // 准备数据
    const xAxisData = data.map(item => item.formattedStartTime);

    console.log('x轴的数据是', xAxisData)

    const seriesData = data.map(item => item.Value);
    console.log('y轴的数据是', seriesData)
    const channelNames = data.map(item => item.channel_name);
    const units = data.map(item => item.Unit);

    console.log('units is ', units[0])
    if (units[0] == '℃') {
        console.log('温度不需要减去均值')
        // 计算数据的最大值和最小值
        const maxDataValue = Math.max(...seriesData);
        const minDataValue = Math.min(...seriesData);

        // 计算 y 轴的范围，放大 20% 的范围
        const rangeBuffer = (maxDataValue - minDataValue) * 3;  // 20% 的 buffer
        const yAxisMin = parseFloat((minDataValue - rangeBuffer).toFixed(2));
        const yAxisMax = parseFloat((maxDataValue + rangeBuffer).toFixed(2));

        // 配置图表选项
        const option = {
            title: {
                text: channelNames[0] // 使用第一个通道名称作为标题
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    let formattedTooltip = '';
                    params.forEach(param => {
                        const formattedValue = `${param.seriesName}: ${param.value} ${units[param.dataIndex]}`;
                        formattedTooltip += `${param.name}<br/>${formattedValue}<br/>`;
                    });
                    return formattedTooltip;
                }
            },
            toolbox: {
                feature: {
                    restore: {},  // 还原
                    saveAsImage: {},  // 保存为图片
                    dataView: {
                        readOnly: false  // 允许编辑数据
                    },
                    magicType: {
                        type: ['line', 'bar', 'scatter']  // 切换图表类型为折线、柱状
                    },
                    dataZoom: {}  // 缩放
                }
            },
            xAxis: {
                name: "时间(s)",
                nameLocation: "center",
                type: 'category',
                nameGap: 30,
                splitLine: {
                    show: false
                },
                data: xAxisData
            },
            yAxis: {
                name: `幅值（${units[0]}）`,
                nameLocation: 'center',
                type: 'value',
                nameGap: 30,
                scale: true,
                min: yAxisMin,  // 动态计算的最小值
                max: yAxisMax   // 动态计算的最大值
            },
            series: [{
                name: channelNames[0],  // 使用第一个通道名称作为系列名称
                type: 'scatter', // 使用散点图
                data: seriesData
            }],
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100,
                    handleSize: 8,
                    textStyle: {
                        color: '#fff'  // 文字颜色
                    },
                    borderColor: '#999'  // 边框颜色
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                }
            ]
        };

        // 使用新数据更新图表
        myChart.setOption(option, true);  // 第二个参数为 true 表示不合并
    } else {

        // 测试
        console.log('y轴数据是',seriesData)
        // 计算均值
        const meanValue = seriesData.reduce((acc, current) => acc + current, 0) / seriesData.length;

        // 创建新数组，元素为原数组元素减去均值
        const newArray = seriesData.map(value => value - meanValue);



        // 计算数据的最大值和最小值
        const maxDataValue = Math.max(...newArray);
        const minDataValue = Math.min(...newArray);

        // 计算 y 轴的范围，放大 20% 的范围
        const rangeBuffer = (maxDataValue - minDataValue) * 0.1;  // 20% 的 buffer
        const yAxisMin = parseFloat((minDataValue - rangeBuffer).toFixed(2));
        const yAxisMax = parseFloat((maxDataValue + rangeBuffer).toFixed(2));

        // 配置图表选项
        const option = {
            title: {
                text: channelNames[0] // 使用第一个通道名称作为标题
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    let formattedTooltip = '';
                    params.forEach(param => {
                        const formattedValue = `${param.seriesName}: ${param.value} ${units[param.dataIndex]}`;
                        formattedTooltip += `${param.name}<br/>${formattedValue}<br/>`;
                    });
                    return formattedTooltip;
                }
            },
            toolbox: {
                feature: {
                    restore: {},  // 还原
                    saveAsImage: {},  // 保存为图片
                    dataView: {
                        readOnly: false  // 允许编辑数据
                    },
                    magicType: {
                        type: ['line', 'bar', 'scatter']  // 切换图表类型为折线、柱状
                    },
                    dataZoom: {}  // 缩放
                }
            },
            xAxis: {
                name: "时间(s)",
                nameLocation: "center",
                type: 'category',
                nameGap: 30,
                splitLine: {
                    show: false
                },
                data: xAxisData
            },
            yAxis: {
                name: `幅值（${units[0]}）`,
                nameLocation: 'center',
                type: 'value',
                nameGap: 30,
                scale: true,
                min: yAxisMin,  // 动态计算的最小值
                max: yAxisMax   // 动态计算的最大值
            },
            series: [{
                name: channelNames[0],  // 使用第一个通道名称作为系列名称
                type: 'scatter', // 使用散点图
                data: newArray,
                symbolSize: 10,
            }],
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100,
                    handleSize: 8,
                    textStyle: {
                        color: '#fff'  // 文字颜色
                    },
                    borderColor: '#999'  // 边框颜色
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                    start: 0,
                    end: 100
                }
            ]
        };
        // 使用新数据更新图表
        myChart.setOption(option, true);  // 第二个参数为 true 表示不合并
    }
}


// 监听窗口大小变化
window.onresize = function () {
    if (myChart) {
        myChart.resize();
    }
};







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
