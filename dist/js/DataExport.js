$(function () {
    platformname();
    fetchChannels();
    ExportDataTable();
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

function fetchChannels() {
    // 返回一个Promise  
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: wz[14] + "?ID_project=" + building,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            async: true,
            success: function (msg) {
                resolve(msg.data); // 解析Promise  
            },
            error: function (xhr, status, error) {
                console.error("Error fetching channels:", xhr.responseText);
                reject(error); // 拒绝Promise  
            }
        });
    });
}
populateChannelDropdown();
// Function to populate channel dropdown
async function populateChannelDropdown() {
    try {
        const channels = await fetchChannels(); // 等待Promise解析  
        console.log(channels);
        const selectElement = document.getElementById('channelSelect');
        selectElement.innerHTML = '';
        channels.forEach(channel => {
            selectElement.innerHTML += `<option value="${channel.id}">${channel.channel_name
                }</option>`;
        });
    } catch (error) {
        console.error("Error populating channel dropdown:", error);
    }
}

function exportData() {
    const channel = document.getElementById('channelSelect').value;
    const startTimeStr = document.getElementById('startTime').value;
    const endTimeStr = document.getElementById('endTime').value;


    // 将字符串转换为Date对象，然后转换为时间戳  
    const startTime = new Date(startTimeStr).getTime() / 1000; // JavaScript Date是毫秒，需要除以1000转换为秒  
    const endTime = new Date(endTimeStr).getTime() / 1000;

    console.log(startTime, endTime);

    console.log(`Exporting data for channel ${channel} from ${startTimeStr} to ${endTimeStr}`);
    fetch(wz[38], {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "ID_project": projectID,
            "id": channel,
            "startTime": startTime,
            "endTime": endTime
        }),
        responseType: 'blob'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = channel + '_' + startTime + '_' + endTime + '_.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Function to download file (simulated)
function downloadFile(fileName) {
    alert(`Downloading file: ${fileName}`);
    // Implement actual file download logic here
}

// Function to delete record (simulated)
function deleteRecord(fileName) {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
        alert(`Deleting record: ${fileName}`);
        // Implement actual record deletion logic here
    }
}

// function ExportDataTable() {
//     $.ajax({
//         type: "GET",
//         url: wz[39],
//         contentType: "application/json;charset=utf-8",
//         dataType: "json",
//         data: '',
//         jsonp: 'callback',
//         success: function (msg) {
//             console.log(msg)
//             const exportedData = msg.data
//             const tableBody = document.getElementById('exportDataTable');
//             tableBody.innerHTML = '';

//             exportedData.forEach(data => {
//                 const row = `  
//                  <tr>  
//                                  <td>${data.id}</td>  
//                                  <td>${data.startTime}</td>  
//                                  <td>${data.endTime}</td>  
//                                  <td>完成</td>  
//                                  <td><a href="#" onclick="downloadFile('${data.fileName}')">${data.fileName}</a></td>  
//                                  <td>${data.exportTime}</td>  

//                              </tr>  

//                          `;
//                 //  <tr>  
//                 //      <td>${data.channel}</td>  
//                 //      <td>${data.startTime}</td>  
//                 //      <td>${data.endTime}</td>  
//                 //      <td>${data.status}</td>  
//                 //      <td><a href="#" onclick="downloadFile('${data.fileName}')">${data.fileName}</a></td>  
//                 //      <td>${data.createTime}</td>  
//                 //     <td><span class="delete-btn" onclick="deleteRecord('${data.fileName}')"><i class="fas fa-trash-alt"></i></span></td>  
//                 //  </tr>  
//                 tableBody.innerHTML += row;
//             });

//             document.querySelector('.export-warning').style.display = 'block';
//         },
//         error: function () {
//             console.logs("错误");
//         }
//     });
// }


function ExportDataTable() {
    $.ajax({
        type: "GET",
        url: wz[39],
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: '',
        jsonp: 'callback',
        success: function (msg) {
            console.log(msg)
            const exportedData = msg.data
            const tableBody = document.getElementById('exportDataTable');
            tableBody.innerHTML = '';

            exportedData.forEach(data => {
                const startTimeFormatted = formatUnixTimestamp(data.startTime);
                const endTimeFormatted = formatUnixTimestamp(data.endTime);
                const exportTimeFormatted = formatUnixTimestamp(new Date(data.exportTime).getTime() / 1000); // Assuming exportTime is in ISO format

                const row = `  
                    <tr>  
                        <td>${data.id}</td>  
                        <td>${startTimeFormatted}</td>  
                        <td>${endTimeFormatted}</td>  
                        <td>完成</td>  
                        <td><a href="#" onclick="downloadFile('${data.fileName}')">${data.fileName}</a></td>  
                        <td>${exportTimeFormatted}</td>  
                    </tr>  
                `;

                tableBody.innerHTML += row;
            });

            document.querySelector('.export-warning').style.display = 'block';
        },
        error: function () {
            console.error("错误");
        }
    });
}

function formatUnixTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function jumptopdflist() {
    document.getElementById("pdflist").style.display = "block";
    document.getElementById("showpdf").style.display = "none";
}

function getExportFile(obj) {
    var zip_name = $(obj).html();
    window.open(wz[5] + '/?file=' + zip_name);
}