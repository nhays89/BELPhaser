

/*

Any object that has a Phaser.Physics.Arcarde.Body

*/

function Body(game, x, y, key) {
    Phaser.Sprite.call(this, game, x, y, key);
    // game.add.existing(this);
    this.myGraphicsCanvas = new Phaser.Graphics(game, 0, 0);

    this.radius = 15;
}

Body.prototype = Object.create(Phaser.Sprite.prototype);
Body.prototype.constructor = Body;


// @param - the selection rectangle to check against

Body.prototype.isSelected = function(rect) {
        //p2 anchor in center
        
        var myLeft = this.body.x - this.radius;
        var myRight = this.body.x + this.radius;
        var myTop = this.body.y - this.radius;
        var myBottom = this.body.y + this.radius;

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
    

Body.prototype.setBodyRing = function() {
    this.setBodyRingColor();
    this.myGraphicsCanvas.lineStyle(1, this.bodyRingColor, 1);
    this.myGraphicsCanvas.drawCircle(this.body.x, this.body.y, this.radius * 3);
    game.world.add(this.myGraphicsCanvas);

}

//sets color of body ring on the selected unit
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

Body.prototype.removeBodyRing = function() {

    this.myGraphicsCanvas.clear();
}


