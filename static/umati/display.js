var socket;
var game;
var players = {};
var h = 0;
var w = 0;
var ball;
var slider1player = '';
var slider2player = '';
var slider3player = '';
var slider4player = '';
var slider5player = '';
var slider6player = '';
document.addEventListener("DOMContentLoaded", function(){
    // create the game and initialize things based on it
    game = createGame();
    var field = document.getElementById("field");
    w = field.offsetWidth;
    h = field.offsetHeight;
    ball = document.getElementById("ball");
    ball.style.width = h * game.ballRadius*2 - 2; // small correction for borders
    ball.style.height = h * game.ballRadius*2 - 2;
    ball.style.borderRadius = h * game.ballRadius;
    ball.style.mozBorderRadius = h * game.ballRadius;

    //CHRISTIE to hide the sliders initially
    document.getElementById("slider1").style.visibility="hidden";
    document.getElementById("slider2").style.visibility="hidden";
    document.getElementById("slider3").style.visibility="hidden";
    document.getElementById("slider4").style.visibility="hidden";
    document.getElementById("slider5").style.visibility="hidden";
    document.getElementById("slider6").style.visibility="hidden";

    // start the socket.io connection and set up the handlers
    socket = io.connect('http://' + window.location.host);
    // the display's own connection handshake
    socket.on('connect', function(){
        document.getElementById("message").innerHTML = 'Display connected to server';
        socket.emit('newDisplay', {title: game.title});
    });
    // a new controller has connected through the server, create a player for it
    socket.on('newPlayer', function(data){
        players[data.controllerID] = game.newPlayer(data.name);
        if(players[data.controllerID]){
            socket.emit('playerConnected', {controllerID: data.controllerID, title: game.title});
            //CHRISTIE add a slider for the player
            if(data.name == slider1player || data.name == slider2player || data.name == slider3player ||
                data.name == slider4player || data.name == slider5player || data.name == slider6player){
                //intentionally left blank to avoid duplicate sliders
            }else if (slider1player == ''){
                document.getElementById("slider1").style.visibility="visible";
                slider1player = data.name;
                $('div#slider1message').html(slider1player);
            }else if (slider2player == ''){
                document.getElementById("slider2").style.visibility="visible";
                slider2player = data.name;
                $('div#slider2message').html(slider2player);
            }else if (slider3player == ''){
                document.getElementById("slider3").style.visibility="visible";
                slider3player = data.name;
                $('div#slider3message').html(slider3player);
            }else if (slider4player == ''){
                document.getElementById("slider4").style.visibility="visible";
                slider4player = data.name;
                $('div#slider4message').html(slider4player);
            }else if (slider5player == ''){
                document.getElementById("slider5").style.visibility="visible";
                slider5player = data.name;
                $('div#slider5message').html(slider5player);
            }else if (slider6player == ''){
                document.getElementById("slider6").style.visibility="visible";
                slider6player = data.name;
                $('div#slider6message').html(slider6player);
            }
        }else{
            socket.emit('playerConnected', {controllerID: data.controllerID, error: "too many players"});
        }
    });
    // a client has disconnected from the server
    socket.on('clientDisconnect', function(data){
        //CHRISTIE to hide slider and delete name (so that slider can be reallocated)
        //also resets slider value to 0
        if(players[data.controllerID].name == (slider1player)){
            slider1player = '';
            $('div#slider1message').html(slider1player);
            document.getElementById("slider1").style.visibility="hidden";
            $('#slider1').slider("value", 0);
        }else if(players[data.controllerID].name == (slider2player)){
            slider2player = '';
            $('div#slider2message').html(slider2player);
            document.getElementById("slider2").style.visibility="hidden";
            $('#slider2').slider("value", 0);
        }else if(players[data.controllerID].name == (slider3player)){
            slider3player = '';
            $('div#slider3message').html(slider3player);
            document.getElementById("slider3").style.visibility="hidden";
            $('#slider3').slider("value", 0);
        }else if(players[data.controllerID].name == (slider4player)){
            slider4player = '';
            $('div#slider4message').html(slider4player);
            document.getElementById("slider4").style.visibility="hidden";
            $('#slider4').slider("value", 0);
        }else if(players[data.controllerID].name == (slider5player)){
            slider5player = '';
            $('div#slider5message').html(slider5player);
            document.getElementById("slider5").style.visibility="hidden";
            $('#slider5').slider("value", 0);
        }else if(players[data.controllerID].name == (slider6player)){
            slider6player = '';
            $('div#slider6message').html(slider6player);
            document.getElementById("slider6").style.visibility="hidden";
            $('#slider6').slider("value", 0);
        }
        if(game.leftPlayers.indexOf(players[data.controllerID]) >= 0
            || game.rightPlayers.indexOf(players[data.controllerID]) >= 0){
            game.removePlayer(players[data.controllerID]);
        }
    });
    socket.on('disconnect', function(){
        game.stop();
    });
    // motion input from a controller through the server
    socket.on('move', function(data){
        // ignore it if the message is from a controllerID that doesn't correspond to one of our players
        if(players[data.controllerID]){
            players[data.controllerID].move(data);
        }
    });
    socket.on('slide', function(data){
        // ignore it if the message is from a controllerID that doesn't correspond to one of our players
        if(players[data.controllerID]){
	    console.log(players[data.controllerID].name + ":" + data.value);
        //CHRISTIE: set slider to equal incoming value
        if(players[data.controllerID].name == (slider1player)){
            $('#slider1').slider("value", data.value);
        }else if(players[data.controllerID].name == (slider2player)){
            $('#slider2').slider("value", data.value);
        }else if(players[data.controllerID].name == (slider3player)){
            $('#slider3').slider("value", data.value);
        }else if(players[data.controllerID].name == (slider4player)){
            $('#slider4').slider("value", data.value);
        }else if(players[data.controllerID].name == (slider5player)){
            $('#slider5').slider("value", data.value);
        }else if(players[data.controllerID].name == (slider6player)){
            $('#slider6').slider("value", data.value);
        }
        }
    });
    socket.on('pause', function(){
        game.pause();
    });
    // set up the Bond debugger
    Bond.startRemoteClient(socket);

    // start ticking away
    setInterval(tick, 20);
   
}, false);

function tick(){
    // tick the game
    game.tick();
    // update the display
    var players = document.getElementsByClassName("player");
    var i;
    if(players.length > 0){
        for(i=0; i<players.length; i++){
            players[i].style.display = "none";
        }
    }
    for(i=0; i<game.leftPlayers.length; i++){
        drawPlayer(game.leftPlayers[i], "left", i);
    }
    for(i=0; i<game.rightPlayers.length; i++){
        drawPlayer(game.rightPlayers[i], "right", i);
    }
    ball.style.top = h * (game.ballLocationY - game.ballRadius);
    ball.style.left = w * game.ballLocationX - h * game.ballRadius;
    document.getElementById("leftScore").innerHTML = game.leftScore;
    document.getElementById("rightScore").innerHTML = game.rightScore;
    var flash = document.getElementById("flash");
    if(game.paused){
        flash.innerHTML = "PAUSED";
    }else if(game.starting){
        flash.innerHTML = "GET READY";
    }else{
        flash.innerHTML = "";
    }
    var playerList = '';
    for(i=0; i< game.leftPlayers.length; i++){
        playerList += '<span style="color:' + game.leftPlayers[i].color + ';">' + game.leftPlayers[i].name + '</span><br>';
    }
    document.getElementById("leftPlayers").innerHTML = playerList;
    playerList = '';
    for(i=0; i< game.rightPlayers.length; i++){
        playerList += '<span style="color:' + game.rightPlayers[i].color + ';">' + game.rightPlayers[i].name + '</span><br>';
    }
    document.getElementById("rightPlayers").innerHTML = playerList;
}

function drawPlayer(player, side, number){
    // create a div if it doesn't yet exist, then adjust its position and color
    var div = document.getElementById(side + number);
    if(!div){
        var container = document.getElementById("leftField");
        if(side == "right"){
            container = document.getElementById("rightField");
        }
        div = document.createElement('div');
        div.setAttribute('class', 'player');
        div.setAttribute('id', side + number);
        div.style.height = h * game.paddleWidth - 4; // small correction for borders
        div.style.width = w * game.paddleThickness - 4;
        container.appendChild(div);
    }
    if(side == "right"){
        div.style.left = w * (player.x - 1.0/2 - game.paddleThickness/2);
    }else{
        div.style.left = w * (player.x - game.paddleThickness/2);
    }
	div.style.top = h * player.y + 1;
    div.style.borderColor = player.color;
    div.style.display = "block";
}
