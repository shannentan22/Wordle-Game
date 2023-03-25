"use strict";
const urlDiv = document.getElementById("url");
const gameDiv = document.getElementById("game");

function makeStartScreen() {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                const wordList = xhr.responseText.split("\n");
                const randomIndex = Math.floor(Math.random() * wordList.length);
                console.log(wordList[randomIndex]);
                makeGameScreen(wordList[randomIndex].toUpperCase());
            }
        }
    };
    xhr.open("GET", "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt", true);
    xhr.send();
}

var guess = "";
var guessBoxes = new Array(30);
var gbp = 0; // guess box pointer
var validGuesses = 6;
function makeGameScreen(word) {
    var title = document.createElement("h1");
    title.innerHTML = "Wordle";
    gameDiv.appendChild(title);
    var subtitle = document.createElement("h2");
    subtitle.innerHTML = "by Angela Shannen Tan";
    gameDiv.appendChild(subtitle);
    if (gameDiv !== null) {
        // guess box
        var guessDiv = document.createElement("div");
        guessDiv.classList.add("guess-div");

        for (let i=0; i<30; i++) {
            guessBoxes[i] = document.createElement("p");
            guessBoxes[i].classList.add("guess-boxes");
            guessDiv.appendChild(guessBoxes[i]);
            if ((i+1) % 5 == 0) {
                let linebreak = document.createElement("br");
                guessDiv.appendChild(linebreak);
            }
        }
        gameDiv.appendChild(guessDiv);

        // alphabet
        const alphabet = "QWERTYUIOPASDFGHJKLZXCVBNM";
        var keyboard = document.createElement("div");
        keyboard.classList.add("keyboard");
        var letters = new Array(26);
        var back, ent;
        for (let i=0; i<26; i++) {
            if (i==0 || i==10 || i==19) {
                var row = document.createElement("div");
                row.classList.add("row");
            }
            if (i==10 || i==19) {
                let linebreak = document.createElement("br");
                row.appendChild(linebreak);
            }
            if (i==19) {
                back = document.createElement("button");
                back.classList.add("letters");
                back.classList.add("backspace");
                back.value = "Backspace";
                back.innerHTML = "Backspace";
                back.addEventListener("click", function e() {
                    if (gbp > 30-validGuesses*5) {
                        guessBoxes[gbp-1].innerHTML = "";
                        guess = guess.substr(0, guess.length-1);
                        gbp--;
                    }
                });
                row.appendChild(back);
            }
            letters[i] = document.createElement("button");
            letters[i].classList.add("letters");
            letters[i].value = alphabet[i];
            letters[i].innerHTML = alphabet[i];
            letters[i].addEventListener("click", letterClick);
            row.appendChild(letters[i]);
            if (i==25) {
                ent = document.createElement("button");
                ent.classList.add("letters");
                ent.classList.add("enter");
                ent.value = "Enter";
                ent.innerHTML = "Enter";
                ent.addEventListener("click", function () {
                    if (guess.length != 5) {
                        alert("Your guess should have 5 characters.");
                    } else {
                        // checks correct, misplaced, and incorrect letters
                        var wordArr = word.split('');
                        for (let i=0; i<5; i++) {
                            if (guess[i] == wordArr[i]) {
                                guessBoxes[i+30-validGuesses*5].classList.add("correct");
                                wordArr[i] = '0';
                            }
                        }
                        for (let i=0; i<5; i++) {
                            if (wordArr.indexOf(guess[i]) != -1 && wordArr[i] != '0') {
                                guessBoxes[i+30-validGuesses*5].classList.add("misplaced");
                                wordArr[wordArr.indexOf(guess[i])] = '1';
                            }
                        }
                        validGuesses--;
    
                        if (guess == word) {
                            alert("You guessed the word correctly!");
                        } else if (validGuesses == 0) {
                            alert("Game over. The word was " + word + ".");
                        }
                        guess = "";
                    }
                });
                row.appendChild(ent);
            } 
            if (i==0 || i==10 || i==19) {
                keyboard.appendChild(row);
            }
        }
        document.addEventListener("keydown", (e) => {
            keyboardPress(e);
        })
        gameDiv.appendChild(keyboard);

        // guesses
        document.addEventListener("keydown", function e(backspace) {
            if (backspace.key === "Backspace" && gbp > 30-validGuesses*5) {
                guessBoxes[gbp-1].innerHTML = "";
                guess = guess.substr(0, guess.length-1);
                gbp--;
            }
        })
        document.addEventListener("keypress", function e(enter) {
            if (enter.key === "Enter") {
                if (guess.length != 5) {
                    alert("Your guess should have 5 characters.");
                } else {
                    // checks correct, misplaced, and incorrect letters
                    var wordArr = word.split('');
                    for (let i=0; i<5; i++) {
                        if (guess[i] == wordArr[i]) {
                            guessBoxes[i+30-validGuesses*5].classList.add("correct");
                            wordArr[i] = '0';
                        }
                    }
                    for (let i=0; i<5; i++) {
                        if (wordArr.indexOf(guess[i]) != -1 && wordArr[i] != '0') {
                            guessBoxes[i+30-validGuesses*5].classList.add("misplaced");
                            wordArr[wordArr.indexOf(guess[i])] = '1';
                        }
                    }
                    validGuesses--;

                    if (guess == word) {
                        alert("You guessed the word correctly!");
                    } else if (validGuesses == 0) {
                        alert("Game over. The word was " + word + ".");
                    }
                    guess = "";
                }
            }
        })
    }
}

function letterClick() {
    if (gbp < 30 - (validGuesses-1)*5) {
        guess = guess + this.value;
        guessBoxes[gbp].innerHTML = this.value;
        gbp++;
    }
}

function keyboardPress(e) {
    if (e.keyCode >= 65 && e.keyCode <= 90 && (gbp < 30 - (validGuesses-1)*5)) {
        guess = guess + e.key.toUpperCase();
        guessBoxes[gbp].innerHTML = e.key.toUpperCase();
        gbp++;
    }
}

makeStartScreen();
// link = https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt
