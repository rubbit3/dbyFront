$(function () {
    platformname();
})

$(window).resize(function () {
    deviceStatusPieChart_myChart.resize();
    cedianStatusPieChart_myChart.resize();
    measurementPointStatusPieChart_myChart.resize();
    alarmStatisticsBarChart_myChart.resize();
});

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

//----------设备状态----------- 
var deviceStatusPieChart_myChart = echarts.init(document.getElementById('deviceStatusPieChart'));

var deviceStatusPieChart_option = {
    title: {
        text: '设备状态',
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
            name: '设备状态', // 更改名称为更贴切的描述  
            type: 'pie',
            radius: '55%', // 可以稍微调整半径以留出更多空间显示标签  
            center: ['50%', '50%'], // 默认也是中心，但明确指定可能更好  
            data: [
                // {value: 12, name: '在线'},  
                {
                    value: 17,
                    name: '在线',
                    itemStyle: {
                        color: 'green'
                    }
                },
                {
                    value: 0,
                    name: '离线',
                    itemStyle: {
                        color: 'red'
                    }
                },
                // 可以添加更多状态  
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            label: {
                show: true, // 显示标签  
                position: 'outside', // 标签的位置，可以是 'inside', 'outside', 'insideLeft', 'insideRight' 等  
                formatter: '{b}: {c}台({d}%)' // 自定义标签格式，其中 {b} 是数据名，{c} 是数值，{d} 是百分比  
            },
            labelLine: {
                show: true // 显示标签线，如果你想要标签与扇区之间有线连接的话  
            }
        }
    ]
};

deviceStatusPieChart_myChart.setOption(deviceStatusPieChart_option);


// ////----------测点状态-----------
// var cedianStatusPieChart_myChart = echarts.init(document.getElementById('CedianPieChart'));
// var cedianStatusPieChart_option = {  
//     title: {    
//         text: '测点信息',    
//         left: 'center'    
//     },    
//     tooltip: {    
//         trigger: 'item'    
//     },    
//     legend: {    
//         orient: 'vertical',    
//         left: 'left',    
//     },    
//     series: [    
//         {    
//             name: '测点信息', // 更改名称为更贴切的描述  
//             type: 'pie',    
//             radius: ['40%', '70%'], // 可以设置为数组来表示内半径和外半径，这样可以在饼图中心留出空间显示标签  
//             center: ['50%', '50%'], // 饼图的中心（圆心）位置  
//             data: [    
//                 // {value: 22, name: '北侧'},    
//                 // {value: 645, name: '风速风向和温度'},    
//                 // {value: 44, name: '温度'},    
//                 // {value: 63, name: '应变'},    
//                 // {value: 78, name: '倾角'},    
//                 {value: 14, name: '加速度'},    
//                 // {value: 11, name: 'MEMS-MEMS-104#'},    
//                 // {value: 33, name: 'MEMS-MEMS-103#'},    
//             ],    
//             label: {  
//                 show: true, // 显示标签  
//                 position: 'outside', // 标签位置在扇区外部  
//                 formatter: '{b}: {c}台' // 自定义标签格式，包括数据名、数值和百分比  
//             },  
//             labelLine: {  
//                 show: true, // 显示标签线，连接扇区和标签  
//                 length: 10, // 标签线的长度  
//                 length2: 20 // 标签线第二段的长度，当标签位置为'outside'时有效  
//             },  
//             emphasis: {    
//                 itemStyle: {    
//                     shadowBlur: 10,    
//                     shadowOffsetX: 0,    
//                     shadowColor: 'rgba(0, 0, 0, 0.5)'    
//                 },  
//                 label: {  
//                     show: true, // 强调状态下也显示标签  
//                     fontSize: '14', // 可以调整字体大小以更清晰地显示  
//                     formatter: '{b}: {c} ({d}%)' // 强调状态下的标签格式，通常与普通状态下相同  
//                 }  
//             }  
//         }  
//     ]  
// };
// cedianStatusPieChart_myChart.setOption(cedianStatusPieChart_option);


////----------运行率状态-----------
// 初始化 ECharts 实例
var cedianStatusPieChart_myChart = echarts.init(document.getElementById('CedianPieChart'));

// 默认的饼图配置
var cedianStatusPieChart_option = {
    title: {
        text: '运行率',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        show: false
    },
    series: [
        {
            name: '运行率', // 更改名称为更贴切的描述  
            type: 'pie',
            radius: ['40%', '70%'], // 可以设置为数组来表示内半径和外半径，这样可以在饼图中心留出空间显示标签  
            center: ['50%', '50%'], // 饼图的中心（圆心）位置  
            data: [], // 初始数据为空，稍后将用真实数据替换  
            label: {
                show: true, // 显示标签  
                position: 'outside', // 标签位置在扇区外部  
                // formatter: '{b}: {c}%' // 只显示数据名和百分比形式的数值  
                formatter: ' {c}%' // 只显示数据名和百分比形式的数值  
            },
            labelLine: {
                show: true, // 显示标签线，连接扇区和标签  
                length: 10, // 标签线的长度  
                length2: 20 // 标签线第二段的长度，当标签位置为'outside'时有效  
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                label: {
                    show: true, // 强调状态下也显示标签  
                    fontSize: '14', // 可以调整字体大小以更清晰地显示  
                    // formatter: '{b}: {c}%' // 强调状态下的标签格式  
                    formatter: ' {c}%' // 强调状态下的标签格式  
                }
            }
        }
    ]
};

// 请求运行率信息
$.ajax({
    type: "GET",
    url: wz[48] + "?ID_project=" + building,
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    async: true,
    jsonp: 'callback',
    success: function (msg) {
        // 处理返回的数据
        var chartData = msg["data"].map(function (item) {
            // 将 runp 转换为百分比形式，保留小数点后两位
            var percentage = (item.runp * 100).toFixed(2);
            return {
                value: percentage, // 使用转换后的百分比
                name: item.cname
            };
        });

        // 更新图表配置
        cedianStatusPieChart_option.series[0].data = chartData;
        cedianStatusPieChart_myChart.setOption(cedianStatusPieChart_option);

        console.log('更新后的图表数据:', chartData);
    },
    error: function (res) {
        console.log(res);
    }
});



////----------报警状态-----------
// var measurementPointStatusPieChart_myChart = echarts.init(document.getElementById('measurementPointStatusPieChart'));
// var measurementPointStatusPieChart_option = {
//     title: {
//         text: '报警状态',
//         left: 'center'
//     },
//     tooltip: {
//         trigger: 'item'
//     },
//     legend: {
//         orient: 'vertical',
//         left: 'left',
//     },
//     series: [
//         {
//             name: '报警状态', // 更改名称为更贴切的描述  
//             type: 'pie',
//             radius: ['40%', '70%'], // 可以设置为数组来表示内半径和外半径，这样可以在饼图中心留出空间显示标签  
//             center: ['50%', '50%'], // 饼图的中心（圆心）位置  
//             data: [
//                 {
//                     value: 3,
//                     name: '报警',
//                     itemStyle: {
//                         color: 'red'
//                     }
//                 },
//                 // {value: 0, name: '无数据'},    
//                 {
//                     value: 15,
//                     name: '正常',
//                     itemStyle: {
//                         color: 'green'
//                     }
//                 },
//             ],
//             label: {
//                 show: true, // 显示标签  
//                 position: 'outside', // 标签位置在扇区外部  
//                 formatter: '{b}: {c}个' // 自定义标签格式，包括数据名、数值和百分比  
//             },
//             labelLine: {
//                 show: true, // 显示标签线，连接扇区和标签  
//                 length: 10, // 标签线的长度  
//                 length2: 20 // 标签线第二段的长度，当标签位置为'outside'时有效  
//             },
//             emphasis: {
//                 itemStyle: {
//                     shadowBlur: 10,
//                     shadowOffsetX: 0,
//                     shadowColor: 'rgba(0, 0, 0, 0.5)'
//                 },
//                 label: {
//                     show: true, // 强调状态下也显示标签  
//                     fontSize: '14', // 可以调整字体大小以更清晰地显示  
//                     formatter: '{b}: {c} 个' // 强调状态下的标签格式，通常与普通状态下相同  
//                 }
//             }
//         }
//     ]
// };
// measurementPointStatusPieChart_myChart.setOption(measurementPointStatusPieChart_option);

//----------报警统计----------
// var alarmStatisticsBarChart_myChart = echarts.init(document.getElementById('alarmStatisticsPieChart'));
// var alarmStatisticsBarChart_option = {
//     title: {
//         text: '报警统计',
//         left: 'center'
//     },
//     tooltip: {
//         trigger: 'item'
//     },
//     legend: {
//         orient: 'vertical',
//         left: 'left',
//     },
//     series: [
//         {
//             name: '报警统计', // 更改名称为更贴切的描述  
//             type: 'pie',
//             radius: ['40%', '70%'], // 可以设置为数组来表示内半径和外半径，这样可以在饼图中心留出空间显示标签  
//             center: ['50%', '50%'], // 饼图的中心（圆心）位置  
//             data: [
//                 { value: 3, name: '近一周' },
//                 { value: 0, name: '近一个月' },
//                 { value: 0, name: '更早的' }

//             ],
//             label: {
//                 show: true, // 显示标签  
//                 position: 'outside', // 标签位置在扇区外部  
//                 formatter: '{b}: {c}条' // 自定义标签格式，包括数据名、数值和百分比  
//             },
//             labelLine: {
//                 show: true, // 显示标签线，连接扇区和标签  
//                 length: 10, // 标签线的长度  
//                 length2: 20 // 标签线第二段的长度，当标签位置为'outside'时有效  
//             },
//             emphasis: {
//                 itemStyle: {
//                     shadowBlur: 10,
//                     shadowOffsetX: 0,
//                     shadowColor: 'rgba(0, 0, 0, 0.5)'
//                 },
//                 label: {
//                     show: true, // 强调状态下也显示标签  
//                     fontSize: '14', // 可以调整字体大小以更清晰地显示  
//                     formatter: '{b}: {c} ({d}%)' // 强调状态下的标签格式，通常与普通状态下相同  
//                 }
//             }
//         }
//     ]
// };
// alarmStatisticsBarChart_myChart.setOption(alarmStatisticsBarChart_option);
