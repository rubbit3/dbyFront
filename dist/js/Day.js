$(function () {
    platformname() 
    loaddatatable()
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


function loaddata() {  
    // 生成formData  
    var formData = new FormData();  
    let myFile = document.getElementById('formFile');  
    // 获取文件  
    formData.append('doc', myFile.files[0]);  
    // 获取其他数据并附加到formData  
    formData.append("ID_project", projectID);  
    formData.append("docSer", document.getElementById("dataNo").value);  
    formData.append("docName", document.getElementById("dataname").value);  
    formData.append("uploadP", document.getElementById("uploadname").value);  
    formData.append("name", document.getElementById("formFile").files[0].name); 
    formData.append("uploadType",'0'); 
  
    $.ajax({  
        url: 'http://10.62.213.53:9000/projects/files',  
        type: "POST",  
        data: formData,  
        processData: false,  // 不处理数据  
        contentType: false,   // 不设置内容类型，让浏览器自动设置  
        beforeSend: function() {  
            console.log(formData)
            for (let [key, value] of formData.entries()) {  
                console.log(key, value);  
            }
            console.log("Sending data...");  
        },  
        success: function (msg) {  
            console.log(msg);  
            $('#uploadDataModal').modal("hide");  
            $('#datatable').bootstrapTable('destroy');  
            loaddatatable();  
        },  
        error: function (xhr, status, error) {  
            console.log("Error: " + status + " - " + error);  
        }  
    });  
}


function loaddatatable() {
    $('#datatable').bootstrapTable({
        ajax: function (request) {
            $.ajax({
                type: "GET",
                url: wz[23] + "/?ID_project=" + projectID,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: {
                    "ID_project": projectID,
                    "uploadType": "0",
                },
                async: true,
                jsonp: 'callback',
                success: function (msg) {
                    console.log(wz[23] + "/" + projectID)
                    console.log(msg["data"])
                    console.log(msg["data"])
                    request.success({
                        row: msg["data"]
                    });
                    $('#datatable').bootstrapTable('load', msg["data"]);
                },
                error: function (res) {
                    console.log(res);
                }
            });
        },
        pagination: true,//是否分页
        sidePagination: 'client',//server:服务器端分页|client：前端分页
        pageSize: 10,//单页记录数
        pageList: [10],
        search: true,
        clickToSelect: true,
        singleSelect: true,
        sortable: true,
        searchAlign: 'left',
        columns: [
            {
                field: 'docSer',
                title: '文档编号',
                sortable: true
            },
            {
                field: 'docName',
                title: '文档名称',
                sortable: true
            },
            {
                field: 'uploadTime',
                title: '上传时间',
                formatter: timestampToTime,
                sortable: true
            },
            {
                field: 'uploadP',
                title: '上传人',
                sortable: true
            },
            {
                field: 'doc.name',
                title: '文件名',
                sortable: true
            },
            {
                field: 'status',
                title: '操作',
                formatter: comoperateFormatter,
                events: operatealarmEvents,
                sortable: true
            }
        ]
    });
}

function timestampToTime(value, row, index) {
    var date = new Date(Number(value));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    console.log(date)
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds() + ':';
    var sm = date.getMilliseconds();
    return Y + M + D + h + m + s + sm;
}

function comoperateFormatter(value, row, index) {
    return [
        " <a class='operate' style='color:#212a3a' href='#'>查看</a>" + " " +
        "<a class='download' style='color:#212a3a' href='#'>下载</a>" + " " +
        "<a class='delete' style='color:#212a3a' href='#'>删除</a>" + " " +
        "<a class='change' style='color:#212a3a' href='#'>修改</a>"
    ]
}

window.operatealarmEvents = {
    'click .operate': function (e, value, row, index) {
        console.log(row.doc.file);
        document.getElementById("pdflist").style.display = "none";
        document.getElementById("showpdf").style.display = "block";
        document.getElementById("pdfPlayer").src = "http://10.62.213.53:9000" + row.doc.file;
    },
    'click .download': function (e, value, row, index) {
        window.open("http://10.62.213.53:9000" + row.doc.file);
    },
    'click .delete': function (e, value, row, index) {
        Swal.fire({
            title: '请问您是否要删除改文档?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '删除',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'DELETE',
                    url: wz[23],
                    dataType: "json",
                    data: {
                        "ID_project": projectID,
                        "docSer": row.docSer,
                        "uploadType": "0",
                    },
                    beforeSend: function (request) {    
                        console.log({
                            "ID_project": projectID,
                            "docSer":row.docSer,
                        })
                        console.log(wz[23]);
                    },
                    success: function (res) {
                        console.log(res);
                        $('#datatable').bootstrapTable('destroy');
                        loaddatatable();
                    },
                    error: function (res) {
                        console.log(res);
                    }
                });
            }
        })
    },
    'click .change': function (e, value, row, index) {
        $('#upgradeDataModal').modal("show");
        document.getElementById("data_id").value = row._id;
        document.getElementById("new_dataNo").value = row.docSer;
        document.getElementById("new_dataname").value = row.docName;
        document.getElementById("new_uploadname").value = row.uploadP;
        $('#changedata').on('click', function () {
            var new_docSer = document.getElementById("new_dataNo").value;
            var new_docName = document.getElementById("new_dataname").value;
            var new_uploadP = document.getElementById("new_uploadname").value;
            $.ajax({
                url: wz[23],
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(
                    {
                        "ID_project": projectID,
                        "docSer": new_docSer,
                        "docName": new_docName,
                        "uploadP": new_uploadP,
                        "uploadType": "0",
                    }),
                dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）    
                success: function (data) {
                    console.log(data);
                    $('#upgradeDataModal').modal("hide");
                    $('#datatable').bootstrapTable('destroy');
                    loaddatatable();
                },
                error: function (err) {
                    console.log(err)
                }
            })
        });

    }
}

function jumptopdflist() {
    document.getElementById("pdflist").style.display = "block";
    document.getElementById("showpdf").style.display = "none";
}

function getExportFile(obj) {
    var zip_name = $(obj).html();
    window.open(wz[5] + '/?file=' + zip_name);
}

