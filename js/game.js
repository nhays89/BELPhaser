var game = new Phaser.Game("100%", "100%", Phaser.CANVAS, '', null, true, false); //the main game object

//run different states starting with load.
game.state.add('menu', menuState, false);
game.state.add('play', playState, false);
game.state.add('load', loadState, true);
