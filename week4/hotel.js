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
    for (let i = 1; i < monthList.length - 1; i++) {
        var array = monthList[i].split(",");
        var tr = document.createElement("tr");
        tr.setAttribute('class', 'row');

        addItem(tr, i); //月份

        for (j = 0; j < array.length; j++) { //内容遍历
            addItem(tr, array[j]);
        }
        addItem(tr, 'delete'); //删除键

        oBody.appendChild(tr);

    }
}

function addItem(father, son) {
    var td = document.createElement("td");
    var span = document.createElement('span');
    if (son == 'delete') {
        span.setAttribute('class', 'del');
        span.setAttribute('onclick', 'deleteRow(this)');
    } else {
        span.setAttribute('class', 'edit');
        span.setAttribute('onclick', 'edit(this)');
    }
    span.append(son);
    td.appendChild(span);
    father.appendChild(td);
}

//删除行操作
function deleteRow(obj) {
    var oParent = obj.parentNode; //td
    var oGrandParent = oParent.parentNode; //tr
    /*oGrandParent.removeChild(oParent);*/
    var oGreatGrandParent = oGrandParent.parentNode; //tbody
    oGreatGrandParent.removeChild(oGrandParent);
}

//新增行操作
function addRow() {
    var oBody = document.getElementById("tbody");
    var tr = document.createElement("tr");
    tr.setAttribute('class', 'row');
    //每行内容前面增加月份
    addItem(tr, 0);
    // 对每行的内容遍历到td标签去
    for (let i = 0; i < 20; i++) {
        addItem(tr, 0);
    }
    //对每行内容后面添加删除键
    addItem(tr, 'delete');

    oBody.appendChild(tr);
}

//编辑操作
function edit(obj) {
    var data = obj.innerHTML;
    obj.innerHTML = '';

    var item = document.createElement("input");
    item.setAttribute("value", data);
    var parent = obj.parentNode;
    parent.appendChild(item);

    //失焦后读取文本框，恢复原来的表格呈现
    item.onblur = function() {
        let inputData = item.value;
        obj.innerHTML = inputData;
        parent.removeChild(parent.lastElementChild);

    }
    console.log(data);
}

//保存文件操作

function saveFile() {
    var str = "";

    //字段名
    var head = document.getElementsByTagName('th');
    for (let i = 0; i < head.length - 1; i++) {
        if (i != 0) {
            str += ',';
        }
        str += head[i].innerHTML;
    }
    str += "\n";

    //数据
    var row = document.getElementsByClassName('row');
    for (let i = 0; i < row.length; i++) {
        var data = row[i].getElementsByClassName('edit');
        for (let j = 0; j < data.length; j++) {
            if (j != 0) {
                str += ',';
            }
            str += data[j].innerHTML;
        }
        str += "\n";
    }

    download("data.csv", str);
}

//下载
function download(filename, text) {
    var pom = document.createElement("a");
    pom.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    pom.setAttribute("download", filename);
    if (document.createEvent) {
        var event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

//判断数据是否合理
function judge() {
    var row = document.getElementsByClassName('row');
    //地点
    for (let i = 0; i < row.length; i++) {
        console.log(i);
        var data = row[i].getElementsByClassName('edit');
        if (data[2] + data[3] + data[4] + data[5] + data[6] + data[7] != 100) {}

    }
    //原因
    //预定方式
    //年龄

}
judge();