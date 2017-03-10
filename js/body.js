

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

// @Alex - pulled his source code
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
        
        //arcade anchor in top left
//     var myLeft = this.body.x;
//     var myRight = this.body.x + 50;
//     var myTop = this.body.y;
//     var myBottom = this.body.y + 50;

//     var rectLeft = rect.x;
//     var rectRight = rect.x + rect.width;
//     var rectTop = rect.y;
//     var rectBottom = rect.y + rect.height;

        //if the selection rectangle covers my anchor x,y || I contain the selection's top left x,y
//         if(myLeft >= rectLeft && myLeft <= rectRight && myTop >= rectTop && myTop <= rectBottom ||
//         rectLeft >= myLeft && rectLeft <= myRight && rectTop >= myTop && rectTop <= myBottom) {
//             this.selected = true;
//         } else {
//             this.selected = false;
//         }
//         return this.selected;
            //revised for p2 anchor in center
        

        

        
}
    

Body.prototype.toggleSelected = function() {
    !(this.selected);
}

Body.prototype.setBodyRing = function() {

    this.myGraphicsCanvas.lineStyle(1, 0x80ff00, 1);
    // var scale = 1.25;
    // var offsetPercent = .5;
    // var widthoffset = this.width * offsetPercent;
    // var heightoffset = this.height * offsetPercent;
    this.myGraphicsCanvas.drawCircle(this.body.x, this.body.y, this.radius * 3);
    game.world.add(this.myGraphicsCanvas);

}


Body.prototype.removeBodyRing = function() {

    this.myGraphicsCanvas.clear();
}


