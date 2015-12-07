// NEW: 1. WindowSetup function and call from main. ADD TO THE GLOBAL VARS AND ADD GAME STATE
// 2. Width and height are now pulling from the global var (in canvasSetup).
// 3. Load Graphics is updated and is now putting info into our fishsprite.js
// 4. Add gameLoop function, update function, and render function.
// 5. Add the massive Fish object function.
// 6. Add the onpress function because it is being referenced.
// Pretty much this is the original code minus the coral being added.

// keep in mind that I have all calls and references to corals commented out for the time being. For now this should just animate the fish and begin the in game state so that you can make the fish jump.
// Also note that the fish is being drawn in the update function that refreshes constantly. that is how we are scrolling the animation.

// Global state
var
    canvas,
    renderingContext,
    width,
    height,
    okButton,

    foregroundPosition = 0,
    frames = 0, // Counts the number of frames rendered.
    score = 0,
    highscore,

// The playable cat character
    cat,
    corals,
//score
    //gameScore,

// State vars
    currentState,

// Our game has three states: the splash screen, gameplay, and the score display.
    states = {
        Splash: 0,
        Game: 1,
        Score: 2
    };

/**
 * Fish class. Creates instances of Cat.
 * @constructor
 */
function Cat() {
    this.x = 110;
    this.y = 0;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0, 1, 2, 1]; // The animation sequence

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 4.6;

    /**
     * Makes the Cat jump
     */
    this.jump = function () {
        this.velocity = -this._jump;
    };

    /**
     * Update sprite animation and position of cat
     */
    this.update = function () {
        // Play animation twice as fast during game state
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
            this.updateIdleCat();
        } else { // Game state
            this.updatePlayingCat();
            if (this.y <= 0) {
                currentState = states.Score;
            }
        }
    };

    /**
     * Runs the cat through its idle animation.
     */
    this.updateIdleCat = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    /**
     * Determines cat animation for the player-controlled cat.
     */
    this.updatePlayingCat = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Change to the score state when fish touches the ground
        if (this.y >= height - foregroundSprite.height - 10) {
            this.y = height - foregroundSprite.height - 10;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump; // Set velocity to jump speed for correct rotation
        }

        // When cat lacks upward momentum increment the rotation angle
        if (this.velocity >= this._jump) {
            this.frame = 1;
            this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
        } else {
            this.rotation = -0.3;
        }
    };

    /**
     * Draws Cat to canvas renderingContext
     * @param  {CanvasRenderingContext2D} renderingContext the context used for drawing
     */
    this.draw = function (renderingContext) {
        renderingContext.save();

        // translate and rotate renderingContext coordinate system
        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

        // draws the cat with center in origo
        nyanSprite[n].draw(renderingContext, -nyanSprite[n].width / 2, -nyanSprite[n].height / 2);

        renderingContext.restore();
    };
}

/**
 * Called on mouse or touch press. Update and change state depending on current game state.
 * @param  {MouseEvent/TouchEvent} evt - the onpress event
 */
function onpress(evt) {
    switch (currentState) {

        case states.Splash: // Start the game and update the fish velocity.
            currentState = states.Game;
            cat.jump();
            break;

        case states.Game: // The game is in progress. Update fish velocity.
            cat.jump();
            break;

        case states.Score: // Change from score to splash state if event within okButton bounding box
            // Get event position
            var mouseX = evt.offsetX, mouseY = evt.offsetY;

            if (mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }

            // Check if within the okButton
            if (okButton.x < mouseX && mouseX < okButton.x + okButton.width &&
                okButton.y < mouseY && mouseY < okButton.y + okButton.height
            ) {
                corals.reset();
                currentState = states.Splash;
                score = 0;
            }
            break;
    }
}

/**
 * Sets the canvas dimensions based on the window dimensions and registers the event handler.
 */
function windowSetup() {
    // Retrieve the width and height of the window
    width = window.innerWidth;
    height = window.innerHeight;

    // Set the width and height if we are on a display with a width > 500px (e.g., a desktop or tablet environment).
    var inputEvent = "touchstart";
    if (width >= 500) {
        width = 380;
        height = 430;
        inputEvent = "mousedown";
    }

    // Create a listener on the input event.
    document.addEventListener(inputEvent, onpress);
}

/**
 * Creates the canvas.
 */
function canvasSetup() {
    canvas = document.createElement("canvas");
    canvas.style.border = "15px solid #382b1d";

    canvas.width = width;
    canvas.height = height;

    renderingContext = canvas.getContext("2d");
}

function loadGraphics() {
    // Initiate graphics and ok button
    var img = new Image();
    img.src = "../Images/spritesheet.png";
    img.onload = function () {
        initSprite(this);
        renderingContext.fillStyle = backgroundSprite.color;

        okButton = {
            x: (width - okButtonSprite.width) / 2,
            y: height - 200,
            width: okButtonSprite.width,
            height: okButtonSprite.height
        };

        gameLoop();
    };
}

/**
 * Initiates the game.
 */
function main() {
    windowSetup();
    canvasSetup();

    currentState = states.Splash; // Game begins at the splash screen.

    document.body.appendChild(canvas); // Append the canvas we've created to the body element in our HTML document.

    cat = new Cat();
    corals = new CoralCollection();

    loadGraphics();
}

/**
 * The game loop. Update and render all sprites before the window repaints.
 */
function gameLoop() {
    update();
    render();
    window.requestAnimationFrame(gameLoop);
    //console.log('swim');
}

/**
 * Updates all moving sprites: foreground, fish, and corals
 */
function update() {
    frames++;

    if (currentState !== states.Score) {
        foregroundPosition = (foregroundPosition - 60) % 658; // Move left two px each frame. Wrap every 14px.
    }

    if (currentState === states.Game) {
        corals.update();
    }

    cat.update();
}

/**
 * Re-draw the game view.
 */
function render() {
    // Draw background color
    renderingContext.fillRect(0, 0, width, height);

    // Draw background sprites
    backgroundSprite.draw(renderingContext, 0, height - backgroundSprite.height);
    backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);

    corals.draw(renderingContext);

    // Draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);

    cat.draw(renderingContext);

    if (currentState === states.Game) {
        drawScoreBox();
        drawScore();
    }
    if (currentState === states.Score) {
        drawScoreBox();
        drawScore();
        drawFinishBox();
        drawFinishBoxText()
        okButtonSprite.draw(renderingContext, (width - okButtonSprite.width) / 2, 210);
    }
    if (currentState === states.Splash) {
        startScreenSprite.draw(renderingContext, (width - startScreenSprite.width) / 2, 200);
    }

}

function drawScore() {
 renderingContext.save();

 renderingContext.fillStyle = "white";
 renderingContext.font = "20px Verdana";
 renderingContext.fillText("Score: " + score, 10, 40);
 renderingContext.fillStyle = backgroundSprite.color;

 renderingContext.restore();
 }

function drawScoreBox() {
    renderingContext.fillStyle="rgba(0, 0, 0, 0.55)";
    renderingContext.fillRect(8,18,150,30);
    renderingContext.fillStyle = backgroundSprite.color;
    renderingContext.restore();
}

function drawFinishBox() {
    renderingContext.fillStyle="rgba(0, 0, 0, 0.55)";
    renderingContext.fillRect(102,130,175,125);
    renderingContext.fillStyle = backgroundSprite.color;
    renderingContext.restore();
}

function drawFinishBoxText() {
    renderingContext.fillStyle="white";
    renderingContext.font = "15 px Verdana";
    renderingContext.fillText("Shoot! Looks like Nyan Cat", 125, 165);
    renderingContext.fillText("is going to have quite a headache.", 115, 180);
    renderingContext.fillStyle = backgroundSprite.color;
    renderingContext.restore();
}

function CoralCollection() {
    this._corals = [];

    /**
     * Empty corals array
     */
    this.reset = function () {
        this._corals = [];
    };

    /**
     * Creates and adds a new Coral to the game.
     */
    this.add = function () {
        this._corals.push(new Coral()); // Create and push coral to array
    };

    /**
     * Update the position of existing corals and add new corals when necessary.
     */
    this.update = function () {
        if (frames % 150 === 0) { // Add a new coral to the game every 100 frames.
            this.add();
        }

        for (var i = 0, len = this._corals.length; i < len; i++) { // Iterate through the array of corals and update each.
            var coral = this._corals[i]; // The current coral.

            if (i === 0) { // If this is the leftmost coral, it is the only coral that the fish can collide with . . .
                coral.detectCollision(); // . . . so, determine if the fish has collided with this leftmost coral.
                if (coral.x === 50) {
                    keepscore();
                }
            }
            function keepscore() {
                score++;
            }

            coral.x -= 2; // Each frame, move each coral two pixels to the left. Higher/lower values change the movement speed.
            if (coral.x < -coral.width) { // If the coral has moved off screen . . .
                this._corals.splice(i, 1); // . . . remove it.
                i--;
                len--;
            }
        }
    };

    /**
     * Draw all corals to canvas context.
     */
    this.draw = function () {
        for (var i = 0, len = this._corals.length; i < len; i++) {
            var coral = this._corals[i];
            coral.draw();
        }
    };
}

/**
 * The Coral class. Creates instances of Coral.
 */
function Coral() {
    this.x = 500;
    this.y = height - (bottomCoralSprite.height + foregroundSprite.height + 120 + 200 * Math.random());
    this.width = bottomCoralSprite.width;
    this.height = bottomCoralSprite.height;

    /**
     * Determines if the cat has collided with the Coral.
     * Calculates x/y difference and use normal vector length calculation to determine
     */
    this.detectCollision = function () {
// intersection
        var cx = Math.min(Math.max(cat.x, (this.x - 40)), (this.x - 40) + this.width);
        var cy1 = Math.min(Math.max(cat.y, this.y), this.y + this.height);
        var cy2 = Math.min(Math.max(cat.y, this.y + this.height + 120), this.y + 2 * this.height + 120);
// Closest difference
        var dx = cat.x - cx;
        var dy1 = cat.y - cy1;
        var dy2 = cat.y - cy2;
// Vector length
        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = cat.radius * cat.radius;
// Determine intersection
        if (r > d1 || r > d2) {
            currentState = states.Score;
        }
    };

    this.draw = function () {
        bottomCoralSprite.draw(renderingContext, this.x, this.y);
        topCoralSprite.draw(renderingContext, this.x, this.y + 120 + this.height);
    };
}