function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

console.log("start")

// $('#box').replaceWith(' <div class="box red" id="box02"> <h2 > Buss 02 </h2> </div>');

function myFunction() {
    var boxes = $(".box")
    for (i = 0; i < boxes.length; i++) {
        var ran = randomInt(1, 10)
        var tempbox = ("#" + boxes[i].id);
        if (ran > 4) {
            $(tempbox).addClass("red");
        } else {
            console.log(tempbox)
            $(tempbox).removeClass("red");
        }
    }
}

var interval = setInterval(function() { myFunction(); }, 20000);

//