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
//     const api= await fetch("https://deckofcardsapi.com/api/deck/80v3il51t5pa/shuffle/")
    const api= await fetch("https://deckofcardsapi.com/api/deck/c7pqt2boam12/shuffle/")
    
}

async function drawCards(){
    computerDraw();
    playerDraw();
    computerDraw();
    playerDraw();

    if(computerCardsValue == 22){
        computerAceCount += 1;
        computerCardsValue -= 10;
    }else if(playerCardsValue == 22){
        playerAceCount += 1;
        playerCardsValue -= 10;
    }

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

async function playerDraw(){
    const api= await fetch(`https://deckofcardsapi.com/api/deck/c7pqt2boam12/draw/?count=1`)

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
                playerAceCount += 1
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
            if(playerCardsValue > 21){
                playerCardsValue -= 10;
                playerAceCount -= 1;
            }
        }
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
    const api= await fetch(`https://deckofcardsapi.com/api/deck/c7pqt2boam12/draw/?count=1`)

    const data = await api.json();

    console.log(data.cards[0].value);

    console.log("computer ace count", computerAceCount);

    if(computerAceCount == 0){
        if(data.cards[0].value == "KING" || data.cards[0].value == "QUEEN" || data.cards[0].value == "JACK"){
            data.cards[0].value = "10";
            computerCardsValue += parseFloat(data.cards[0].value);
        }else if(data.cards[0].value == "ACE"){
            data.cards[0].value = "11";
            computerCardsValue += parseFloat(data.cards[0].value);
            if(computerCardsValue > 21){
                computerCardsValue -= 10;
            }else{
                computerAceCount += 1
            }
        }else{
            computerCardsValue += parseFloat(data.cards[0].value);
        }
    }else if(computerAceCount == 1){
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
            if(computerCardsValue > 21){
                computerCardsValue -= 10;
                computerAceCount -= 1;
            }
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
