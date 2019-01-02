// @description Enemies our player must avoid
// @constructor
// @param {number} x - x coordinate
// @param {number} y - y coordinate
// @param {number} speed - enemy speed
class Enemy {
    constructor(x, y, speed) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        this.x = x;
        this.y = y + 63; // Offset 63px to center enemy;
        this.speed = speed;
        this.horz = 101; // x axis distance change for movement
        this.vert = 83; // y axis distance change for movement
        this.boundary = this.horz * 5; // Right side boundary
        this.resetX = -this.horz; // Left reset position

        // Update the enemy's position, required method for game
        // Parameter: dt, a time delta between ticks
        this.update = function(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        // Increment x by speed * dt to move enemy forward
        this.x += this.speed * dt;

        // Loop around to the left side and randomize enemy speed.
        // The enemy will start in a random row
        if (this.x > this.boundary) {
            this.x = this.resetX;
            this.y = ((Math.floor(Math.random() * 3)) * this.vert) + 63; // Offset 63px to center enemy
            this.speed = ((Math.floor(Math.random() * 200)) + 100);
            }
        }

        // Draw the enemy on the screen, required method for game
        this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// @description player
// @constructor
class Player {
    constructor() {
        // Player image file
        this.sprite = 'images/char-boy.png';
        this.horz = 101; // x axis distance change for movement
        this.vert = 83; // y axis distance change for movement
        // Beginning position at the middle bottom
        this.startX = this.horz * 2;
        this.startY = (this.vert * 5) - 11; // Offset 11px to center the player
        this.x = this.startX;
        this.y = this.startY;
        this.bottomBoundary = this.vert * 4;
        this.rightBoundary = this.horz * 4;
        this.victory = false;

        this.update = function() {
        // Collision detection
        for (let enemy of allEnemies) {
            let dx = this.x - enemy.x;
            let dy = this.y - enemy.y;
            let distance = Math.sqrt(dx * dx + dy * dy); // Distance formula
            if (distance < 70) { // Player loses if an enemy is within 70px
                this.reset();
                }
            }

        // Win condition
        if (this.y < (this.vert - 11)) { // Account for initial offset by 11px
            this.victory = true;
            }
        }

        // Draw the player on the screen, required method for game
        this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }

        // Update player's x and y properties according to input
        this.handleInput = function(direction) {
        switch (direction) {
            case 'up':
                this.y -= this.vert;
                break;
            case "down":
                if (this.y < this.bottomBoundary) { // Bottom boundary
                this.y += this.vert;
                }
                break;
            case 'left':
                if (this.x > 0) { // Left boundary
                this.x -= this.horz;
                }
                break;
            case 'right':
                if (this.x < this.rightBoundary) { // Right boundary
                this.x += this.horz;
                }
                break;
            }
        }

        // Reset to start position
        this.reset = function () {
        this.x = this.startX;
        this.y = this.startY;
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const allEnemies = [];

const enemy1 = new Enemy(-202, 0, 100);
const enemy2 = new Enemy(-152, 83, ((Math.floor(Math.random() * 200)) + 100));
const enemy3 = new Enemy(-101, 166, 300);
const enemy4 = new Enemy(-101, ((Math.floor(Math.random() * 3)) * 83), 300);

allEnemies.push(enemy1, enemy2, enemy3, enemy4);

const player = new Player();

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

// Click outside the player's box to move the player
document.addEventListener('click', function (event) {
    const rect = document.querySelector('canvas').getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const deltaX = x - player.x - 50; // Offset 50px to center
    const deltaY = y - player.y - 100; // Offset 100px to center
    const horz = 101;
    const vert = 83;
    const clickedOnButton = event.target;

    // Math.abs confines transverse click values to 1-block wide areas
    switch (true) {
        case (clickedOnButton.tagName === 'BUTTON'):
            return; // @resturns This prevents a move error after game reset.
        case (deltaX > horz/2 && Math.abs(deltaY) < vert/2):
            player.handleInput('right');
            break;
        case (deltaX < -horz/2 && Math.abs(deltaY) < vert/2):
            player.handleInput('left');
            break;
        case (Math.abs(deltaX) < horz/2 && deltaY < -vert/2):
            player.handleInput('up');
            break;
        case (Math.abs(deltaX) < horz/2 && deltaY > vert/2):
            player.handleInput('down');
            break;
    }
});