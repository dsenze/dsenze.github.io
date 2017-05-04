// Global variables
// gamevar is used to store all game variables for the game
var gamevar = {
    // posYplayer: 401 and posXplayer: 1 = default start value.
    player_start_x: 201,
    player_start_y: 460,
    player_position_x: 0,
    player_position_y: 0,
    move_up_down: 100,
    move_left_right: 80,
    enemy_start_pos: -100,
    enemy_total: 10,
    canvas_width_max: 401,
    canvas_width_min: 1,
    canvas_colums: [60, 140, 220, 300, 380],
    speed: [-90, -80, -70],
    collision: 80,
    collisionDetected: false,
    pause: false

}



// Enemies our player must avoid
var Enemy = function() {
    this.x = gamevar.enemy_start_pos;
    this.y = gamevar.canvas_colums[Math.floor(Math.random() * gamevar.canvas_colums.length)];
    this.speed = gamevar.speed[Math.floor(Math.random() * gamevar.speed.length)];
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    if (gamevar.pause !== true) {
        this.x = this.x + dt + this.speed;
        if (this.x > gamevar.canvas_width_max) {
            this.x = gamevar.enemy_start_pos;
            this.y = gamevar.canvas_colums[Math.floor(Math.random() * gamevar.canvas_colums.length)];
            this.speed = gamevar.speed[Math.floor(Math.random() * gamevar.speed.length)];

        } else {
            this.x = this.x + 101
        }

        if (parseInt(this.x) >= (gamevar.player_position_x - gamevar.collision) && parseInt(this.x) <= gamevar.player_position_x) {
            if (this.y === gamevar.player_position_y) {
                gamevar.collisionDetected = true;
                gamevar.pause = true;
            }

        }
    } else {
        //do nothing
    }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if (gamevar.collisionDetected === true) {
        writeText("lose", "red")
        $("#pause").hide()
    }
    if (gamevar.help === true) {
        writehelp()
        this.x = -100;
        this.y = -100;
    }

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);


};


var Player = function(x, y) {
    gamevar.player_position_x = x;
    gamevar.player_position_y = y;
    this.sprite = 'images/char-boy.png';
}
Player.prototype.update = function(x, y) {

    this.x = x;
    this.y = y;


}
Player.prototype.render = function() {
    this.x = gamevar.player_position_x;
    this.y = gamevar.player_position_y;
    if (this.y === gamevar.canvas_width_min) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        writeText("you won!", "green")
        $('#restart').replaceWith('<button id="play_again" onclick="player.reset()">play again</button>')
        gamevar.pause = true;
        $("#pause").hide()
    }
    if (gamevar.help === true) {
        writehelp()
        this.x = -1000;
        this.y = -1000;
    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(move) {
    switch (move) {
        case "down":
            this.checkCanvas("y", (gamevar.player_position_y + gamevar.move_left_right));
            gamevar.player_position_y = this.y;
            break;
        case "right":
            this.checkCanvas("x", (gamevar.player_position_x + gamevar.move_up_down));
            gamevar.player_position_x = this.x;
            break;
        case "up":
            this.checkCanvas("y", (gamevar.player_position_y - gamevar.move_left_right));
            gamevar.player_position_y = this.y;
            break;
        case "left":
            this.checkCanvas("x", (gamevar.player_position_x - gamevar.move_up_down));
            gamevar.player_position_x = this.x;
            break;
    }

};

Player.prototype.checkCanvas = function(op, number) {
    if (gamevar.collisionDetected == !true && gamevar.pause == !true) {
        if (op === "y") {
            if (number >= gamevar.canvas_width_max || number <= gamevar.canvas_width_min) {
                if (number >= gamevar.canvas_width_max) {
                    this.y = gamevar.canvas_width_max;
                }
                if (number <= gamevar.canvas_width_min) {
                    this.y = gamevar.canvas_width_min;
                }
            } else {
                this.y = number;
            }
        }
        if (op === "x") {
            if (number >= gamevar.canvas_width_max || number <= gamevar.canvas_width_min) {
                if (number >= gamevar.canvas_width_max) {
                    this.x = gamevar.canvas_width_max;
                }
                if (number <= gamevar.canvas_width_min) {
                    this.x = gamevar.canvas_width_min;
                }
            } else {
                this.x = number;
            }
        }
    }

}
Player.prototype.reset = function() {
        this.x = gamevar.player_start_x;
        this.y = gamevar.player_start_y;
        gamevar.player_position_x = gamevar.player_start_x;
        gamevar.player_position_y = gamevar.player_start_y;
        gamevar.pause = false;
        gamevar.collisionDetected = false;
        $('#play_again').replaceWith('<button id="restart" onclick="player.reset()">restart</button>')
        $("#pause").show()
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


function writeText(textinput, color) {
    ctx.font = "100px Arial";
    ctx.fillStyle = color;
    ctx.fillText(textinput, 80, 300);
}

function pause(input) {
    gamevar.pause = input;
    if (gamevar.pause === true) {
        $('#pause').replaceWith('<button id="resume" onclick="pause(false)">resume</button>')
    } else {
        $('#resume').replaceWith('<button id="pause" onclick="pause(true)">pause</button>')
    }
}

function help() {
    gamevar.pause = true;
    gamevar.help = true;
}

function writehelp() {
    ctx.beginPath();
    ctx.lineWidth = "6";
    ctx.strokeStyle = "green";
    ctx.font = "80px Arial"
    ctx.fillText("Goal", 180, 80)
    ctx.rect(1, 1, 501, 130);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(1, 500, 501, 100);
    ctx.font = "40px Arial"
    ctx.fillText("Start / Safe zone", 100, 550)

    ctx.fillStyle = "white";
    ctx.fillRect(10, 150, 320, 200);
    ctx.fillStyle = "black";
    ctx.font = "11px Arial"
    ctx.fillText("1. Use keyboard to move player. UP / DOWN / LEFT / RIGHT.", 10, 170)
    ctx.fillText("2. Avoid a collosion with bugs moving from left", 10, 185)
    ctx.fillText("3. move player to water without bug collosion and ", 10, 200)
    ctx.fillText("= YOU WON over the bugs", 10, 215)
    ctx.drawImage(Resources.get('images/char-boy.png'), 401, 451);
    ctx.globalAlpha = 0.5
        //ctx.drawImage(Resources.get('images/char-boy.png'), 301, 201);
    ctx.drawImage(Resources.get('images/char-boy.png'), 301, 1);
    ctx.globalAlpha = 0.2
    ctx.drawImage(Resources.get('images/enemy-bug.png'), 101, 301);
    ctx.globalAlpha = 0.4
    ctx.drawImage(Resources.get('images/enemy-bug.png'), 201, 301);
    ctx.globalAlpha = 1
    ctx.drawImage(Resources.get('images/enemy-bug.png'), 301, 301);
    ctx.globalAlpha = 1
    ctx.beginPath();
    ctx.setLineDash([5, 3]);
    ctx.moveTo(451, 501);
    ctx.lineTo(451, 250);
    ctx.lineTo(350, 250);
    ctx.lineTo(350, 101);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();


}
// 
// Game starts
//
// add total number of enemies on canvas with enemy_total variable
for (var i = 0; i < gamevar.enemy_total; i++) {
    allEnemies.push(new Enemy());
}
// Init a player
var player = new Player(gamevar.player_start_x, gamevar.player_start_y);