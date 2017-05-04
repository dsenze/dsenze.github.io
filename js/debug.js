// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Global variables
// gamevar is used to store all game variables for the game
var gamevar = {
    // posYplayer: 401 and posXplayer: 1 = default start value.
    player_start_x: 201,
    player_start_y: 1,
    player_position_x: 401,
    player_position_y: 1,
    enemy_position_x: 101,
    enemy_position_y: 1,
    enemy_total: 3,
    canvas_max: 401,
    canvas_min: 1,
    canvas_max_col: 5,
    canvas_min_col: 1,
    x_max = 505,
    x_min = 1,
    y_max = 606,
    y_min = 1,
    speed: -3000,
    moveForward: 100,
    moveBackward: -100

}


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
    console.log(this.checkCanvas(this.x));
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
    console.log(this.x, this.y)
}

var player = new Player(gamevar.player_start_x, gamevar.player_start_y);
player.checkCanvas(10);