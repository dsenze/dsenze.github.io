// gamevar include all game variables for the game
var gamevar = {
    // posYplayer: 401 and posXplayer: 1 = default start value.
    posYplayer: 401,
    posXplayer: 1,
    posYenemy: 1,
    posXenemy: 1
}
var allEnemies = [];
var enemycount = 3;

// Enemies our player must avoid
var Enemy = function(loc) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.loc = loc;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, loc) {
    this.x = loc
    this.y = loc
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    if (gamevar.posXenemy <= 401) {
        gamevar.posXenemy = gamevar.posXenemy + 101
    } else {
        gamevar.posXenemy = 1;
    }


    this.x = gamevar.posXenemy;
    this.y = randomstart(0, 5)
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};





// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    // Set the player's x position on the canvas
    this.x = x;
    // Set the player's y position on the canvas
    this.y = y;
}
Player.prototype.update = function(x, y) {
    this.x = x;
    this.y = y;
}
Player.prototype.render = function() {
    this.x = gamevar.posXplayer;
    this.y = gamevar.posYplayer;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.insideCanvas = function() {
    if (this.x === 401 || this.x === 1) {
        this.x = this.x;
    }
    if (this.y === 401 || this.y === 1) {
        this.y = this.y;
    } else {
        this.y = this.y + 100;
    }




};
Player.prototype.handleInput = function(move) {
    var move = move;

    switch (move) {
        case "down":
            gamevar.posYplayer = Player.insideCanvas()
            break;
        case "right":
            gamevar.posXplayer = Player.insideCanvas()
            break;
        case "up":
            gamevar.posYplayer = Player.insideCanvas()
            break;
        case "left":
            gamevar.posXplayer = Player.insideCanvas()
            break;
    }
    // startposy = startposy + 101;
    //startposx = startposx + 101;
};

// Player.prototype.insidecanvas = function() {
// if (gamevar.posYplayer >= 401) {
// gamevar.posYplayer = gamevar.posYplayer;
// }
// if (gamevar.posYplayer <= 1) {
// gam1evar.posYplayer = gamevar.posYplayer;
// }
// if (gamevar.posXplayer >= 401) {
// gamevar.posXplayer = gamevar.posYplayer;
// }
// if (gamevar.posYplayer >= 1) {
// gamevar.posYplayer = gamevar.posYplayer;
// }
// };


function randomstart(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.floor(Math.random() * (max - min)) + min) * 100 + 1;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Create an array with all enemies and their position


for (var i = 0; i < enemycount; i++) {
    var pos = 3;
    allEnemies.push(new Enemy(pos))
}
// Place the player object in a variable called player
var player = new Player(gamevar.posXplayer, gamevar.posYplayer)


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});