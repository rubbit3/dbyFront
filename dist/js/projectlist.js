var str = "";

$(function () {
  var url = window.location.href;
  str = url.substring(url.lastIndexOf("=") + 1, url.length);
  var token = $.cookie('token');
  if (token == null) {
    window.location.href = './login.html'
  }
});

function usergove() {
  window.location.href = "usermange.html?" + "name=" + str;
}

function gotoprojectlist(index) {
  window.location.href = "index.html?type=" + index + "&name=" + str;
}

function logout() {
  var token = $.cookie('token');
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
        url: wz[1],
        type: "PUT",
        contentType: "application/json", 
        data: JSON.stringify({ 
          "token": token
        }),
        dataType: "json",   
        success: function (data) {
          $.cookie('token', null, { expires: -1 });
          window.location.href = "./login.html";
        },
        error: function (err) {
          console.log(err)
        }
      })
    }
  })
}

