var preload = function() {
    this.load.image("bg", "./assets/switchback.jpg", true);
}

var bgPress = function(e) {
    var camX = this.game.camera.x;
    var camY = this.game.camera.y;
    if (e.key === "a") {
        console.log("a");
    } else if (e.key === "s") {
        camY += (bgHeight - (camY + canvasHeight)) % 10;
    } else if (e.key === "d") {
        console.log("d");
    } else if (e.key === "w") {
        camY -= camY % 10;
    }
}
var init = function() {
    this.game.add.image(0, 0, "bg");
    bgWidth = this.game.cache.getImage("bg").width;
    bgHeight = this.game.cache.getImage("bg").height;
    this.game.input.keyboard.onDownCallback = bgPress;
    this.game.world.bounds.width = bgWidth;
    this.game.world.bounds.height = bgHeight;
    this.game.camera.setBoundsToWorld();
}

var create = function() {
    init();
}
var update = function() {
    console.log("new frame");
}

var canvasWidth = this.innerWidth;
var canvasHeight = this.innerHeight;
var bgWidth;
var bgHeight;
var game;
var loader;
window.onload = function() {
    game = new Phaser.Game("100%", "100%", Phaser.CANVAS, '', { preload: preload, create: create, update: update });
}
