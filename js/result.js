$(document).ready(function(){
    "use strict";
    console.log(window.location.search.split("?")[1].split("&"));
    console.log(decodeURIComponent(window.location.search.split("?")[1]).split("&"));
    var qs = decodeURIComponent(window.location.search.split("?")[1]).split("&");
    var msg = "";
    var status = "";
    var level = 0;
    var targetLevelLink = "index_new.html";
    
    for(var i=0; i<qs.length; i++) {
        var qsi = qs[i].split("=");
        if(qsi[0] == "msg") {
            msg = qsi[1];
        } else if(qsi[0] == "status") {
            status = qsi[1];
        } else if(qsi[0] == "level") {
            level = parseInt(qsi[1]);
        }
    }
    
    console.log("status: " + status);
    console.log("msg: " + msg);
    console.log("level: " + level);
    
    
    $("#title_msg").html(msg);
    if(status == "completed") {
        targetLevelLink += "?level=1";
        $("#play_game").html("Play Game again");
    } else if(status == "done") {
        targetLevelLink += "?level=" + (level+1);
        $("#play_game").html("Next level");
    } else {
        targetLevelLink += "?level=" + level;
        $("#play_game").html("Try again");
    }
    $("#play_game").attr("href", targetLevelLink);
    
});