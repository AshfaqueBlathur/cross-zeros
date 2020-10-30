window.onload = function(){

    console.log("window ready");

}

var playToken = "redsplay"

const table = document.querySelector(".table")
const zeros = document.querySelectorAll(".zeros")



zeros.forEach(zero => {

    zero.addEventListener("click", clickEvent);

})

function clickEvent(e){

    const zero = e.target

    console.log("clicked");

    if (playToken == "redsplay") {

        zero.classList.add("crossedbyred");

        table.classList.remove(playToken);
        table.classList.add("blusplay");

        swapPlay();

    } else if (playToken == "blusplay") {

        zero.classList.add("crossedbyblu");

        table.classList.remove(playToken);
        table.classList.add("redsplay");

        swapPlay();

    }
}

function swapPlay(){
    if (playToken == "redsplay") {
        playToken = "blusplay"
    } else {
        playToken = "redsplay"
    }
}

function startGame(){

    table.classList.add(playToken);

}

startGame()