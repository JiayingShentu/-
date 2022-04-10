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

        addItem(tr, i, 'month'); //月份

        for (j = 0; j < array.length; j++) { //内容遍历
            addItem(tr, array[j]);
        }
        addItem(tr, 'delete'); //删除键

        oBody.appendChild(tr);
    }
    judge();
    drawChart();
    showHeatmap();
}

function addItem(father, son, type) {
    var td = document.createElement("td");
    if (type == 'month') { td.setAttribute('class', 'month') }
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
    var tRows = document.getElementsByClassName('row');
    console.log(tRows.length)
    for (let i = 0; i < tRows.length; i++) {
        var month = tRows[i].getElementsByTagName('td')[0];
        console.log(month);
        month.setAttribute('onclick', 'showPie(this)');
    }
}


function showPie(obj) {

    var width = 450
    height = 450
    margin = 150

    var radius = Math.min(width, height) / 2 - margin

    var svg = d3.select("#chart1")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var area = [];
    var parent = obj.parentNode;
    console.log(parent)

    for (let i = 0; i < 6; i++) {
        area[i] = parseInt(parent.getElementsByClassName('edit')[i + 2].innerHTML)
    }
    var data = {
        local: area[0],
        USA: area[1],
        SA: area[2],
        EU: area[3],
        MEA: area[4],
        ASL: area[5]
    }
    console.log(area)

    var color = d3.scaleOrdinal()
        .range(["#BBDEFB", "#98CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5"]);


    var pie = d3.pie()
        .value(function(d) {
            return d.value;
        })
    var data_ready = pie(d3.entries(data))



    var arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)


    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d) {
            return (color(d.data.key))
        })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)


    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('text')
        .text(function(d) {
            return d.data.key
        })
        .attr("transform", function(d) {
            var x = arcGenerator.centroid(d)[0] * 2.8;
            var y = arcGenerator.centroid(d)[1] * 2.8;
            return 'translate(' + x + ', ' + y + ')';
        })
        .style("text-anchor", "middle")
        .style("font-size", 12)
    svg
        .selectAll('mySlices')
        .data(data_ready)
        .enter()
        .append('line')
        .attr('stroke', 'black')
        .attr('x1', function(d) { return arcGenerator.centroid(d)[0] * 2; })
        .attr('y1', function(d) { return arcGenerator.centroid(d)[1] * 2; })
        .attr('x2', function(d, i) {
            return arcGenerator.centroid(d)[0] * 2.5;
        })
        .attr('y2', function(d, i) {
            return arcGenerator.centroid(d)[1] * 2.5;
        });
    svg
        .append('text')
        .text(function() { return 'areas coming from' })
        .attr("transform", function() {
            return 'translate(-60,-150)'
        })
}

function showHeatmap() {
    var margin = 30,
        width = 560,
        height = 300
        //设置chart,svg
    var svg = d3.select("#chart2")
        .append("svg")
        .attr("width", width + margin)
        .attr("height", height + margin * 2)
        .append("g") //在svg内加入一个group
        .attr("transform", "translate(" + margin + "," + margin + ")")
    var g = svg.select('g');

    var tRows = document.getElementsByClassName('row');
    console.log(tRows.length)
    var months = []; //月份
    for (let i = 0; i < tRows.length; i++) {
        months[i] = tRows[i].getElementsByTagName('td')[0].getElementsByTagName('span')[0].innerHTML;
    }
    var areas = ["local", "USA", "SA", "EU", "MEA", "ASL"];
    var dataset = [];


    for (let i = 0; i < tRows.length; i++) {
        var month = tRows[i].getElementsByClassName("month")[0].getElementsByTagName("span")[0].innerHTML;
        var data = []
        for (let j = 0; j < 6; j++) {
            data[j] = parseInt(tRows[i].getElementsByClassName('edit')[j + 2].innerHTML)
        }
        /*dataset[i] = [{ 'month': month, 'area': areas[0], 'data': data[0] },
            { 'month': month, 'area': areas[1], 'data': data[1] },
            { 'month': month, 'area': areas[2], 'data': data[2] },
            { 'month': month, 'area': areas[3], 'data': data[3] },
            { 'month': month, 'area': areas[4], 'data': data[4] },
            { 'month': month, 'area': areas[5], 'data': data[5] }
        ]*/
        dataset.push({ 'month': month, 'area': areas[0], 'data': data[0] })
        dataset.push({ 'month': month, 'area': areas[1], 'data': data[1] })
        dataset.push({ 'month': month, 'area': areas[2], 'data': data[2] })
        dataset.push({ 'month': month, 'area': areas[3], 'data': data[3] })
        dataset.push({ 'month': month, 'area': areas[4], 'data': data[4] })
        dataset.push({ 'month': month, 'area': areas[5], 'data': data[5] })

    }
    console.log(months, areas, dataset)

    //x轴
    const x = d3.scaleBand()
        .range([0, width])
        .domain(months)
        .padding(0.05);
    svg.append("g")
        .attr("transform", 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    //y轴
    const y = d3.scaleBand()
        .range([height, 0])
        .domain(areas)
    svg.append("g")
        .call(d3.axisLeft(y));

    const setColor = d3.scaleLinear()
        .range(["white", "#148cfc"])
        .domain([0, 100])

    svg.selectAll()
        .data(dataset, function(d) { return d.month + ':' + d.area; })
        .enter().append("svg:rect")
        .attr("x", function(d) { return x(d.month) })
        .attr("y", function(d) { return y(d.area) })
        .attr("width", (width - margin) / months.length)
        .attr("height", (height - margin) / 6)
        .style("fill", function(d) { return setColor(d.data) })
}