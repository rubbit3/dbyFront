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
// 查询数据
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
    if (diffHours > 6) {
        alert("选择的时间段不能大于6小时，请重新选择！");
        return;
    }

    showLoadingOverlay();

    var myChart = echarts.init(document.getElementById('dataview'));

    const promises = nodes.map(node => {
        return fetchDataForNode(projectID, node.id, newbegin, newend);
    });

    Promise.all(promises).then(results => {

        let seriesData = results.map((result, index) => {
            const values = result.map(item => item.value);
            const meanValue = values.reduce((acc, value) => acc + value, 0) / values.length;
            return {
                name: result[0].name,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: result.map(item => [Number(item.time), Number(item.value) - meanValue])
            };
        });

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



// 查询峰值数据
function ViewPeakData() {
    console.log(newbegin);
    console.log(newend);

    //     /***begin */
    // /***如果需要控制时差，就去掉注释 */

    // // 计算时间差  
    var timeDiff = newend - newbegin;
    console.log(timeDiff)

    // 将时间差转换为小时  
    var diffHours = timeDiff / 3600;

    console.log(diffHours)

    // 检查时间差是否超过1小时  
    if (diffHours > 24) {
        alert("选择的时间段不能大于24小时，请重新选择！");
        return;
    }

    //     /***end */

    showLoadingOverlay();

    var myChart = echarts.init(document.getElementById('dataview'));

    // 模拟节点数据，这里要注释掉哈。url是http://127.0.0.1:5000/fengzhi/getget?collection_name=973126%231-3&start_time=1728366281&end_time=1730871881
    // const nodes = [
    //     { id: "973126%231-3", name: "节点1" },
    //     { id: "973126%231-3", name: "节点2" },
    //     { id: "973126%231-3", name: "节点3" }
    // ];

    const promises = nodes.map(node => {
        return fetchPeakDataForNode(node.id, newbegin, newend);
    });

    // Promise.all(promises).then(results => {
    //     console.log('result is ', results)

    //     // 提取最大值和最小值系列数据
    //     let maxDataSeries = results[0].map(item => ({
    //         time: item.time,
    //         value: item.maxData
    //     }));
    //     let minDataSeries = results[0].map(item => ({
    //         time: item.time,
    //         value: item.mindata
    //     }));
    //     // 配置 ECharts 的 series 数据
    //     let seriesData = [
    //         {
    //             name: '最大值',
    //             type: 'scatter',
    //             data: maxDataSeries.map(item => [Number(item.time), Number(item.value)]),
    //             itemStyle: { color: 'red' },
    //             symbolSize: 6
    //         },
    //         {
    //             name: '最小值',
    //             type: 'scatter',
    //             data: minDataSeries.map(item => [Number(item.time), Number(item.value)]),
    //             itemStyle: { color: 'blue' },
    //             symbolSize: 6
    //         }
    //     ];

    //     // 配置 ECharts 图表选项
    //     var option = {
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: { type: 'shadow' }
    //         },
    //         legend: {
    //             data: ['最大值', '最小值'],
    //             top: 10
    //         },
    //         dataZoom: [
    //             { type: 'slider', show: true, start: 0, end: 100, bottom: 35 },
    //             { type: "inside" }
    //         ],
    //         grid: {
    //             left: 25, bottom: 35, right: 20, containLabel: true
    //         },
    //         xAxis: {
    //             name: "时间(s)",
    //             type: 'time',
    //             nameLocation: "center",
    //             nameGap: 30,
    //             splitLine: { show: false }
    //         },
    //         yAxis: {
    //             name: "幅值(cm/s^2)",
    //             type: 'value',
    //             nameLocation: 'center',
    //             nameGap: 30,
    //             scale: true
    //         },
    //         series: seriesData
    //     };

    //     // 使用配置项和数据显示图表  
    //     myChart.setOption(option, true);



    //     // let seriesData = results.map((result, index) => {
    //     //     const values = result.map(item => item.value);
    //     //     const meanValue = values.reduce((acc, value) => acc + value, 0) / values.length;
    //     //     return {
    //     //         name: result[0].name,
    //     //         type: 'line',
    //     //         showSymbol: false,
    //     //         hoverAnimation: false,
    //     //         data: result.map(item => [Number(item.time), Number(item.value) - meanValue])
    //     //     };
    //     // });

    //     // var option = {
    //     //     tooltip: {//鼠标放在点上显示数据
    //     //         trigger: 'axis',//显示该列下所有坐标轴所对应的数据
    //     //     },
    //     //     legend: {
    //     //         name: "sss"
    //     //     },
    //     //     dataZoom: [{
    //     //         type: 'slider',
    //     //         show: true,
    //     //         start: 50,
    //     //         end: 100,
    //     //         bottom: 35,
    //     //     }, {
    //     //         type: "inside",
    //     //     }],
    //     //     grid: {
    //     //         show: true,
    //     //         borderWidth: 0,
    //     //         left: 25,
    //     //         bottom: 35,
    //     //         right: 20,
    //     //         containLabel: true
    //     //     },
    //     //     xAxis: {
    //     //         name: "时间(s)",
    //     //         nameLocation: "center",
    //     //         type: 'time',
    //     //         nameGap: 30,
    //     //         splitLine: {
    //     //             show: false,
    //     //             rotate: 30,
    //     //         },
    //     //     },
    //     //     yAxis: {
    //     //         name: "幅值(cm/s^2)",
    //     //         nameLocation: 'center',
    //     //         type: 'value',
    //     //         nameGap: 30,
    //     //         scale: true
    //     //     },
    //     //     series: seriesData
    //     // };
    //     // // 使用配置项和数据显示图表  
    //     // myChart.setOption(option, true); // 注意：setOption 的第二个参数通常不是必需的，除非您有特定需求  

    //     // 监听窗口大小变化，自适应图表大小  
    //     window.addEventListener("resize", function () {
    //         myChart.resize();
    //     });
    //     hideLoadingOverlay();
    // }).catch(error => {
    //     console.error("加载数据失败:", error);
    //     hideLoadingOverlay();
    // });


    Promise.all(promises).then(results => {
        // 用于存储所有系列数据的数组
        let seriesData = [];

        // 遍历每个结果集，将最大值和最小值添加到 seriesData 中
        results.forEach((dataSet, index) => {
            // 提取每个数据集的最大值和最小值系列
            let maxDataSeries = dataSet.map(item => ({
                time: item.time,
                value: item.maxData
            }));
            let minDataSeries = dataSet.map(item => ({
                time: item.time,
                value: item.mindata
            }));

            // 使用数据集的 `name` 字段值替换
            const dataSetName = dataSet[0].name;  // 假设 `name` 是在 `dataSet` 的第一个元素中

            // 添加最大值散点系列
            seriesData.push({
                name: `${dataSetName} - 最大值`,
                type: 'scatter',
                data: maxDataSeries.map(item => [Number(item.time), Number(item.value)]),
                itemStyle: { color: `hsl(${index * 60}, 100%, 50%)` }, // 不同数据集用不同颜色
                symbolSize: 6
            });

            // 添加最小值散点系列
            seriesData.push({
                name: `${dataSetName} - 最小值`,
                type: 'scatter',
                data: minDataSeries.map(item => [Number(item.time), Number(item.value)]),
                itemStyle: { color: `hsl(${index * 60 + 30}, 100%, 50%)` }, // 不同数据集用不同颜色
                symbolSize: 6
            });


        });

        // 配置 ECharts 图表选项
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: seriesData.map(series => series.name),
                top: 10
            },
            dataZoom: [
                { type: 'slider', show: true, start: 0, end: 100, bottom: 35 },
                { type: "inside" }
            ],
            grid: {
                left: 25, bottom: 35, right: 20, containLabel: true
            },
            xAxis: {
                name: "时间(s)",
                type: 'time',
                nameLocation: "center",
                nameGap: 30,
                splitLine: { show: false }
            },
            yAxis: {
                name: "幅值(cm/s^2)",
                type: 'value',
                nameLocation: 'center',
                nameGap: 30,
                scale: true
            },
            series: seriesData
        };

        // 使用配置项和数据显示图表  
        myChart.setOption(option, true);

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
                            name: response.data[i].channel_name + "-" + response.data[i].dir + "(" + response.data[i].Unit + ")",
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


function fetchPeakDataForNode(nodes, newbegin, newend) {


    return new Promise((resolve, reject) => {
        //     // 获取时间间隔
        const intervalInput = document.getElementById("intervalInput").value;
        const interval = parseInt(intervalInput) * 60;
        console.log("interval", interval)
        // console.log(wz[53] + 'get?collection_name=' + nodes + '&start_time=' + newbegin + '&end_time=' + newend)
        let encodedNodes = encodeURIComponent(nodes);
        let encodedNewbegin = encodeURIComponent(newbegin);
        let encodedNewend = encodeURIComponent(newend);


        let urlcc = wz[53] + '?collection_name=' + encodedNodes + '&start_time=' + encodedNewbegin + '&end_time=' + encodedNewend;
        console.log('encodedNodes is', encodedNodes);
        console.log('encodedNewbegin is', encodedNewbegin);
        console.log('encodedNewend is', encodedNewend);
        // 发起峰值请求，返回三个数组，最大值序列，最小值序列，时间序列
        $.ajax({
            url: 'http://10.62.213.53:9000/fengzhi/get?collection_name=' + encodedNodes + '&start_time=' + encodedNewbegin + '&end_time=' + encodedNewend,

            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log('response.namevalue', response.namevalue)
                let echartsData = [];
                let maxData = [];
                let minData = [];
                console.log('response.fengzhi_max_values', response.fengzhi_maxdata_values)
                console.log('response.fengzhi_min_values', response.fengzhi_mindata_values)

                for (let i = 0; i < response.fengzhi_data_values.length; i += interval) {
                    // console.log(i)
                    // absdata = Math.abs(response.fengzhi_data_values[i])
                    echartsData.push({
                        name: response.namevalue,
                        time: response.time_data_values[i] * 1000, // 转换为毫秒
                        maxData: response.fengzhi_maxdata_values[i], // 最大值数据
                        mindata: response.fengzhi_mindata_values[i] // 最小值数据
                        // value: response.fengzhi_data_values[i]
                        // value: absdata

                    });
                }
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