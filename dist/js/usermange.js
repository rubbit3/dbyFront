$(function () {
    admininfo();
    table();
    admintable();
    touristtable();
    platformname();
    loadadminloginrecord();
    timerange();
    timerange3();
    var str = "";
    var url = window.location.href;
    var obj = {};
    if (url.charAt(url.length - 1) == "#") {
        url = url.substring(0, url.length - 1);
    }
    str = url.split("?")[1].split("&");
    for (let i = 0; i < str.length; i++) {
        let a = str[i].split('=');
        obj[a[0]] = a[1];
    }
    username = obj.name;
    type = obj.type;
});

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

//通过接口登出
function logout() {
    var token = $.cookie('token');
    console.log(JSON.stringify(token));
    Swal.fire({
        title: '请问您是否要退出系统?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '确认登出',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: wz[8],
                type: "PUT",//取代资源
                contentType: "application/json", //发送信息至服务器时内容编码类型，必须这样写,添加的参数为json格式
                data: JSON.stringify({  //转json格式，前端获取用户输入的用户名、密码、验证码信息，发送到服务器
                    "token": token
                }),
                dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）    
                success: function (data) {
                    $.cookie('token', null, { expires: -1 });
                    // alert("退出成功！返回登录页面");
                    window.location.href = "../login.html";//跳转到login.html页面
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
    })
}

function jumptohome() {
    window.location.href = "index.html?name=" + hrefname;
}

function fhindex() {
    window.history.back(-1);
}

function setActiveNavItem(itemClass) {
    // 首先移除所有 nav-item 的 active 类  
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function (item) {
        item.classList.remove('active');
    });

    // 然后为指定的 nav-item 添加 active 类  
    var activeItem = document.querySelector('.' + itemClass);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

function superadmin() {
    document.getElementById("user_tab_edit").style.display = "block";
    document.getElementById("user_tab_admin").style.display = "none";
    document.getElementById("user_tab_tourist").style.display = "none";
    document.getElementById("user_tab_superadmin").style.display = "none";
    document.getElementById("user_edit").style.display = "none";
    document.getElementById("buttonpart").style.display = "none";
}

function alluser() {
    setActiveNavItem('alluser-nav-item');
    document.getElementById("user_tab_edit").style.display = "none";
    document.getElementById("user_tab_admin").style.display = "none";
    document.getElementById("user_tab_tourist").style.display = "none";
    document.getElementById("user_tab_superadmin").style.display = "block";
    document.getElementById("user_edit").style.display = "none";
    document.getElementById("buttonpart").style.display = "block";
}

function admin() {
    setActiveNavItem('admin-nav-item');
    document.getElementById("user_tab_edit").style.display = "none";
    document.getElementById("user_tab_admin").style.display = "block";
    document.getElementById("user_tab_tourist").style.display = "none";
    document.getElementById("user_tab_superadmin").style.display = "none";
    document.getElementById("user_edit").style.display = "none";
    document.getElementById("buttonpart").style.display = "block";
}

function tourist() {
    setActiveNavItem('tourist-nav-item');
    document.getElementById("user_tab_edit").style.display = "none";
    document.getElementById("user_tab_admin").style.display = "none";
    document.getElementById("user_tab_tourist").style.display = "block";
    document.getElementById("user_tab_superadmin").style.display = "none";
    document.getElementById("user_edit").style.display = "none";
    document.getElementById("buttonpart").style.display = "block";
}

adminlist = [];
userlist = [];

function table() {
    $('#table').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[16] + "/?token=" + tokenname,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: '',
                jsonp: 'callback',
                success: function (msg) {
                    request.success({
                        row: msg["data"]
                    });
                    $('#table').bootstrapTable('load', msg["data"]);
                    const mapRole = { a: '管理员', u: '访客' };
                    for (var i = 0; i < msg["data"]["result"]["a"].length; i++) {
                        msg["data"]["result"]["a"][i].role = mapRole[msg["data"]["result"]["a"][i].role];
                    }
                    for (var i = 0; i < msg["data"]["result"]["u"].length; i++) {
                        msg["data"]["result"]["u"][i].role = mapRole[msg["data"]["result"]["u"][i].role];
                    }

                    if (msg["data"]["result"]["u"].length == 0) {
                        $('#table').bootstrapTable('load', msg["data"]["result"]["a"]);
                    } if (msg["data"]["result"]["a"].length == 0) {
                        $('#table').bootstrapTable('load', msg["data"]["result"]["u"]);
                    } else {
                        $('#table').bootstrapTable('load', msg["data"]["result"]["u"]);
                        $('#table').bootstrapTable('append', msg["data"]["result"]["a"]);
                    }
                    for (var i = 0; i < msg["data"]["result"]["a"].length; i++) {
                        adminlist[i] = msg["data"]["result"]["a"][i].name;
                    }
                    for (var i = 0; i < msg["data"]["result"]["u"].length; i++) {
                        userlist[i] = msg["data"]["result"]["u"][i].name;
                    }
                    console.log(adminlist);
                    console.log(userlist);
                },
                error: function () {
                    alert("错误");
                }
            });
        },
        pagination: true,//是否分页
        showloading: false,
        sidePagination: 'client',//server:服务器端分页|client：前端分页
        pageSize: 10,//单页记录数
        pageList: [10],
        columns: [{
            field: 'role',
            title: '权限',
        }, {
            field: 'name',
            title: '用户名',
        },
        {
            field: 'phone',
            title: '联系电话',
        },
        {
            field: 'email',
            title: '电子邮箱',
        },
        {
            field: '',
            title: '访问继承',
        },
        {
            field: 'description',
            title: '用户备注',
        },
        {
            field: 'index',
            title: '操作',
            events: operateEvents,
            formatter: operateFormatter,
        }]
    });
}

function admintable() {
    $('#admintable').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[16] + "/?token=" + tokenname,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: '',
                jsonp: 'callback',
                success: function (msg) {
                    request.success({
                        row: msg["data"]["result"]["a"]
                    });
                    $('#table').bootstrapTable('load', msg["data"]);
                    const mapRole = { a: '管理员', u: '访客' };
                    for (var i = 0; i < msg["data"]["result"]["a"].length; i++) {
                        msg["data"]["result"]["a"][i].role = mapRole[msg["data"]["result"]["a"][i].role];
                    }
                    $('#admintable').bootstrapTable('load', msg["data"]["result"]["a"]);
                },
                error: function () {
                    alert("错误");
                }
            });
        },
        pagination: true,//是否分页
        sidePagination: 'client',//server:服务器端分页|client：前端分页
        pageSize: 10,//单页记录数
        pageList: [10],
        columns: [{
            field: 'role', //要与数据key一一对应
            title: '权限',//表头名
        }, {
            field: 'name', //要与数据key一一对应
            title: '用户名',//表头名
        },
        {
            field: 'phone',
            title: '联系电话',
        },
        {
            field: 'email',
            title: '电子邮箱',
        },
        {
            field: '',
            title: '访问继承',
        },
        {
            field: 'description',
            title: '用户备注',
        },
        {
            field: 'index',
            title: '操作',
            events: operateEvents,
            formatter: operateFormatter,
        }]
    });
}

function touristtable() {
    $('#touristtable').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[16] + "/?token=" + tokenname,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: '',
                jsonp: 'callback',
                success: function (msg) {
                    request.success({
                        row: msg["data"]["result"]["u"]
                    });
                    const mapRole = { a: '管理员', u: '访客' };
                    for (var i = 0; i < msg["data"]["result"]["u"].length; i++) {
                        msg["data"]["result"]["u"][i].role = mapRole[msg["data"]["result"]["u"][i].role];
                    }
                    $('#touristtable').bootstrapTable('load', msg["data"]["result"]["u"]);
                },
                error: function () {
                    alert("错误");
                }
            });
        },
        pagination: true,//是否分页
        sidePagination: 'client',//server:服务器端分页|client：前端分页
        pageSize: 10,//单页记录数
        pageList: [10],
        columns: [{
            field: 'role', //要与数据key一一对应
            title: '权限',//表头名
        }, {
            field: 'name', //要与数据key一一对应
            title: '用户名',//表头名
        },
        {
            field: 'phone',
            title: '联系电话',
        },
        {
            field: 'email',
            title: '电子邮箱',
        },
        {
            field: '',
            title: '访问继承',
        },
        {
            field: 'description',
            title: '用户备注',
        },
        {
            field: 'index',
            title: '操作',
            events: operateEvents,
            formatter: operateFormatter,
        }]
    });
}

var tokenname = "";
var tokenname = $.cookie('token');

function save() {
    const mapRole = { a: '管理员', u: '访客' }
    var newdata = {
        role: mapRole[$("input[type='radio']:checked").val()],
        name: $('#name').val(),
        phone: $('#phone').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        description: $('#description').val()
    }
    $('#table').bootstrapTable('append', newdata);

    $("#exampleModal").on('show.bs.modal', function () {
        $("#name")[0].value = "";
        $('input:radio[name=optradio]')[0].checked = false;
        $('input:radio[name=optradio]')[1].checked = false;
        $("#password")[0].value = "";
        $("#email")[0].value = "";
        $("#description")[0].value = "";
        $("#phone")[0].value = "";
    });

    const fetchData = {
        ...newdata,
        role: $("input[type='radio']:checked").val()
    }


    $.ajax({
        type: "POST",//向服务器推送数据
        url: "http://test.com",
        contentType: "application/json", //必须这样写,添加的参数为json格式
        dataType: "json",
        data: JSON.stringify(fetchData),
    });
    buildprojtree();
}

var username = "";
var passord = "";
var role = "";
var email = "";
var phone = "";
var description = "";

function myFunction() {
    var x = $('#email').val();
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    var email_prompt = $("#tip");
    if (re.test(x)) {
        $("#emailtip").html(" ");
        $('#email').css('border-color', '#ccc');
    } else {
        $("#emailtip").html("邮箱格式不正确");
        $('#email').css('border-color', 'red');
    }
}

function RegisterUser() {
    var username = $('#name').val();
    var passord = $('#password').val();
    var role = $("input[type='radio']:checked").val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var description = $('#description').val();
    $.ajax({
        type: "POST",
        url: wz[16],
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "name": username,
            "password": passord,
            "token": tokenname,
            "role": role,
            "email": email,
            "phone": phone,
            "description": description
        }),
        success: function (res) {
            Swal.fire('添加用户成功！')
            $('#adduserModal').modal('hide');
            $('#table').bootstrapTable('refresh');
            // 清空表单字段  
            $('#name').val("");
            $('#password').val("");
            $('#email').val("");
            $('#phone').val("");
            $('#description').val("");

            // 可选：重置 radio 按钮  
            $("input[name='radioSelected']").prop('checked', false);
        },
        error: function (res) {
            Swal.fire('添加用户失败！')
            $('#adduserModal').modal('hide');
        }
    });
}

function operateFormatter(value, row, index) {
    return [
        '<a class="remove pointer" title="Remove"> ',
        '删除',
        '</a>',
        '<i>&nbsp;&nbsp;&nbsp;&nbsp;</i>',
        '<a class="jump pointer" title="Jump">',
        '编辑',
        '</a>',
        '<i>&nbsp;&nbsp;&nbsp;&nbsp;</i>',
        '<a class="view pointer" title="View">',
        '查看登录记录',
        '</a>'
    ].join('')
}

function returnmain() {
    document.getElementById("user_tab_superadmin").style.display = "block";
    document.getElementById("user_edit").style.display = "none";
    document.getElementById("user_tab_admin").style.display = "none";
    document.getElementById("user_tab_tourist").style.display = "none";
    document.getElementById("buttonpart").style.display = "block";
    document.getElementById("viewdenglu").style.display = "none";
    document.getElementById("tablexx").style.display = "block";
}

var newname = "";
var zzNodes = [];
var zNodes = [];
var zzzNodes = [];
var projarr = [];
var rowname = "";
var zzTreeObj = "";
var loadname = "";
window.operateEvents = {
    'click .remove': function (e, value, row, index) {
        // const mapRole = { a: '管理员', u: '访客' };
        const mapRole = { '管理员': 'a', '访客': 'u' };
        row.role = mapRole[row.role];
        Swal.fire({
            title: '请问您是否要删除该用户?',
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
                    url: wz[16],
                    dataType: "json",
                    data: {
                        "name": row.name,
                        "token": tokenname,
                        "role": row.role
                    },
                    success: function (res) {
                        $('#table').bootstrapTable('refresh');
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            }
        })
    },
    'click .jump': function (e, value, row, index) {
        document.getElementById("user_tab_superadmin").style.display = "none";
        document.getElementById("user_edit").style.display = "block";
        document.getElementById("user_tab_admin").style.display = "none";
        document.getElementById("user_tab_tourist").style.display = "none";
        document.getElementById("buttonpart").style.display = "none";
        $("#user_edit").empty();
        newname = row.name;
        newrole = row.role;
        if (row.role == "访客") {
            $("#user_edit").append($("<a class='btn btn-default btn-sm' style='border-style:none;' onclick = 'updateuserinfo()' href='#'><i class='fa fa-folder fa-lg' style='color:green;'></i> 保存</a><a class='btn btn-default btn-sm' style='border-style:none;'  onclick = 'changetoadmin(\"" + newname + "\")' href='#'><i class='fa fa-random fa-lg' style='color:green;'></i> 转为管理员</a><a class='btn btn-default btn-sm' style='border-style:none;' onclick = 'deleteuserinfo(\"" + newname + "\",\"" + newrole + "\")' href='#'><i class='fa fa-times fa-lg' style='color:green;'></i> 删除</a><a class='btn btn-default btn-sm' style='border-style:none;' onclick = 'returnlist()' href='#'><i class='fa fa-reply fa-lg' style='color:green;'></i> 返回</a>"))
        } else {
            $("#user_edit").append($("<a class='btn btn-default btn-sm' style='border-style:none;' onclick = 'updateuserinfo()' href='#'><i class='fa fa-folder fa-lg' style='color:green;'></i> 保存</a><a class='btn btn-default btn-sm' style='border-style:none;'  onclick = 'changetouser(\"" + newname + "\")' href='#'><i class='fa fa-random fa-lg' style='color:green;'></i> 转为访客</a><a class='btn btn-default btn-sm' style='border-style:none;'  onclick = 'deleteuserinfo(\"" + newname + "\",\"" + newrole + "\")' href='#'><i class='fa fa-times fa-lg' style='color:green;'></i> 删除</a><a class='btn btn-default btn-sm' style='border-style:none;' onclick = 'returnlist()' href='#'><i class='fa fa-reply fa-lg' style='color:green;'></i> 返回</a>"))
        }
        $("#user_edit").append($("<div style='line-height: 40px;width: 400px;'><label>用户名：</label><input type='text' class='form-control' value='" + row.name + "' disabled></div>"));
        $("#user_edit").append($("<div style='line-height: 40px;width: 400px;'><label>备注信息：</label><input type='text' class='form-control' id='editdescription'></div>"));
        $("#user_edit").append($("<div style='line-height: 40px;width: 400px;'><label>用户密码：</label><input type='text' class='form-control' id='editpassword'></div>"));
        $("#user_edit").append($("<div style='line-height: 40px;width: 400px;'><label>电子邮箱：</label><input type='text' class='form-control' id='editemail' onblur='myFunction1()'><span style='color:red;font-size:12px' id='uemailtip'></span></div>"));
        $("#user_edit").append($("<div style='line-height: 40px;width: 400px;'><label>联系电话：</label><input type='text' class='form-control' id='editphone' ></div>"));
        document.getElementById("editdescription").value = row.description;
        document.getElementById("editemail").value = row.email;
        document.getElementById("editphone").value = row.phone;
        $("#user_edit").append($("</br></br>"));
        $("#user_edit").append($("<div class='panel panel-default' style='width:600px;'><div class='panel-heading'><h3 class='panel-title text-center' style='font-size:13px;font-weight:bold;'>分配项目(拖拽实现)</h3></div><div><div class='panel-body' style='position: relative;'><div class='panel panel-default text-center' style='overflow:auto;width:255px;align:left;float:left;height:250px;margin:0px'></br><p style='font-size:13px;font-weight:bold;'>可分配项目</p><ul id='treeDemo' class='ztree' style='width:200px;height:200px'></ul></div><div class='panel panel-default' style='align:right;width:50px;float:left;height:200px;overflow:auto;border:none;verticle-align:middle;align-items: center;'><div style='position: absolute;top: 40%;border-style:none;left: 46%;'><button class='btn btn-default btn-sm'  style='border-style:none;display:none;' id='toRight' onclick='loadProj()'><i class='fa fa-angle-double-right fa-3x' style='color:green;'></i></button></div></div><div class='panel panel-default text-center' style='overflow:auto;height:250px;align:right;width:255px;float:left;margin:0px'></br><p style='font-size:13px;font-weight:bold;'>已获得项目</p><ul id='treeDemo2' class='ztree' style='width:200px;height:200px'></ul></div></div></div>"));
        leftTree(row.name);
        rightTree(row.name);
    },
    'click .view': function (e, value, row, index) {
        $('#loginrecord').bootstrapTable('destroy');
        console.log(row.name);
        loadname = row.name;
        document.getElementById("user_tab_superadmin").style.display = "none";
        document.getElementById("user_edit").style.display = "none";
        document.getElementById("user_tab_admin").style.display = "none";
        document.getElementById("user_tab_tourist").style.display = "none";
        document.getElementById("buttonpart").style.display = "none";
        document.getElementById("viewdenglu").style.display = "block";
        document.getElementById("tablexx").style.display = "none";
        $('#loginrecord').bootstrapTable({
            ajax: function (request) {
                $.ajax({
                    type: "GET",
                    url: wz[17] + "/" + row.name + "?token=" + tokenname,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    data: '',
                    async: true,
                    beforeSend: function () {
                        console.log(wz[17] + "/" + row.name + "?token=" + tokenname)
                    },
                    jsonp: 'callback',
                    success: function (msg) {
                        console.log(msg["log"])
                        request.success({
                            row: msg["log"]
                        });
                        $('#loginrecord').bootstrapTable('load', msg["log"]);
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            },
            pagination: true,//是否分页
            search: true,
            toolbar: "#tool",
            clickToSelect: true,
            singleSelect: true,
            sortable: true,
            showExport: true,
            Icons: "glyphicon glyphicon-export",
            initExport: true,
            toolbarAlign: "right",
            exportDataType: "all",
            exportOptions: {
                fileName: "文档数据导出",
                worksheetName: 'Sheet1'
            },
            exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
            searchAlign: 'left',
            columns: [
                {
                    field: 'timeStamp',
                    title: '登陆时间',
                    formatter: timestampToTime,
                    sortable: true
                },
                {
                    field: 'remoteAddress',
                    title: 'IP地址',
                    sortable: true
                }
            ]

        });
    }

}

function deleteuserinfo(x, y) {
    const mapRole = { '管理员': 'a', '访客': 'u' };
    role = mapRole[x];
    Swal.fire({
        title: '请问您是否要删除该用户?',
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
                url: wz[16],
                dataType: "json",
                data: {
                    "name": x,
                    "token": tokenname,
                    "role": role
                },
                success: function (res) {
                    $('#table').bootstrapTable('refresh');
                    window.location.href = "usermange.html?name=" + hrefname;
                    $('#table').bootstrapTable('refresh');
                    $('#admintable').bootstrapTable('refresh');
                    $('#touristtable').bootstrapTable('refresh');
                    returnlist();
                },
                error: function (res) {
                    console.log(res);
                }
            });
        }
    })
}

function myFunction1() {
    var x = $('#editemail').val();
    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    var email_prompt = $("#uemailtip");
    if (re.test(x)) {
        $("#uemailtip").html(" ");
        $('#editemail').css('border-color', '#ccc');
    } else {
        $("#uemailtip").html("邮箱格式不正确");
        $('#editemail').css('border-color', 'red');
    }
}

//可分配项目
function leftTree(x) {
    var zTreeObj;
    var setting = {
        edit: {
            enable: true,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        data: {
            simpleData: {
                enable: true,        //是否使用简单数据模式
                idKey: "id",        //节点数据中保存唯一标识的属性名称
                pIdKey: "pId",     //节点数据中保存其父节点唯一标识的属性名称
                rootPId: 0         //用于修正根节点父节点的数据，即pIdKey指定的属性值
            }
        },
        callback: {
            beforeDrag: beforeDrag,
            beforeDrop: del_beforeDrop,
        }
    };
    $.ajax({
        type: 'GET',
        url: wz[20] + "/?name=" + x,//发送请求的页面
        beforeSend: function () { console.log(wz[20] + "/?name=" + x) },
        crossDomain: true, //跨域请求
        contentType: "application/json", //必须这样写,添加的参数为json格式
        dataType: "json",
        success: function (res) {
            console.log(res)
            var zzNodes = [];
            for (var i = 0; i < res['data'].length; i++) {
                let tree = {};
                tree.name = res['data'][i].name;
                tree.id = res['data'][i].ID_project;
                tree.username = x;
                zzNodes.push(tree);
            }
            zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zzNodes);
            zTreeObj.expandAll(true);
            console.log(zzNodes)
        },
        error: function (res) {
            console.log(res);
        }
    });
}

//已获得项目
function rightTree(x) {
    $.ajax({
        type: 'GET',//从服务器获取数据
        url: wz[18] + "/?name=" + x,//发送请求的页面
        crossDomain: true, //跨域请求
        contentType: "application/json", //必须这样写,添加的参数为json格式
        dataType: "json",
        success: function (res) {
            console.log(res)
            var zNodes = [];
            var setting = {
                data: {
                    simpleData: {
                        enable: true,        //是否使用简单数据模式
                        idKey: "id",        //节点数据中保存唯一标识的属性名称
                        pIdKey: "pId",     //节点数据中保存其父节点唯一标识的属性名称
                        rootPId: 0         //用于修正根节点父节点的数据，即pIdKey指定的属性值
                    }
                },
                edit: {
                    enable: true,
                    showRemoveBtn: false,
                    showRenameBtn: false
                },
                callback: {
                    beforeDrag: beforeDrag,
                    beforeDrop: add_beforeDrop
                }
            };
            for (var i = 0; i < res['data'].length; i++) {
                let tree11 = {};
                tree11.name = res['data'][i].name;
                tree11.id = res['data'][i].ID_project;
                tree11.username = x;
                zNodes.push(tree11);
            }
            zzTreeObj = $.fn.zTree.init($("#treeDemo2"), setting, zNodes);
            zzTreeObj.expandAll(true);
        },
        error: function (res) {
            console.log(res);
        }
    });
}


function beforeDrag(treeId, treeNode) {
    for (var i = 0, l = treeNode.length; i < l; i++) {
        if (treeNode[i].drag === false) {
            return false;
        }
    }
    return true;
}

// function beforeDrop(treeId, treeNode, targetNode, moveType) {
//     console.log(treeNode);
//     return targetNode ? targetNode.drop !== false : true;
// }

function del_beforeDrop(treeId, treeNode, targetNode, moveType) {
    console.log(treeNode);
    $.ajax({
        url: wz[36],
        type: "POST",
        data: {
            "name": treeNode[0].username,
            "ID_project": treeNode[0].id,
        },
        beforeSend: function () {
            console.log({
                "name": treeNode[0].username,
                "ID_project": treeNode[0].id,
            })
        },
        success: function (msg) {
            console.log(msg);
        },
        error: function (xhr, status, error) {
            console.log("Error: " + status + " - " + error);
        }
    });
    return true;
}

function add_beforeDrop(treeId, treeNode, targetNode, moveType) {
    $.ajax({
        url: wz[37],
        type: "POST",
        data: {
            "name": treeNode[0].username,
            "ID_project": treeNode[0].id,
        },
        beforeSend: function () {
            console.log({
                "name": treeNode[0].username,
                "ID_project": treeNode[0].id,
            })
        },
        success: function (msg) {
            console.log(msg);
        },
        error: function (xhr, status, error) {
            console.log("Error: " + status + " - " + error);
        }
    });
    return targetNode ? targetNode.drop !== false : true;
}

function loadProj() {
    $.ajax({
        url: wz[20],
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            "name": newname,
            "projects": projarr
        }),
        dataType: "json",
        success: function (msg) {
            buildprojtree(newname);
        },
        error: function (err) {
            console.log(err)
        }
    })
}

var projectarr = [];
function buildprojtree() {
    var zzTreeObj = $.fn.zTree.getZTreeObj("treeDemo2");
    var node = zzTreeObj.getNodes();
    var nodes = zzTreeObj.transformToArray(node); //获取树所有节点
    for (var i = 0; i < nodes.length; i++) {
        projectarr[i] = nodes[i].id;
        console.log(typeof projectarr[i])
    }
    $.ajax({
        url: wz[20],
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            "name": newname,
            "projects": projectarr
        }),
        dataType: "json",
        success: function (msg) {
        },
        error: function (err) {
            console.log(err)
        }
    })
}


function xxxbuildprojtree() {
    zzTreeObj.destroy();
    console.log(zNodes);
    console.log(zzzNodes);
    $.ajax({
        type: 'GET',//从服务器获取数据
        url: wz[18] + newname,//发送请求的页面
        crossDomain: false, //跨域请求
        contentType: "application/json", //必须这样写,添加的参数为json格式
        dataType: "json",
        success: function (res) {
            var zzzNodes = [];
            var setting = {
                check: {
                    // enable: true   
                    enable: false            //设置ztree的节点是否显示checkbox/radio
                }
            };
            for (var i = 0; i < res['data'].length; i++) {
                let tree3 = {};
                tree3.name = res['data'][i].name;
                tree3.id = 0;
                tree3.pId = i;
                zzzNodes.push(tree3);
            }
            zzTreeObj = $.fn.zTree.init($("#treeDemo2"), setting, zzzNodes);

        },
        error: function (res) {
            console.log(res);
        }
    });
}

var newdescription = "";
var newemail = "";
var newphone = "";
var newpassword = "";

//更新用户信息
function updateuserinfo() {
    newdescription = $('#editdescription').val();
    newemail = $('#editemail').val();
    newphone = $('#editphone').val();
    newpassword = $('#editpassword').val();
    if (newpassword === "") {
        newdata = JSON.stringify({
            "name": newname,
            "token": tokenname,
            "email": newemail,
            "phone": newphone,
            "description": newdescription
        })
    } else {
        newdata = JSON.stringify({
            "name": newname,
            "token": tokenname,
            "email": newemail,
            "phone": newphone,
            "password": newpassword,
            "description": newdescription
        })
    }
    console.log(newpassword);
    $.ajax({
        url: wz[16],
        type: "PUT",//取代资源
        contentType: "application/json", //发送信息至服务器时内容编码类型，必须这样写,添加的参数为json格式
        data: newdata,
        dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）   
        success: function (msg) {
            buildprojtree();
            Swal.fire({
                title: '更新成功！',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "usermange.html?name=" + hrefname;
                    $('#table').bootstrapTable('refresh');
                    $('#admintable').bootstrapTable('refresh');
                    $('#touristtable').bootstrapTable('refresh');
                    returnlist();
                }
            })
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function changetoadmin(newname) {
    var token = $.cookie('token');
    console.log(newname)
    console.log(token)
    $.ajax({
        url: wz[16],
        type: "PUT",//取代资源
        contentType: "application/json", //发送信息至服务器时内容编码类型，必须这样写,添加的参数为json格式
        data: JSON.stringify({  //转json格式，前端获取用户输入的用户名、密码、验证码信息，发送到服务器
            "name": newname,
            "token": token,
            "role": 'a'
        }),
        dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）   
        success: function (msg) {
            Swal.fire({
                title: '已转为管理员！',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "usermange.html?name=" + hrefname;
                    $('#table').bootstrapTable('refresh');
                    $('#admintable').bootstrapTable('refresh');
                    $('#touristtable').bootstrapTable('refresh');
                    returnlist();
                }
            })
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function exportData() {
    $('#adminloginrecord').tableExport({
        type: 'excel',
        exportDataType: "all",
        exportOptions: {
            fileName: '超级管理员登录记录',
        },
    });
}

function changetouser() {
    $.ajax({
        url: wz[16],
        type: "PUT",//取代资源
        contentType: "application/json", //发送信息至服务器时内容编码类型，必须这样写,添加的参数为json格式
        data: JSON.stringify({  //转json格式，前端获取用户输入的用户名、密码、验证码信息，发送到服务器
            "name": newname,
            "token": tokenname,
            "role": 'u'
        }),
        dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）   
        success: function (msg) {
            Swal.fire({
                title: '已转为访客！',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "usermange.html?name=" + hrefname;
                    $('#table').bootstrapTable('refresh');
                    $('#admintable').bootstrapTable('refresh');
                    $('#touristtable').bootstrapTable('refresh');
                    returnlist();
                }
            })
        },
        error: function (err) {
            console.log(err)
        }
    })
}


var newadmindecription = "";
var newademail = "";
var newadphone = "";
var newadname = "";
var newadpassword = "";

$("#user_tab_edit").append($("<a class='btn btn-default btn-sm' style='border-style:none;' onclick = 'updateadmininfo()' href='#'><i class='fa fa-folder fa-lg' style='color:green;'></i> 保存</a><a class='btn btn-default btn-sm' style='border-style:none;' onclick = 'returnlist()' href='#'><i class='fa fa-reply fa-lg' style='color:green;'></i> 返回</a>"))
$("#user_tab_edit").append($("<div style='line-height: 40px;width: 400px;'><label>平台名称：</label><input type='text' class='form-control' id='adeditpname'></div>"));
$("#user_tab_edit").append($("<br><div style='line-height: 40px;'><label>超级管理员登录记录（近半个月内）：</label><p>按时间段查询:</p><div><button type='button' class='btn btn-outline-primary' id='daterange-btn'><i class='fa fa-calendar'></i><span>时间</span><i class='fa fa-caret-down'></i></button></div><button type='button' class='btn btn-primary' onclick='searchadmin()'>查询</button><br><div class='table-responsive'><table id='adminloginrecord' data-locale='zh-CN' class= 'table table-bordered table-hover'></div></div>"));

function returnlist() {
    document.getElementById("user_tab_edit").style.display = "none";
    document.getElementById("user_tab_admin").style.display = "none";
    document.getElementById("user_tab_tourist").style.display = "none";
    document.getElementById("user_tab_superadmin").style.display = "block";
    document.getElementById("user_edit").style.display = "none";
    document.getElementById("buttonpart").style.display = "block";
}

function loadadminloginrecord() {
    $('#adminloginrecord').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[17] + "/admin?token=" + tokenname,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: '',
                async: true,
                jsonp: 'callback',
                success: function (msg) {
                    console.log(msg)
                    request.success({
                        row: msg["log"]
                    });
                    $('#adminloginrecord').bootstrapTable('load', msg["log"]);
                },
                error: function (res) {
                    console.log(res);
                }
            });
        },
        pagination: true,//是否分页
        search: true,
        toolbar: "#toolbar",
        clickToSelect: true,
        singleSelect: true,
        sortable: true,
        showExport: true,
        Icons: "glyphicon glyphicon-export",
        initExport: true,
        exportButton: $("#btn_export"),
        toolbarAlign: "right",
        exportDataType: "all",
        exportOptions: {
            fileName: "文档数据导出",
            worksheetName: 'Sheet1'
        },
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
        searchAlign: 'left',
        columns: [
            {
                field: 'timeStamp',
                title: '登陆时间',
                formatter: timestampToTime,
                sortable: true
            },
            {
                field: 'remoteAddress',
                title: 'IP地址',
                sortable: true
            }
        ]

    });
}

function queryParams(params) {
    var options = $('#adminloginrecord').bootstrapTable('getOptions')
    if (!options.pagination) {
        params.limit = options.totalRows
    }
    return params
}

function timestampToTime(value, row, index) {
    var time = row.timeStamp;
    var time = time.replace('T', ' ');
    time = time.replace('Z', '');
    return time;
}

//获取superadmin信息
function admininfo() {
    $.ajax({
        type: "GET",
        url: wz[16] + "/?token=" + tokenname,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: '',
        jsonp: 'callback',
        success: function (msg) {
            console.log(msg.data.result)
            console.log(msg.data.result.s[0].name)
            console.log(msg.data.result.s[0].role)
            console.log(msg.data.result.s[0].password)
        },
        error: function () {
            alert("错误");
        }
    });
}

//更新superadmin信息
// function updateadmininfo() {
//     newadmindecription = $('#adeditdescription').val();
//     newademail = $('#adeditemail').val();
//     newadphone = $('#adeditphone').val();
//     newadname = "Admin";
//     // newadpassword = $('#adeditpassword').val();
//     $.ajax({
//         url: wz[16],
//         type: "PUT",//取代资源
//         contentType: "application/json", //发送信息至服务器时内容编码类型，必须这样写,添加的参数为json格式
//         data: JSON.stringify({  //转json格式，前端获取用户输入的用户名、密码、验证码信息，发送到服务器
//             "name": newadname,
//             "token": tokenname,
//             "email": newademail,
//             "phone": newadphone,
//             "description": newadmindecription
//         }),
//         beforeSend: function () {
//             console.log(newadmindecription);
//             console.log(newadphone)
//             console.log(newadname)
//         },
//         dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）   
//         success: function (msg) {
//             $.ajax({
//                 url: wz[33],
//                 type: "PUT",//取代资源
//                 contentType: "application/json", //发送信息至服务器时内容编码类型，必须这样写,添加的参数为json格式
//                 data: JSON.stringify({  //转json格式，前端获取用户输入的用户名、密码、验证码信息，发送到服务器
//                     "token": tokenname,
//                     "name": $("#adeditpname").val()
//                 }),
//                 dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）    
//                 success: function (data) {
//                     Swal.fire({
//                         title: '更新成功！',
//                     }).then((result) => {
//                         if (result.isConfirmed) {
//                             document.getElementById("adeditpname").value = $("#adeditpname").val();
//                             window.location.href = "usermange.html?name=" + hrefname;
//                             $('#table').bootstrapTable('refresh');
//                             $('#admintable').bootstrapTable('refresh');
//                             $('#touristtable').bootstrapTable('refresh');
//                             returnlist();
//                         }
//                     })
//                     admininfo();
//                 },
//                 error: function (err) {
//                     console.log(err)
//                 }
//             });
//         },
//         error: function (err) {
//             alert(err);
//         }
//     })
// }

//更新superadmin平台信息
function updateadmininfo() {
    newadname = "admin";
    $.ajax({
        url: wz[19],
        type: "PUT",//取代资源
        contentType: "application/json", //发送信息至服务器时内容编码类型，必须这样写,添加的参数为json格式
        data: JSON.stringify({  //转json格式，前端获取用户输入的用户名、密码、验证码信息，发送到服务器
            "token": tokenname,
            "name": $("#adeditpname").val()
        }),
        dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）    
        success: function (data) {
            Swal.fire({
                title: '更新成功！',
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById("platername").textContent = $("#adeditpname").val();
                    $('#table').bootstrapTable('refresh');
                    $('#admintable').bootstrapTable('refresh');
                    $('#touristtable').bootstrapTable('refresh');
                    returnlist();
                }
            })
            admininfo();
        },
        error: function (err) {
            console.log(err)
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
    var end = moment();
    function cb(start, end) {
        $('#daterange-btn span').html('开始时间：' + start.format('YYYY-MM-DD HH:mm:ss:SSS') + ' - 结束时间：' + end.format('YYYY-MM-DD HH:mm:ss:SSS'));
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

function timerange3() {
    var start = moment().subtract(29, 'days');
    var end = moment();
    function cb(start, end) {
        $('#daterange3-btn span').html('开始时间：' + start.format('YYYY-MM-DD HH:mm:ss:SSS') + ' - 结束时间：' + end.format('YYYY-MM-DD HH:mm:ss:SSS'));
        Begin = start.format('YYYYMMDDHHmmss');
        End = end.format('YYYYMMDDHHmmss');
        newbegin = timeToTimestamp(start.format('YYYY-MM-DD HH:mm:ss:SSS'));
        newend = timeToTimestamp(end.format('YYYY-MM-DD HH:mm:ss:SSS'))
    }

    $('#daterange3-btn').daterangepicker({
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

function timeToTimestamp(time) {
    let timestamp = Date.parse(new Date(time).toString());
    timestamp = timestamp / 1000; //时间戳为13位需除1000，时间戳为13位的话不需除1000
    return timestamp;
}

function search() {
    $('#loginrecord').bootstrapTable('destroy');
    $('#loginrecord').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[17] + "/admin?token=" + tokenname,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: '',
                async: true,
                beforeSend: function () {
                    console.log(wz[17] + "/" + loadname + "?token=" + tokenname)
                },
                jsonp: 'callback',
                success: function (msg) {
                    var newdata = [];
                    for (let i = 0; i < msg["log"].length; i++) {
                        newtime = timeToTimestamp(msg["log"][i].timeStamp);
                        if (newtime < newend && newtime > newbegin) {
                            newdataitem = {};
                            newdataitem.timeStamp = msg["log"][i].timeStamp;
                            newdataitem.remoteAddress = msg["log"][i].remoteAddress;
                            newdata.push(newdataitem)
                        }
                    }
                    request.success({
                        row: newdata
                    });
                    // $('#loginrecord').bootstrapTable('load', msg["log"]);
                    $('#loginrecord').bootstrapTable('load', newdata);
                },
                error: function (res) {
                    console.log(res);
                }
            });
        },
        pagination: true,//是否分页
        search: true,
        toolbar: "#tool",
        clickToSelect: true,
        singleSelect: true,
        sortable: true,
        showExport: true,
        Icons: "glyphicon glyphicon-export",
        initExport: true,
        toolbarAlign: "right",
        exportDataType: "all",
        exportOptions: {
            fileName: "文档数据导出",
            worksheetName: 'Sheet1'
        },
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
        searchAlign: 'left',
        columns: [
            {
                field: 'timeStamp',
                title: '登陆时间',
                formatter: timestampToTime,
                sortable: true
            },
            {
                field: 'remoteAddress',
                title: 'IP地址',
                sortable: true
            }
        ]
    });
}

function searchadmin() {
    $('#adminloginrecord').bootstrapTable('destroy');
    $('#adminloginrecord').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[17] + "/admin?token=" + tokenname,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: '',
                async: true,
                beforeSend: function () {
                    console.log(wz[17] + "/admin?token=" + tokenname)
                },
                jsonp: 'callback',
                success: function (msg) {
                    let newdata1 = [];
                    for (let i = 0; i < msg["log"].length; i++) {
                        newtime = timeToTimestamp(msg["log"][i].timeStamp);
                        if (newtime < newend && newtime > newbegin) {
                            newdataitem = {};
                            newdataitem.timeStamp = msg["log"][i].timeStamp;
                            newdataitem.remoteAddress = msg["log"][i].remoteAddress;
                            newdata1.push(newdataitem)
                        }
                    }
                    request.success({
                        row: newdata1
                    });
                    $('#adminloginrecord').bootstrapTable('load', newdata1);
                },
                error: function (res) {
                    console.log(res);
                }
            });
        },
        pagination: true,//是否分页
        search: true,
        toolbar: "#tool",
        clickToSelect: true,
        singleSelect: true,
        sortable: true,
        showExport: true,
        Icons: "glyphicon glyphicon-export",
        initExport: true,
        toolbarAlign: "right",
        exportDataType: "all",
        exportOptions: {
            fileName: "文档数据导出",
            worksheetName: 'Sheet1'
        },
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
        searchAlign: 'left',
        columns: [
            {
                field: 'timeStamp',
                title: '登陆时间',
                formatter: timestampToTime,
                sortable: true
            },
            {
                field: 'remoteAddress',
                title: 'IP地址',
                sortable: true
            }
        ]
    });

}

function gotoProjectlist() {
    window.location.href = "projectlist.html?name=" + hrefname;
}