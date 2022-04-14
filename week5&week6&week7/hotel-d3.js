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
    judge();
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
    judge();
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
        judge();
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

    for (let i = 0; i < row.length; i++) {
        var item = row[i].getElementsByClassName('edit');
        var data = [];
        for (let j = 0; j < item.length; j++) {
            data[j] = parseInt(item[j].innerHTML);
        }
        //地点
        var place = data[2] + data[3] + data[4] + data[5] + data[6] + data[7];
        if (place != 100) {
            for (let a = 2; a < 8; a++) {
                item[a].style.backgroundColor = 'pink';
            }
        } else {
            for (let a = 2; a < 8; a++) {
                item[a].style.backgroundColor = 'white';
            }
        }
        //住宿原因
        var reason = data[8] + data[9];
        if (reason != 100) {
            item[8].style.backgroundColor = '#f1ef6f';
            item[9].style.backgroundColor = '#f1ef6f';
        } else {
            item[8].style.backgroundColor = 'white';
            item[9].style.backgroundColor = 'white';
        }
        //预定方式
        var method = data[10] + data[11] + data[12];
        if (method != 100) {
            item[10].style.backgroundColor = '#7afa9a';
            item[11].style.backgroundColor = '#7afa9a';
            item[12].style.backgroundColor = '#7afa9a';
        } else {
            item[10].style.backgroundColor = 'white';
            item[11].style.backgroundColor = 'white';
            item[12].style.backgroundColor = 'white';
        }
        //年龄
        var age = data[13] + data[14] + data[15] + data[16];
        if (age != 100) {
            for (let a = 13; a < 17; a++) {
                item[a].style.backgroundColor = '#d4b8f8';
            }
        } else {
            for (let a = 13; a < 17; a++) {
                item[a].style.backgroundColor = 'white';
            }
        }
    }

}

function drawChart() {
    var thead = document.getElementsByTagName('thead')[0];
    var head = thead.getElementsByTagName('th');
    for (let i = 1; i < head.length - 1; i++) {
        head[i].setAttribute('onclick', 'show(this)');
    }
}

drawChart();

function show(obj) {

    var head = ['month', 'female', 'local', 'USA', 'SA', 'EU', 'MEA', 'ASL',
        'businessmen', 'tourists', 'DR', 'agency', 'AC', 'u20', '20to35', '35to55',
        'm55', 'price', 'LoS', 'occupancy', 'conventions'
    ];
    var index;
    for (let i = 0; i < head.length; i++) {
        if (obj.innerHTML == head[i]) index = i;
    }

    //得到数据
    var rows = document.getElementsByClassName('row');
    var months = [];
    var tmpData = [];
    for (let j = 0; j < rows.length; j++) {
        var items = rows[j].getElementsByClassName('edit');
        months[j] = items[0].innerHTML;
        tmpData[j] = parseInt(items[index].innerHTML);
    }

    var width = 1000,
        height = 400,
        padding = {
            top: 10,
            right: 40,
            bottom: 40,
            left: 40
        };

    var textSvg = document.getElementById("test-svg")
    textSvg.innerHTML = ''

    var svg = d3.select("#test-svg")
        .append('svg')
        .attr('width', width + 'px')
        .attr('height', height + 'px');

    // x轴
    var rangex = [];
    for (let i = 0; i < months.length; i++) {
        rangex[i] = i * 50 + 100;
    }

    var xScale = d3.scaleOrdinal()
        .domain(months)
        .range(rangex);
    var xAxis = d3.axisBottom()
        .scale(xScale);
    svg.append('g')
        .call(xAxis)
        .attr("transform", "translate(0," + (height - padding.bottom) + ")")
        .selectAll("text")
        .attr("dx", "50px");

    // y轴      
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(tmpData)])
        .range([height - padding.bottom, padding.top]);
    var yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10);
    svg.append('g')
        .call(yAxis)
        .attr("transform", "translate(" + 100 + ",0)");

    var bar = svg.selectAll(".bar")
        .data(tmpData)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {
            return "translate(" + xScale(i * 100) + "," + yScale(d) + ")";
        });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", 50)
        .attr("height", function(d) {
            return height - yScale(d) - padding.bottom;
        })
        .attr("stroke", "White")
        .attr("fill", "skyblue");
    var dataDot = [];
    for (let i = 0; i < tmpData.length; i++) {
        var tmp = [i, tmpData[i]];
        dataDot[i] = tmp;
    }
    var lineFunc = d3.line()
        .x(function(d) { return 50 * d[0] + 125 })
        .y(function(d) { return yScale(d[1]) })
    svg.append("path")
        .attr('d', lineFunc(dataDot))
        .attr('stroke', 'blue')
        .attr('fill', 'none')
}