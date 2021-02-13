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



// Game ...
const gameTable = document.querySelector('.game-wrap'),
      aScoreBoard = document.querySelector('.aScore'),
      bScoreBoard = document.querySelector('.bScore'),
      msgUl = document.querySelector('.msgs'),
      endScreen = document.querySelector('.endScreen'),
      winnerDisplay = document.querySelector('.winner'),
      zerosArray = Array.from(document.querySelectorAll('.zeros')),
      restartBtn = document.getElementById('restart');

var aScore = 0,
    bScore = 0,
    myTurn,
    opTurn,
    crossedZeros = [],
    randNum = Math.random();

// first turn finder
const firstTurn = () => {
    if (randNum < 0.5){
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
        };
        if (colScored){
            score = (col.length);
        };
        if (rowScored && colScored){
            score = (row.length) + (col.length);
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
        endScreen.style.display = 'flex';
        if (aScore > bScore){
            winnerDisplay.innerHTML = '<span>💃</span><span>you won!</span>';
            toast('you won..');
        } else if (bScore > aScore){
            winnerDisplay.innerHTML = '<span>💥</span><span>opponent won.</span>';
            msg('come on you jur*... i will beat you next time ＞︿＜');
            toast('opponent won..');
        } else if (aScore == bScore){
            winnerDisplay.innerHTML = "<span>💢</span><span>it's a tie..</span>";
            toast('its a tie..')
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

const restart = (isFromClick) => {
    crossedZeros = [];
    zerosArray.forEach(zero => {
        zero.setAttribute('data-cross', '');
        zero.classList.remove('crossed_by_me');
        zero.classList.remove('crossed_by_op');
    });
    aScore = 0;
    bScore = 0;
    aScoreBoard.innerText = aScore;
    bScoreBoard.innerText = bScore;
    endScreen.style.display = 'none';
    if (isFromClick){
        send(['restart']);
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
    inviteUrl = `https://cross-zeros.github.io#${myPeerId}`;
    toast('my peer is: ' + id);
    peerDisplay.innerHTML = `${id}`;
    new QRCode(document.getElementById("qrcode"), inviteUrl);
});


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
            toast('link shared...')
        } catch (err) {
            toast(err);
        };
    };
};



// error
peer.on('error', err => {
    toast(err);
});

// join a game
var conn;

const joinGame = () => {
    if (myPeerId != undefined){
        let peerId = joinForm.peerId.value;
        conn = peer.connect(peerId);
        
        conn.on('open', () => {
            conn.send(['myPeerId', myPeerId]);
            conn.send(['firstTurn', firstTurn()]);
            console.log(firstTurn());
            // close connection tab
            joinForm.style.display = 'none';
        });
    } else {
        toast('wait....');
    };
};

conn.on('error', err => {
    toast(err);
});

// send msg
const send = (msg) => {
    if (conn){
        conn.send(msg);
    }
};

// recive a connection
peer.on('connection', function(c) {
    c.on('data', data => {
        recieve(data);
    });
});


// recieve msg
const recieve = (data) => {

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
        
            let firstTurn = !data[1];
            console.log(firstTurn);
            
            if (firstTurn){
                myTurn = true;
                opTurn = false;
            } else {
                myTurn = false;
                opTurn = true;
            };
            initiateTable();
            break;

        case 'crossed':

            toast(data[1]);
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

        case 'restart':

            restart(false);
            toast('opponent ready for pla again.');
            break;

    };

};