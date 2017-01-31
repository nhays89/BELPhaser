
var preload = function() {
	
}

var create = function() {
	/*game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;*/
}

var update = function() {
	//TO DO
}

var width = this.innerWidth;
var height = this.innerHeight;

window.onload = function() {
	var game = new Phaser.Game("100%","100%",Phaser.CANVAS, '', {preload: preload, create: create, update: update});
}

