

/*

Any object that has a Phaser.Physics.P2.Body

*/

function Body(game, x, y, key) {
    Phaser.Sprite.call(this, game, x, y, key);
    this.myGraphicsCanvas = new Phaser.Graphics(game, 0, 0);
}

Body.prototype = Object.create(Phaser.Sprite.prototype); //body inherits from Phaser.Sprite
Body.prototype.constructor = Body;

/**
    Determines if a body is 'selected' by checking if its bounds overlap a given rectangle's bounds.

    @param rect - the selection rectangle to check this body against
*/
Body.prototype.isSelected = function(rect) {
        //p2 anchor in center
        
        var myLeft = this.body.x - this.body.radius;
        var myRight = this.body.x + this.body.radius;
        var myTop = this.body.y - this.body.radius;
        var myBottom = this.body.y + this.body.radius;

        var rectLeft = rect.x;
        var rectRight = rect.x + rect.width;
        var rectTop = rect.y;
        var rectBottom = rect.y + rect.height;

        var myX = this.body.x;
        var myY = this.body.y;

        if(myX >= rectLeft && myX <= rectRight && myY >= rectTop && myY <= rectBottom ||
        rectLeft >= myLeft && rectLeft <= myRight && rectTop >= myTop && rectTop <= myBottom) {
            this.selected = true;
        } else {
            this.selected = false;
        }
        return this.selected;
}
    
/**
    Sets the body ring around the body
*/
Body.prototype.setBodyRing = function() {
    this.setBodyRingColor();
    this.myGraphicsCanvas.lineStyle(1, this.bodyRingColor, 1);
    this.myGraphicsCanvas.drawCircle(this.body.x, this.body.y, this.body.radius * 3);
    game.world.add(this.myGraphicsCanvas);

}

/**
    Sets the color of body ring on the selected unit
*/
Body.prototype.setBodyRingColor = function() {
    var maxHealth = this.fullHealth;
    var percentHealthy = this.health /maxHealth;
    if(percentHealthy === 1) {
        this.bodyRingColor = 0x7fff00;
    } else if(percentHealthy >= .75) {
        this.bodyRingColor = 0xdfff00;
    } else if(percentHealthy >= .5) {
        this.bodyRingColor = 0xffff00;
    } else if(percentHealthy >=.25) {
        this.bodyRingColor = 0xff3333;
    } else {
        this.bodyRingColor = 0x8a0707;
    }
}

/**
    Removes the body ring.
*/

Body.prototype.removeBodyRing = function() {

    this.myGraphicsCanvas.clear();
}


