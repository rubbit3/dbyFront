$(function () {
    loadProjInfo();
    // loadProjAddress();
    platformname();
    loadpicture();
})

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

var tokenname = $.cookie('token');
var url = window.location.href;
var obj = {};
str = url.split("?")[1].split("&");
for (let i = 0; i < str.length; i++) {
    let a = str[i].split('='); // 小1
    obj[a[0]] = a[1];  // 小2
}
var lat;
var lng;

var subproject = {};
var username = obj.name;
var building = obj.building;
var type = obj.type;


//获取建筑物名称、建筑物概述、建筑物位置
function loadProjInfo() {
    $.ajax({
        type: 'get',
        url: wz[3] + username,
        dataType: "json",
        success: function (res) {
            for (var i = 0; i < res["data"].length; i++) {
                if (res["data"][i].id == building) {
                    subproject = res["data"][i];
                    subproject.lng = subproject.location.split(",")[0];
                    subproject.lat = subproject.location.split(",")[1];
                }
            }
            lng = subproject.lng;
            lat = subproject.lat;
            loadProjAddress();
            document.getElementById("address_lng").value = subproject.lng;
            document.getElementById("address_lat").value = subproject.lat;
            document.getElementById("loadBuildingname").innerHTML = subproject.name;
            document.getElementById("loadBuildingdescription").innerHTML = subproject.description;
            document.getElementById("changebuilding-description").value = subproject.description;
        },
        error: function (res) {
            console.log(res);
        }
    });
}

//修改建筑物名称
function changeName() {
    newname = $("#changebuilding-name").val();
    $.ajax({
        url: wz[4],
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            "token": tokenname,
            "body": {
                "name": newname,
            },
            "ID_project": building
        }),
        dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）    
        success: function (data) {
            $('#ChangeBudilngNameModal').modal('hide');
            Swal.fire('建筑物名称修改成功！')
            loadProjInfo();
        },
        error: function (err) {
            console.log(err)
        }
    })
}

//修改建筑物概述
function changeDescription() {
    newdescription = $("#changebuilding-description").val();
    $.ajax({
        url: wz[4],
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            "token": tokenname,
            "body": {
                "description": newdescription,
            },
            "ID_project": building
        }),
        dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）    
        success: function (data) {
            $('#ChangeBudilngdesModal').modal('hide');
            Swal.fire('建筑物概述修改成功！')
            loadProjInfo();
        },
        error: function (err) {
            console.log(err)
        }
    })
}

//获取建筑物位置
function loadProjAddress() {
    var map = new BMap.Map("container");
    var point = new BMap.Point(lng, lat);
    map.centerAndZoom(point, 16);                   // 初始化地图,设置城市和地图级别
    var marker1 = new BMap.Marker(new BMap.Point(lng, lat));
    map.addOverlay(marker1);
    map.enableScrollWheelZoom(true);
    var localSearch = new BMap.LocalSearch(map);
    $("#address").blur(function () {
        map.clearOverlays();//清空原来的标注
        var keyword = document.getElementById("address").value;
        localSearch.setSearchCompleteCallback(function (searchResult) {
            var poi = searchResult.getPoi(0);
            document.getElementById("address_lng").value = poi.point.lng;
            document.getElementById("address_lat").value = poi.point.lat;
            map.centerAndZoom(poi.point, 13);
            var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地方对应的经纬度
            map.addOverlay(marker);
        });
        localSearch.search(keyword);
    })

    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {
            "input": "address"
            , "location": map
        });

    ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province + _value.city + _value.district + _value.street + _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });

    var myValue;

    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
        setPlace();
    });

    function G(id) {
        return document.getElementById(id);
    }

    function setPlace() {
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp));    //添加标注
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }
}

//修改建筑物位置
function changeaddress() {
    var url = window.location.href;
    var obj = {};
    str = url.split("?")[1].split("&");
    for (let i = 0; i < str.length; i++) {
        let a = str[i].split('='); // 小1
        obj[a[0]] = a[1];  // 小2
    }
    id = obj.building;
    ccity = obj.city;
    newLocation = $("#address_lng").val() + "," + $("#address_lat").val();
    if ($("#address").val() == []) {
        Swal.fire('请输入地址！')
    } else {
        $.ajax({
            url: wz[4],
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify({
                "token": tokenname,
                "body": {
                    "location": newLocation,
                },
                "ID_project": building
            }),
            dataType: "json",
            success: function (data) {
                Swal.fire('地址修改成功！')
                loadProjInfo();
            },
            error: function (err) {
                console.log(err)
            }
        })
    }
}

//上传图片
function uploadpicture() {
    var form = document.getElementById("myForm");
    var formData = new FormData(form);
    formData.append("ID_project", building);
    $.ajax({
        url: wz[5],
        type: "POST",
        data: formData,
        processData: false,  // 不处理数据
        contentType: false,   // 不设置内容类型
        success: function (msg) {
            $('#ChangeBudilngPicModal').modal('hide');
            $("#preview_out").empty();
            loadpicture();
        }, error: function (err) {
            console.log(err)
        }
    });
}

//加载图片
function loadpicture() {
    userole = $.cookie('userrole');
    $("#preview_out").empty();
    $.ajax({
        type: 'GET',//从服务器获取数据
        url: wz[6] + building,//发送请求的页面
        dataType: "json",
        async: false,
        success: function (res) {
            for (var i = 0; i < res.data.length; i++) {
                $("#preview_out").append("<li style='position:relative'><img src = 'http://10.62.213.53:9000" + res.data[i].file + "' style='width:250px;height:250px;border-style:solid;border-width:1px;border-color:blue'>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + res.data[i].name + "<div style='height:5px'></div>" +
                    "<span style='position:absolute;top:5px;left:0px'><button id='bnn1' type='button' class='btn btn-light btn-xs'  data-bs-toggle='modal' data-bs-target='#edit' onclick='Values(\"" + res.data[i].id + "\",\"" + res.data[i].name + "\")'>修改说明</button></span>" +
                    "<span style='position:absolute;top:40px;left:0px'><button id='bnn2' type='button' class='btn btn-light btn-xs' onclick='deletepicture(\"" + res.data[i].id + "\")'>删除</button></span>" +
                    "</li>");
            }
            if (userole == 'u') {
                document.getElementById("bnn1").style.display = "none";
                document.getElementById("bnn2").style.display = "none";
            } else {
                document.getElementById("bnn1").style.display = "block";
                document.getElementById("bnn2").style.display = "block";
            }
        },
        error: function (res) {
            console.log(res);
        }
    });

}

var photoid = "";
function Values(ID, y) {
    $("#picid").val(ID);
    document.getElementById("picname").value = y;
    var photoid = $("#picid").val();
}

function editpicturename() {
    var photoid = $("#picid").val();
    var phootname = $("#picname").val();
    $.ajax({
        url: wz[5],
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(
            {
                "name": phootname,
                "photoID": photoid,
                "ID_project": building
            }),
        dataType: "json",    
        success: function (data) {
            $('#edit').modal('hide');
            Swal.fire('图片说明修改成功！')
            $("#preview_out").empty();
            loadpicture();
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function deletepicture(url) {
    Swal.fire({
        title: '请问您是否要删除该图片?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'DELETE',
                url: wz[5],
                dataType: "json",
                data: {
                    "photoID": url,
                    "ID_project": building
                },
                success: function (res) {
                    $("#preview_out").empty();
                    loadpicture();
                },
                error: function (res) {
                    console.log(res);
                }
            });
        }
    })
}


