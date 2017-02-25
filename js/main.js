
var preload = function() {

}
var init = function() {

  //DESTINATION FOR UNITS
  destinationIsSet  = false;
  destination     = {x: null, y: null};

  //UNIT
  game.load.spritesheet('infantry', './assets/infantry.png', 76, 97);
  player = game.add.sprite(300, 300, 'infantry');
  game.physics.arcade.enable(player);

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
  /*
	game.physics.p2.enable(american);
	american.body.setCircle(20);
	american.body.damping = .5;
	american.body.fixedRotation=true;
	cursors = game.input.keyboard.createCursorKeys(); 
	game.camera.follow(american); 
  */

  //FOCUS ON PLAYER
  game.camera.follow(player);
}

var create = function() {
    init();
}

function getMouseClickCoordinates() {

  if (game.input.activePointer.leftButton.isDown) {
    destination.x = game.input.activePointer.x;
    destination.y = game.input.activePointer.y;
    // console.log('X: ' + destination.x, 'Y: ' + destination.y);
    destinationIsSet = true;
  }
}

function controlWithMouse() {

  getMouseClickCoordinates();

  if (destinationIsSet) {
    player.angle = game.physics.arcade.moveToXY(player, destination.x - 38, destination.y - 48.5);
    // console.log("Position:");
    // console.log('x: ' + player.centerX, 'y: ' + player.centerY);
    // console.log("Destination:");
    // console.log('x: ' + destination.x, 'y: ' + destination.y);
    var differenceX = Math.abs(destination.x - player.centerX);
    var differenceY = Math.abs(destination.y - player.centerY);
    // console.log("Difference:");
    // console.log('x: ' + differenceX, 'y: ' + differenceY);
    // console.log("angle: " + player.angle);

    // Swith sprite animations
    if (player.angle >= -0.3 && player.angle <= 0.3) {
      player.animations.play('E');
    }
    else if (player.angle > 0.3 && player.angle <= 1.2) {
      player.animations.play('SE');
    }
    else if (player.angle > 1.2 && player.angle <= 1.9) {
      player.animations.play('S');
    }
    else if (player.angle > 1.9 && player.angle <= 2.7) {
      player.animations.play('SW');
    }
    else if (player.angle > 2.7 && player.angle <= Math.PI) {
      player.animations.play('W');
    }
    else if ( (player.angle >= (Math.PI * -1) ) && player.angle <= -2.8) {
      player.animations.play('W');
    }
    else if (player.angle > -2.8 && player.angle <= -1.9) {
      player.animations.play('NW');
    }
    else if (player.angle > -1.9 && player.angle <= -1.3) {
      player.animations.play('N');
    }
    else if (player.angle > -1.3 && player.angle < -0.3) {
      player.animations.play('NE');
    }

    // Check destination point
    if ( (differenceX <= 2) && (differenceY <= 2) ) {
      destinationIsSet = false;
    }
  }
  else {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    player.animations.play('STAND');
  }

}
var update = function() {

    controlWithMouse();

    /*
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
    */
}

var canvasWidth = this.innerWidth;
var canvasHeight = this.innerHeight;
var bgWidth;
var bgHeight;
var game;
var loader;

