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
    //begin
    //这是参考的code
    // return new Promise((resolve) => {
    //     // 获取时间间隔
    //     const intervalInput = document.getElementById("intervalInput").value;
    //     const interval = parseInt(intervalInput) * 60;
    //     console.log("interval", interval)

    //     // 模拟数据
    //     const mockData = {
    //         "fengzhi_data_values": [
    //             0.01373312,
    //             0.0701915,
    //             0.012715851,
    //             -0.015767656,
    //             0.010681315,
    //             -0.009664047,
    //             -0.007629511,
    //             0.01373312,
    //             -0.053406574,
    //             -0.012715851,
    //             0.031535313,
    //             -0.0147503875,
    //             -0.009664047,
    //             0.014241753,
    //             -0.010681315,
    //             0.016784923,
    //             0.0122072175,
    //             0.012715851,
    //             -0.028483506,
    //             -0.015259022,
    //             -0.016276289,
    //             -0.011189949,
    //             -0.010681315,
    //             -0.009155413,
    //             0.0066122427,
    //             0.007629511,
    //             0.010681315,
    //             0.0122072175,
    //             -0.011189949,
    //             0.010681315,
    //             -0.011189949,
    //             0.0071208766,
    //             -0.012715851,
    //             -0.009155413,
    //             0.0147503875,
    //             -0.013224485,
    //             -0.010172681,
    //             -0.011698583,
    //             -0.0122072175,
    //             0.011189949,
    //             0.021871265,
    //             0.027974872,
    //             -0.030518044,
    //             0.025940336,
    //             0.026957605,
    //             -0.02644897,
    //             -0.025431702,
    //             0.02492307,
    //             0.028483506,
    //             -0.027974872,
    //             -0.02746624,
    //             -0.026957605,
    //             0.030518044,
    //             0.022888532,
    //             0.0239058,
    //             -0.02746624,
    //             0.025431702,
    //             -0.025940336,
    //             0.031026676,
    //             0.02644897,
    //             0.08392462,
    //             -0.063070625,
    //             -0.023397166,
    //             0.029500775,
    //             0.03000941,
    //             -0.023397166,
    //             0.0239058,
    //             -0.027974872,
    //             -0.050863404,
    //             0.02644897,
    //             0.036621653,
    //             0.03000941,
    //             0.025940336,
    //             -0.02746624,
    //             -0.025940336,
    //             -0.032552578,
    //             0.027974872,
    //             0.0122072175,
    //             -0.02644897,
    //             -0.015767656,
    //             0.0122072175,
    //             0.017802192,
    //             0.015259022,
    //             0.011189949,
    //             -0.019328093,
    //             -0.032552578,
    //             0.039673455,
    //             -0.04526843,
    //             -0.040690724,
    //             0.0478116,
    //             -0.050863404,
    //             -0.09918364,
    //             0.078329645,
    //             -0.04984614,
    //             0.032043945,
    //             -0.030518044,
    //             0.033569846,
    //             0.031026676,
    //             0.025940336,
    //             -0.031535313,
    //             0.033569846,
    //             0.0239058,
    //             0.02899214,
    //             -0.019328093,
    //             0.018310826,
    //             -0.018310826,
    //             -0.015767656,
    //             -0.011698583,
    //             0.010172681,
    //             0.010681315,
    //             0.010681315,
    //             -0.010681315,
    //             0.010681315,
    //             0.010172681,
    //             -0.01373312,
    //             -0.008646779,
    //             -0.009664047,
    //             0.017802192,
    //             0.030518044,
    //             0.012715851,
    //             0.07222603,
    //             0.009664047,
    //             -0.01373312,
    //             -0.013224485,
    //             0.012715851,
    //             -0.010172681,
    //             0.009664047,
    //             -0.009155413,
    //             -0.05544111,
    //             -0.011698583,
    //             0.02899214,
    //             -0.010681315,
    //             -0.011189949,
    //             -0.009664047,
    //             0.013224485,
    //             0.016276289,
    //             0.017802192,
    //             0.016784923,
    //             -0.032552578,
    //             -0.032043945,
    //             0.033569846,
    //             -0.036621653,
    //             -0.047302965,
    //             -0.026957605,
    //             -0.02492307,
    //             -0.0239058,
    //             -0.024414435,
    //             0.026957605,
    //             0.02899214,
    //             0.036113016,
    //             -0.02899214,
    //             -0.03763892,
    //             -0.03509575,
    //             0.03000941,
    //             -0.038147554,
    //             0.038656186,
    //             -0.034078483,
    //             -0.044759795,
    //             0.08494189,
    //             0.09460593,
    //             0.06764833,
    //             -0.09664047,
    //             -0.10020091,
    //             0.06612243,
    //             -0.04882887,
    //             -0.04272526,
    //             0.035604384,
    //             0.030518044,
    //             0.03763892,
    //             -0.025431702,
    //             0.033061214,
    //             -0.02746624,
    //             -0.029500775,
    //             -0.030518044,
    //             0.02644897,
    //             0.013224485,
    //             -0.007629511,
    //             0.011189949,
    //             0.032043945,
    //             0.02492307,
    //             0.071717404,
    //             -0.015259022,
    //             0.011698583,
    //             0.0071208766,
    //             -0.011698583,
    //             0.015767656,
    //             0.0122072175,
    //             0.014241753,
    //             -0.05289794,
    //             0.013224485,
    //             0.0239058,
    //             0.014241753,
    //             -0.0122072175,
    //             0.015767656,
    //             0.013224485,
    //             -0.0147503875,
    //             0.013224485,
    //             -0.013224485,
    //             -0.019836728,
    //             -0.018310826,
    //             -0.009664047,
    //             -0.0122072175,
    //             -0.007629511,
    //             -0.009664047,
    //             0.009664047,
    //             0.009155413,
    //             0.009155413,
    //             0.0061036088,
    //             -0.009155413,
    //             -0.0122072175,
    //             0.008138145,
    //             -0.015259022,
    //             -0.0122072175,
    //             0.0066122427,
    //             0.008646779,
    //             0.012715851,
    //             0.008138145,
    //             -0.010172681,
    //             -0.008646779,
    //             0.0071208766,
    //             0.0071208766,
    //             -0.01373312,
    //             0.008646779,
    //             -0.009664047,
    //             -0.01373312,
    //             -0.009155413,
    //             -0.012715851,
    //             0.0122072175,
    //             0.010172681,
    //             0.01373312,
    //             -0.011698583,
    //             -0.009155413,
    //             0.011698583,
    //             0.010172681,
    //             0.016276289,
    //             -0.017802192,
    //             -0.031026676,
    //             0.032552578,
    //             0.049337503,
    //             0.049337503,
    //             -0.038147554,
    //             0.058492918,
    //             0.078329645,
    //             -0.076803744,
    //             0.068665594,
    //             0.05747565,
    //             -0.03763892,
    //             0.08087281,
    //             -0.08748506,
    //             0.107321784,
    //             0.073751934,
    //             0.0478116,
    //             -0.05137204,
    //             -0.05900155,
    //             -0.05391521,
    //             -0.038147554,
    //             -0.04882887,
    //             -0.05289794,
    //             -0.040690724,
    //             -0.056967013,
    //             -0.030518044,
    //             -0.039673455,
    //             -0.033061214,
    //             0.037130285,
    //             -0.03000941,
    //             -0.036621653,
    //             -0.033061214,
    //             0.029500775,
    //             -0.02746624,
    //             -0.02899214,
    //             0.02644897,
    //             0.029500775,
    //             -0.031026676,
    //             -0.025940336,
    //             0.0147503875,
    //             0.015259022,
    //             0.009155413,
    //             -0.0147503875,
    //             0.015259022,
    //             -0.019836728,
    //             -0.022379898,
    //             -0.019836728,
    //             0.016276289,
    //             -0.015767656,
    //             0.013224485,
    //             0.012715851,
    //             -0.010172681,
    //             0.012715851,
    //             0.0147503875,
    //             -0.017293558,
    //             0.015767656,
    //             0.01881946,
    //             -0.016276289,
    //             0.018310826,
    //             0.0147503875,
    //             -0.011698583,
    //             -0.019836728,
    //             0.031026676,
    //             0.0239058,
    //             0.017293558,
    //             -0.05137204,
    //             -0.018310826,
    //             0.019328093,
    //             -0.024414435,
    //             0.022379898,
    //             0.033061214,
    //             -0.07222603,
    //             0.05798428,
    //             0.062053353,
    //             0.13529666,
    //             0.108847685,
    //             0.07629511,
    //             -0.06968287,
    //             -0.05035477,
    //             -0.045777064,
    //             -0.07883828,
    //             0.08443325,
    //             0.07476921,
    //             0.05289794,
    //             0.04272526,
    //             0.038147554,
    //             0.045777064,
    //             0.03000941,
    //             -0.02899214,
    //             0.02746624,
    //             -0.025940336,
    //             -0.02746624,
    //             -0.036621653,
    //             -0.036621653,
    //             -0.04882887,
    //             0.066631064,
    //             0.065105155,
    //             0.05493248,
    //             -0.04526843,
    //             -0.050863404,
    //             -0.04272526,
    //             -0.034078483,
    //             -0.02644897,
    //             -0.028483506,
    //             -0.023397166,
    //             0.029500775,
    //             -0.032043945,
    //             -0.02899214,
    //             -0.023397166,
    //             -0.026957605,
    //             -0.02644897,
    //             0.025431702,
    //             -0.03000941,
    //             -0.029500775,
    //             -0.02746624,
    //             -0.02644897,
    //             0.025431702,
    //             0.02899214,
    //             -0.019836728,
    //             -0.028483506,
    //             0.02644897,
    //             -0.028483506,
    //             0.050863404,
    //             0.033569846,
    //             -0.02492307,
    //             0.0925714,
    //             -0.031026676,
    //             0.023397166,
    //             0.03000941,
    //             0.030518044,
    //             0.03000941,
    //             -0.029500775,
    //             0.033061214,
    //             -0.061036088,
    //             0.035604384,
    //             0.03000941,
    //             -0.025940336,
    //             -0.009664047,
    //             0.008646779,
    //             -0.010172681,
    //             0.013224485,
    //             0.009664047,
    //             -0.019328093,
    //             0.015259022,
    //             -0.016784923,
    //             0.0066122427,
    //             -0.010681315,
    //             -0.0061036088,
    //             0.008646779,
    //             0.009155413,
    //             -0.010681315,
    //             0.011698583,
    //             -0.009155413,
    //             -0.007629511,
    //             0.007629511,
    //             0.008138145,
    //             -0.011698583,
    //             0.01373312,
    //             -0.008646779,
    //             -0.010172681,
    //             0.012715851,
    //             0.008646779,
    //             0.0071208766,
    //             -0.008646779,
    //             -0.010172681,
    //             -0.0071208766,
    //             0.010172681,
    //             -0.0122072175,
    //             0.0055949744,
    //             0.009155413,
    //             0.0066122427,
    //             0.01373312,
    //             -0.008138145,
    //             -0.009664047,
    //             -0.012715851,
    //             -0.012715851,
    //             -0.015767656,
    //             0.0066122427,
    //             0.0071208766,
    //             0.013224485,
    //             0.010681315,
    //             -0.007629511,
    //             0.039164823,
    //             0.016784923,
    //             0.017293558,
    //             0.06561379,
    //             -0.014241753,
    //             -0.009664047,
    //             -0.013224485,
    //             0.013224485,
    //             0.019328093,
    //             0.009664047,
    //             -0.05493248,
    //             0.008138145,
    //             0.034078483,
    //             -0.010681315,
    //             0.0122072175,
    //             0.010681315,
    //             -0.027974872,
    //             -0.026957605,
    //             -0.027974872,
    //             -0.031535313,
    //             -0.029500775,
    //             0.026957605,
    //             -0.035604384,
    //             0.027974872,
    //             0.02492307,
    //             -0.032043945,
    //             0.03509575,
    //             -0.04018209,
    //             -0.048320234,
    //             -0.034587115,
    //             0.05645838,
    //             0.054423843,
    //             -0.03509575,
    //             0.033569846,
    //             -0.022379898,
    //             0.02492307,
    //             -0.031026676,
    //             0.031535313,
    //             -0.031535313,
    //             0.030518044,
    //             -0.03000941,
    //             -0.027974872,
    //             -0.030518044,
    //             0.031535313,
    //             -0.038656186,
    //             -0.03000941,
    //             -0.035604384,
    //             0.044759795,
    //             0.031026676,
    //             0.032043945,
    //             0.032552578,
    //             0.044251163,
    //             -0.05747565,
    //             -0.05137204,
    //             -0.061036088,
    //             -0.09104549,
    //             0.06917423,
    //             0.05289794,
    //             -0.05900155,
    //             0.14292617,
    //             -0.18209098,
    //             -0.13682257,
    //             0.07629511,
    //             0.26499835,
    //             -0.25940338,
    //             0.2568602,
    //             -0.29805955,
    //             -0.0940973,
    //             0.07782101,
    //             -0.056967013,
    //             -0.1134254,
    //             0.05137204,
    //             0.049337503,
    //             0.034078483,
    //             0.028483506,
    //             0.02136263,
    //             -0.02644897,
    //             0.029500775,
    //             0.015767656,
    //             0.011698583,
    //             -0.022379898,
    //             -0.029500775,
    //             -0.017293558,
    //             -0.01373312,
    //             -0.015259022,
    //             0.011698583,
    //             -0.013224485,
    //             0.011698583,
    //             0.014241753,
    //             -0.009664047,
    //             -0.0122072175,
    //             0.011698583,
    //             -0.015767656,
    //             0.017802192,
    //             0.0122072175,
    //             -0.018310826,
    //             0.011189949,
    //             -0.016784923,
    //             -0.014241753,
    //             0.015259022,
    //             -0.019836728,
    //             0.015767656,
    //             0.019328093,
    //             -0.034078483,
    //             -0.034078483,
    //             0.04984614,
    //             0.04526843,
    //             -0.041199356,
    //             0.04526843,
    //             -0.06561379,
    //             -0.088502325,
    //             -0.08799369,
    //             0.06764833,
    //             -0.038656186,
    //             0.054423843,
    //             -0.05900155,
    //             -0.0701915,
    //             0.10070954,
    //             0.062053353,
    //             -0.08951959,
    //             -0.07578647,
    //             0.12156354,
    //             0.14953841,
    //             -0.14597797,
    //             -0.08036418,
    //             0.073243305,
    //             -0.05544111,
    //             0.04018209,
    //             -0.039673455,
    //             -0.055949744,
    //             -0.05645838,
    //             -0.05798428,
    //             0.04272526,
    //             0.04272526,
    //             -0.061036088,
    //             -0.06917423,
    //             -0.061036088,
    //             0.06612243,
    //             0.062053353,
    //             0.07120877,
    //             0.045777064,
    //             0.0462857,
    //             0.041199356,
    //             0.037130285,
    //             -0.046794333,
    //             0.03763892,
    //             -0.025431702,
    //             -0.033061214,
    //             0.025940336,
    //             0.028483506,
    //             -0.032552578,
    //             0.020853996,
    //             -0.012715851,
    //             -0.0122072175,
    //             -0.01373312,
    //             -0.02899214,
    //             0.033061214,
    //             0.024414435,
    //             0.02746624,
    //             -0.040690724,
    //             -0.03509575,
    //             0.041199356,
    //             -0.020345362,
    //             -0.019836728,
    //             -0.019328093,
    //             -0.020853996,
    //             -0.022888532,
    //             -0.024414435,
    //             0.022888532,
    //             -0.016784923,
    //             0.016784923,
    //             0.0239058,
    //             -0.015259022,
    //             -0.017293558,
    //             0.008646779,
    //             0.009664047,
    //             0.01373312,
    //             -0.014241753,
    //             -0.0122072175,
    //             0.015767656,
    //             0.036113016,
    //             0.020853996,
    //             -0.05493248,
    //             -0.023397166
    //         ],
    //         "time_data_values": [
    //             1729008000,
    //             1729008001,
    //             1729008002,
    //             1729008003,
    //             1729008004,
    //             1729008005,
    //             1729008006,
    //             1729008007,
    //             1729008008,
    //             1729008009,
    //             1729008010,
    //             1729008011,
    //             1729008012,
    //             1729008013,
    //             1729008014,
    //             1729008015,
    //             1729008016,
    //             1729008017,
    //             1729008018,
    //             1729008019,
    //             1729008020,
    //             1729008021,
    //             1729008022,
    //             1729008023,
    //             1729008024,
    //             1729008025,
    //             1729008026,
    //             1729008027,
    //             1729008028,
    //             1729008029,
    //             1729008030,
    //             1729008031,
    //             1729008032,
    //             1729008033,
    //             1729008034,
    //             1729008035,
    //             1729008036,
    //             1729008037,
    //             1729008038,
    //             1729008039,
    //             1729008040,
    //             1729008041,
    //             1729008042,
    //             1729008043,
    //             1729008044,
    //             1729008045,
    //             1729008046,
    //             1729008047,
    //             1729008048,
    //             1729008049,
    //             1729008050,
    //             1729008051,
    //             1729008052,
    //             1729008053,
    //             1729008054,
    //             1729008055,
    //             1729008056,
    //             1729008057,
    //             1729008058,
    //             1729008059,
    //             1729008060,
    //             1729008061,
    //             1729008062,
    //             1729008063,
    //             1729008064,
    //             1729008065,
    //             1729008066,
    //             1729008067,
    //             1729008068,
    //             1729008069,
    //             1729008070,
    //             1729008071,
    //             1729008072,
    //             1729008073,
    //             1729008074,
    //             1729008075,
    //             1729008076,
    //             1729008077,
    //             1729008078,
    //             1729008079,
    //             1729008080,
    //             1729008081,
    //             1729008082,
    //             1729008083,
    //             1729008084,
    //             1729008085,
    //             1729008086,
    //             1729008087,
    //             1729008088,
    //             1729008089,
    //             1729008090,
    //             1729008091,
    //             1729008092,
    //             1729008093,
    //             1729008094,
    //             1729008095,
    //             1729008096,
    //             1729008097,
    //             1729008098,
    //             1729008099,
    //             1729008100,
    //             1729008101,
    //             1729008102,
    //             1729008103,
    //             1729008104,
    //             1729008105,
    //             1729008106,
    //             1729008107,
    //             1729008108,
    //             1729008109,
    //             1729008110,
    //             1729008111,
    //             1729008112,
    //             1729008113,
    //             1729008114,
    //             1729008115,
    //             1729008116,
    //             1729008117,
    //             1729008118,
    //             1729008119,
    //             1729008120,
    //             1729008121,
    //             1729008122,
    //             1729008123,
    //             1729008124,
    //             1729008125,
    //             1729008126,
    //             1729008127,
    //             1729008128,
    //             1729008129,
    //             1729008130,
    //             1729008131,
    //             1729008132,
    //             1729008133,
    //             1729008134,
    //             1729008135,
    //             1729008136,
    //             1729008137,
    //             1729008138,
    //             1729008139,
    //             1729008140,
    //             1729008141,
    //             1729008142,
    //             1729008143,
    //             1729008144,
    //             1729008145,
    //             1729008146,
    //             1729008147,
    //             1729008148,
    //             1729008149,
    //             1729008150,
    //             1729008151,
    //             1729008152,
    //             1729008153,
    //             1729008154,
    //             1729008155,
    //             1729008156,
    //             1729008157,
    //             1729008158,
    //             1729008159,
    //             1729008160,
    //             1729008161,
    //             1729008162,
    //             1729008163,
    //             1729008164,
    //             1729008165,
    //             1729008166,
    //             1729008167,
    //             1729008168,
    //             1729008169,
    //             1729008170,
    //             1729008171,
    //             1729008172,
    //             1729008173,
    //             1729008174,
    //             1729008175,
    //             1729008176,
    //             1729008177,
    //             1729008178,
    //             1729008179,
    //             1729008180,
    //             1729008181,
    //             1729008182,
    //             1729008183,
    //             1729008184,
    //             1729008185,
    //             1729008186,
    //             1729008187,
    //             1729008188,
    //             1729008189,
    //             1729008190,
    //             1729008191,
    //             1729008192,
    //             1729008193,
    //             1729008194,
    //             1729008195,
    //             1729008196,
    //             1729008197,
    //             1729008198,
    //             1729008199,
    //             1729008200,
    //             1729008201,
    //             1729008202,
    //             1729008203,
    //             1729008204,
    //             1729008205,
    //             1729008206,
    //             1729008207,
    //             1729008208,
    //             1729008209,
    //             1729008210,
    //             1729008211,
    //             1729008212,
    //             1729008213,
    //             1729008214,
    //             1729008215,
    //             1729008216,
    //             1729008217,
    //             1729008218,
    //             1729008219,
    //             1729008220,
    //             1729008221,
    //             1729008222,
    //             1729008223,
    //             1729008224,
    //             1729008225,
    //             1729008226,
    //             1729008227,
    //             1729008228,
    //             1729008229,
    //             1729008230,
    //             1729008231,
    //             1729008232,
    //             1729008233,
    //             1729008234,
    //             1729008235,
    //             1729008236,
    //             1729008237,
    //             1729008238,
    //             1729008239,
    //             1729008240,
    //             1729008241,
    //             1729008242,
    //             1729008243,
    //             1729008244,
    //             1729008245,
    //             1729008246,
    //             1729008247,
    //             1729008248,
    //             1729008249,
    //             1729008250,
    //             1729008251,
    //             1729008252,
    //             1729008253,
    //             1729008254,
    //             1729008255,
    //             1729008256,
    //             1729008257,
    //             1729008258,
    //             1729008259,
    //             1729008260,
    //             1729008261,
    //             1729008262,
    //             1729008263,
    //             1729008264,
    //             1729008265,
    //             1729008266,
    //             1729008267,
    //             1729008268,
    //             1729008269,
    //             1729008270,
    //             1729008271,
    //             1729008272,
    //             1729008273,
    //             1729008274,
    //             1729008275,
    //             1729008276,
    //             1729008277,
    //             1729008278,
    //             1729008279,
    //             1729008280,
    //             1729008281,
    //             1729008282,
    //             1729008283,
    //             1729008284,
    //             1729008285,
    //             1729008286,
    //             1729008287,
    //             1729008288,
    //             1729008289,
    //             1729008290,
    //             1729008291,
    //             1729008292,
    //             1729008293,
    //             1729008294,
    //             1729008295,
    //             1729008296,
    //             1729008297,
    //             1729008298,
    //             1729008299,
    //             1729008300,
    //             1729008301,
    //             1729008302,
    //             1729008303,
    //             1729008304,
    //             1729008305,
    //             1729008306,
    //             1729008307,
    //             1729008308,
    //             1729008309,
    //             1729008310,
    //             1729008311,
    //             1729008312,
    //             1729008313,
    //             1729008314,
    //             1729008315,
    //             1729008316,
    //             1729008317,
    //             1729008318,
    //             1729008319,
    //             1729008320,
    //             1729008321,
    //             1729008322,
    //             1729008323,
    //             1729008324,
    //             1729008325,
    //             1729008326,
    //             1729008327,
    //             1729008328,
    //             1729008329,
    //             1729008330,
    //             1729008331,
    //             1729008332,
    //             1729008333,
    //             1729008334,
    //             1729008335,
    //             1729008336,
    //             1729008337,
    //             1729008338,
    //             1729008339,
    //             1729008340,
    //             1729008341,
    //             1729008342,
    //             1729008343,
    //             1729008344,
    //             1729008345,
    //             1729008346,
    //             1729008347,
    //             1729008348,
    //             1729008349,
    //             1729008350,
    //             1729008351,
    //             1729008352,
    //             1729008353,
    //             1729008354,
    //             1729008355,
    //             1729008356,
    //             1729008357,
    //             1729008358,
    //             1729008359,
    //             1729008360,
    //             1729008361,
    //             1729008362,
    //             1729008363,
    //             1729008364,
    //             1729008365,
    //             1729008366,
    //             1729008367,
    //             1729008368,
    //             1729008369,
    //             1729008370,
    //             1729008371,
    //             1729008372,
    //             1729008373,
    //             1729008374,
    //             1729008375,
    //             1729008376,
    //             1729008377,
    //             1729008378,
    //             1729008379,
    //             1729008380,
    //             1729008381,
    //             1729008382,
    //             1729008383,
    //             1729008384,
    //             1729008385,
    //             1729008386,
    //             1729008387,
    //             1729008388,
    //             1729008389,
    //             1729008390,
    //             1729008391,
    //             1729008392,
    //             1729008393,
    //             1729008394,
    //             1729008395,
    //             1729008396,
    //             1729008397,
    //             1729008398,
    //             1729008399,
    //             1729008400,
    //             1729008401,
    //             1729008402,
    //             1729008403,
    //             1729008404,
    //             1729008405,
    //             1729008406,
    //             1729008407,
    //             1729008408,
    //             1729008409,
    //             1729008410,
    //             1729008411,
    //             1729008412,
    //             1729008413,
    //             1729008414,
    //             1729008415,
    //             1729008416,
    //             1729008417,
    //             1729008418,
    //             1729008419,
    //             1729008420,
    //             1729008421,
    //             1729008422,
    //             1729008423,
    //             1729008424,
    //             1729008425,
    //             1729008426,
    //             1729008427,
    //             1729008428,
    //             1729008429,
    //             1729008430,
    //             1729008431,
    //             1729008432,
    //             1729008433,
    //             1729008434,
    //             1729008435,
    //             1729008436,
    //             1729008437,
    //             1729008438,
    //             1729008439,
    //             1729008440,
    //             1729008441,
    //             1729008442,
    //             1729008443,
    //             1729008444,
    //             1729008445,
    //             1729008446,
    //             1729008447,
    //             1729008448,
    //             1729008449,
    //             1729008450,
    //             1729008451,
    //             1729008452,
    //             1729008453,
    //             1729008454,
    //             1729008455,
    //             1729008456,
    //             1729008457,
    //             1729008458,
    //             1729008459,
    //             1729008460,
    //             1729008461,
    //             1729008462,
    //             1729008463,
    //             1729008464,
    //             1729008465,
    //             1729008466,
    //             1729008467,
    //             1729008468,
    //             1729008469,
    //             1729008470,
    //             1729008471,
    //             1729008472,
    //             1729008473,
    //             1729008474,
    //             1729008475,
    //             1729008476,
    //             1729008477,
    //             1729008478,
    //             1729008479,
    //             1729008480,
    //             1729008481,
    //             1729008482,
    //             1729008483,
    //             1729008484,
    //             1729008485,
    //             1729008486,
    //             1729008487,
    //             1729008488,
    //             1729008489,
    //             1729008490,
    //             1729008491,
    //             1729008492,
    //             1729008493,
    //             1729008494,
    //             1729008495,
    //             1729008496,
    //             1729008497,
    //             1729008498,
    //             1729008499,
    //             1729008500,
    //             1729008501,
    //             1729008502,
    //             1729008503,
    //             1729008504,
    //             1729008505,
    //             1729008506,
    //             1729008507,
    //             1729008508,
    //             1729008509,
    //             1729008510,
    //             1729008511,
    //             1729008512,
    //             1729008513,
    //             1729008514,
    //             1729008515,
    //             1729008516,
    //             1729008517,
    //             1729008518,
    //             1729008519,
    //             1729008520,
    //             1729008521,
    //             1729008522,
    //             1729008523,
    //             1729008524,
    //             1729008525,
    //             1729008526,
    //             1729008527,
    //             1729008528,
    //             1729008529,
    //             1729008530,
    //             1729008531,
    //             1729008532,
    //             1729008533,
    //             1729008534,
    //             1729008535,
    //             1729008536,
    //             1729008537,
    //             1729008538,
    //             1729008539,
    //             1729008540,
    //             1729008541,
    //             1729008542,
    //             1729008543,
    //             1729008544,
    //             1729008545,
    //             1729008546,
    //             1729008547,
    //             1729008548,
    //             1729008549,
    //             1729008550,
    //             1729008551,
    //             1729008552,
    //             1729008553,
    //             1729008554,
    //             1729008555,
    //             1729008556,
    //             1729008557,
    //             1729008558,
    //             1729008559,
    //             1729008560,
    //             1729008561,
    //             1729008562,
    //             1729008563,
    //             1729008564,
    //             1729008565,
    //             1729008566,
    //             1729008567,
    //             1729008568,
    //             1729008569,
    //             1729008570,
    //             1729008571,
    //             1729008572,
    //             1729008573,
    //             1729008574,
    //             1729008575,
    //             1729008576,
    //             1729008577,
    //             1729008578,
    //             1729008579,
    //             1729008580,
    //             1729008581,
    //             1729008582,
    //             1729008583,
    //             1729008584,
    //             1729008585,
    //             1729008586,
    //             1729008587,
    //             1729008588,
    //             1729008589,
    //             1729008590,
    //             1729008591,
    //             1729008592,
    //             1729008593,
    //             1729008594,
    //             1729008595,
    //             1729008596,
    //             1729008597,
    //             1729008598,
    //             1729008599,
    //             1729008600
    //         ]
    //     }

    //     let echartsData = [];
    //     console.log("(mockData.fengzhi_data_values.length", mockData.time_data_values.length)
    //     console.log("(mockData.fengzhi_data_values.length", mockData.fengzhi_data_values.length)
    //     for (let i = 0; i < mockData.fengzhi_data_values.length; i += interval) {
    //         console.log(i)
    //         echartsData.push({
    //             name: nodes,
    //             time: mockData.time_data_values[i] * 1000, // 转换为毫秒
    //             value: mockData.fengzhi_data_values[i]
    //         });
    //     }

    //     resolve(echartsData);
    // });
    //end

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

        $.ajax({
            url: 'http://10.62.213.53:9000/fengzhi/get?collection_name=' + encodedNodes + '&start_time=' + encodedNewbegin + '&end_time=' + encodedNewend,
            // url: urlcc,

            method: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log('response.namevalue',response.namevalue)
                let echartsData = [];
                for (let i = 0; i < response.fengzhi_data_values.length; i += interval) {
                    // console.log(i)
                    absdata = Math.abs(response.fengzhi_data_values[i])
                    echartsData.push({
                        name: response.namevalue,
                        time: response.time_data_values[i] * 1000, // 转换为毫秒
                        // value: response.fengzhi_data_values[i]
                        value: absdata
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