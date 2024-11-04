
document.getElementById('goToIndex').addEventListener('click', function (event) {
    event.preventDefault();
    gotoProjectlist();
});




//返回项目列表
function gotoProjectlist() {
    window.location.href = "index.html?" + "type=" + type + "&name=" + username;
}

//返回项目配置
function gotoProjectConfig() {
    window.location.href = "projectconfig.html?&building=" + building + "&type=" + type + "&name=" + username;
}

//返回项目信息
function jumptodashboard() {
    window.location.href = "dashboard.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回设备状态
function jumptoDeviceStatus() {
    window.location.href = "DeviceStatus.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回时程曲线
function jumptotimeCurve() {
    window.location.href = "timeCurve.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回时频曲线
function jumptofftCurve() {
    window.location.href = "fftCurve.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回位移和静力
function jumptoweiyiraoduCurve() {
    window.location.href = "timeweiyi.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回台站数据
function jumptotimeStationCurve() {
    window.location.href = "timeStation.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回时程和时频曲线
function jumptotimefftCurve() {
    window.location.href = "timefftCurve.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回速度和位移曲线
function jumptospeedCurve() {
    window.location.href = "speedCurve.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//去往数据分析
function jumptodataAnylsis() {
    window.location.href = "dataAnalysis.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回数据查看
function jumptoDataView() {
    window.location.href = "DataView.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回数据导出
function jumptoDataExport() {
    window.location.href = "DataExport.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回报警管理
function jumptoDataWarn() {
    window.location.href = "DataWarn.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回资料档案
function jumptoArchive() {
    window.location.href = "Archive.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回视频监控
function jumptoVideoMonitoring() {
    window.location.href = "VideoMonitoring.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回3D模型
function jumpto3D() {
    window.location.href = "3D.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回用户管理
function jumptoUserManage() {
    window.location.href = "usermange.html?" + "&type=" + type + "&name=" + username;
}

function jumptoDay() {
    window.location.href = "Day.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
    
}

function jumptoMonth() {
    window.location.href = "Month.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
    
}

function jumptoYear() {
    window.location.href = "Year.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
    
}

//返回地震
function gotoEarthquake() {
    window.location.href = "earthquake_BridgeSeismicEarlyWarningOverallInformation.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

function jumptoBridgeSeismicEarlyWarningOverallInformation(){
    window.location.href = "earthquake_BridgeSeismicEarlyWarningOverallInformation.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

function jumptoSingleBridgeSeismicEarlyWarningInformation(){
    window.location.href = "earthquake_SingleBridgeSeismicEarlyWarningInformation.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回烈度
function gotoIntensity() {
    window.location.href = "Intensity_OverallProjectStatus.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

function jumptoIntensity_OverallProjectStatus(){
    window.location.href = "Intensity_OverallProjectStatus.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

function jumptoIntensity_SpecificBridgeSituation(){
    window.location.href = "Intensity_SpecificBridgeSituation.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}
//返回测点状态
function jumptoCedianStatus() {
    window.location.href = "CedianStatus.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回项目状态
function jumptoProjectStatus() {
    window.location.href = "ProjectStatus.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回异常数据分析
function jumptoAnomalyDataAnalysis() {
    window.location.href = "AnomalyDataAnalysis.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回异常数据处理
function jumptoAnomalyDataProcessing() {
    window.location.href = "AnomalyDataProcessing.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回地震事件查询
function jumptoQueryearthquake() {
    window.location.href = "Queryearthquake.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回有限元分析模型
function jumptoFiniteelementmodel() {
    window.location.href = "Finiteelementmodel.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

//返回模态分析
function jumptoFiniteelementmodelAnalysis() {
    window.location.href = "FiniteelementmodelAnalysis.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}
//返回仿真模拟
function jumptoFiniteelementmodelSimulation() {
    window.location.href = "FiniteelementmodelSimulation.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

function jumptohelp(){
    window.location.href = "help.html?" + "&building=" + building + "&type=" + type + "&name=" + username;
}

