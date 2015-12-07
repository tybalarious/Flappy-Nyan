/**
 * Created by THATONEGUY on 11/13/15.
 */

// Sprite Variables

var
    nyanSprite,
    backgroundSprite,
    foregroundSprite,
    topCoralSprite,
    bottomCoralSprite,
    textSprites,
    scoreSprite,
    startScreenSprite,
    okButtonSprite,
    smallNumberSprite,
    largeNumberSprite;

/**
 * Sprite class
 * @param {Image} img - sprite sheet image
 * @param {number} x - x-position in sprite sheet
 * @param {number} y - y-position in sprite sheet
 * @param {number} width - width of sprite
 * @param {number} height - height of sprite
 */
function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x * 2;
    this.y = y * 2;
    this.width = width * 2;
    this.height = height * 2;
}

/**
 * Draw sprite to canvas context
 *
 * @param {CanvasRenderingContext2D} renderingContext context used for drawing
 * @param {number} x   x-position on canvas to draw from
 * @param {number} y   y-position on canvas to draw from
 */
Sprite.prototype.draw = function (renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height,
        x, y, this.width, this.height);
};

/**
 * Initate all sprite
 * @param {Image} img spritesheet image
 */
function initSprite(img) {

    nyanSprite = [
        new Sprite(img, 100.5, 284.5, 52, 21),
        new Sprite(img, 165.5, 283.5, 54, 21),
        new Sprite(img, 229.5, 282.5, 53, 22),
        new Sprite(img, 100.5, 315.5, 54, 22),
        new Sprite(img, 166.5, 315.5, 52, 22),
        new Sprite(img, 230.5, 315.5, 53, 22)
    ];

    backgroundSprite = new Sprite(img, 0, 0, 138, 114);
    backgroundSprite.color = "#8080FF"; // save background color
    foregroundSprite = new Sprite(img, 275, 21.5, 329, 17.5);

    topCoralSprite = new Sprite(img, 644, 240.5, 34.5, 157);
    bottomCoralSprite = new Sprite(img, 573, 250.5, 34.5, 157);

    textSprites = {
        floppyFish: new Sprite(img, 59, 114, 96, 22),
        gameOver: new Sprite(img, 59, 136, 94, 19),
        getReady: new Sprite(img, 36, 203, 119, 23.5)
    };

    okButtonSprite = new Sprite(img, 55.5, 205, 79, 19);

    scoreSprite = new Sprite(img, 138, 56, 113, 58);
    startScreenSprite = new Sprite(img, 503, 589.5, 53, 24.5);

}