$(function () {
    platformname() 
    getCode();
    $("#carousel").owlCarousel({  
        loop:true,  
        margin:10,  
        nav:true,  
        responsive:{  
          0:{  
            items:1  
          },  
          600:{  
            items:3  
          },  
          1000:{  
            items:5  
          }  
        }  
      }); 
})
var captcha = "";

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

//获取验证码
function getCode() {
    $.ajax({
        type: 'GET',
        url: wz[0],
        crossDomain: true, 
        contentType: "application/json", 
        dataType: "json",
        success: function (res) {
            $("#verifypic").attr('src', "data:image/svg+xml;base64," + res["data"]);
            captcha = res["captcha"];
        },
        error: function (res) {
            console.log("cuowu:" + res);
        }
    });
}

//通过接口进行登录
function login() {
    let username = $("#form-username").val();//let：当前区块的变量 var:全局变量
    let password = $("#form-password").val();//将id=form-username,form-password的值赋给username、password
    let verifycode = $("#verifyCode").val();//将用户输入的验证码的值赋给verifycode
    if (verifycode == captcha) {//如果用户输入的验证码值==从后台传来的验证码值，则进行ajax，向服务器推送数据
        $.ajax({
            type: "POST",//向服务器推送数据
            url: wz[1],//后段给的api接口
            contentType: "application/json", //发送信息至服务器时内容编码类型，必须这样写,添加的参数为json格式
            dataType: "json",//预期服务器返回的数据类型，这里返回的是token、message，token格式为token：token（key：value）
            data: JSON.stringify({  //转json格式，前端获取用户输入的用户名、密码、验证码信息，发送到服务器
                "name": username,
                "password": password
            }),
            success: function (res) { //请求成功后的回调函数。如果成功，返回res，并根据dataType参数进行处理，数据类型json。
                console.log(res)
                $.cookie('token', res.token, { expires: 10000 });
                $.cookie('userrole', res.role, { expires: 10000 });
                // window.location.href = "projectlist.html?" + "name=" + username;//跳转到index.html页面
                window.location.href = "index.html?" + "type=3&name=" + username;//跳转到index.html页面
                console.log('res is ',res);
            },
            error: function (res) {//请求错误的回调函数，返回res
                console.log("错误:" + JSON.stringify(res));
                if (!$("#verifyCode").val()) {
                    alert("请输入验证码！")
                }
                else {
                    alert("用户名密码不对！")
                }
            }
        });
    } else {//如果用户输入的验证码值！=从后台传来的验证码值如果不一样，验证码错误
        alert("验证码错误[注意：请区分大小写！]")
    }
}

