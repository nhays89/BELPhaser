WebFontConfig = {
    google: {
        families: ['Roboto']
    }
};

var text = null;
var playState = {
    preload: function () {
        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    create: function () {
        var groups = [];
         this.map = game.add.tilemap('map');
        game.physics.arcade.skipQuadTree = false;
     

      

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

        this.setupUnits();
        this.cursors = game.input.keyboard.createCursorKeys();
        this.setupUI();
    },

    update : function () {
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

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            var found = this.getNearbyEnemies(this.red);
            console.log('Num enemies: ' + this.getNearbyEnemies(this.red));
        }

        if (this.cursors.left.isDown) {
            if (this.currentPlayer.name === 'american') {   // debug purposes set currentPlayer to be whatever player in the console at runtime
                this.american.sprite.body.moveLeft(100);
                this.american.sprite.animations.play('american-west');
            } else if (this.currentPlayer.name === 'red') {
                this.red.sprite.body.moveLeft(100);
                this.red.sprite.animations.play('red-run-west');
            }
        } else if (this.cursors.right.isDown) { // Move to the right
            if (this.currentPlayer.name === 'american') {
                this.american.sprite.body.moveRight(100);
                this.american.sprite.animations.play('american-east');
            } else if (this.currentPlayer.name == "red") {
                this.red.sprite.body.moveRight(100);
                this.red.sprite.animations.play('red-run-east');
            }
        } else if (this.cursors.up.isDown) { //move up
            if (this.currentPlayer.name === 'american') {
                this.american.sprite.body.moveUp(100);
                this.american.sprite.animations.play('american-north');
            } else if (this.currentPlayer.name === 'red') {
                this.red.sprite.body.moveUp(100);
                this.red.sprite.animations.play('red-run-north');
            }
        } else if (this.cursors.down.isDown) { // move dowm
            if (this.currentPlayer.name === 'american') {
                this.american.sprite.animations.play('american-south');
                this.american.sprite.body.moveDown(100);
            } else if (this.currentPlayer.name === 'red') {
                this.red.sprite.animations.play('red-run-south');
                this.red.sprite.body.moveDown(100);
            }
        } else {
            if (this.currentPlayer.name === 'american') {
                this.american.sprite.animations.play('american-stand');
            } else if (this.currentPlayer.name === 'red') {
                this.red.sprite.animations.play('red-stand-north');
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
    },
    render : function () {
     //   this.red.sprite.body.debug = true;
     //   game.debug.spriteInfo(this.red.sprite, 32, 32);
       //  game.debug.quadTree(this.quadTree);
       //  game.debug.geom(this.viewCircle, '#00bff3', false);
    },

    setupUnits      : function () {
        this.alliesGroup = [];
        this.sovietsGroup = [];
        this.quadTree = new Phaser.QuadTree(0, 0, game.width, game.height, 5, 4, 0);

        this.red = this.newSoviet(150, 150);
        this.sovietsGroup.push(this.red);

        for (var i = 0; i < 20; i++) {

            var x = game.world.randomX;
            var y = game.world.randomY;

            if (x > game.world.width - 100) {
                x = 760;
            }

            if (y > game.world.height - 100) {
                y = 560;
            }

            this.american = this.newAmerican(x, y);
            this.alliesGroup.push(this.american);
            this.quadTree.insert(this.american);
        }

        this.quadTree.insert(this.red);


        // sprite that's used with quadtree to find a circle around the target sprite
        // this.viewSprite = game.add.sprite(0, 0);
        this.viewSprite = new Phaser.Rectangle(0, 0, 10, 10);
        // for debugging view distance
        this.viewCircle = new Phaser.Circle(0, 0, 200);

        this.currentPlayer = this.red.sprite; //debug purposes
        this.currentPlayer.name = "red";
    },
    getNearbyEnemies: function (soldierSprite) {
        var widthAndHeight = soldierSprite.viewRadius * 2;
        this.viewSprite.centerOn(soldierSprite.sprite.x, soldierSprite.sprite.y);
        this.viewSprite.resize(widthAndHeight, widthAndHeight);

        // for debugging view distance
        this.viewCircle.setTo(soldierSprite.sprite.x, soldierSprite.sprite.y, widthAndHeight);

        var found = this.quadTree.retrieve(this.viewSprite);
        var distance;

        var closeEnough = 0;
        for (var i = 0; i < found.length; i++) {
            distance = Phaser.Math.distance(soldierSprite.sprite.x, soldierSprite.sprite.y,
                found[i].sprite.x, found[i].sprite.y);

            if (distance <= soldierSprite.attackRadius) {
                if (soldierSprite.american && found[i].soviet || soldierSprite.soviet && found[i].american) {
                    //soldierSprite.shoot(found[i]);
                    closeEnough++;
                }
            } else if (distance <= soldierSprite.viewRadius) {
                // walk closer
                closeEnough++;
            }
        }
        return closeEnough;
    },
    pauseGame       : function () {
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

    newAmerican: function (x, y) {
        var american = game.add.sprite(x, y, 'green');

        american.animations.add('green-stand-north', ['green-stand-north'], 1, false, false);
        american.animations.add('green-stand-northwest', ['green-stand-northwest'], 1, false, false);
        american.animations.add('green-stand-west', ['green-stand-west'], 1, false, false);
        american.animations.add('green-stand-southwest', ['green-stand-southwest'], 1, false, false);
        american.animations.add('green-stand-south', ['green-stand-south'], 1, false, false);
        american.animations.add('green-stand-southeast', ['green-stand-southeast'], 1, false, false);
        american.animations.add('green-stand-east', ['green-stand-east'], 1, false, false);
        american.animations.add('green-stand-northeast', ['green-stand-northeast'], 1, false, false);

        american.animations.add('green-run-east', Phaser.Animation.generateFrameNames('green-run-east', 0, 5), 6, false, false);
        american.animations.add('green-run-west', Phaser.Animation.generateFrameNames('green-run-west', 0, 5), 6, false, false);
        american.animations.add('green-run-north', Phaser.Animation.generateFrameNames('green-run-north', 0, 5), 6, false, false);
        american.animations.add('green-run-south', Phaser.Animation.generateFrameNames('green-run-south', 0, 5), 6, false, false);

        american.animations.add('green-run-northwest', Phaser.Animation.generateFrameNames('green-run-northwest', 0, 5), 6, false, false);
        american.animations.add('green-run-northeast', Phaser.Animation.generateFrameNames('green-run-northeast', 0, 5), 6, false, false);
        american.animations.add('green-run-southweset', Phaser.Animation.generateFrameNames('green-run-southwest', 0, 5), 6, false, false);
        american.animations.add('green-run-southeast', Phaser.Animation.generateFrameNames('green-run-southeast', 0, 5), 6, false, false);

        american.animations.add('green-fire-north', Phaser.Animation.generateFrameNames('green-fire-north', 0, 5), 6, false, false);
        american.animations.add('green-fire-south', Phaser.Animation.generateFrameNames('green-fire-south', 0, 5), 6, false, false);
        american.animations.add('green-fire-west', Phaser.Animation.generateFrameNames('green-fire-west', 0, 5), 6, false, false);
        american.animations.add('green-fire-east', Phaser.Animation.generateFrameNames('green-fire-east', 0, 5), 6, false, false);
        american.animations.add('green-fire-northwest', Phaser.Animation.generateFrameNames('green-fire-northwest', 0, 5), 6, false, false);
        american.animations.add('green-fire-northeast', Phaser.Animation.generateFrameNames('green-fire-northeast', 0, 5), 6, false, false);
        american.animations.add('green-fire-southwest', Phaser.Animation.generateFrameNames('green-fire-southwest', 0, 5), 6, false, false);
        american.animations.add('green-fire-southeast', Phaser.Animation.generateFrameNames('green-fire-southeast', 0, 5), 6, false, false);

        american.animations.add('green-die-west', Phaser.Animation.generateFrameNames('green-die-west', 0, 14), 14, false, false);
        american.animations.add('green-die-east', Phaser.Animation.generateFrameNames('green-die-east', 0, 14), 14, false, false);

        game.physics.p2.enable(american);
        american.body.setCircle(20);
        american.body.damping = .9999999999;
        american.body.fixedRotation = true;

        //return american;
        return new American(x, y, american);
    },
    newSoviet  : function (x, y) {
        var soviet = game.add.sprite(x, y, 'red');

        soviet.animations.add('red-stand-north', ['red-stand-north'], 1, false, false);
        soviet.animations.add('red-stand-northwest', ['red-stand-northwest'], 1, false, false);
        soviet.animations.add('red-stand-west', ['red-stand-west'], 1, false, false);
        soviet.animations.add('red-stand-southwest', ['red-stand-southwest'], 1, false, false);
        soviet.animations.add('red-stand-south', ['red-stand-south'], 1, false, false);
        soviet.animations.add('red-stand-southeast', ['red-stand-southeast'], 1, false, false);
        soviet.animations.add('red-stand-east', ['red-stand-east'], 1, false, false);
        soviet.animations.add('red-stand-northeast', ['red-stand-northeast'], 1, false, false);

        soviet.animations.add('red-run-east', Phaser.Animation.generateFrameNames('red-run-east', 0, 5), 6, false, false);
        soviet.animations.add('red-run-west', Phaser.Animation.generateFrameNames('red-run-west', 0, 5), 6, false, false);
        soviet.animations.add('red-run-north', Phaser.Animation.generateFrameNames('red-run-north', 0, 5), 6, false, false);
        soviet.animations.add('red-run-south', Phaser.Animation.generateFrameNames('red-run-south', 0, 5), 6, false, false);
        soviet.animations.add('red-run-northwest', Phaser.Animation.generateFrameNames('red-run-northwest', 0, 5), 6, false, false);
        soviet.animations.add('red-run-northeast', Phaser.Animation.generateFrameNames('red-run-northeast', 0, 5), 6, false, false);
        soviet.animations.add('red-run-southweset', Phaser.Animation.generateFrameNames('red-run-southwest', 0, 5), 6, false, false);
        soviet.animations.add('red-run-southeast', Phaser.Animation.generateFrameNames('red-run-southeast', 0, 5), 6, false, false);

        soviet.animations.add('red-fire-north', Phaser.Animation.generateFrameNames('red-fire-north', 0, 5), 6, false, false);
        soviet.animations.add('red-fire-south', Phaser.Animation.generateFrameNames('red-fire-south', 0, 5), 6, false, false);
        soviet.animations.add('red-fire-west', Phaser.Animation.generateFrameNames('red-fire-west', 0, 5), 6, false, false);
        soviet.animations.add('red-fire-east', Phaser.Animation.generateFrameNames('red-fire-east', 0, 5), 6, false, false);
        soviet.animations.add('red-fire-northwest', Phaser.Animation.generateFrameNames('red-fire-northwest', 0, 5), 6, false, false);
        soviet.animations.add('red-fire-northeast', Phaser.Animation.generateFrameNames('red-fire-northeast', 0, 5), 6, false, false);
        soviet.animations.add('red-fire-southwest', Phaser.Animation.generateFrameNames('red-fire-southwest', 0, 5), 6, false, false);
        soviet.animations.add('red-fire-southeast', Phaser.Animation.generateFrameNames('red-fire-southeast', 0, 5), 6, false, false);

        soviet.animations.add('red-die-west', Phaser.Animation.generateFrameNames('red-die-west', 0, 14), 14, false, false);
        soviet.animations.add('red-die-east', Phaser.Animation.generateFrameNames('red-die-east', 0, 14), 14, false, false);

        game.physics.p2.enable(soviet);
        soviet.body.setCircle(20);
        soviet.body.damping = .999999999;
        soviet.body.fixedRotation = true;

        //return soviet;
        return new Soviet(x, y, soviet);
    },

    // raycasting line of sight
    // https://gamemechanicexplorer.com/#raycasting-1
    getDirection: function (radians) {
        var degrees = Phaser.Math.radToDeg(radians);

        if (degrees >= -22.5 && degrees < 22.5) {
            return 'west';
        } else if (degrees >= 22.5 && degrees < 67.5) {
            return 'northwest';
        } else if (degrees >= 67.5 && degrees < 112.5) {
            return 'north';
        } else if (degrees >= 112.5 && degrees < 157.5) {
            return 'northeast';
        } else if (degrees >= -157.5 && degrees < -112.5) {
            return 'southeast';
        } else if (degrees >= -112.5 && degrees < -67.5) {
            return 'south';
        } else if (degrees >= -67.5 && degrees < -22.5) {
            return 'southwest';
        } else {
            return 'east';
        }
    }
};

function Soldier(x, y, sprite) {
    this.alive = true;
    this.selected = false;
    this.sprite = sprite;
    this.viewRadius = 250;
    this.attackRadius = 150;

    this.health = 100;
    this._damage = 20;
}

Soldier.prototype.shoot = function (enemy) {
    var radians = game.physics.arcade.angleBetween(this.sprite, enemy);
    var direction = playState.getDirection(radians);
    // find direction
    // determine animation
    // play animation
    // take health from enemy
};

Soldier.prototype.moveTo = function () {
    // implement A* here
};


function American(x, y, sprite) {
    this.american = true;
    Soldier.call(this, x, y, sprite);
}

American.prototype = new Soldier();
American.constructor = American;


function Soviet(x, y, sprite) {
    this.soviet = true;
    Soldier.call(this, x, y, sprite);
}

Soviet.prototype = new Soldier();
Soviet.constructor = Soviet;

