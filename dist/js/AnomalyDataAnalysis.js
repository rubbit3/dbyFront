$(function () {
    platformname();
    timerange();
})

// $(window).resize(function () {
// });

var url = window.location.href;
var obj = {};
str = url.split("?")[1].split("&");
for (let i = 0; i < str.length; i++) {
    let a = str[i].split('=');
    obj[a[0]] = a[1];
}


console.log("Parsed URL Parameters:",obj)
var token = $.cookie('token');
console.log("token:",token)

var building = obj.building;
console.log("building:",building)
var type = obj.type;
console.log("type:",type)
var username = obj.name;
console.log("username:",username)
var projectID = obj.building;
console.log("projectID:",projectID)
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

// function ViewData() {
//     setTimeout(function () {
//         PieChart_ProportionStatistics();
//         BarChart_QuantityStatistics();
//         LineChart_TimeSeriesStatistics();
//     }, 2000); 
// }


PieChart_ProportionStatistics();
        // 调用函数时传入时间参数
// const startTime = 1721957984;
// const endTime = 1721957984;
// PieChart_ProportionStatistics(startTime, endTime);
BarChart_QuantityStatistics();
LineChart_TimeSeriesStatistics();


function PieChart_ProportionStatistics() {
    // 初始化图表
    var PieChart_ProportionStatistics_myChart = echarts.init(document.getElementById('PieChart_ProportionStatistics'));

    // 发起 GET 请求，获取数据
    fetch('http://10.62.213.53:9000/exce/get') // 将 'your-api-endpoint-url' 替换为你的实际接口URL
        .then(response => response.json()) // 将响应解析为 JSON
        .then(data => {
            // 处理接口返回的数据
            const proportionData = data.proportionStatistics; // 使用接口返回的 proportionStatistics 数据
            
            // 更新图表配置，使用接口返回的数据填充图表
            var PieChart_ProportionStatistics_option = {
                title: {
                    text: '异常数据',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [
                    {
                        name: '异常数据', // 更改名称为更贴切的描述
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: proportionData, // 使用接口返回的数据填充
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            show: true,
                            position: 'outside',
                            formatter: '{b}: {d}%' // 自定义标签格式，其中 {b} 是数据名，{d} 是百分比
                        },
                        labelLine: {
                            show: true
                        }
                    }
                ]
            };

            // 设置图表选项并更新
            PieChart_ProportionStatistics_myChart.setOption(PieChart_ProportionStatistics_option);
        })
        .catch(error => {
            console.error('Error fetching data:', error); // 如果请求失败，输出错误信息
        });
}


// function PieChart_ProportionStatistics() {
//     var PieChart_ProportionStatistics_myChart = echarts.init(document.getElementById('PieChart_ProportionStatistics'));
//     var PieChart_ProportionStatistics_option = {
//         title: {
//             text: '异常数据',
//             left: 'center'
//         },
//         tooltip: {
//             trigger: 'item'
//         },
//         legend: {
//             orient: 'vertical',
//             left: 'left',
//         },
//         series: [
//             {
//                 name: '异常数据', // 更改名称为更贴切的描述  
//                 type: 'pie',
//                 radius: '55%', // 可以稍微调整半径以留出更多空间显示标签  
//                 center: ['50%', '50%'], // 默认也是中心，但明确指定可能更好  
//                 data: [
//                     { value: 1, name: '缺失' },
//                     { value: 1, name: '次小值' },
//                     { value: 1, name: '离群值' },
//                     { value: 0, name: '超量程震荡' },
//                     { value: 0, name: '趋势' },
//                     { value: 0, name: '漂移' },
//                     { value: 86397, name: '正常' },
//                 ],
//                 emphasis: {
//                     itemStyle: {
//                         shadowBlur: 10,
//                         shadowOffsetX: 0,
//                         shadowColor: 'rgba(0, 0, 0, 0.5)'
//                     }
//                 },
//                 label: {
//                     show: true, // 显示标签  
//                     position: 'outside', // 标签的位置，可以是 'inside', 'outside', 'insideLeft', 'insideRight' 等  
//                     formatter: '{b}: {d}%' // 自定义标签格式，其中 {b} 是数据名，{c} 是数值，{d} 是百分比  
//                 },
//                 labelLine: {
//                     show: true
//                 }
//             }
//         ]
//     };
//     PieChart_ProportionStatistics_myChart.setOption(PieChart_ProportionStatistics_option);
// }


// function PieChart_ProportionStatistics(startTime, endTime) {
//     var PieChart_ProportionStatistics_myChart = echarts.init(document.getElementById('PieChart_ProportionStatistics'));

//     // 构建请求参数
//     const params = {
//         startTime: startTime,
//         endTime: endTime
//     };

//     // AJAX 请求获取数据
//     $.ajax({
//         url: 'http://10.62.213.53:9000/exce/get', // 替换为你的后端接口地址
//         method: 'POST', // 或 'POST'，根据你的接口需求POST
//         data: params, // 将请求参数传递给后端
//         success: function(response) {
//             // 检查响应码
//             if (response.code === "200") {
//                 // 从响应中提取数据
//                 const data = response.data[0]; // 假设只取第一个数据对象

//                 // 构建饼图数据
//                 const pieData = [
//                     { value: data.Missing, name: '缺失' },
//                     { value: data.Minor, name: '次小值' },
//                     { value: data.Outlier, name: '离群值' },
//                     { value: data.Square, name: '超量程震荡' },
//                     { value: data.Trend, name: '趋势' },
//                     { value: data.Drift, name: '漂移' },
//                     { value: data.Normal, name: '正常' },
//                 ];

//                 // 更新饼图选项
//                 var PieChart_ProportionStatistics_option = {
//                     title: {
//                         text: '异常数据',
//                         left: 'center'
//                     },
//                     tooltip: {
//                         trigger: 'item'
//                     },
//                     legend: {
//                         orient: 'vertical',
//                         left: 'left',
//                     },
//                     series: [
//                         {
//                             name: '异常数据',
//                             type: 'pie',
//                             radius: '55%',
//                             center: ['50%', '50%'],
//                             data: pieData,
//                             emphasis: {
//                                 itemStyle: {
//                                     shadowBlur: 10,
//                                     shadowOffsetX: 0,
//                                     shadowColor: 'rgba(0, 0, 0, 0.5)'
//                                 }
//                             },
//                             label: {
//                                 show: true,
//                                 position: 'outside',
//                                 formatter: '{b}: {d}%'
//                             },
//                             labelLine: {
//                                 show: true
//                             }
//                         }
//                     ]
//                 };

//                 // 设置饼图选项
//                 PieChart_ProportionStatistics_myChart.setOption(PieChart_ProportionStatistics_option);
//             } else {
//                 console.error(response.message); // 处理错误信息
//             }
//         },
//         error: function(xhr, status, error) {
//             console.error("请求失败:", status, error); // 请求失败的处理
//         }
//     });
// }


function BarChart_QuantityStatistics() {
    var BarChart_QuantityStatistics_myChart = echarts.init(document.getElementById('BarChart_QuantityStatistics'));

    // 发起 GET 请求，获取数据
    fetch('http://10.62.213.53:9000/exce/get') // 将 'your-api-endpoint-url' 替换为你的实际接口URL
        .then(response => response.json()) // 将响应解析为 JSON
        .then(data => {
            // 处理接口返回的数据
            const categories = data.quantityStatistics.categories; // 从接口中获取 categories
            const values = data.quantityStatistics.values; // 从接口中获取 values
            
            // 颜色数组，每个颜色对应一个柱子
            const colors = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452'];
            // 更新图表配置，使用接口返回的数据填充图表
            var BarChart_QuantityStatistics_option = {
                title: {
                    text: '数量统计',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: categories, // 使用接口返回的 categories 作为 X 轴数据
                    axisLabel: {
                        interval: 0, // 显示所有标签
                        rotate: 45 // 如果标签太长，可以旋转一定角度
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: values, // 使用接口返回的 values 作为条形图的 Y 轴数据
                    type: 'bar',
                    label: {
                        show: true, // 显示标签
                        position: 'top', // 标签位置在柱子上方
                        valueAnimation: true // 开启数值动画
                    },
                    itemStyle: {
                        color: function (params) {
                            // params.index 是柱子的索引，通过索引返回对应的颜色
                            return colors[params.dataIndex % colors.length]; // 循环使用颜色
                            // return '#FC8452'; // 循环使用颜色
                        }
                    }
                }]
            };

            // 设置图表选项并更新
            BarChart_QuantityStatistics_myChart.setOption(BarChart_QuantityStatistics_option);
        })
        .catch(error => {
            console.error('Error fetching data:', error); // 如果请求失败，输出错误信息
        });
}



// function BarChart_QuantityStatistics() {
//     var BarChart_QuantityStatistics_myChart = echarts.init(document.getElementById('BarChart_QuantityStatistics'));
//     var BarChart_QuantityStatistics_option = {
//         title: {
//             text: '数量统计',
//             left: 'center'
//         },
//         tooltip: {
//             trigger: 'axis',
//             axisPointer: {
//                 type: 'shadow'
//             }
//         },
      
//         xAxis: {
//             type: 'category',
//             data: ['正常', '缺失', '次小值', '离群值', '超量程震荡', '趋势', '漂移'],
//             axisLabel: {
//                 interval: 0, // 显示所有标签  
//                 rotate: 45 // 如果标签太长，可以旋转一定角度  
//             }
//         },
//         yAxis: {
//             type: 'value'
//         },
//         series: [{
//             data: [86397, 1, 1, 1, 0, 0, 0],
//             type: 'bar',
//             label: {
//                 show: true, // 显示标签  
//                 position: 'top', // 标签位置在柱子上方  
//                 valueAnimation: true // 开启数值动画  
//             },
//             itemStyle: {
//                 color: function (params) {
//                     // 根据数据值或其他条件自定义柱子颜色（可选）  
//                     // 这里只是一个简单的示例，所有柱子都是同一种颜色  
//                     return '#409EFF';
//                 }
//             }
//         }]
//     };
//     BarChart_QuantityStatistics_myChart.setOption(BarChart_QuantityStatistics_option);
// }


function LineChart_TimeSeriesStatistics() {
    var LineChart_TimeSeriesStatistics_myChart = echarts.init(document.getElementById('LineChart_TimeSeriesStatistics'));

    // 发起 GET 请求，获取数据
    fetch('http://10.62.213.53:9000/exce5day/get') // 将 'your-api-endpoint-url' 替换为你的实际接口URL
        .then(response => response.json()) // 将响应解析为 JSON
        .then(data => {
            // 从接口数据中提取需要的字段
            const dates = data.timeSeriesStatistics.dates; // X轴的时间日期
            const seriesData = data.timeSeriesStatistics.series; // 各类统计数据

            // 更新图表配置，使用接口返回的数据
            var LineChart_TimeSeriesStatistics_option = {
                title: {
                    text: '最近5天数据情况',
                    left: 'center',
                    textStyle: {
                        color: '#333',
                        fontSize: 18,
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                    formatter: function (params) {
                        var res = params[0].name + '<br/>';
                        params.forEach(function (item) {
                            res += item.seriesName + ' : ' + item.value + '<br/>';
                        });
                        return res;
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%', // 增加底部间距以防止标签重叠
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: dates, // 使用接口返回的时间数据
                    axisLabel: {
                        interval: 0, // 显示所有标签
                        rotate: 45,  // 旋转标签，防止重叠
                        margin: 10,  // 调整标签与轴线的间距，避免重叠
                        formatter: function (value) {
                            return value.split(' ').join('\n'); // 可选：将时间换行以节省空间
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#999'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: '#999'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#eee']
                        }
                    }
                },
                series: [
                    {
                        name: '正常',
                        type: 'line',
                        data: seriesData.正常, // 从接口返回的 '正常' 数据
                        label: {
                            show: true,
                            position: 'top'
                        },
                        itemStyle: {
                            color: '#5470C6'
                        },
                        smooth: true
                    },
                    {
                        name: '缺失',
                        type: 'line',
                        data: seriesData.缺失, // 从接口返回的 '缺失' 数据
                        label: {
                            show: true,
                            position: 'bottom'
                        },
                        itemStyle: {
                            color: '#FF4500'
                        },
                        smooth: true
                    },
                    {
                        name: '次小值',
                        type: 'line',
                        data: seriesData.次小值, // 从接口返回的 '次小值' 数据
                        label: {
                            show: true,
                            position: 'bottom'
                        },
                        itemStyle: {
                            color: '#FFD700'
                        },
                        smooth: true
                    },
                    {
                        name: '离群值',
                        type: 'line',
                        data: seriesData.离群值, // 从接口返回的 '离群值' 数据
                        label: {
                            show: true,
                            position: 'bottom'
                        },
                        itemStyle: {
                            color: '#1E90FF'
                        },
                        smooth: true
                    },
                    {
                        name: '超量程震荡',
                        type: 'line',
                        data: seriesData.超量程震荡, // 从接口返回的 '超量程震荡' 数据
                        label: {
                            show: true,
                            position: 'bottom'
                        },
                        itemStyle: {
                            color: '#90EE90'
                        },
                        smooth: true
                    },
                    {
                        name: '趋势',
                        type: 'line',
                        data: seriesData.趋势, // 从接口返回的 '趋势' 数据
                        label: {
                            show: true,
                            position: 'bottom'
                        },
                        itemStyle: {
                            color: '#ADFF2F'
                        },
                        smooth: true
                    },
                    {
                        name: '漂移',
                        type: 'line',
                        data: seriesData.漂移, // 从接口返回的 '漂移' 数据
                        label: {
                            show: true,
                            position: 'bottom'
                        },
                        itemStyle: {
                            color: '#8B4513'
                        },
                        smooth: true
                    }
                ]
            };

            // 设置图表选项并更新
            LineChart_TimeSeriesStatistics_myChart.setOption(LineChart_TimeSeriesStatistics_option);
        })
        .catch(error => {
            console.error('Error fetching data:', error); // 如果请求失败，输出错误信息
        });
}



// function LineChart_TimeSeriesStatistics() {
//     var LineChart_TimeSeriesStatistics_myChart = echarts.init(document.getElementById('LineChart_TimeSeriesStatistics'));
//     var LineChart_TimeSeriesStatistics_option = {
//         title: {
//             text: '按时间统计',
//             left: 'center',
//             textStyle: {
//                 color: '#333',
//                 fontSize: 18,
//                 fontWeight: 'bold'
//             }
//         },
//         tooltip: {
//             trigger: 'axis',
//             axisPointer: {
//                 type: 'cross',
//                 label: {
//                     backgroundColor: '#6a7985'
//                 }
//             },
//             formatter: function (params) {
//                 var res = params[0].name + '<br/>';
//                 params.forEach(function (item) {
//                     res += item.seriesName + ' : ' + item.value + '<br/>';
//                 });
//                 return res;
//             }
//         },



//         grid: {
//             left: '3%',
//             right: '4%',
//             bottom: '3%',
//             containLabel: true
//         },
//         xAxis: {
//             type: 'category',
//             data: ['7月30日', '7月31日', '8月1日', '8月2日','8月3日'],
//             axisLabel: {
//                 interval: 0,
//                 rotate: 0
//             },
//             axisLine: {
//                 lineStyle: {
//                     color: '#999'
//                 }
//             }
//         },
//         yAxis: {
//             type: 'value',
//             axisLine: {
//                 lineStyle: {
//                     color: '#999'
//                 }
//             },
//             splitLine: {
//                 lineStyle: {
//                     color: ['#eee']
//                 }
//             }
//         },
//         series: [
//             {
//                 name: '正常',
//                 type: 'line',
//                 data: [86399, 86380, 86390, 86388,86384],
//                 label: {
//                     show: true,
//                     position: 'top'
//                 },
//                 itemStyle: {
//                     color: '#5470C6'
//                 },
//                 smooth: true
//             },
//             {
//                 name: '缺失',
//                 type: 'line',
//                 data: [0, 1, 0, 0,0],
//                 label: {
//                     show: true,
//                     position: 'bottom'
//                 },
//                 itemStyle: {
//                     color: '#FF4500' // 红色  
//                 },
//                 smooth: true
//             },
//             {
//                 name: '次小值',
//                 type: 'line',
//                 data: [0, 1, 0, 0,0],
//                 label: {
//                     show: true,
//                     position: 'bottom'
//                 },
//                 itemStyle: {
//                     color: '#FFD700' // 金色  
//                 },
//                 smooth: true
//             },
//             {
//                 name: '离群值',
//                 type: 'line',
//                 data: [1, 0, 0, 0,0],
//                 label: {
//                     show: true,
//                     position: 'bottom'
//                 },
//                 itemStyle: {
//                     color: '#1E90FF' // 亮蓝色  
//                 },
//                 smooth: true
//             },
//             {
//                 name: '超量程震荡',
//                 type: 'line',
//                 data: [0, 0, 0, 0,0],
//                 label: {
//                     show: true,
//                     position: 'bottom'
//                 },
//                 itemStyle: {
//                     color: '#90EE90' // 浅绿色  
//                 },
//                 smooth: true
//             },
//             {
//                 name: '趋势',
//                 type: 'line',
//                 data: [0, 0, 0, 0,0],
//                 label: {
//                     show: true,
//                     position: 'bottom'
//                 },
//                 itemStyle: {
//                     color: '#ADFF2F' // 绿色  
//                 },
//                 smooth: true
//             },
//             {
//                 name: '漂移',
//                 type: 'line',
//                 data: [0, 0, 0,0,0],
//                 label: {
//                     show: true,
//                     position: 'bottom'
//                 },
//                 itemStyle: {
//                     color: '#8B4513' // 棕色  
//                 },
//                 smooth: true
//             }
//         ]
//     };
//     LineChart_TimeSeriesStatistics_myChart.setOption(LineChart_TimeSeriesStatistics_option);
// }