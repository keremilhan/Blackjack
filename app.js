const computerDOM = document.querySelector('.computer p');
const playerDOM = document.querySelector('.player p');
const hitButton = document.querySelector('#hit-btn');
const stayButton = document.querySelector('#stay-btn');

window.addEventListener("DOMContentLoaded", gameStart)

async function gameStart(){
    await shuffleTheDeck();
    await drawCards();

    
}

let computerCardsValue = 0;
let playerCardsValue = 0;

async function shuffleTheDeck(){
    const api= await fetch("https://deckofcardsapi.com/api/deck/80v3il51t5pa/shuffle/")
}

async function drawCards(){
    const api= await fetch(`https://deckofcardsapi.com/api/deck/80v3il51t5pa/draw/?count=4`)

    const data = await api.json();

    let starterCards = [`${data.cards[0].value}`,`${data.cards[1].value}`,`${data.cards[2].value}`,`${data.cards[3].value}`];

    checkCards(starterCards);

    computerCardsValue += parseFloat(starterCards[0]) + parseFloat(starterCards[1]); 

    playerCardsValue += parseFloat(starterCards[2]) + parseFloat(starterCards[3]); 

    winLoseCheck(computerCardsValue,playerCardsValue);

    hitButton.addEventListener("click", draw)
}

function winLoseCheck(computerCardsValue,playerCardsValue){
    console.log("computer", computerCardsValue);
    console.log("player", playerCardsValue);
    if(computerCardsValue > 21 || playerCardsValue > 21 ){
        if(computerCardsValue > 21){
            console.log("computer lost");
        }else if(playerCardsValue > 21){
            console.log("you lost");
        }
    }
    else if(computerCardsValue == 21 && playerCardsValue ==21 ){
        console.log("tie. play again");
    }else if(computerCardsValue == 21){
        console.log("computer won");
    }else if(playerCardsValue == 21){
        console.log("you won");
    }else{
        return
    }
}

function checkCards(array){
    while(array.includes("JACK") || array.includes("KING") || array.includes("ACE") || array.includes("QUEEN")){
        if(array.includes("JACK")){
            array[(array.indexOf("JACK"))] = "10";
        }else if(array.includes("KING")){
            array[(array.indexOf("KING"))] = "10";
        }else if(array.includes("ACE")){
            array[(array.indexOf("ACE"))] = "11";
        }else if(array.includes("QUEEN")){
            array[(array.indexOf("QUEEN"))] = "10";
        }
    }
}


async function draw(){
    const api= await fetch(`https://deckofcardsapi.com/api/deck/80v3il51t5pa/draw/?count=1`)

    const data = await api.json();

    console.log(data.cards[0].value);

    if(data.cards[0].value == "KING" || data.cards[0].value == "QUEEN" || data.cards[0].value == "JACK" || data.cards[0].value == "ACE"){
        data.cards[0].value = "10";
    }

    playerCardsValue += parseFloat(data.cards[0].value);

    console.log(playerCardsValue);

    winLoseCheck(computerCardsValue,playerCardsValue);
}


