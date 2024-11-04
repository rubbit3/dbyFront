$(function () {
    platformname();
    timerange();
})
let selectedAlgorithm = '';

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function () {
        selectedAlgorithm = this.getAttribute('data-value');
    });
});

function ProcessData() {
    var leftImage = document.getElementById('left_image');  
    var rightImage = document.getElementById('right_image');
    switch (selectedAlgorithm) {
        case 'zeroDriftCorrection':
            leftImage.src = './dist/images/zeroDriftCorrection2.png';  
            rightImage.src = './dist/images/zeroDriftCorrection1.png';  
            break;
        case 'filtering':
            leftImage.src = './dist/images/filtering1.png';
            rightImage.src = './dist/images/filtering2.png';
            break;
        case 'dataCompletion':
            leftImage.src = './dist/images/dataCompletion1.png';
            rightImage.src = './dist/images/dataCompletion2.png';
            break;
        case 'outlierRemoval':
            leftImage.src = './dist/images/outlierRemoval1.png';
            rightImage.src = './dist/images/outlierRemoval2.png';
            break;
        case 'trendRemoval':
            leftImage.src = './dist/images/trendRemoval1.png';
            rightImage.src = './dist/images/trendRemoval2.png';
            break;
        default:
            alert('请选择数据处理算法！');
            return;
    }
}

$(window).resize(function () {
});

$(document).ready(function () {
    $('.dropdown-menu a').click(function () {
        $('#dropdownMenuButton').text($(this).text());
    });
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

function ViewData() {
    setTimeout(function () {
    }, 2000);
}
