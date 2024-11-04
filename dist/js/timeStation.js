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
    timestamp = timestamp
    // timestamp = timestamp / 1000; //时间戳为13位需除1000，时间戳为13位的话不需除1000
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

    var timeDiff = newend - newbegin;
    var diffHours = timeDiff / 3600000;

    if (diffHours > 1) {
        alert("选择的时间段不能大于一小时，请重新选择！");
        return; 
    }

    showLoadingOverlay();

    var myChart = echarts.init(document.getElementById('dataview'));

    const promises = nodes.map(node => {
        return fetchDataForNode(projectID, node.id, newbegin, newend);
    });

    Promise.all(promises).then(results => {
        let seriesData = results.flat(); // Flatten the array of arrays
        
        // Assuming the first data item contains the field names for units
        let xAxisUnit = seriesData[0]?.data[0]?.xUnit || "时间(ms)"; // Default unit
        let yAxisUnit = seriesData[0]?.data[0]?.yUnit || "幅值(cm/s^2)"; // Default unit
    
        var option = {
            // tooltip: {
            //     trigger: 'axis',
            //     formatter: function (params) {
            //         let tooltipContent = params.map(param => {
            //             const seriesName = param.seriesName;
            //             const data = param.data;
            //             const timestamp = data[0];
            //             const value = data[1];
    
            //             // 获取当前系列的颜色
            //             const color = param.color;
    
            //             // 将时间戳转换为毫秒级格式
            //             const date = new Date(timestamp);
            //             const formattedTime = `${date.getUTCFullYear()}-${('0' + (date.getUTCMonth() + 1)).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)} ` +
            //                                   `${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}:${('0' + date.getUTCSeconds()).slice(-2)}.` +
            //                                   `${('00' + date.getUTCMilliseconds()).slice(-3)}`;
    
            //             return `<div style="color:${color};"><strong>${seriesName}</strong><br>${formattedTime}: ${value}</div>`;
            //         }).join('<br>');
    
            //         return tooltipContent;
            //     }
            // },
            tooltip: {
                trigger: 'axis',
                // formatter: function (params) {
                //     let tooltipContent = params.map(param => {
                //         const seriesName = param.seriesName;
                //         const data = param.data;
                //         const timestamp = data[0]; // 确保这里的timestamp是动态更新的正确值
                //         const value = data[1];
            
                //         // 获取当前系列的颜色
                //         const color = param.color;
            
                //         // 将时间戳转换为毫秒级格式
                //         const date = new Date(timestamp); // 确保timestamp是正确的时间戳
                //         const formattedTime = `${date.getUTCFullYear()}-${('0' + (date.getUTCMonth() + 1)).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)} ` +
                //                               `${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}:${('0' + date.getUTCSeconds()).slice(-2)}.` +
                //                               `${('00' + date.getUTCMilliseconds()).slice(-3)}`;
            
                //         return `<div style="color:${color};"><strong>${seriesName}</strong><br>${formattedTime}: ${value}</div>`;
                //     }).join('<br>');
            
                //     return tooltipContent;
                // }
            },
            
            legend: {
                data: seriesData.map(data => data.name),
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
                name: xAxisUnit,
                nameLocation: "center",
                type: 'time',
                nameGap: 30,
                splitLine: {
                    show: false,
                    rotate: 30,
                },
                // axisLabel: {
                    // formatter: function (value) {
                    //     var date = new Date(value);
                    //     return `${date.getUTCFullYear()}-${('0' + (date.getUTCMonth() + 1)).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)} ` +
                    //            `${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}:${('0' + date.getUTCSeconds()).slice(-2)}.` +
                    //            `${('00' + date.getUTCMilliseconds()).slice(-3)}`;
                    // }
                // }
                axisLabel: {
                    formatter: function (value) {
                        var date = new Date(value);  // 将毫秒级时间戳转换为Date对象
                        return `${date.getUTCFullYear()}-${('0' + (date.getUTCMonth() + 1)).slice(-2)}-${('0' + date.getUTCDate()).slice(-2)} ` +
                               `${('0' + date.getUTCHours()).slice(-2)}:${('0' + date.getUTCMinutes()).slice(-2)}:${('0' + date.getUTCSeconds()).slice(-2)}.` +
                               `${('000' + date.getUTCMilliseconds()).slice(-3)}`;  // 确保毫秒是三位数
                    }
                }
                
            },
            yAxis: {
                name: yAxisUnit,
                nameLocation: 'center',
                type: 'value',
                nameGap: 30,
                scale: true
            },
            series: seriesData
        };
    
        myChart.setOption(option, true);
    
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
        dblClickExpand: false,  // 双击节点时，是否自动展开父节点的标识
        showLine: true,         // 设置ztree是否显示节点之间的连线
        selectedMulti: false,   // 设置是否允许同时选中多个节点
    },
    check: {  
        enable: true,  
        chkboxType: { "Y": "", "N": "" }, // 单选模式
        chkStyle: "radio", // 设置checkbox为radio单选模式
        radioType: "all"  // 全局单选模式（可选），"all"表示所有节点都在一个单选组中
    }, 
    data: {
        simpleData: {
            enable: true,        // 是否使用简单数据模式
            idKey: "id",        // 节点数据中保存唯一标识的属性名称
            pIdKey: "pId",     // 节点数据中保存其父节点唯一标识的属性名称
            rootPId: 0         // 用于修正根节点父节点的数据，即pIdKey指定的属性值
        }
    }
};


function initTree() {
    $.ajax({
        url: wz[50],
        success: function (msg) {

            console.log(msg.data)
            zNodes = msg.data.map(item => ({
                name: item.name,
                id: item.value,
                idname: item.value,
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
            url: wz[51],
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                "id": nodes,
                "startTime": newbegin,
                "endTime": newend
            }),
            success: function (response) {
                console.log(response);

                let echartsData = [];
                
                response.data.forEach(collection => {
                    collection.data.forEach(record => {
                        let values = record.value;
                        let startTime = record.tsStart;
                        let sampleRate = record.rate;

                        let seriesData = values.map((value, index) => {
                            let timeStampMs = startTime + index * (1000 / sampleRate); 
                            return [timeStampMs, value];
                        });

                        echartsData.push({
                            name: `${collection.collection} (${record.unit})`,
                            // name: `${collection.collection}-${record.channel} (${record.unit})`,
                            type: 'line',
                            showSymbol: false,
                            hoverAnimation: false,
                            data: seriesData
                        });
                    });
                });

                console.log(echartsData);
                resolve(echartsData);
            },
            error: function (xhr, status, error) {
                console.error("AJAX request failed: ", status, error);
                reject(error);
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