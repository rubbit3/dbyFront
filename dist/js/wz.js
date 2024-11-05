var wz = new Array(70);
var ip = "http://10.62.213.53:9000";

//获取验证码
wz[0] = ip + "/users/captcha?random+Date.now()";

//用户登录
wz[1] = ip + "/users/session";

//创建项目
wz[2] = ip + "/projects/?token=";

//获取当前用户关联的所有项目
wz[3] = ip + "/projects/?name=";

//删除项目、更新项目
wz[4] = ip + "/projects";

//存放项目图片
wz[5] = ip + "/projects/image";

//获取项目所有图片
wz[6] = ip + "/projects/image?ID_project=";

//添加设备
wz[7] = ip + "/dev/add";

//获取所有设备
wz[8] = ip + "/dev/get";

//删除设备
wz[9] = ip + "/dev/del";

//添加分组
wz[10] = ip + "/group/create";

//查询分组
wz[11] = ip + "/group/get";

//新建测点
wz[12] = ip + "/cedian/create";

//新建通道
wz[13] = ip + "/channel/add";

//查询通道
wz[14] = ip + "/channel/get";

//删除通道
wz[15] = ip + "/channel/del";

//获取用户信息（最高权限）
wz[16] = ip + "/users";

//获取用户登录记录(最高权限；半个月之内的记录)
wz[17] = ip + "/users/loginR"

//获取目标用户关联的所有项目
wz[18] = ip + "/users/projects/ass";

//获取系统名称
wz[19] = ip + "/system/name"

//获取目标用户不关联的所有项目
wz[20] = ip + "/users/projects/dis";

//获取实时数据
wz[21] = ip + "/real/get"

//获取历史数据
wz[22] = ip + "/history/get"

//file
wz[23] = ip + "/projects/files"

//添加摄像头
wz[24] = ip + "/live/add"

//获取所有摄像头
wz[25] = ip + "/live/getAll"

//删除摄像头
wz[26] = ip + "/live/del"

//更新摄像头
wz[27] = ip + "/live/update"

//更新通道
wz[28] = ip + "/channel/update"

//更新设备
wz[29] = ip + "/dev/update";

//邮件报警-短信报警（更改0和1）
wz[30] = ip + "/push/get";

//更新邮件报警-短信报警
wz[31] = ip + "/push/update";

//添加邮箱-短信
wz[32] = ip + "/emailPhone/add"

//查询邮箱-短信
wz[33] = ip + "/emailPhone/get"

//删除邮箱-短信
wz[34] = ip + "/emailPhone/del"

//添加阈值
wz[35] = ip + "/warnSetting/add"

//给指定用户添加项目
wz[36] = ip + "/users/projects/add"

//给指定用户删除项目
wz[37] = ip + "/users/projects/del"

//导出数据
wz[38] = ip + "/data/download"

//查询所有导出记录
wz[39] = ip + "/dataLog/get"

//更新阈值
wz[40] = ip + "/warnSetting/update"

//查询阈值
wz[41] = ip + "/warnSetting/get"

//删除阈值
wz[42] = ip + "/warnSetting/del"

//查询报警
wz[43] = ip + "/alert/get"

//处理报警
wz[44] = ip + "/alert/update"

//fft数据
wz[45] = ip + "/fft/get"

//数据分析获取
wz[46] = ip + "/result/get"

//烈度获取
wz[47] = ip + "/liedu/get"
//读取运行率
wz[48] = ip + "/run/get";
//读取位移计等数据
wz[49] = ip + "/weiyi/get"

//读取台站名字
wz[50] = ip + "/station/get"

// 读取台站数据

wz[51] = ip + "/station/getdata"

// 导出excel数据
wz[52] =  "http://127.0.0.1:5000/download_data"

// /**实时加速度数据(往前回溯10s) */
// wz[0] = ip + "/sensorData/current-com";
// /** 速度时程; 位移时程; 预定时段内位移最大; 预定时段内位移平均值 后面需要加/{begin}/{end} 时间格式milliseconds*/
// wz[1] = ip + "/sensorData/combinations";
// //.....依次类推写到wz[9]
// wz[2] = "ws://10.62.213.53:1449";

// //20211206更新接口
// //**所有device 和station获取 */
// wz[3] = ip + "/data/devices/temp";
// // wz[3]=ip+"/sensorData/devices";
// //*获取对应的device数据/sensorData/current-com/<station>/<device> */
// wz[4] = ip + "/data/current-data";
// // wz[4]=ip+"/sensorData/current-com";
// //根据时间以及device和station进行数据查询
// //格式：/sensorData/export/:station/:device/:begin/:end
// //参数: station: station ID, device: device ID, begin: 起始时间，end: 终止时间 （时间格式：‘211222112502’ 21年12月22日11点25分02秒）
// // wz[5]=ip+"/sensorData/export";
// wz[5] = ip + "/data/files";
// //下载文件
// wz[6] = ip + "/data/files/?file=filename";
// //登录验证码
// wz[7] = ip + "/users/captcha?random+Date.now()";
// //用户登录,post
// wz[8] = ip + "/users/session";
// //获取频谱api数据
// wz[9] = ip + "/data/current-data-fft";
// //创建新项目(权限's', 'a' 用户),获取当前用户关联的所有项目
// wz[10] = ip + "/projects/?token=";
// //获取项目相关关联传感信息
// wz[11] = ip + "/data/devices/ass";
// //历史数据
// wz[12] = ip + "/data/history-data";
// //更新项目
// wz[13] = ip + "/projects";
// //在项目中新建站点 (权限's', 'a' 用户)
// wz[14] = ip + "/data/stations";
// //在站点中添加设备 (权限's', 'a' 用户).删除设备 (权限's', 'a' 用户
// wz[15] = ip + "/data/devices";
// //注册新用户,删除用户,更改用户信息
// wz[16] = ip + "/users";
// //获取用户信息(最高权限)
// wz[17] = ip + "/users";
// //获取目标用户关联的所有项目
// wz[18] = ip + "/users/projects/ass/";
// //获取目标用户不关联的所有项目
// wz[19] = ip + "/users/projects/dis/";
// //关联项目与用户
// wz[20] = ip + "/users/projects";
// //存放项目图片/获取目标项目所有图片
// wz[21] = ip + "/projects/image";
// //对应项目的 设备信息
// wz[22] = ip + "/data/devices?project=";
// //增加测点 (权限's', 'a' 用户)
// wz[23] = ip + "/data/list/devices";
// //对应项目的 测点信息
// wz[24] = ip + "/data/devices?project=";
// //为项目相关的站点设置报警\得到项目所有报警设置
// wz[25] = ip + "/projects/settings";
// //得到项目所有报警
// wz[26] = ip + "/projects/warnings/"
// //处理报警
// wz[27] = ip + "/projects/warnings/info"
// //已处理报警
// wz[28] = ip + "/projects/unpro/warnings/"
// //未处理报警
// wz[29] = ip + "/projects/warnings/unpro/"
// //有效报警
// wz[30] = ip + "/projects/warnings/pro/val/"
// //无效报警
// wz[31] = ip + "/projects/warnings/pro/inval/"
// //file
// wz[32] = ip + "/projects/files"
// //获取系统名称
// wz[33] = ip + "/system/name"
// //獲取整合數據紀錄
// wz[34] = ip + "/data/files/records/"
// //站点处理
// wz[35] = ip + "/data/devices/record"
// //模式匹配
// wz[36] = ip + "/data/algorithm/str?num="
// //添加报警邮箱
// wz[37] = ip + "/projects/warningsEmail"
// //查看接受日志
// wz[38] = ip + "/data/devices/log"
// //位移速度
// wz[39] = ip + "/data/current-data-speed-distance-dir/"
// //上传灾难报告
// wz[40] = ip + "/projects/disReport"
// //位移速度默认
// wz[41] = ip + "/data/current-data-speed-distance/"
// //登陆日志
// wz[42] = ip + "/users/loginR"
// //灾情报告
// wz[43] = ip + '/data/disExt'
// //历史时程数据
// wz[44] = ip + "/data/history"
// //模式匹配
// wz[45] = ip + "/data/algorithm/damagePattern"
// //位移数据
// wz[46] = ip + "/data/history/dis"
// //获取连接传感器数量
// wz[47] = ip + "/system/sensors/num"