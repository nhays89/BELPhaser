var game = new Phaser.Game("100%", "100%", Phaser.CANVAS, '', null,true,false);



game.state.add('menu', menuState, false);
game.state.add('play', playState, false);
game.state.add('load', loadState, true);


