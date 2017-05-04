/* gamevar object variables are used in game to control properties
 * some of the variables are updated during the game
 */

var gamevar = {
    player_start_x: 201, // players start position
    player_start_y: 401, // players start position
    player_position_x: 201, // players current position
    player_position_y: 401, // players current position
    move_up_down: 80, //used to move player up and down on canvas
    move_left_right: 100, //used to move player left and right on canvas
    enemy_start_pos: -100, //enemy start position, start off screen.
    enemy_total: 5, // total enemies on canvas.
    canvas_width_max: 401, // Used for not moving player outside canvas.
    canvas_width_min: 1, // Used for not moving player outside canvas.
    canvas_colums: [81, 161, 241, 321], // start coloums for enemies.
    speed: [100, 200, 300, 400], // random speed intervall for enemies.
    collisionMetric: 80, // control when impact happends between player and enemy.
    collisionDetected: false, // used to restart game
    pause: false, // used to pause game
    endgame: false, // used to end game.
    points: 0, // total score
    watercount: 0, //total Wins
    failedcount: 0 // total fails
};

var allEnemies = []; // stores all enemies.

// variables are used to pause and start game.
var starttime = Date.now();
var timeleft;
var pausetime;

/* Enemy class includes image, x and y position
 * It verifies player is not outside canvas
 * Updates timeleft of game or end game.
 */
var Enemy = function() {
    this.x = gamevar.enemy_start_pos; //enemy start outside canvas
    this.y = randomizer(gamevar.canvas_colums); // y use a random value from gamevar variable list.
    this.speed = randomizer(gamevar.speed); // speed defines how fast Enemy will move over map.
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position.
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (gamevar.pause !== true && gamevar.endgame !== true) { //only run if game is not paused or ended.
        if (this.x > gamevar.canvas_width_max) { // enemy is outside canvas. reset enemys position.
            this.x = gamevar.enemy_start_pos;
            this.y = randomizer(gamevar.canvas_colums);
            this.speed = randomizer(gamevar.speed);
        } else {
            // enemy is inside canvas. move forward.
            this.x = this.x + (this.speed * dt);
        }
        this.collosiondetection(); // check if enemy taken player.
    }
};

//update enemies position off canvas.
Enemy.prototype.respawn = function() {
    this.x = -100;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// check if enemy has taken the player.
Enemy.prototype.collosiondetection = function() {
    // TODO: IF statement should be updated with an better statement to verify collosion.
    if (parseInt(this.x) >= (gamevar.player_position_x - gamevar.collisionMetric) && parseInt(this.x) <= gamevar.player_position_x) {
        if (this.y === gamevar.player_position_y) {
            gamevar.collisionDetected = true; // sets variable which resets players position to start position.
            gamevar.failedcount = gamevar.failedcount + 1;
        }
    }
};

// player class includes image, x and y position
var Player = function() {
    this.x = gamevar.player_start_x;
    this.y = gamevar.player_start_y;
    this.sprite = 'images/char-boy.png';
};

/* This function is used to update players x and y position
 * It verifies player is not outside canvas
 * Updates timeleft of game or end game.
 */
Player.prototype.update = function() {
    if (gamevar.pause !== true && gamevar.endgame !== true) { //only run if game is not paused or ended.
        if (gamevar.collisionDetected === true) { //if enemy catched player, reset player position to start.
            this.x = gamevar.player_start_x;
            this.y = gamevar.player_start_y;
            gamevar.collisionDetected = false;
        }

        if (this.y >= gamevar.canvas_width_max || this.y <= gamevar.canvas_width_min) { // check if y is inside canvas
            if (this.y >= gamevar.canvas_width_max) {
                this.y = gamevar.canvas_width_max;
            } else {
                this.y = gamevar.canvas_width_min;
            }
        } else {
            this.y = this.y;
        }
        if (this.x >= gamevar.canvas_width_max || this.x <= gamevar.canvas_width_min) { // check if x is inside canvas
            if (this.x >= gamevar.canvas_width_max) {
                this.x = gamevar.canvas_width_max;
            } else {
                this.x = gamevar.canvas_width_min;
            }
        } else {
            this.x = this.x;
        }
        // update global player position.
        gamevar.player_position_x = this.x;
        gamevar.player_position_y = this.y;
        timeleft = timer(starttime); //get time left to play.
        if (timeleft <= 0) {
            gamevar.endgame = true; // end game.
            $('#pause').hide();
            $('body').append(' <p class="infobox">Game over..</p>');
        }
    }
};

/* This function is used to render players position on canvas.
 * Also update scoreboard if player reach goal.
 */
Player.prototype.render = function() {
    if (this.y === 1) { //player reached water. Reset player position
        this.x = gamevar.player_start_x;
        this.y = gamevar.player_start_y;
        gamevar.points = gamevar.points + 10;
        gamevar.watercount = gamevar.watercount + 1;
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};
Player.prototype.handleInput = function(move) {
    if (gamevar.endgame !== true) {
        //update players x,y position
        switch (move) {
            case "down":
                this.y = this.y + gamevar.move_up_down;
                break;
            case "right":
                this.x = this.x + gamevar.move_left_right;
                break;
            case "up":
                this.y = this.y - gamevar.move_up_down;
                break;
            case "left":
                this.x = this.x - gamevar.move_left_right;
                break;
        }
    }
};

/* This function is called by enemy to get random element values
 * Its purpose is to randomize speed and position.
 * input : arrayList
 * return : {element} value
 */
function randomizer(arrayList) {
    // return a random element value
    return arrayList[Math.floor(Math.random() * arrayList.length)];
}

/**
 * @description Get timedifference
 * @param Date.now() object.
 * @returns {number} sum of (currenttime - oldtime) if game is not paused.
 */
function timer(oldtime) {
    if (gamevar.pause !== true) {
        var now = new Date().getTime();
        var distance = now - oldtime;
        return 30 - (Math.floor((distance % (1000 * 60)) / 1000));
    }
}

/* This function is called by pause button onclick.
 * Its purpose is to pause the game.
 * changes gamevar.pause variable to true or false.
 * Player.update() and Enemy.update() will ignore to update positions if gamevar.pause = true;
 */
function pause(input) {
    gamevar.pause = input;
    if (gamevar.pause === true) {
        pausetime = Date.now();
        $('#pause').replaceWith('<button id="resume" onclick="pause(false)">resume</button>');
    } else {
        $('#resume').replaceWith('<button id="pause" onclick="pause(true)">pause</button>');
        var temp = starttime - pausetime;
        starttime = Date.now() + temp;
    }
}

/* This function is called by restart button onclick.
 * Its purpose is to restart game.
 * Reset all variables like points,player,enemy
 */
function restart() {
    // TODO: add delay timer countdown when game restarts.
    gamevar.endgame = false;
    gamevar.pause = false;
    starttime = Date.now();
    $('.infobox').hide()
    $('#pause').show()
    gamevar.points = 0;
    gamevar.failedcount = 0;
    gamevar.watercount = 0;
    gamevar.player_start_x = gamevar.player_start_x;
    gamevar.player_start_y = gamevar.player_start_y;
    allEnemies.forEach(function(enemy) {
        enemy.respawn();
    });
}

/* This listens for key presses and sends the keys to your
 * Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/* START GAME
 *Instantiate enemies and player
 */
for (var i = 0; i < gamevar.enemy_total; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player();