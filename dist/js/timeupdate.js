$(function () {
    let now=new Date();
    // let nowdate= now.Format("YYYY-MM-dd hh:mm:ss");
    document.getElementById("NOWTIME").innerHTML=format(now);
    setInterval(function(){
            let now=new Date();
            // let nowdate= now.Format("YYYY-MM-dd hh:mm:ss");
            document.getElementById("NOWTIME").innerHTML=format(now);
        },1000        
    )
})

function add0(m){return m<10?'0'+m:m }
function format(shijianchuo)
{
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}