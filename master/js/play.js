WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function () {
        game.time.events.add(Phaser.Timer.SECOND, createText, this);
    },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Roboto']
    }

};


var pos = {
    start: null,
    current: null,
    rect: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
    }
};
var group;
var infantryGroup = [];
var selectedArray = [];
// var canvas;
var box = document.querySelector('#selection-box');
var tint = 0x2ae03b;


var text = null;
var playState = {
    preload: function () {
        // canvas = document.querySelector('#playground canvas');
        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        // disable context menu for mouse right click
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

    },

    create: function () {
        //ethan map
        //var groups = [];

       // var map = game.add.tilemap('mountains');

       // map.addTilesetImage('mountain_landscape', 'mountain_landscape');
       // map.addTilesetImage('wood_tileset', 'wood_tileset');
       // var grassLayer = map.createLayer('grass');
        //var obstacleLayer = map.createLayer('obstacles');
       // grassLayer.resizeWorld();
        //obstacleLayer.resizeWorld();

        // canvas = document.querySelector('#body');



        game.physics.startSystem(Phaser.Physics.P2JS);
        // game.physics.startSystem(Phaser.Physics.ARCADE);



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
        red = game.add.sprite(75,75, 'red');
        green = game.add.sprite(125,125, 'green');
        // infantry = game.add.sprite(50, 70, 'infantry');

        for (var i = 0; i < 4; i++) {
            createBaddie();
        }

        game.input.onDown.add(mouseDragStart, this);
        game.input.addMoveCallback(mouseDragMove, this);
        game.input.onUp.add(mouseDragEnd, this);

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

        red.animations.add('red-stand-north', ['red-stand-north'],1, false, false);
        red.animations.add('red-stand-northwest', ['red-stand-northwest'],1, false, false);
        red.animations.add('red-stand-west', ['red-stand-west'],1, false, false);
        red.animations.add('red-stand-southwest', ['red-stand-southwest'],1, false, false);
        red.animations.add('red-stand-south', ['red-stand-south'],1, false, false);
        red.animations.add('red-stand-southeast', ['red-stand-southeast'],1, false, false);
        red.animations.add('red-stand-east', ['red-stand-east'],1, false, false);
        red.animations.add('red-stand-northeast', ['red-stand-northeast'],1, false, false);

        red.animations.add('red-run-east', Phaser.Animation.generateFrameNames('red-run-east',0,5), 6,false,false);
        red.animations.add('red-run-west', Phaser.Animation.generateFrameNames('red-run-west',0,5), 6,false,false);
        red.animations.add('red-run-north', Phaser.Animation.generateFrameNames('red-run-north', 0, 5), 6, false, false);
        red.animations.add('red-run-south', Phaser.Animation.generateFrameNames('red-run-south', 0, 5), 6, false, false);
        red.animations.add('red-run-northwest',Phaser.Animation.generateFrameNames('red-run-northwest', 0, 5), 6, false, false);
        red.animations.add('red-run-northeast',Phaser.Animation.generateFrameNames('red-run-northeast', 0, 5), 6, false, false);
        red.animations.add('red-run-southweset', Phaser.Animation.generateFrameNames('red-run-southwest', 0, 5), 6, false, false);
        red.animations.add('red-run-southeast', Phaser.Animation.generateFrameNames('red-run-southeast', 0, 5), 6, false, false);

        red.animations.add('red-fire-north', Phaser.Animation.generateFrameNames('red-fire-north', 0,5), 6, false, false);
        red.animations.add('red-fire-south', Phaser.Animation.generateFrameNames('red-fire-south', 0,5), 6, false, false);
        red.animations.add('red-fire-west', Phaser.Animation.generateFrameNames('red-fire-west', 0,5), 6, false, false);
        red.animations.add('red-fire-east', Phaser.Animation.generateFrameNames('red-fire-east', 0,5), 6, false, false);
        red.animations.add('red-fire-northwest', Phaser.Animation.generateFrameNames('red-fire-northwest', 0,5), 6, false, false);
        red.animations.add('red-fire-northeast', Phaser.Animation.generateFrameNames('red-fire-northeast', 0,5), 6, false, false);
        red.animations.add('red-fire-southwest', Phaser.Animation.generateFrameNames('red-fire-southwest', 0,5), 6, false, false);
        red.animations.add('red-fire-southeast', Phaser.Animation.generateFrameNames('red-fire-southeast', 0,5), 6, false, false);

        red.animations.add('red-die-west', Phaser.Animation.generateFrameNames('red-die-west', 0, 14), 14, false, false);
        red.animations.add('red-die-east', Phaser.Animation.generateFrameNames('red-die-east', 0, 14), 14, false, false);

        green.animations.add('green-stand-north', ['green-stand-north'],1, false, false);
        green.animations.add('green-stand-northwest', ['green-stand-northwest'],1, false, false);
        green.animations.add('green-stand-west', ['green-stand-west'],1, false, false);
        green.animations.add('green-stand-southwest', ['green-stand-southwest'],1, false, false);
        green.animations.add('green-stand-south', ['green-stand-south'],1, false, false);
        green.animations.add('green-stand-southeast', ['green-stand-southeast'],1, false, false);
        green.animations.add('green-stand-east', ['green-stand-east'],1, false, false);
        green.animations.add('green-stand-northeast', ['green-stand-northeast'],1, false, false);

        green.animations.add('green-run-east', Phaser.Animation.generateFrameNames('green-run-east',0,5), 6,false,false);
        green.animations.add('green-run-west', Phaser.Animation.generateFrameNames('green-run-west',0,5), 6,false,false);
        green.animations.add('green-run-north', Phaser.Animation.generateFrameNames('green-run-north', 0, 5), 6, false, false);
        green.animations.add('green-run-south', Phaser.Animation.generateFrameNames('green-run-south', 0, 5), 6, false, false);

        green.animations.add('green-run-northwest',Phaser.Animation.generateFrameNames('green-run-northwest', 0, 5), 6, false, false);
        green.animations.add('green-run-northeast',Phaser.Animation.generateFrameNames('green-run-northeast', 0, 5), 6, false, false);
        green.animations.add('green-run-southweset', Phaser.Animation.generateFrameNames('green-run-southwest', 0, 5), 6, false, false);
        green.animations.add('green-run-southeast', Phaser.Animation.generateFrameNames('green-run-southeast', 0, 5), 6, false, false);

        green.animations.add('green-fire-north', Phaser.Animation.generateFrameNames('green-fire-north', 0,5), 6, false, false);
        green.animations.add('green-fire-south', Phaser.Animation.generateFrameNames('green-fire-south', 0,5), 6, false, false);
        green.animations.add('green-fire-west', Phaser.Animation.generateFrameNames('green-fire-west', 0,5), 6, false, false);
        green.animations.add('green-fire-east', Phaser.Animation.generateFrameNames('green-fire-east', 0,5), 6, false, false);
        green.animations.add('green-fire-northwest', Phaser.Animation.generateFrameNames('green-fire-northwest', 0,5), 6, false, false);
        green.animations.add('green-fire-northeast', Phaser.Animation.generateFrameNames('green-fire-northeast', 0,5), 6, false, false);
        green.animations.add('green-fire-southwest', Phaser.Animation.generateFrameNames('green-fire-southwest', 0,5), 6, false, false);
        green.animations.add('green-fire-southeast', Phaser.Animation.generateFrameNames('green-fire-southeast', 0,5), 6, false, false);

        green.animations.add('green-die-west', Phaser.Animation.generateFrameNames('green-die-west', 0, 14), 14, false, false);
        green.animations.add('green-die-east', Phaser.Animation.generateFrameNames('green-die-east', 0, 14), 14, false, false);

        cursors = game.input.keyboard.createCursorKeys();
        currentPlayer = red; //debug purposes
        currentPlayer.name = "red";

        game.physics.p2.enable(american);
        game.physics.p2.enable(red);
        game.physics.p2.enable(green);
        american.body.setCircle(20);
        american.body.damping = .5;
        american.body.fixedRotation=true;
        red.body.setCircle(20);
        red.body.damping = .999;
        red.body.fixedRotation=true;
        green.body.setCircle(20);
        green.body.damping = .999;
        green.body.fixedRotation=true;






        this.setupUI();
    },

    update : function () {

        setDedstinationPoint();
        controlWithMouse();

        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            game.camera.y -= 20;
            if (!game.camera.atLimit.y) {
               // this.minimap_loc.y -= 20 * this.minimapImg.scale.y; //expensive
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            game.camera.y += 20;
            if (!game.camera.atLimit.y) {
               // this.minimap_loc.y += 20 * this.minimapImg.scale.y; //expensive
            }
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            game.camera.x -= 20;
            if (!game.camera.atLimit.x) {
               // this.minimap_loc.x -= 20 * this.minimapImg.scale.x; //expensive
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            game.camera.x += 20;
            if (!game.camera.atLimit.x) {
              //  this.minimap_loc.x += 20 * this.minimapImg.scale.x; //expensive
            }
        }

        if (cursors.left.isDown ){
              if(currentPlayer.name === 'american') {   // debug purposes set currentPlayer to be whatever player in the console at runtime
           american.body.moveLeft(100);
           american.animations.play('american-west');
             } else if(currentPlayer.name === 'red'){
           red.body.moveLeft(100);
           red.animations.play('red-run-west');
             }
         }

    else if (cursors.right.isDown) {//  Move to the right
        if(currentPlayer.name === 'american') {
           american.body.moveRight(100);
            american.animations.play('american-east');
        } else if(currentPlayer.name == "red") {
            red.body.moveRight(100);
            red.animations.play('red-run-east');
        }
    }
    else if(cursors.up.isDown) { //move up
    if(currentPlayer.name === 'american') {
        american.body.moveUp(100);
         american.animations.play('american-north');
    }else if(currentPlayer.name === 'red') {
        red.body.moveUp(100);
        red.animations.play('red-run-north');
    }
    }  else if(cursors.down.isDown) {// move dowm
        if(currentPlayer.name === 'american') {
            american.animations.play('american-south');
    	american.body.moveDown(100);
        } else if(currentPlayer.name === 'red') {
              red.animations.play('red-run-south');
    	red.body.moveDown(100);
        }

	}
    else {
        if(currentPlayer.name === 'american') {
            american.animations.play('american-stand');
        } else if(currentPlayer.name === 'red') {
            red.animations.play('red-stand-north');
        }


    }







    },
    setupUI: function () {
        this.minimap = game.add.sprite(-2, game.canvas.height + 2, 'minimap_frame');
        this.minimap.scale.setTo(2, 2);
        this.minimap.y = this.minimap.y - this.minimap.height;
        this.minimap.fixedToCamera = true;

        this.minimapImg = game.add.sprite(this.minimap.x + 35, this.minimap.y + 35, 'minimap_image');
        this.minimapImg.fixedToCamera = true;
        this.minimapImg.scale.setTo(0.035, 0.0275);

        this.info_panel = game.add.sprite(game.canvas.width / 2, 0, 'info_panel');
        this.info_panel.scale.setTo(2, 2);
        this.info_panel.x = this.info_panel.x - this.info_panel.width / 2;
        this.info_panel.fixedToCamera = true;

        //this.timeLabel = game.add.text(15, 20, '5:00 AM', { font: '12px Arial Black', fill: '#000000' });

        this.timeLabel = game.add.text(15, 20, "10:00 AM", { font: '12px Arial', fill: '#000000' });
        // this.timeLabel.anchor.setTo(0.5);
        //
        // this.timeLabel.font = 'Roboto';
        // this.timeLabel.fontSize = 9;
        //
        // //this.timeLabel.align = 'center';
        // this.timeLabel.stroke = '#000000';
        // this.timeLabel.strokeThickness = 1;

        this.info_panel.addChild(this.timeLabel);

        this.action_menu = game.add.sprite(game.canvas.width, game.canvas.height, 'action_menu');
        this.action_menu.scale.setTo(2, 2);
        this.action_menu.x = this.action_menu.x - this.action_menu.width;
        this.action_menu.y = this.action_menu.y - this.action_menu.height;
        this.action_menu.fixedToCamera = true;

        this.minimap_loc_sprite = game.add.sprite(this.minimapImg.x, this.minimapImg.y);
        this.minimap_loc = game.add.graphics(0, 0);

        this.minimap_loc_sprite.addChild(this.minimap_loc);
        this.minimap_loc_sprite.fixedToCamera = true;

        this.minimap_loc.lineStyle(2, 0xFFFFFF, 1);
        this.minimap_loc.drawRect(0, 0,
            game.camera.width * this.minimapImg.scale.x,
            game.camera.height * this.minimapImg.scale.y);

        //this.cursors = game.input.keyboard.createCursorKeys();

        var pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        pKey.onDown.add(this.pauseGame, this);
    },

    pauseGame: function () {

        if (game.paused) {
            this.pause_menu.destroy();
            game.paused = false;
        }
        else {
            game.paused = true;
            this.pause_menu = game.add.sprite(game.camera.x + (game.camera.width / 2), game.camera.y + (game.camera.height / 2), 'pause_menu');
            this.pause_menu.anchor.setTo(0.5, 0.5);
        }
    }
};

function createText(x, y, parent) {

    text = game.add.text(game.world.centerX, game.world.centerY, "10:00 AM");
    text.anchor.setTo(0.5);

    text.font = 'Roboto';
    text.fontSize = 20;

    text.align = 'center';
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
}


// alex helper functions
var createBaddie = function createBaddie() {
    // var player = group.create(100 + Math.random() * 500, 50 + Math.random() * 500, 'infantry');
    // var player = group.create(50, 70, 'infantry');
    var player = game.add.sprite(100 + Math.random() * 500, 50 + Math.random() * 500, 'infantry');

    player.newDestination = {x: null, y: null};
    player.oldDestination = {x: null, y: null};
    player.destinationIsSet = false;
    player.selected = false;
    player.current = false;

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    player.body.width  = 35;
    player.body.height = 45;

    player.body.offset.x = 20;
    player.body.offset.y = 10;

    player.animations.add('E',  [38, 39, 40, 41, 42, 43], 10, true);
	player.animations.add('W',  [25, 24, 23, 22, 21, 20], 10, true);
	player.animations.add('N',  [8, 9, 10, 11, 12, 13],   10, true);
	player.animations.add('S',  [32, 33, 34, 35, 36, 37], 10, true);
	player.animations.add('NE', [50, 51, 52, 53, 54, 55], 10, true);
	player.animations.add('NW', [19, 18, 17, 16, 15, 14], 10, true);
	player.animations.add('SW', [26, 27, 28, 29, 30, 31], 10, true);
	player.animations.add('SE', [38, 39, 40, 41, 42, 43], 10, true);
	player.animations.add('STAND', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85], 10, true);

    infantryGroup.push(player);

    return player;
}

var mouseDragStart = function mouseDragStart() {
    box.style.height = 0;
    box.style.width = 0;
    box.style.left = 0;
    box.style.top = 0;

    if (!pos.isActive) {
        pos.start = {
            x: game.input.mousePointer.position.x,
            y: game.input.mousePointer.position.y
        }
        box.classList.add('active');
        box.style.top = 8 + pos.start.y;
        box.style.left = 8 + pos.start.x;
        pos.isActive = true;
    }
    // get mouse position
};

var mouseDragMove = function mouseDragMove(sprite, pointer, dragX, dragY, snapPoint) {
    if (pos.isActive) {
        pos.current = {
            x: game.input.mousePointer.position.x,
            y: game.input.mousePointer.position.y
        }
        if (pos.current.x > pos.start.x) {
            box.style.width = pos.current.x - pos.start.x;
        } else {
            box.style.left = 8 + pos.current.x;
            box.style.width = pos.start.x - pos.current.x;
        }

        if (pos.current.y > pos.start.y) {
            box.style.height = pos.current.y - pos.start.y;
        } else {
            box.style.top = 8 + pos.current.y;
            box.style.height = pos.start.y - pos.current.y;
        }


    }
};

var mouseDragEnd = function mouseDragEnd() {
    if (pos.isActive && pos.start && pos.current) {
        pos.isActive = false;
        if (pos.start.x > pos.current.x) {
            pos.rect.left = pos.current.x;
            pos.rect.right = pos.start.x;
        } else {
            pos.rect.left = pos.start.x;
            pos.rect.right = pos.current.x;
        }
        if (pos.start.y > pos.current.y) {
            pos.rect.bottom = pos.start.y;
            pos.rect.top = pos.current.y;
        } else {
            pos.rect.bottom = pos.current.y;
            pos.rect.top = pos.start.y;
        }

        // uncomment to hide rect box
        // box.classList.remove('active');
        checkSprites();
    }
};

var checkSprites = function checkSprites() {
    // console.clear();
    selectedArray.length = 0;

    infantryGroup.forEach(function (item, index) {
        var bottom = (item.y + item.body.height + 10);
        var left = item.x + 20;
        var right = (item.x + item.body.width + 20);
        var top = item.y + 10;
        item.tint = 0xffffff;

        // console.log(x, y);

        if (left >= pos.rect.left && right <= pos.rect.right &&
            top >= pos.rect.top && bottom <= pos.rect.bottom) {
                // console.log('unit selected');
                // console.log({
                //     bottom: bottom,
                //     left: left,
                //     right: right,
                //     top: top
                // }, pos.rect);
                item.tint = tint;
                selectedArray.push(item);
                // item.current = true;
                // console.log('Selected Units: ' + selectedArray.length);
            }
    }, this);
};

function setDedstinationPoint() {
    var x, y;
    var oldDestination = false;

    if (game.input.activePointer.rightButton.isDown) {
        x = game.input.activePointer.x;
		y = game.input.activePointer.y;
    }
    else {
        oldDestination = true;
    }

    for (var i = 0; i < selectedArray.length; i++) {
        var player = selectedArray[i];
        player.destinationIsSet = true;

        if (!oldDestination) {
            player.newDestination.x = x;
            player.newDestination.y = y;
            player.oldDestination.x = x;
            player.oldDestination.y = y;
        }
        else {
            player.newDestination.x = player.oldDestination.x;
            player.newDestination.y = player.oldDestination.y;
        }
    }
    // console.log('Selected Units: ' + selectedArray.length);
}

function controlWithMouse() {

    for (var i = 0; i < infantryGroup.length; i++) {
        var player = infantryGroup[i];
        // var player = group.children[i];

        // game.physics.arcade.collide(player, group);

        if (player.destinationIsSet && player.newDestination.x != null && player.newDestination.y != null) {
            var differenceX = Math.abs(player.newDestination.x - player.centerX);
    		var differenceY = Math.abs(player.newDestination.y - player.centerY);

            player.angle = game.physics.arcade.moveToXY(player, player.newDestination.x - 38, player.newDestination.y - 48.5);

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
                player.oldDestination.x = null;
                player.oldDestination.y = null;
                player.destinationIsSet = false;
    		}
        }
        else {
    		player.body.velocity.x = 0;
    		player.body.velocity.y = 0;
    		player.animations.play('STAND');
    	}
    }
}
