
var preload = function() {
	game.load.tilemap('map', './assets/bel-map.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('Castle', 'assets/Castle.png');
  game.load.image('mountain_landscape', 'assets/mountain_landscape.png');
  game.load.image('town', 'assets/town.png');
  game.load.image('trees_plants_rocks', 'assets/trees_plants_rocks.png');
	game.load.image('wood_tileset', 'assets/wood_tileset.png');
	game.load.image('bel-map', 'assets/bel-map.png');
	game.load.atlas('american', './assets/soldiers/american/american.png','./assets/soldiers/american/american.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
}
var init = function() {
	game.physics.startSystem(Phaser.Physics.P2JS);
  map = game.add.tilemap('map');
  map.addTilesetImage('wood_tileset');
  map.addTilesetImage('trees_plants_rocks');
  map.addTilesetImage('town');
  map.addTilesetImage('Castle');
  map.addTilesetImage('mountain_landscape');
  baselayer = map.createLayer('base');  
  rocklayer = map.createLayer('rock');  
  castlelayer = map.createLayer('castle');  
  extralayer = map.createLayer('extra'); 
	baselayer.resizeWorld();
  american = game.add.sprite(50,50, 'american');
  collisionLayer = game.physics.p2.convertCollisionObjects(map,"collision");  
	american.animations.add('american-east', Phaser.Animation.generateFrameNames('american-east',0,13), 13,false,false);
	american.animations.add('american-west', Phaser.Animation.generateFrameNames('american-west',0,13), 13,false,false);
	american.animations.add('american-north', Phaser.Animation.generateFrameNames('american-north', 0, 13), 13, false, false);
	american.animations.add('american-south', Phaser.Animation.generateFrameNames('american-south', 0, 13), 13, false, false);
	american.animations.add('american-stand', Phaser.Animation.generateFrameNames('american-stand', 0, 14), 14, false, false);
	american.animations.add('american-northwest',Phaser.Animation.generateFrameNames('american-northwest', 0, 13), 13, false, false);
	american.animations.add('american-northeast',Phaser.Animation.generateFrameNames('american-northeast', 0, 13), 13, false, false);
	american.animations.add('american-southweset', Phaser.Animation.generateFrameNames('american-southwest', 0, 13), 13, false, false);
	american.animations.add('american-southeast', Phaser.Animation.generateFrameNames('american-southeast', 0, 13), 13, false, false);
	game.physics.p2.enable(american);
	american.body.setCircle(20);
	american.body.damping = .5;
	american.body.fixedRotation=true;
	cursors = game.input.keyboard.createCursorKeys(); 
	game.camera.follow(american); 
}

var create = function() {
    init();
}
var update = function() {
    if (cursors.left.isDown ){   //  Move to the left
         if(cursors.up.isDown) {
         	american.body.moveLeft(100);
         	american.body.moveUp(100);
         	american.animations.play('american-northwest');
         }
           // american.body.velocity.x = -100;
           american.body.moveLeft(100);
         //  american.body.thrust(50);
           american.animations.play('american-west');  
    }
    else if (cursors.right.isDown) {//  Move to the right
           //american.body.thrust(50);
           american.body.moveRight(100);
           // american.body.velocity.x= 100;
            american.animations.play('american-east');
    }
    else if(cursors.up.isDown) { //move up
    american.body.thrust(50);
    	// american.body.velocity.y= 100;
    		american.body.moveUp(100);
         american.animations.play('american-north');
    } else if(cursors.down.isDown) {// move dowm
    	//american.body.velocity.y= -100;
    	//american.body.thrust(50);
    	american.animations.play('american-south');
    	american.body.moveDown(100);
	}
    else {
    	american.animations.play('american-stand');
           
    }
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
