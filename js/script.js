// global variables.
var timerId;
var timer = "01:00";
var timeOutPeriod = "00:23";

var chances = 6;
var currentChance = 1;
var level = 1;
var levelsCount = 5;
var code = [];
var codeLength = 3;

var sysCards = 12;

var cardsPerRow;
var offsetSpace;
var offsetPointer;

var taxtHelperCases = [];

var audio = document.createElement('audio');
audio.setAttribute("src", "timer_music.mp3");
audio.setAttribute("loop", "true");
    
var timeOutAudio = document.createElement('audio');
timeOutAudio.setAttribute("src", "time_out.mp3");

var gameOverAudio = document.createElement('audio');
gameOverAudio.setAttribute("src", "game_over.mp3");

var winAudio = document.createElement('audio');
winAudio.setAttribute("src", "won_audio.mp3");

var levelsData = [
    {level: 1, totalAvailableChances: 8, totalAvailableTime: "06:00"},
    {level: 2, totalAvailableChances: 7, totalAvailableTime: "05:00"},
    {level: 3, totalAvailableChances: 6, totalAvailableTime: "04:00"},
    {level: 4, totalAvailableChances: 5, totalAvailableTime: "03:00"},
    {level: 5, totalAvailableChances: 5, totalAvailableTime: "02:00"}
];

// some utils functions.

function generatRandomNumber() {
    return Math.floor( Math.random() * 9 );
}

function isTimeOut(timerAsString) {
    var timerAsArray = timerAsString.split(":");
    if((parseInt(timerAsArray[0]) == 0) && (parseInt(timerAsArray[1]) == 0)) {
        return true;
    }
    return false;
} 

function decreaseTimerOneSecond(timerAsString) {
    var timerAsArray = timerAsString.split(":");
    if(parseInt(timerAsArray[1]) == 0) {
        return ((parseInt(timerAsArray[0]) - 1) < 10? "0" + (parseInt(timerAsArray[0]) - 1): (parseInt(timerAsArray[0]) - 1)) + ":59";
    }
    return timerAsArray[0] + ":" + ((parseInt(timerAsArray[1]) - 1) < 10? "0" + (parseInt(timerAsArray[1]) - 1): (parseInt(timerAsArray[1]) - 1));
}

function decreaseChances(){
    $("#total_chances_number").html(chances - currentChance);
}

function finishLevel(status) {
    $("#gp_container").html("");
    var levelNumber = 0;
    var message = "";
    var btnMessage = "";
    if(status == "completed") {
        levelNumber = 1;
        message = "Great! it's completed.";
        btnMessage = "Play Again";
    } else if(status == "done") {
        levelNumber = level + 1;
        message = "Good Job!";
        btnMessage = "Next level";
    } else if(status == "timeout") {
        levelNumber = level;
        message = "Oops! Timeout";
        btnMessage = "try again";
    } else if(status == "gameover") {
        levelNumber = level;
        message = "Oops! Game over";
        btnMessage = "try again";
    }
    drawResultSection(levelNumber, message, btnMessage);
}

// time out function.
function timeOut() {
    clearInterval(timerId);
    finishLevel("timeout");
}

// game over function
function gameOver() {
    clearInterval(timerId);
    audio.pause();
    gameOverAudio.play();
    setTimeout(function(){
        finishLevel("gameover");
    }, 4000);
    
}

// won the level.
function won() {
    clearInterval(timerId);
    audio.pause();
    winAudio.play();
    setTimeout(function(){
        if(level == levelsCount) {
            finishLevel("completed");
        } else {
            finishLevel("done");
        }
    }, 2000);
    
}

function checkTimer() {
    if(isTimeOut(timer)) {
        timeOut();
    } else {
        if(timer == timeOutPeriod) {
            audio.pause();
            timeOutAudio.play();
        }
        timer = decreaseTimerOneSecond(timer);
        $("#timer_span").html(timer);
    }
}

function startTimer() {
    timerId = setInterval(checkTimer, 1000);
}

// validate is a number between 0-9.
function isaDigit(num) {
    var digit = parseInt(num);
    if((digit != NaN) && (digit >= 0) && (digit <= 9)) {
        return true;
    }
    return false;
}

// draw game page components.

// draw result section.
function drawResultSection(levelNumber, message, btnMessage) {
    var pageContainer = document.getElementById("gp_container");
    var resultSection = document.createElement("section");
    resultSection.setAttribute("class", "container result_section");
    resultSection.setAttribute("id", "result_section");
    pageContainer.appendChild(resultSection);
    
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    resultSection.appendChild(row);
    
    var resultSectionContent = document.createElement("div");
    resultSectionContent.setAttribute("class", "col-xs-offset-3 col-xs-6 result_section_content");
    row.appendChild(resultSectionContent);
    
    var resultSectionh1 = document.createElement("h1");
    resultSectionh1.setAttribute("id", "title_msg");
    resultSectionh1.innerHTML = message;
    resultSectionContent.appendChild(resultSectionh1);
    
    var resultSectionStartBtn = document.createElement("button");
    resultSectionStartBtn.setAttribute("class", "btn play_game_btn");
    resultSectionStartBtn.setAttribute("id", "play_game");
    resultSectionStartBtn.setAttribute("data-level", levelNumber);
    resultSectionStartBtn.innerHTML = btnMessage;
    resultSectionContent.appendChild(resultSectionStartBtn);
}

// draw intro section.
function drawIntroSection(levelNumber) {
    var pageContainer = document.getElementById("gp_container");
    var introSection = document.createElement("section");
    introSection.setAttribute("class", "container intro_section");
    introSection.setAttribute("id", "intro_section");
    pageContainer.appendChild(introSection);
    
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    introSection.appendChild(row);
    
    var introSectionContent = document.createElement("div");
    introSectionContent.setAttribute("class", "col-xs-offset-3 col-xs-6 intro_section_content");
    row.appendChild(introSectionContent);
    
    var introSectionh1 = document.createElement("h1");
    introSectionh1.innerHTML = 'Level <span class="level_number">' + levelNumber + '</span>';
    introSectionContent.appendChild(introSectionh1);
    
    var introSectionStartBtn = document.createElement("button");
    introSectionStartBtn.setAttribute("class", "btn start_btn");
    introSectionStartBtn.setAttribute("id", "start_game");
    introSectionStartBtn.setAttribute("data-level", levelNumber);
    introSectionStartBtn.innerHTML = "Start";
    introSectionContent.appendChild(introSectionStartBtn);
}

// draw header section.
function drawHeaderSection() {
    var pageContainer = document.getElementById("gp_container");
    var headerSection = document.createElement("section");
    headerSection.setAttribute("class", "header_section");
    pageContainer.appendChild(headerSection);
    
    var headerSectionContainer = document.createElement("div");
    headerSectionContainer.setAttribute("class", "container bd_light_white bd_sides_rd");
    headerSection.appendChild(headerSectionContainer);
    
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    headerSectionContainer.appendChild(row);
    
    // header level part
    var headerLevelDiv = document.createElement("div");
    headerLevelDiv.setAttribute("class", "col-xs-4 header_level");
    row.appendChild(headerLevelDiv);
    
    var headerLevelP = document.createElement("p");
    headerLevelP.innerHTML = "Level: ";
    headerLevelDiv.appendChild(headerLevelP);

    var headerLevelspan = document.createElement("span");
    headerLevelspan.innerHTML = level;
    headerLevelP.appendChild(headerLevelspan);
    
    
    // header chances part
    var headerChancesDiv = document.createElement("div");
    headerChancesDiv.setAttribute("class", "col-xs-4 header_chances");
    row.appendChild(headerChancesDiv);
    
    var headerChancesP = document.createElement("p");
    headerChancesP.innerHTML = "Chances: ";
    headerChancesDiv.appendChild(headerChancesP);

    var headerChancesSpan = document.createElement("span");
    headerChancesSpan.setAttribute("id", "total_chances_number");
    headerChancesSpan.innerHTML = chances;
    headerChancesP.appendChild(headerChancesSpan);
    
    // header timer part
    var headerTimerDiv = document.createElement("div");
    headerTimerDiv.setAttribute("class", "col-xs-4 header_timer");
    row.appendChild(headerTimerDiv);
    
    var headerTimerP = document.createElement("p");
    headerTimerP.innerHTML = "Time: ";
    headerTimerDiv.appendChild(headerTimerP);

    var headerTimerspan = document.createElement("span");
    headerTimerspan.setAttribute("id","timer_span");
    headerTimerspan.innerHTML = timer;
    headerTimerP.appendChild(headerTimerspan);
}

// draw main section.
function drawMainSection() {
    var pageContainer = document.getElementById("gp_container");
    var mainSection = document.createElement("section");
    mainSection.setAttribute("class", "main_section container");
    pageContainer.appendChild(mainSection);
    
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    mainSection.appendChild(row);
    
    // logo part
    var mainHeadDiv = document.createElement("div");
    mainHeadDiv.setAttribute("class", "main_head col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2");
    row.appendChild(mainHeadDiv);
    
    var logoDiv = document.createElement("div");
    logoDiv.setAttribute("class", "logo");
    logoDiv.innerHTML = "CodeBreaker";
    mainHeadDiv.appendChild(logoDiv);
    
    // fields part
    var gameInputsDiv = document.createElement("div");
    gameInputsDiv.setAttribute("class", "game_input_fields col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2");
    row.appendChild(gameInputsDiv);
    
    var gameInput1 = document.createElement("input");
    gameInput1.setAttribute("type","text");
    gameInput1.setAttribute("class","input_field_control");
    gameInput1.setAttribute("id","game_input_1");
    gameInput1.setAttribute("maxlength","1");
    gameInputsDiv.appendChild(gameInput1);
    
    var gameInput2 = document.createElement("input");
    gameInput2.setAttribute("type","text");
    gameInput2.setAttribute("class","input_field_control");
    gameInput2.setAttribute("id","game_input_2");
    gameInput2.setAttribute("maxlength","1");
    gameInputsDiv.appendChild(gameInput2);
    
    var gameInput3 = document.createElement("input");
    gameInput3.setAttribute("type","text");
    gameInput3.setAttribute("class","input_field_control");
    gameInput3.setAttribute("id","game_input_3");
    gameInput3.setAttribute("maxlength","1");
    gameInputsDiv.appendChild(gameInput3);
    
    // main footer part.
    var mainFooterDiv = document.createElement("div");
    mainFooterDiv.setAttribute("class", "main_footer col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2");
    row.appendChild(mainFooterDiv);
    
    var footerI = document.createElement("i");
    footerI.setAttribute("class", "fa fa-code");
    footerI.setAttribute("id", "submit_chance");
    footerI.setAttribute("aria-hidden", "true");
    mainFooterDiv.appendChild(footerI);
}

// draw chances section.
function drawChancesSection() {
    var pageContainer = document.getElementById("gp_container");
    var chancesSection = document.createElement("section");
    chancesSection.setAttribute("class", "game_chances_section container");
    pageContainer.appendChild(chancesSection);
    
    var row = document.createElement("div");
    row.setAttribute("class", "row");
    row.setAttribute("id", "game_chances_container");
    chancesSection.appendChild(row);
}

// draw chance card div.
function drawChanceCard(chanceCode, textHelper, offset) {
    var chancesContainer = document.getElementById("game_chances_container");
    var chanceCard = document.createElement("div");
    if(offset) {
        chanceCard.setAttribute("class", "col-sm-offset-3 col-md-offset-" + offsetSpace + " col-xs-12 col-sm-6 col-md-4");
    } else {
        chanceCard.setAttribute("class", "col-xs-12 col-sm-6 col-md-4");
    }
    
    chancesContainer.appendChild(chanceCard);
    
    var chanceCardContainer = document.createElement("div");
    chanceCardContainer.setAttribute("class", "chance_card");
    chanceCard.appendChild(chanceCardContainer);
    
    var chanceCardDigits = document.createElement("div");
    chanceCardDigits.setAttribute("class", "card_digits");
    chanceCardContainer.appendChild(chanceCardDigits);
    
    var chanceCardDigit1 = document.createElement("span");
    chanceCardDigit1.innerHTML = chanceCode[0];
    chanceCardDigits.appendChild(chanceCardDigit1);
    var chanceCardDigit2 = document.createElement("span");
    chanceCardDigit2.innerHTML = chanceCode[1];
    chanceCardDigits.appendChild(chanceCardDigit2);
    var chanceCardDigit3 = document.createElement("span");
    chanceCardDigit3.innerHTML = chanceCode[2];
    chanceCardDigits.appendChild(chanceCardDigit3);
    
    var chanceCardDiscription = document.createElement("div");
    chanceCardDiscription.setAttribute("class", "card_discription");
    chanceCardContainer.appendChild(chanceCardDiscription);
    
    var chanceCardDiscriptionText = document.createElement("p");
    chanceCardDiscriptionText.innerHTML = textHelper;
    chanceCardDiscription.appendChild(chanceCardDiscriptionText);
}

// draw game page.
function drawGamePage() {
    drawHeaderSection();
    drawMainSection();
    drawChancesSection();
}

// generate code.
function generateCode() {
    code = [];
    var i = 0;
    while(i<codeLength) {
        var codeElement = generatRandomNumber();
        if(!code.includes(codeElement)) {
            code.push(codeElement);
            i++;
        }
    }
}

// get code statistics json
function getCSJ(codeOfChacnce) {
    var csj = {
        'rr': 0,
        'rw': 0,
        'w': 0
    };
    
    for(var i = 0; i<codeOfChacnce.length; i++) {
        if(codeOfChacnce[i] == code[i]) {
            csj.rr++;
        } else if(code.includes(codeOfChacnce[i])) {
            csj.rw++;
        } else {
            csj.w++;
        }
    }
    console.log("csj: " + csj.rr + " , " + csj.rw + " , " + csj.w);
    return csj;
}

// initialize offset pointer configurations.
function initializeOffset() {
    offsetSpace = (((cardsPerRow - ((chances-1) % cardsPerRow)) / cardsPerRow) * sysCards) / 2;
    offsetPointer = chances - ((chances-1) % cardsPerRow);
}

// initialize game.
function initializeGame(levelNumber, chancesCount, totalTime, cpr=3) {
    level = levelNumber;
    chances = chancesCount;
    currentChance = 1;
    timer = totalTime;
    cardsPerRow = cpr;
    initializeOffset();
    codeLength = 3;
    console.log("offsetPointer: " + offsetPointer);
    console.log("offsetSpace: " + offsetSpace);
    
    generateCode();
    console.log("code: " + code);
}

$(document).ready(function(){
    "use strict";
//    var qs = decodeURIComponent(window.location.search.split("?")[1]).split("&");
//    var urlLevel = 1;
//    for(var i=0; i<qs.length; i++) {
//        var qsi = qs[i].split("=");
//        if(qsi[0] == "level") {
//            urlLevel = parseInt(qsi[1]);
//        }
//    }
//    
//    $(".level_number").html(urlLevel);
    console.log('do you ready....');
    drawIntroSection(1);
    
    
    // when cleck btn in intro section.
    $("#gp_container").on("click", ".intro_section .intro_section_content #start_game", function(){
        console.log('Starting.');
        var urlLevel = parseInt($(this).attr("data-level"));
        
        $("#gp_container").html("");
        initializeGame(levelsData[urlLevel-1].level,levelsData[urlLevel-1].totalAvailableChances,levelsData[urlLevel-1].totalAvailableTime,3);
        drawGamePage();
                
        audio.play();
        startTimer();
    });
    
    // when cleck btn in result section.
    $("#gp_container").on("click", ".result_section .result_section_content #play_game", function(){
        var urlLevel = parseInt($(this).attr("data-level"));
        
        $("#gp_container").html("");
        drawIntroSection(urlLevel);
    });
    
    $("#gp_container").on("click", ".main_section .main_footer #submit_chance", function(){
        console.log("value: " + this.value);
        var fields = []
        var valid = true;
        $(".input_field_control").each(function(i,e){
            if((!isaDigit(e.value)) || (fields.includes(parseInt(e.value)))) {
                valid = false;
            }
            fields.push(parseInt(e.value));
        });
        console.log("fields: " + fields);
        console.log("valid: " + valid);
        
        if(valid) {
            var cSJson = getCSJ(fields);
            if(cSJson.rr == codeLength) {
                // done right code.
                console.log("Done.");
                // call win fun.
                won();
            } else if(currentChance == chances) {
                // finish last wrong code.
                console.log("Game over.");
                // call game over fun.
                //drawChanceCard(fields, "", currentChance == offsetPointer);
                decreaseChances();
                currentChance++;
                gameOver();
            } else if(cSJson.w == codeLength) {
                drawChanceCard(fields, "Nothing is correct", currentChance == offsetPointer);
                decreaseChances();
                currentChance++;
            } else if(cSJson.rw == codeLength) {
                drawChanceCard(fields, "All numbers are correct but wrong placed.", currentChance == offsetPointer);
                decreaseChances();
                currentChance++;
            } else if((cSJson.w > 0) && ((codeLength - cSJson.w) == cSJson.rr)) {
                var hText = cSJson.rr == 1? "One number is correct and well placed." : "Two numbers are correct and well placed.";
                drawChanceCard(fields, hText, currentChance == offsetPointer);
                decreaseChances();
                currentChance++;
            } else if((cSJson.w > 0) && ((codeLength - cSJson.w) == cSJson.rw)) {
                var hText = cSJson.rw == 1? "One number is correct but wrong placed." : "Two numbers are correct but wrong placed.";
                drawChanceCard(fields, hText, currentChance == offsetPointer);
                decreaseChances();
                currentChance++;
            } else if((cSJson.w > 0) && ((codeLength - cSJson.w) == (cSJson.rw + cSJson.rr))) {
                var hText = "Two numbers are correct but one is wrong placed.";
                drawChanceCard(fields, hText, currentChance == offsetPointer);
                decreaseChances();
                currentChance++;
            } else if((cSJson.rw > 0) && ((codeLength - cSJson.rw) == cSJson.rr)) {
                var hText = cSJson.rw == 1? "All numbers are correct but one is wrong placed." : "All numbers are correct but two are wrong placed.";
                drawChanceCard(fields, hText, currentChance == offsetPointer);
                decreaseChances();
                currentChance++;
            }
        }

    });
    
    
});

