const main = () => {
    var xh = new XMLHttpRequest();
    xh.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log()
        }
    };
    xh.open("POST", "hotel.csv", true);
    xh.send();
}

main();