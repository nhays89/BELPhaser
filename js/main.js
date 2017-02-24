

var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

var map;

var leftKey;

function preload() {
	game.load.image('map', './assets/dorian-map.png');
	game.load.spritesheet('infantry', './assets/infantry.png', 76, 97);
}

function create() {
	// game.add.sprite(0, 0, 'map');
	map = game.add.tileSprite(0, 0, 1524, 844, 'map');

	player = game.add.sprite(300, 300, 'infantry');

	destinationIsSet 	= false;
	destination 		= {x: null, y: null};


	// graphics = game.add.graphics(0, 0);



	// keyboard
	leftKey = game.input.keyboard.addKey(Phaser.KeyCode.D);


	game.physics.arcade.enable(player);

	player.animations.add('E',  [38, 39, 40, 41, 42, 43], 10, true);
	player.animations.add('W',  [25, 24, 23, 22, 21, 20], 10, true);
	player.animations.add('N',  [8, 9, 10, 11, 12, 13],   10, true);
	player.animations.add('S',  [32, 33, 34, 35, 36, 37], 10, true);
	player.animations.add('NE', [50, 51, 52, 53, 54, 55], 10, true);
	player.animations.add('NW', [19, 18, 17, 16, 15, 14], 10, true);
	player.animations.add('SW', [26, 27, 28, 29, 30, 31], 10, true);
	player.animations.add('SE', [38, 39, 40, 41, 42, 43], 10, true);
	player.animations.add('STAND', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85], 10, true);

	// console.log("Initial XY position:");
	// console.log('X: ' + player.centerX, ' Y: ' + player.centerY);

}

function update() {

	// controlWithArrowKeys();
	controlWithMouse();
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

function controlWithArrowKeys() {

	cursors = game.input.keyboard.createCursorKeys();

	player.body.velocity.x = 0;
	player.body.velocity.y = 0;


	if (cursors.up.isDown && cursors.right.isDown) {
		player.body.velocity.x = 80;
		player.body.velocity.y = -80;
		player.animations.play('NE');
	}
	else if (cursors.down.isDown && cursors.left.isDown) {
		player.body.velocity.x = -80;
		player.body.velocity.y = 80;
		player.animations.play('SW');
	}
	else if (cursors.left.isDown && cursors.up.isDown) {
		player.body.velocity.x = -80;
		player.body.velocity.y = -80;
		player.animations.play('NW');
	}
	else if (cursors.right.isDown && cursors.down.isDown) {
		player.body.velocity.x = 80;
		player.body.velocity.y = 80;
		player.animations.play('SE');
	}
	else if (cursors.right.isDown) {
		player.body.velocity.x = 100;
		player.animations.play('E');
	}
	else if (cursors.left.isDown) {
		player.body.velocity.x = -100;
		player.animations.play('W');
	}
	else if (cursors.up.isDown) {
		player.body.velocity.y = -100;
		player.animations.play('N');
	}
	else if (cursors.down.isDown) {
		player.body.velocity.y = 100;
		player.animations.play('S');
	}
	else {
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		player.animations.play('STAND');
	}

	// if (leftKey.isDown) {
	// 	map.tilePosition.x -= 2;
	// }
}
