const playerCardsContainer = document.querySelector('.player')
const computerCardsContainer = document.querySelector('.computer')
const hitButton = document.querySelector('#hit-btn');
const stayButton = document.querySelector('#stay-btn');
const playAgainButton = document.querySelector('#play-again-btn')
const infoText = document.querySelector('#info-text');
const whoseTurn = document.getElementById('whose-turn-text');

window.addEventListener("DOMContentLoaded", gameStart)

async function gameStart(){
    await shuffleTheDeck();
    await drawCards();
}

let computerCardsValue = 0;
let playerCardsValue = 0;
let playerAceCount = 0;
let computerAceCount = 0;


async function shuffleTheDeck(){
    const api= await fetch("https://deckofcardsapi.com/api/deck/80v3il51t5pa/shuffle/")
}

async function drawCards(){
    const api= await fetch(`https://deckofcardsapi.com/api/deck/80v3il51t5pa/draw/?count=4`)

    const data = await api.json();

    let starterCards = [`${data.cards[0].value}`,`${data.cards[1].value}`,`${data.cards[2].value}`,`${data.cards[3].value}`];

    checkCards(starterCards);

    let cardImage1 = document.createElement('img');
    let cardImage2 = document.createElement('img');
    let cardImage3 = document.createElement('img');
    let cardImage4 = document.createElement('img');

    cardImage1.src = `${data.cards[0].images.png}`;
    cardImage2.src = `${data.cards[1].images.png}`;
    cardImage3.src = `${data.cards[2].images.png}`;
    cardImage4.src = `${data.cards[3].images.png}`;

    computerCardsContainer.appendChild(cardImage1);
    computerCardsContainer.appendChild(cardImage2);
    playerCardsContainer.appendChild(cardImage3);
    playerCardsContainer.appendChild(cardImage4);

    computerCardsValue += parseFloat(starterCards[0]) + parseFloat(starterCards[1]); 

    playerCardsValue += parseFloat(starterCards[2]) + parseFloat(starterCards[3]); 

    winLoseCheck(computerCardsValue,playerCardsValue);

    hitButton.addEventListener("click", playerDraw);

    stayButton.addEventListener("click", stay)
    
}

function winLoseCheck(computerCardsValue,playerCardsValue){
    console.log("computer", computerCardsValue);
    console.log("player", playerCardsValue);
    if(computerCardsValue > 21 || playerCardsValue > 21 ){
        if(computerCardsValue > 21){
            console.log("computer lost");
            infoText.textContent = `You won!`
            winLoseScreen();
        }else if(playerCardsValue > 21){
            infoText.textContent = `You lost!`
            winLoseScreen();
        }
    }
    else if(computerCardsValue == 21 && playerCardsValue ==21 ){
        infoText.textContent = `Tie! Play again!`
        winLoseScreen();
    }else if(computerCardsValue == 21){
        infoText.textContent = `You lost!`
        winLoseScreen();
    }else if(playerCardsValue == 21){
        infoText.textContent = `You won!`
        winLoseScreen();
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
            if(array.indexOf("ACE") == 0 && (array.indexOf("ACE") == 1)){
                computerAceCount += 1
                array[0] = "11";
                array[1] = "1";
            }else if(array.indexOf("ACE") == 2 && (array.indexOf("ACE") == 3)){
                playerAceCount += 1
                array[2] = "11";
                array[3] = "1";
            }else if(array.indexOf("ACE") == 0 || (array.indexOf("ACE") == 1)){
                computerAceCount += 1
            }else if(array.indexOf("ACE") == 2 || array.indexOf("ACE") == 3) {
                playerAceCount += 1
            }
        }else if(array.includes("QUEEN")){
            array[(array.indexOf("QUEEN"))] = "10";
        }
    }
}

async function playerDraw(){
    const api= await fetch(`https://deckofcardsapi.com/api/deck/80v3il51t5pa/draw/?count=1`)

    const data = await api.json();

    console.log(data.cards[0].value);

    console.log("player ace count", playerAceCount);

    if(playerAceCount == 0){
        if(data.cards[0].value == "KING" || data.cards[0].value == "QUEEN" || data.cards[0].value == "JACK"){
            data.cards[0].value = "10";
            playerCardsValue += parseFloat(data.cards[0].value);
        }else if(data.cards[0].value == "ACE"){
            data.cards[0].value = "11";
            playerCardsValue += parseFloat(data.cards[0].value);
            if(playerCardsValue > 21){
                playerCardsValue -= 10;
            }else{
                data.cards[0].value = "11";
                playerAceCount += 1
                console.log("player ace count", playerAceCount);
                playerCardsValue += parseFloat(data.cards[0].value);
            }
        }else{
            playerCardsValue += parseFloat(data.cards[0].value);
        }
    }else if(playerAceCount == 1){
        if(data.cards[0].value == "KING" || data.cards[0].value == "QUEEN" || data.cards[0].value == "JACK"){
            data.cards[0].value = "10";
            playerCardsValue += parseFloat(data.cards[0].value);
            if(playerCardsValue > 21){
                playerCardsValue -= 10;
                playerAceCount -= 1;
            }
        }else if(data.cards[0].value == "ACE"){
            if(parseFloat(data.cards[0].value) + playerCardsValue > 21){
                data.cards[0].value = "1";
                playerCardsValue += parseFloat(data.cards[0].value);
                console.log("player ace count", playerAceCount);
            }
        }else{
            console.log("player ace count", playerAceCount);
            playerCardsValue += parseFloat(data.cards[0].value);
            playerCardsValue -= 10;
            playerAceCount -= 1;
        }
    }else{
        console.log("bir sıkıntı var");
    }

    let cardImage = document.createElement('img');
    cardImage.src = `${data.cards[0].images.png}`;
    playerCardsContainer.appendChild(cardImage);

    console.log(playerCardsValue);

    console.log("remaining afer player draw", data.remaining);

    winLoseCheck(computerCardsValue,playerCardsValue);
}

function winLoseScreen(){
    stayButton.disabled = true;
    hitButton.disabled = true;
    playAgainButton.disabled = false;
}

playAgainButton.addEventListener("click", ()=> {
    document.location.reload();
})

async function computerDraw(){
    const api= await fetch(`https://deckofcardsapi.com/api/deck/80v3il51t5pa/draw/?count=1`)

    const data = await api.json();

    console.log(data.cards[0].value);

    console.log("computer ace count", computerAceCount);

    if(computerAceCount == 0){
        if(data.cards[0].value == "KING" || data.cards[0].value == "QUEEN" || data.cards[0].value == "JACK"){
            data.cards[0].value = "10";
            computerCardsValue += parseFloat(data.cards[0].value);
        }else if(data.cards[0].value == "ACE"){
            if(computerCardsValue < 10){
                data.cards[0].value = "11";
                computerAceCount += 1
                console.log("computer ace count", computerAceCount);
                computerCardsValue += parseFloat(data.cards[0].value);
            }else{
                data.cards[0].value = "1";
                computerAceCount += 1
                console.log("computer ace count", computerAceCount);
                computerCardsValue += parseFloat(data.cards[0].value);
            }
        }else{
            computerCardsValue += parseFloat(data.cards[0].value);
        }
    }else if(computerAceCount > 0){
        if(data.cards[0].value == "KING" || data.cards[0].value == "QUEEN" || data.cards[0].value == "JACK"){
            data.cards[0].value = "10";
            computerCardsValue += parseFloat(data.cards[0].value);
            if(computerCardsValue > 21){
                computerCardsValue -= 10;
                computerAceCount -= 1;
            }
        }else if(data.cards[0].value == "ACE"){
            if(parseFloat(data.cards[0].value) + computerCardsValue > 21){
                data.cards[0].value = "1";
                computerCardsValue += parseFloat(data.cards[0].value);
                console.log("computer ace count", computerAceCount);
            }
        }else{
            console.log("computer ace count", computerAceCount);
            computerCardsValue += parseFloat(data.cards[0].value);
            computerCardsValue -= 10;
            computerAceCount -= 1;
        }
    }


    let cardImage = document.createElement('img');
    cardImage.src = `${data.cards[0].images.png}`;
    computerCardsContainer.appendChild(cardImage);

    console.log(computerCardsValue);

    console.log("remaining afer compdraw", data.remaining);

    winLoseCheck(computerCardsValue,playerCardsValue)
}

async function stay(){
    whoseTurn.textContent = `Computer turn`;
    stayButton.disabled = true;
    hitButton.disabled = true;

    if(computerCardsValue > playerCardsValue){
        computerCardsValue = 21;
        winLoseCheck(computerCardsValue,playerCardsValue)
    }else if(computerCardsValue == playerCardsValue && computerCardsValue >= 15){
        infoText.textContent = `Tie! Play again!`
        winLoseScreen();
    }else if(computerCardsValue <= playerCardsValue){
        while(computerCardsValue <= playerCardsValue){
            await computerDraw();
            if(computerCardsValue > playerCardsValue && computerCardsValue <= 21){
                computerCardsValue = 21;
                winLoseCheck(computerCardsValue,playerCardsValue)
                break
            }else if(computerCardsValue == playerCardsValue && computerCardsValue >= 15){
                infoText.textContent = `Tie! Play again!`
                winLoseScreen();
                break
            }
        }
    }
}
