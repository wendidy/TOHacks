var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
var typing = false;
var msg = '';

// timer function
var seconds = 0; 
function timer() {
    setInterval(function() {
        seconds += 1;
    }, 1000);
}

document.addEventListener('keydown', function(event) {
    var letter = event.keyCode;
    if (typing) {   
        //console.log('if you see this, its working');
        if(letter == 13) { // send the msg
            socket.emit('msg', msg);
            msg = '';
            typing = false;
            seconds = 0;
            timer();
        } else {
            msg += String.fromCharCode(letter);
        }
    } else {
    
  switch (letter) {
      case 13: // enter key is pressed
        typing = true;
        break;
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
}
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;          
  }
});

/*
socket.on('name', function(data) {
  // data pram is used to send data here
});
*/


socket.emit('new player');
    
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'red';
        
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
    context.strokeText(player.text, player.x - 15, player.y - 20);
      if(seconds > 5) {
        socket.emit('msg', "");
      }
  }
});