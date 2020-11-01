// global constants
var playToken = "redsplay"
const table = document.querySelector(".table")
const zeros = document.querySelectorAll(".zeros")
const c1 = Array.from(document.getElementsByClassName("c1"))
const c2 = Array.from(document.getElementsByClassName("c2"))
const c3 = Array.from(document.getElementsByClassName("c3"))
const c4 = Array.from(document.getElementsByClassName("c4"))
const c5 = Array.from(document.getElementsByClassName("c5"))
const c6 = Array.from(document.getElementsByClassName("c6"))
const c7 = Array.from(document.getElementsByClassName("c7"))
const c8 = Array.from(document.getElementsByClassName("c8"))
const coloumns = [c1, c2, c3, c4, c5, c6, c7, c8]
const r1 = Array.from(document.getElementsByClassName("r1"))
const r2 = Array.from(document.getElementsByClassName("r2"))
const r3 = Array.from(document.getElementsByClassName("r3"))
const r4 = Array.from(document.getElementsByClassName("r4"))
const r5 = Array.from(document.getElementsByClassName("r5"))
const r6 = Array.from(document.getElementsByClassName("r6"))
const r7 = Array.from(document.getElementsByClassName("r7"))
const r8 = Array.from(document.getElementsByClassName("r8"))
const rows = [r1, r2, r3, r4, r5, r6, r7, r8]


// Event listener
zeros.forEach(zero => {
    zero.addEventListener("click", clickEvent);
})

// click event
function clickEvent(e){
    const zerosArray = Array.from(zeros)
    const zero = e.target

    console.log(zerosArray.indexOf(zero) + 1 + " th zero is clicked");

    // basic things to do
    if (playToken == "redsplay") {

        zero.classList.add("crossedbyred");
        table.classList.remove(playToken);
        table.classList.add("blusplay");
        zero.setAttribute("data-value" , "1");
        swapPlay();

    } else if (playToken == "blusplay") {

        zero.classList.add("crossedbyblu");
        table.classList.remove(playToken);
        table.classList.add("redsplay");
        zero.setAttribute("data-value" , "1");
        swapPlay();

    }

    // locators
    columnLocator();
     function columnLocator(){

        for (let i = 0; i < coloumns.length; i++){
            if (coloumns[i].includes(zero)){
                var clickedColoumn = Array.from(coloumns[i])
                console.log(clickedColoumn)

                    console.log(clickedColoumn.every(function(divs){  
                        divs.getAttribute("data-value") == "1"
                    }))
                    
            }
        }
    }
    rowLocator();
     function rowLocator(){
        for (let i = 0; i < rows.length; i++){
            if (rows[i].includes(zero)){
                var clickedRow = Array.from(rows[i])
                console.log(clickedRow)

                    console.log(clickedRow.every(function(divs){
                        divs.getAttribute("data-value") == "1"
                    }))
                
            }
        }
    }

}

// play swapper
function swapPlay(){
    if (playToken == "redsplay") {
        playToken = "blusplay"
    } else {
        playToken = "redsplay"
    }
}

// initiator
function startGame(){
    table.classList.add(playToken);
}

startGame()
