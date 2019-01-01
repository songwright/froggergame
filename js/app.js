// Enemies our player must avoid
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
    

        // Update the enemy's position, required method for game
        // Parameter: dt, a time delta between ticks
        this.update = function(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        // Increment x by speed * dt to move enemy forward
        this.x += this.speed * dt;
        }

        // Draw the enemy on the screen, required method for game
        this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

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

        this.update = function() {
        // Collision detection
        for (let enemy of allEnemies) {
            let dx = this.x - enemy.x;
            let dy = this.y - enemy.y;
            let distance = Math.sqrt(dx * dx + dy * dy); // Distance formula
            if (distance < 70) { // Player loses if an enemy is within 70px
                this.x = this.startX;
                this.y = this.startY;
                }
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
                this.y += this.vert;
                break;
            case 'left':
                this.x -= this.horz;
                break;
            case 'right':
                this.x += this.horz;
                break;
            }
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const allEnemies = [];

const enemy1 = new Enemy(-202, 0, 100);
const enemy2 = new Enemy(-152, 83, 200);
const enemy3 = new Enemy(-101, 166, 300);

allEnemies.push(enemy1, enemy2, enemy3);

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

    // Math.abs confines transverse click values to 1-block wide areas
    switch (true) {
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