var row = 0;

//加载文件
function urlToBlob() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "hotel.csv", true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
        if (this.status == 200) {
            console.log(this.response);
            const reader = new FileReader();
            reader.onload = function() {
                console.log('reader.result', reader.result);
                csvToTable(reader.result);
            }
            reader.readAsText(this.response);
        }
    }
    xhr.send();
}

urlToBlob();

//分割数据
function csvToTable(content) {
    var oBody = document.getElementById("tbody");
    // 以换行符行分割数据
    var monthList = content.split("\n");
    // 以逗号分割每行的数据
    for (i = 1; i < monthList.length - 1; i++) {
        row++;
        var array = monthList[i].split(",");
        tr = document.createElement("tr");

        //每行内容前面增加月份
        td = document.createElement("td");
        td.append(row);
        tr.appendChild(td);

        // 对每行的内容遍历到td标签去
        for (j = 0; j < array.length; j++) {

            td = document.createElement("td");
            td.append(array[j]);
            tr.appendChild(td);
        }

        //对每行内容后面添加删除键
        td = document.createElement("td");
        td.setAttribute('class', 'del');
        td.setAttribute('onclick', 'deleteRow()')
        td.setAttribute('id', row - 1);
        td.append('delete');
        tr.appendChild(td);

        oBody.appendChild(tr);

    }
}
/*
function button() {
    deleteRow();
}

button();
*/
/*
function deleteRow() {
    let oDel = document.getElementsByClassName('del');
    let oBody = document.getElementById('tBody');
    for (let i = 0; i < oDel.length; i++) {
        oDel[i].onclick = function() {
            oBody.removeChild(oBody.childNodes[i]);
        }
    }
}*/
function deleteRow() {
    console.log(this.id);
}
/*
function addRow() {
    row++;
    var oBody = document.getElementById("tbody");
    tr = document.createElement("tr");
    td = document.createElement("td");
    td.append(row);
    tr.appendChild(td);
}*/