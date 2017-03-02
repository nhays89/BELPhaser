

/*

Any object that has a Phaser.Physics.Arcarde.Body

*/

function Body(game, x, y, key) {
    Phaser.Sprite.call(this, game, x, y, key);
    game.add.existing(this);
    this.myGraphicsCanvas = new Phaser.Graphics(game, 0, 0);
}




Body.prototype = Object.create(Phaser.Sprite.prototype);
Body.prototype.constructor = Body;



// @Alex - pulled his source code
// @param - the selection rectangle to check against

Body.prototype.isSelected = function(rect) {

        var myLeft = this.body.x;
        var myRight = this.body.x + this.body.width;
        var myTop = this.body.y;
        var myBottom = this.body.y + this.body.height;

        var rectLeft = rect.x;
        var rectRight = rect.x + rect.width;
        var rectTop = rect.y;
        var rectBottom = rect.y + rect.height;

        var myX = this.body.x;
        var myY = this.body.y;
        var rectX = rect.x;
        var rectY = rect.y;

        //if the selection rectangle covers my anchor x,y || I contain the selection's top left x,y
        if(myX >= rectLeft && myX <= rectRight && myY >= rectTop && myY <= rectBottom ||
        rectX >= myLeft && rectX <= myRight && rectY >= myTop && rectY <= myBottom) {
            this.selected = true;
        } else {
            this.selected = false;
        }
        return this.selected;

}


Body.prototype.toggleSelected = function() {
    !(this.selected);
}

Body.prototype.setBodyRing = function() {

        this.myGraphicsCanvas.lineStyle(1, 0x80ff00, 1);
        var scale = 1.25;
        var offsetPercent = .5;
        var widthoffset = this.body.width * offsetPercent;
        var heightoffset = this.body.height * offsetPercent;
        this.myGraphicsCanvas.drawCircle(this.body.x + widthoffset, this.body.y + heightoffset, this.body.width * scale);
        game.world.add(this.myGraphicsCanvas);

}


Body.prototype.removeBodyRing = function() {

        this.myGraphicsCanvas.clear();
}






Body.prototype.removeBodyRing = function() {
    this.myGraphicsCanvas.clear();
}