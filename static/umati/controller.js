var socket;
var name;
$(document).ready(function(){
    //CHRISTIE
    checkCookie();
    //CHRISTIE moved lower so only generated if no cookie
    //name = Math.random().toString(36).substring(10);

    // start the socket.io connection and set up the handlers
    socket = io.connect('http://' + window.location.host);
    socket.on('connect', function(){
        $('div#message').html('Controller connected to server');
        socket.emit('newPlayer', {title: 'Multipong', name: name});
    });
    socket.on('playerConnected', function(data){
        if(data.error){
            $('div#message').html('Error: ' + data.error);
            socket.disconnect();
        }else{
            $('div#message').html(data.title + ' controller connected to display as player ' + name);
        }
    });
    initKey();
    initSlider();
});

//CHRISTIE to set cookie
function setCookie(c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

//CHRISTIE to get cookie
function getCookie(c_name){
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1){
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1){
        c_value = null;
    }else{
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1){ 
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

//CHRISTIE to check cookie
function checkCookie(){
    var username=getCookie("username");
    if (username!=null && username!=""){
        //alert("Welcome again " + username);
    }else {
        username = Math.random().toString(36).substring(10);
        if (username!=null && username!=""){
            //cookie is set to last a year
            setCookie("username",username,365);
        }
    }
    self.name = username;
}


function keyHandler(event) {
    var deltaY = 0;
    switch(parseInt(event.keyCode)){
        case 38: //up arrow
            deltaY = -1;
            break;
        case 40:  //down arrow
            deltaY = 1;
            break;
        case 0:
            if(event.charCode == 112) socket.emit('pause');
            break;
        default:
            return;
    }
    if(deltaY != 0){
        socket.emit('move', {y: deltaY});
    }
}

function initKey()
{
    window.addEventListener('keydown', keyHandler, true);
}

function sliderHandler(event, ui) {
    console.log(ui.value);
    socket.emit('slide', {value: ui.value});
}

function initSlider()
{
    $( "div#slider" ).on('slidechange', sliderHandler);
}