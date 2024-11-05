$(function () {
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
// var building = 'd36a4445-6882-45d4-beca-baabd2120940';
// console.log('bulid is ',building)
console.log('url is ',url)


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


function updateInputs() {
    const algorithm = document.getElementById('algorithm').value;
    const order = document.getElementById('order');
    const channel = document.getElementById('channel');

    if (algorithm === '小波包能量') {
        order.disabled = false;
        channel.disabled = false;
    } else {
        order.disabled = true;
        channel.disabled = true;
    }
}

async function fetchData() {
    const category = document.getElementById('category').value;
    const algorithm = document.getElementById('algorithm').value;
    const order = document.getElementById('order').value;
    const channel = document.getElementById('channel').value;
    let startTime = document.getElementById('startTime').value;
    let endTime = document.getElementById('endTime').value;
    console.log(startTime, endTime);

    if (!startTime || !endTime) {
        alert('开始时间和结束时间不能为空');
        return;
    }
    startTime = Math.floor(new Date(startTime).getTime() / 1000);
    endTime = Math.floor(new Date(endTime).getTime() / 1000);

    const url = new URL('http://10.62.213.53:9000/result/get');
    url.searchParams.append('result', category);
    // url.searchParams.append('startTime', 1721194422);
    // url.searchParams.append('endTime', 1721267442);
    url.searchParams.append('startTime', startTime);
    url.searchParams.append('endTime', endTime);
    console.log(url)

    $.ajax({
        type: "POST",
        url: wz[46],
        data: {
            result: category,
            startTime: startTime,
            endTime: endTime
        },
        beforeSend: function () {
            console.log(JSON.stringify({
                result: category,
                startTime: startTime,
                endTime: endTime
            }))
            console.log(wz[46])
        },
        success: function (msg) {
            console.log(msg)
            displayCharts(algorithm, msg.data, channel, order, msg.firstTimestamp, msg.lastTimestamp);
        },
        error: function (res) {
            console.log("错误: " + res.statusText);
        }
    });


    // fetch(url, {  
    //     method: 'POST',  
    //     headers: {  
    //         'Content-Type': 'application/json' // 注意：对于GET请求，Content-Type通常不是必需的  
    //     }  
    // })  
    // .then(response => {  
    //     // 检查响应是否成功  
    //     if (!response.ok) {  
    //         throw new Error(`HTTP error! status: ${response.status}`);  
    //     }  

    //     // 解析JSON  
    //     return response.json();  
    // })  
    // .then(result => {  
    //     // 检查数据是否存在  
    //     if (!result || !result.data) {  
    //         throw new Error('No data found in the response');  
    //     }  

    //     // 处理数据  
    //     const data = result.data;  
    //     console.log(data);
    //     displayCharts(algorithm, data, channel, order, startTime, endTime);  
    // })  
    // .catch(error => {  
    //     // 错误处理  
    //     console.error('Error fetching data:', error.message);  
    //     alert( error);  
    // }); 
}

function displayCharts(algorithm, data, channel, order, startTime, endTime) {
    const chartsContainer = document.getElementById('chartsContainer');
    chartsContainer.innerHTML = '';

    const timeLabels = generateTimeLabels(startTime, endTime, data.freq[0]?.length || 0);

    if (algorithm === '模态频率') {
        data.freq.forEach((freqData, index) => {
            createChart(freqData, `模态频率`, timeLabels, `${index + 1}阶 (单位Hz)`);
        });
    } else if (algorithm === '小波包能量') {
        const offset = channel == 1 ? 0 : 8;
        for (let i = 0; i < order; i++) {
            createChart(data.wav[offset + i], `小波包能量 - 通道${channel} - 阶数${i + 1}`, timeLabels, `${i + 1}阶 (☆ 特征值,亦无具体单位)`);
        }
    } else if (algorithm === '主成分分析') {
        data.pca.forEach((pcaData, index) => {
            createChart(pcaData, `主成分分析`, timeLabels, `${index + 1}阶（☆ 特征值,亦无具体单位）`);
        });
    } else if (algorithm === '融合指标') {
        data.fusion.forEach((fusionData, index) => {
            createChart(fusionData, `融合指标`, timeLabels, `${index + 1}阶 (☆ 特征值,亦无具体单位)`);
        });
    }
}

function generateTimeLabels(startTime, endTime, length) {
    const interval = (endTime - startTime) / (length - 1);
    const labels = [];
    for (let i = 0; i <= length; i++) {
        let timestamp = startTime + i * interval;
        labels.push(new Date(timestamp * 1000).toLocaleString());
    }
    console.log(labels)
    return labels;
}

function createChart(data, title, timeLabels, subText) {
    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');
    document.getElementById('chartsContainer').appendChild(chartContainer);

   


    const min = Math.min(...data) - 0.05;
    const max = Math.max(...data) + 0.05;

    const chart = echarts.init(chartContainer);
    const option = {
        title: {
            text: title,
            left: 'center',
            subtext: subText,
            subtextStyle: {
                color: '#555',
                fontSize: 12
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: timeLabels,
            boundaryGap: false
        },
        toolbox: {
            feature: {
                restore: { show: true },  // 还原
                saveAsImage: { show: true },  // 保存为图片
                dataView: {
                    show: true,
                    readOnly: false  // 允许编辑数据
                },
                dataZoom: { show: true }  // 缩放
            }
        },
        yAxis: {
            type: 'value',
            min: min,
            max: max,
            axisLabel: {  
                formatter: function (value, index) {  
                    return value.toFixed(2);  
                },  
            }, 
        },
        series: [{
            data: data,
            type: 'line',
            smooth: true,
            lineStyle: {
                width: 2
            },
            itemStyle: {
                color: 'rgba(75, 192, 192, 1)'
            }
        }],
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100
            },
            {
                type: 'inside',
                xAxisIndex: [0],
                start: 0,
                end: 100
            }
        ]
    };
    chart.setOption(option);
}