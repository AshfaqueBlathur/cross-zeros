// ui shits
const about = document.querySelector('.about'),
      score = document.querySelector('.score'),
      chat = document.querySelector('.chat');
      
const trig = (target) => {
    switch(target){
        case 'about':
            // open about
            about.style.display = 'block';
            score.style.display = 'none';
            chat.style.display = 'none';
            break;
        case 'score':
            // open about
            about.style.display = 'none';
            score.style.display = 'block';
            chat.style.display = 'none';
            break;
        case 'chat':
            // open chgat
            about.style.display = 'none';
            score.style.display = 'none';
            chat.style.display = 'block';
            break;
    };
};
trig('score');

const toastBlock = document.querySelector('.toastBlock');
const toast = (tst) => {
    let tstP = document.createElement('p');
    tstP.innerText = tst;
    toastBlock.appendChild(tstP);
    setTimeout(() => {
        tstP.remove();
    }, 3000);
};

const msg = () => {
    let msgValue = document.getElementById('msg');
    if (msgValue.value.length){
        send(['message', msgValue.value]);
        let li = document.createElement('li');
        li.setAttribute('class', 'me');
        li.innerText = msgValue.value;
        msgUl.appendChild(li);
        li.scrollIntoView();
        msgValue.value = '';
    } else {
        toast('type something to send .. . !');
    };
};



// share peer id
const share = async () => {
    if (inviteUrl != undefined){
        let inviteObj = {
            title: 'Cross Zeros Invitation',
            text: 'Come, lets play Cross Zeros',
            url: inviteUrl,
        }
        try {
            await navigator.share(inviteObj)
            toast('link shared')
        } catch (err) {
            toast(err);
        };
    };
};

// Game ...
const gameTable = document.querySelector('.game-wrap'),
      aScoreBoard = document.querySelector('.aScore'),
      bScoreBoard = document.querySelector('.bScore');
var aScore = 0,
    bScore = 0,
    myTurn,
    opTurn,
    crossedZeros = [];

// first turn finder
const firstTurn = () => {
    if (randNum < 500){
        return true;
    } else {
        return false;
    };
};

// first turn switch config
if (firstTurn()){
    myTurn = true;
    opTurn = false;
} else {
    myTurn = false;
    opTurn = true;
};


// table color init
const initiateTable = () => {
    if (myTurn){
        gameTable.classList.add('myTurn');
        gameTable.classList.remove('opTurn');
    } else if (opTurn){
        gameTable.classList.add('opTurn');
        gameTable.classList.remove('myTurn');
    };
};
initiateTable();

const crossed = (e, r, c) => {

    // send cross to opp
    if (!crossedZeros.includes(e)){
        send(['crossed', e.classList[1]]);
        crossedZeros.push(e);
    };

    // marking cross
    if (myTurn){
        e.classList.add('crossed_by_me')
    } else if (opTurn){
        e.classList.add('crossed_by_op')
    };

    e.setAttribute('data-cross', 'crossed');
    let score = 0,
        row = Array.from(document.querySelectorAll(`.${r}`)),
        col = Array.from(document.querySelectorAll(`.${c}`)),
        rowScored = row.every(isCrossed),
        colScored = col.every(isCrossed);

    if(rowScored || colScored){
        // fuker scored
        if (rowScored){
            score = (row.length);
        } else if (colScored){
            score = (col.length);
        };
        // score adding
        if (myTurn){
            aScore += score;
            aScoreBoard.innerText = aScore;
        } else if (opTurn){
            bScore += score;
            bScoreBoard.innerText = bScore;
        };
    } else {
        // swap turn
        if (myTurn){
            myTurn = false;
            opTurn = true;
            gameTable.classList.remove('myTurn');
            gameTable.classList.add('opTurn');
        } else if (opTurn){
            myTurn = true;
            opTurn = false;
            gameTable.classList.remove('opTurn');
            gameTable.classList.add('myTurn');
        };
    };

    //console.log(aScore + ' v/s ' + bScore);
    let zeros = Array.from(document.querySelectorAll('.zeros'));
    if (zeros.every(zero => zero.getAttribute('data-cross') == 'crossed')){
        if (aScore > bScore){
            alert('i won, restart browser for a new game..');
        } else if (bScore > aScore){
            alert('opponent won, restart browser for a new game..');
        } else if (aScore == bScore){
            alert('its a tie, restart browser for a new game..')
        };
    };
};     

const isCrossed = (zero) => {
    if (zero.getAttribute('data-cross') == 'crossed'){
        return true;
    } else {
        return false;
    }; 
};



const joinForm = document.querySelector('.joinForm');
// recieve hash peer
if (location.hash){
    let opponentPeer = location.hash.slice(1);
    joinForm.peerId.value = opponentPeer;
};

// peer js
const peerDisplay = document.querySelector('.peerIdDisplay');

var peer = new Peer(),
    myPeerId,
    inviteUrl,
    duplex = false;

peer.on('open', id => {
    myPeerId = id;
    inviteUrl = `https://cross-zeros.web.app#${myPeerId}`;
    toast('my peer is: ' + id);
    peerDisplay.innerHTML = `${id}`;
    new QRCode(document.getElementById("qrcode"), inviteUrl);
});

// error
peer.on('error', function(err) {
    toast(err);
});

// join a game
var conn,
    randNum = Math.floor(Math.random()*1000);

const joinGame = () => {
    let peerId = joinForm.peerId.value;
    conn = peer.connect(peerId);
    
    conn.on('open', () => {
        conn.send(['myPeerId', myPeerId]);
        conn.send(['firstTurn', firstTurn()]);
        //console.log(firstTurn());
        // close connection tab
        joinForm.style.display = 'none';
    });
};


// recive a connection
peer.on('connection', function(c) {
    c.on('data', data => {
        recieve(data);
    });
});

// send msg
const send = (msg) => {
    if (conn){
        conn.send(msg);
    }
};


const msgUl = document.querySelector('.msgs');
// recieve msg
const recieve = (data) => {
    console.log(data);
    switch (data[0]) {
        case 'myPeerId':

            // swap on recieving conn
            myTurn = !myTurn;
            opTurn = !opTurn;
            // connect to him
            if (!duplex){
                let opponentPeerId = data[1];
                conn = peer.connect(opponentPeerId);
                conn.on('open', () => {
                    joinForm.style.display = 'none';
                });
                duplex = true;
                break;
            };

        case 'firstTurn':
        
            let firstTurn = data[1];
            //console.log(firstTurn);
            
            if (!firstTurn){
                myTurn = true;
                opTurn = false;
            } else {
                myTurn = false;
                opTurn = true;
            };
            initiateTable();
            break;

        case 'crossed':

            let zero = document.querySelector(`.${data[1]}`);
            crossedZeros.push(zero);
            zero.click();
            break;

        case 'message':

            trig('chat');
            let msg = data[1];
            let li = document.createElement('li');
            li.setAttribute('class', 'op');
            li.innerText = msg;
            msgUl.appendChild(li);
            li.scrollIntoView();
            break;

    };
};