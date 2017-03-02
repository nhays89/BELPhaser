WebFontConfig = {
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
var infantry = [];
var selectedArray = [];
var box = document.querySelector('#selection-box');
var tint = 0x2ae03b;


var text = null;
var playState = {
    preload: function () {
        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        game.load.spritesheet('infantry', './assets/soldiers/infantry.png', 76, 97);
    },

    create: function () {
        var groups = [];
        this.map = game.add.tilemap('map');

        this.map.addTilesetImage('wood_tileset');
        this.map.addTilesetImage('trees_plants_rocks');
        this.map.addTilesetImage('town');
        this.map.addTilesetImage('Castle');
        this.map.addTilesetImage('mountain_landscape');

        this.baselayer = this.map.createLayer('base');
        this.rocklayer = this.map.createLayer('rock');
        this.castlelayer = this.map.createLayer('castle');
        this.extralayer = this.map.createLayer('extra');

        this.baselayer.resizeWorld();
        this.collisionLayer = game.physics.p2.convertCollisionObjects(this.map, "collision");

        // unit selection
        game.input.mousePointer.leftButton.onDown.add(this.mouseDragStart, this);
        game.input.addMoveCallback(this.mouseDragMove, this);
        game.input.mousePointer.leftButton.onUp.add(this.mouseDragEnd, this);
        game.input.mousePointer.rightButton.onDown.add(this.mouseRightClick, this);

        this.setupUnits();
        this.setupUI();
        this.cursors = game.input.keyboard.createCursorKeys();

        for (var i = 0; i < 8; i++) {
            this.createBaddie();
        }

    },

    update : function () {
        this.mouseRightClick();
        this.controlWithMouse();
        // Used to check if the camera's coordinates were changed.
        // The camera's coordinates won't change if they have reached the bounds of the world.
        var tempCamera;

        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            tempCamera = game.camera.y;
            game.camera.y -= 20;
            if (tempCamera != game.camera.y) {
                this.minimap_loc.y -= 20 * this.minimapImg.scale.y;
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            tempCamera = game.camera.y;
            game.camera.y += 20;
            if (tempCamera != game.camera.y) {
                this.minimap_loc.y += 20 * this.minimapImg.scale.y;
            }
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            tempCamera = game.camera.x;
            game.camera.x -= 20;
            if (tempCamera != game.camera.x) {
                this.minimap_loc.x -= 20 * this.minimapImg.scale.x;
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            tempCamera = game.camera.x;
            game.camera.x += 20;
            if (tempCamera != game.camera.x) {
                this.minimap_loc.x += 20 * this.minimapImg.scale.x;
            }
        }

        this.soldierGroups.forEach(function(group) {
            group.forEach(function (soldier) {
                soldier.update();

                if (soldier.alive) {
                    soldier.getNearbyEnemies();
                }
            })
        });

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            // this.soviet.sprite.animations.play('soviet-die-west');
            // var found = this.getNearbyEnemies(this.soviet);
            // console.log('Num enemies: ' + this.getNearbyEnemies(this.soviet));
        }

        if (this.soviet && this.soviet.alive) {
            if (this.cursors.left.isDown) {
                if (this.currentPlayer.name === 'american') {   // debug purposes set currentPlayer to be whatever player in the console at runtime
                    this.american.sprite.body.moveLeft(100);
                    this.american.sprite.animations.play('american-west');
                } else if (this.currentPlayer.name === 'soviet') {
                    this.soviet.sprite.body.moveLeft(100);
                    this.soviet.sprite.animations.play('soviet-run-west');
                    this.soviet.direction = 'west';
                }
            } else if (this.cursors.right.isDown) { // Move to the right
                if (this.currentPlayer.name === 'american') {
                    this.american.sprite.body.moveRight(100);
                    this.american.sprite.animations.play('american-east');
                } else if (this.currentPlayer.name == "soviet") {
                    this.soviet.sprite.body.moveRight(100);
                    this.soviet.sprite.animations.play('soviet-run-east');
                    this.soviet.direction = 'east';
                }
            } else if (this.cursors.up.isDown) { //move up
                if (this.currentPlayer.name === 'american') {
                    this.american.sprite.body.moveUp(100);
                    this.american.sprite.animations.play('american-north');
                } else if (this.currentPlayer.name === 'soviet') {
                    this.soviet.sprite.body.moveUp(100);
                    this.soviet.sprite.animations.play('soviet-run-north');
                    this.soviet.direction = 'north';
                }
            } else if (this.cursors.down.isDown) { // move dowm
                if (this.currentPlayer.name === 'american') {
                    this.american.sprite.animations.play('american-south');
                    this.american.sprite.body.moveDown(100);
                } else if (this.currentPlayer.name === 'soviet') {
                    this.soviet.sprite.animations.play('soviet-run-south');
                    this.soviet.sprite.body.moveDown(100);
                    this.soviet.direction = 'south';
                }
            } else {
                if (this.currentPlayer.name === 'american') {
                    this.american.sprite.animations.play('american-stand');
                } else if (this.currentPlayer.name === 'soviet') {
                    this.soviet.sprite.animations.play('soviet-stand-north');
                    this.soviet.direction = 'north';
                }
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
        // 166 and 132 are the number of pixels (width / height) of the minimap frame
        // multiplied by the scale of the minimap frame
        this.minimapImg.scale.setTo(168 * this.minimap.scale.x / this.minimapImg.width,
            132 * this.minimap.scale.y / this.minimapImg.height);

        this.info_panel = game.add.sprite(game.canvas.width / 2, 0, 'info_panel');
        this.info_panel.scale.setTo(2, 2);
        this.info_panel.x = this.info_panel.x - this.info_panel.width / 2;
        this.info_panel.fixedToCamera = true;

        this.timeLabel = game.add.text(this.info_panel.x + 20, this.info_panel.y + 30, 'TIME');
        this.timeLabel.font = 'Roboto';
        this.timeLabel.fontSize = 18;

        this.timeLabel.stroke = '#000000';
        this.timeLabel.strokeThickness = 1;
        this.timeLabel.fixedToCamera = true;

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

        var pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        pKey.onDown.add(this.pauseGame, this);

        // var miniMapGroup = game.add.group();
        // miniMapGroup.add(this.minimap);
        // miniMapGroup.add(this.minimapImg);
        // miniMapGroup.add(this.minimap_loc);
        // miniMapGroup.add(this.minimap_loc_sprite);
    },
    render : function () {

        // unit selection
        // game.input.mousePointer.leftButton.onDown.add(this.mouseDragStart, this);
        // game.input.addMoveCallback(this.mouseDragMove, this);
        // game.input.mousePointer.leftButton.onUp.add(this.mouseDragEnd, this);
        // game.input.mousePointer.rightButton.onDown.add(this.mouseRightClick, this);


        // this.soviet.sprite.body.debug = true;
        // game.debug.spriteInfo(this.soviet.sprite, 32, 32);
        // game.debug.quadTree(this.quadTree);
        // game.debug.geom(this.viewCircle, '#00bff3', false);

        // debug infantry
        // infantry.forEach(function(player) {
        //     game.debug.body(player);
        //     // game.debug.text('anchor', player.x, player.y, 'red', 10);
        //     // game.debug.pixel(player.x + 20, player.y + 10, 'red', 4);
        //     // game.debug.pointer(game.input.activePointer);
        //     if (player.current) {
        //         // game.debug.spriteInfo(player);  // Sprite debug info
        //     }
        // });
    },

    setupUnits: function () {
        this.soldierGroups = [];
        this.alliesGroup = [];
        this.soldierGroups.push(this.alliesGroup);

        this.sovietsGroup = [];
        this.soldierGroups.push(this.sovietsGroup);

        this.quadTree = new Phaser.QuadTree(0, 0, game.width, game.height, 5, 4, 0);

        this.soviet = new Soviet(275, 275);
        this.sovietsGroup.push(this.soviet);

        for (var i = 0; i < 20; i++) {

            var x = game.world.randomX;
            var y = game.world.randomY;

            this.american = new American(x, y);
            this.alliesGroup.push(this.american);
            this.quadTree.insert(this.american);
        }

        this.american = new American(150, 150);
        this.alliesGroup.push(this.american);
        this.quadTree.insert(this.american);

        this.quadTree.insert(this.soviet);


        // sprite that's used with quadtree to find a circle around the target sprite
        // this.viewSprite = game.add.sprite(0, 0);
        this.viewSprite = new Phaser.Rectangle(0, 0, 10, 10);
        // for debugging view distance
        this.viewCircle = new Phaser.Circle(0, 0, 200);

        this.currentPlayer = this.soviet.sprite; //debug purposes
        this.currentPlayer.name = "soviet";
    },
    pauseGame : function () {
        if (game.paused) {
            this.pause_menu.destroy();
            game.paused = false;
        } else {
            game.paused = true;

            this.pause_menu = game.add.sprite(game.camera.x + (game.camera.width / 2),
                game.camera.y + (game.camera.height / 2), 'pause_menu');
            this.pause_menu.inputEnabled = true;
            this.pause_menu.input.useHandCursor = true;
            this.pause_menu.events.onInputDown.add(this.pauseMenuListener, this);
            this.pause_menu.anchor.setTo(0.5, 0.5);
        }
    },

    pauseMenuListener: function (sprite, pointer) {
        console.log('in here');
    },

    mouseDragStart: function () {
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
            // box.style.top = canvas.offsetTop + pos.start.y;
            // box.style.left = canvas.offsetLeft + pos.start.x;
            box.style.top = pos.start.y;
            box.style.left = pos.start.x;
            pos.isActive = true;
        }
    },

    mouseDragMove: function (sprite, pointer, dragX, dragY, snapPoint) {
        if (pos.isActive) {
            pos.current = {
                x: game.input.mousePointer.position.x,
                y: game.input.mousePointer.position.y
            }
            if (pos.current.x > pos.start.x) {
                box.style.width = pos.current.x - pos.start.x;
            } else {
                // box.style.left = canvas.offsetLeft + pos.current.x;
                // box.style.width = pos.start.x - pos.current.x;
                box.style.left = pos.current.x;
                box.style.width = pos.start.x - pos.current.x;
            }

            if (pos.current.y > pos.start.y) {
                box.style.height = pos.current.y - pos.start.y;
            } else {
                // box.style.top = canvas.offsetTop + pos.current.y;
                box.style.top = pos.current.y;
                box.style.height = pos.start.y - pos.current.y;
            }


        }
    },

    mouseDragEnd: function() {
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
            this.checkSprites();
            box.classList.remove('active');
        }
    },

    createBaddie: function() {
        var player = game.add.sprite(100 + Math.random() * 500, 50 + Math.random() * 500, 'infantry');
        player.newDestination = {x: null, y: null};
        player.oldDestination = {x: null, y: null};
        player.destinationIsSet = false;
        player.selected = false;
        player.current = false;

        // baddie.scale.set(.25)
        // console.log(player.offsetX, player.offsetY);

        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        player.body.width  = 35;
        player.body.height = 45;

        player.body.offset.x = 20;
        player.body.offset.y = 10;

        infantry.push(player);

        player.animations.add('E',  [38, 39, 40, 41, 42, 43], 10, true);
    	player.animations.add('W',  [25, 24, 23, 22, 21, 20], 10, true);
    	player.animations.add('N',  [8, 9, 10, 11, 12, 13],   10, true);
    	player.animations.add('S',  [32, 33, 34, 35, 36, 37], 10, true);
    	player.animations.add('NE', [50, 51, 52, 53, 54, 55], 10, true);
    	player.animations.add('NW', [19, 18, 17, 16, 15, 14], 10, true);
    	player.animations.add('SW', [26, 27, 28, 29, 30, 31], 10, true);
    	player.animations.add('SE', [38, 39, 40, 41, 42, 43], 10, true);
    	player.animations.add('STAND', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85], 10, true);

        return player;
    },

checkSprites: function() {
    // console.clear();
    selectedArray.length = 0;


    infantry.forEach(function (item, index) {
        console.log('in here');
        var bottom = (item.y + item.body.height + 10);
        var left = item.x + 20;
        var right = (item.x + item.body.width + 20);
        var top = item.y + 10;
        item.tint = 0xffffff;


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
                console.log('Selected Units: ' + selectedArray.length);
            }
    }, this);
},

mouseRightClick: function() {
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
},

controlWithMouse: function() {

    for (var i = 0; i < infantry.length; i++) {
        // var player = selectedArray[i];
        var player = infantry[i];

        game.physics.arcade.collide(player, infantry);

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





    // newAmerican: function (x, y) {
    //     var american = game.add.sprite(x, y, 'american');
    //
    //     american.animations.add('american-stand-north', ['american-stand-north'], 1, false, false);
    //     american.animations.add('american-stand-northwest', ['american-stand-northwest'], 1, false, false);
    //     american.animations.add('american-stand-west', ['american-stand-west'], 1, false, false);
    //     american.animations.add('american-stand-southwest', ['american-stand-southwest'], 1, false, false);
    //     american.animations.add('american-stand-south', ['american-stand-south'], 1, false, false);
    //     american.animations.add('american-stand-southeast', ['american-stand-southeast'], 1, false, false);
    //     american.animations.add('american-stand-east', ['american-stand-east'], 1, false, false);
    //     american.animations.add('american-stand-northeast', ['american-stand-northeast'], 1, false, false);
    //
    //     american.animations.add('american-run-east', Phaser.Animation.generateFrameNames('american-run-east', 0, 5), 6, false, false);
    //     american.animations.add('american-run-west', Phaser.Animation.generateFrameNames('american-run-west', 0, 5), 6, false, false);
    //     american.animations.add('american-run-north', Phaser.Animation.generateFrameNames('american-run-north', 0, 5), 6, false, false);
    //     american.animations.add('american-run-south', Phaser.Animation.generateFrameNames('american-run-south', 0, 5), 6, false, false);
    //
    //     american.animations.add('american-run-northwest', Phaser.Animation.generateFrameNames('american-run-northwest', 0, 5), 6, false, false);
    //     american.animations.add('american-run-northeast', Phaser.Animation.generateFrameNames('american-run-northeast', 0, 5), 6, false, false);
    //     american.animations.add('american-run-southweset', Phaser.Animation.generateFrameNames('american-run-southwest', 0, 5), 6, false, false);
    //     american.animations.add('american-run-southeast', Phaser.Animation.generateFrameNames('american-run-southeast', 0, 5), 6, false, false);
    //
    //     american.animations.add('american-fire-north', Phaser.Animation.generateFrameNames('american-fire-north', 0, 5), 6, false, false);
    //     american.animations.add('american-fire-south', Phaser.Animation.generateFrameNames('american-fire-south', 0, 5), 6, false, false);
    //     american.animations.add('american-fire-west', Phaser.Animation.generateFrameNames('american-fire-west', 0, 5), 6, false, false);
    //     american.animations.add('american-fire-east', Phaser.Animation.generateFrameNames('american-fire-east', 0, 5), 6, false, false);
    //     american.animations.add('american-fire-northwest', Phaser.Animation.generateFrameNames('american-fire-northwest', 0, 5), 6, false, false);
    //     american.animations.add('american-fire-northeast', Phaser.Animation.generateFrameNames('american-fire-northeast', 0, 5), 6, false, false);
    //     american.animations.add('american-fire-southwest', Phaser.Animation.generateFrameNames('american-fire-southwest', 0, 5), 6, false, false);
    //     american.animations.add('american-fire-southeast', Phaser.Animation.generateFrameNames('american-fire-southeast', 0, 5), 6, false, false);
    //
    //     american.animations.add('american-die-west', Phaser.Animation.generateFrameNames('american-die-west', 0, 14), 14, false, false);
    //     american.animations.add('american-die-east', Phaser.Animation.generateFrameNames('american-die-east', 0, 14), 14, false, false);
    //
    //     game.physics.p2.enable(american);
    //     american.body.setCircle(20);
    //     american.body.damping = .9999999999;
    //     american.body.fixedRotation = true;
    //
    //     //return american;
    //     return new American(x, y, american);
    // },
    // newSoviet  : function (x, y) {
    //     var soviet = game.add.sprite(x, y, 'soviet');
    //
    //     soviet.animations.add('soviet-stand-north', ['soviet-stand-north'], 1, false, false);
    //     soviet.animations.add('soviet-stand-northwest', ['soviet-stand-northwest'], 1, false, false);
    //     soviet.animations.add('soviet-stand-west', ['soviet-stand-west'], 1, false, false);
    //     soviet.animations.add('soviet-stand-southwest', ['soviet-stand-southwest'], 1, false, false);
    //     soviet.animations.add('soviet-stand-south', ['soviet-stand-south'], 1, false, false);
    //     soviet.animations.add('soviet-stand-southeast', ['soviet-stand-southeast'], 1, false, false);
    //     soviet.animations.add('soviet-stand-east', ['soviet-stand-east'], 1, false, false);
    //     soviet.animations.add('soviet-stand-northeast', ['soviet-stand-northeast'], 1, false, false);
    //
    //     soviet.animations.add('soviet-run-east', Phaser.Animation.generateFrameNames('soviet-run-east', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-run-west', Phaser.Animation.generateFrameNames('soviet-run-west', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-run-north', Phaser.Animation.generateFrameNames('soviet-run-north', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-run-south', Phaser.Animation.generateFrameNames('soviet-run-south', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-run-northwest', Phaser.Animation.generateFrameNames('soviet-run-northwest', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-run-northeast', Phaser.Animation.generateFrameNames('soviet-run-northeast', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-run-southwest', Phaser.Animation.generateFrameNames('soviet-run-southwest', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-run-southeast', Phaser.Animation.generateFrameNames('soviet-run-southeast', 0, 5), 6, false, false);
    //
    //     soviet.animations.add('soviet-fire-north', Phaser.Animation.generateFrameNames('soviet-fire-north', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-fire-south', Phaser.Animation.generateFrameNames('soviet-fire-south', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-fire-west', Phaser.Animation.generateFrameNames('soviet-fire-west', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-fire-east', Phaser.Animation.generateFrameNames('soviet-fire-east', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-fire-northwest', Phaser.Animation.generateFrameNames('soviet-fire-northwest', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-fire-northeast', Phaser.Animation.generateFrameNames('soviet-fire-northeast', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-fire-southwest', Phaser.Animation.generateFrameNames('soviet-fire-southwest', 0, 5), 6, false, false);
    //     soviet.animations.add('soviet-fire-southeast', Phaser.Animation.generateFrameNames('soviet-fire-southeast', 0, 5), 6, false, false);
    //
    //     soviet.animations.add('soviet-die-west', Phaser.Animation.generateFrameNames('soviet-die-west', 0, 14), 14, false, false);
    //     soviet.animations.add('soviet-die-east', Phaser.Animation.generateFrameNames('soviet-die-east', 0, 14), 14, false, false);
    //
    //     game.physics.p2.enable(soviet);
    //     soviet.body.setCircle(15);
    //     soviet.body.damping = .9999999999;
    //     soviet.body.fixedRotation = true;
    //
    //     //return soviet;
    //     return new Soviet(x, y, soviet);
    // },

    // raycasting line of sight
    // https://gamemechanicexplorer.com/#raycasting-1

};
