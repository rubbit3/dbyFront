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

    // 如果 myChart 尚未初始化，则初始化它
    if (!myChart) {
        myChart = echarts.init(container);
    }

    // 准备数据
    const xAxisData = data.map(item => item.formattedStartTime);
    const seriesData = data.map(item => item.Value);
    const channelNames = data.map(item => item.channel_name);
    const units = data.map(item => item.Unit);

    // 配置图表选项
    const option = {
        title: {
            // text: '数据图'
            text: channelNames[0]
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
        //工具箱组件
        toolbox: {
            feature: {
                restore: {}, // 还原
                saveAsImage: {}, // 保存为图片
                dataView: {
                    readOnly: false // 允许编辑数据
                },
                magicType: {
                    type: ['line', 'bar'] // 切换图表类型
                },
                dataZoom: {} // 缩放
            }
        },
        
        
        xAxis: {
            name: "时间(s)",
            nameLocation: "center",
            type: 'category',
            nameGap: 30,
            splitLine: {
                show: false,
                rotate: 30,
            },
            data: xAxisData,
        },
        yAxis: {
            name: "幅值（"+units[0]+")",
            nameLocation: 'center',
            type: 'value',
            nameGap: 30,
            scale: true
        },
        series: [{
            name: channelNames[0] || '通道', // 使用第一个通道名称作为系列名称
            type: 'line',
            data: seriesData,
            smooth: true // 平滑曲线
        }],
        // 添加 dataZoom 组件
        dataZoom: [
            {
                type: 'slider', // 使用滑动条
                xAxisIndex: [0], // 绑定到 x 轴
                start: 0, // 起始百分比
                end: 100, // 结束百分比
                handleSize: 8, // 手柄大小
                textStyle: {
                    color: '#fff' // 文字颜色
                },
                borderColor: '#999' // 边框颜色
            },
            {
                type: 'inside', // 内部缩放
                xAxisIndex: [0], // 绑定到 x 轴
                start: 0,
                end: 100
            }
        ]
    };

    // 使用新数据更新图表
    myChart.setOption(option, true); // 第二个参数为 true 表示不合并
}

// 监听窗口大小变化
window.onresize = function () {
    if (myChart) {
        myChart.resize();
    }
};

// document.getElementById('query-button').addEventListener('click', function () {
//     const channelSelect = document.getElementById('channel-select');
   

//     const selectedChannel = channelSelect.value;

//     let startTime = document.getElementById('startTime').value;
//     let endTime = document.getElementById('endTime').value;
//     console.log(startTime, endTime);

//     if (!startTime || !endTime) {
//         alert('开始时间和结束时间不能为空');
//         return;
//     }
//     startTime = Math.floor(new Date(startTime).getTime() / 1000);
//     endTime = Math.floor(new Date(endTime).getTime() / 1000);

//     // 调用发起请求的函数
//     sendRequest(selectedChannel, startTime, endTime);
// });

// function sendRequest(channelId, startTime, endTime) {
//     const data = {
//         id: channelId,
//         startTime: startTime,
//         endTime: endTime
//     };

//     // 发起 AJAX 请求
//     $.ajax({
//         type: "POST", // 根据需要选择请求类型
//         url: "http://10.62.213.53:9000/weiyi/get", // 替换为实际的 API 地址
//         contentType: "application/json;charset=utf-8",
//         dataType: "json",
//         data: JSON.stringify(data),
//         success: function (response) {
//             // 处理返回的数据
//             console.log('查询结果:', response);
//             // 在这里处理返回的数据
//             generateChart(response.data)
//         },
//         error: function (res) {
//             console.error('请求错误:', res);
//         }
//     });
// }

// let myChart; // 在外部声明 myChart

// function generateChart(data) {
//     const container = document.getElementById('chart-container');
//     container.innerHTML = ''; // 清空容器

//     // // 创建 ECharts 实例
//     // const myChart = echarts.init(container);

//      // 如果 myChart 尚未初始化，则初始化它
//      if (!myChart) {
//         myChart = echarts.init(container);
//     }

//     // 准备数据
//     const xAxisData = data.map(item => item.formattedStartTime);
//     const seriesData = data.map(item => item.Value);
//     const channelNames = data.map(item => item.channel_name);
//     const units = data.map(item => item.Unit);

//     // 配置图表选项
//     const option = {
//         title: {
//             text: '数据图'
//         },
//         tooltip: {
//             trigger: 'axis',
//             formatter: function (params) {
//                 const param = params[0];
//                 return `${param.name}<br/>${param.seriesName}: ${param.value} ${units[param.dataIndex]}`;
//             }
//         },
//         xAxis: {
//             type: 'category',
//             data: xAxisData,
//             name: '时间'
//         },
//         yAxis: {
//             type: 'value',
//             name: '值'
//         },
//         series: [{
//             name: channelNames[0] || '通道', // 使用第一个通道名称作为系列名称
//             type: 'line', // 可以根据需要选择 'line', 'bar', 等等
//             data: seriesData,
//             smooth: true // 平滑曲线
//         }]
//     };

//     // 使用刚指定的配置项和数据显示图表
//     myChart.setOption(option);
// }





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
