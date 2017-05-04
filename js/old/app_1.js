// Global variables
// gamevar is used to store all game variables for the game
var gamevar = {
    // posYplayer: 401 and posXplayer: 1 = default start value.
    player_start_x: 201,
    player_start_y: 1,
    player_position_x: 401,
    player_position_y: 1,
    player_walk: 100,
    enemy_position_x: 101,
    enemy_position_y: 1,
    enemy_total: 3,
    canvas_width_max: 401,
    canvas_width_min: 1,
    canvas_max_col: 5,
    canvas_min_col: 1,
    speed: -3000,
    moveForward: 100,
    moveBackward: -100

}

var allEnemies = [];

// Enemies our player must avoid
var Enemy = function(pos) {
    this.y = pos;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + gamevar.speed * dt;
    if (this.x >= gamevar.canvas_max) {
        this.x = this.randomstart();

    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    if (this.x <= 401) {
        this.x = this.x + 101
    } else {
        this.x = 1;
    }

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

Enemy.prototype.walk = function() {
    // Get an random value between canvas coloumns and add multiplicate with 100 + 1
    if (this.x <= 401) {
        gamevar.posXenemy = gamevar.posXenemy + 101
    } else {
        gamevar.posXenemy = 1;
    }

}
Enemy.prototype.randomstart = function() {
    // Get an random value between canvas coloumns and add multiplicate with 100 + 1
    this.y = (Math.floor(Math.random() * (gamevar.canvas_max_col - gamevar.canvas_min_col)) + gamevar.canvas_min_col) * 100 + 1;

}




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
    this.x = gamevar.player_position_x;
    this.y = gamevar.player_position_y;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(move) {

    switch (move) {
        case "down":
            gamevar.player_position_y = gamevar.player_position_y + 100;
            break;
        case "right":
            gamevar.player_position_x = gamevar.player_position_x + 100;
            break;
        case "up":
            gamevar.player_position_y = gamevar.player_position_y - 100;
            break;
        case "left":
            gamevar.player_position_x = gamevar.player_position_x - 100;
            break;
    }

};

Player.prototype.checkCanvas = function(number) {
    if (number > 401) {
        number = 401;
    }
    if (number < 1) {
        number = 1;
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



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


// 
// Game starts
//
// add total number of enemies on canvas with enemy_total variable
for (var i = 0; i < gamevar.enemy_total; i++) {
    allEnemies.push(new Enemy(0));
}
console.log(allEnemies);
// Init a player
var player = new Player(gamevar.player_start_x, gamevar.player_start_y);