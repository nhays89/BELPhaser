WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    // active: function () {
    //     game.time.events.add(Phaser.Timer.SECOND, createText, this);
    // },

    //  The Google Fonts we want to load (specify as many as you like in the array)
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
        this.american = game.add.sprite(50, 50, 'american');
        this.red = game.add.sprite(75, 75, 'red');
        this.collisionLayer = game.physics.p2.convertCollisionObjects(this.map, "collision");
        this.american.animations.add('american-east', Phaser.Animation.generateFrameNames('american-east', 0, 13), 13, false, false);
        this.american.animations.add('american-west', Phaser.Animation.generateFrameNames('american-west', 0, 13), 13, false, false);
        this.american.animations.add('american-north', Phaser.Animation.generateFrameNames('american-north', 0, 13), 13, false, false);
        this.american.animations.add('american-south', Phaser.Animation.generateFrameNames('american-south', 0, 13), 13, false, false);
        this.american.animations.add('american-stand', Phaser.Animation.generateFrameNames('american-stand', 0, 14), 14, false, false);
        this.american.animations.add('american-northwest', Phaser.Animation.generateFrameNames('american-northwest', 0, 13), 13, false, false);
        this.american.animations.add('american-northeast', Phaser.Animation.generateFrameNames('american-northeast', 0, 13), 13, false, false);
        this.american.animations.add('american-southweset', Phaser.Animation.generateFrameNames('american-southwest', 0, 13), 13, false, false);
        this.american.animations.add('american-southeast', Phaser.Animation.generateFrameNames('american-southeast', 0, 13), 13, false, false);
        this.red.animations.add('red-run-east', Phaser.Animation.generateFrameNames('red-run-east', 0, 5), 6, false, false);
        this.red.animations.add('red-run-west', Phaser.Animation.generateFrameNames('red-run-west', 0, 5), 6, false, false);
        this.red.animations.add('red-run-north', Phaser.Animation.generateFrameNames('red-run-north', 0, 5), 6, false, false);
        this.red.animations.add('red-run-south', Phaser.Animation.generateFrameNames('red-run-south', 0, 5), 6, false, false);
        this.red.animations.add('red-stand', Phaser.Animation.generateFrameNames('red-stand', 0, 5), 14, false, false);
        this.red.animations.add('red-run-northwest', Phaser.Animation.generateFrameNames('red-run-northwest', 0, 5), 6, false, false);
        this.red.animations.add('red-run-northeast', Phaser.Animation.generateFrameNames('red-run-northeast', 0, 5), 6, false, false);
        this.red.animations.add('red-run-southweset', Phaser.Animation.generateFrameNames('red-run-southwest', 0, 5), 6, false, false);
        this.red.animations.add('red-run-southeast', Phaser.Animation.generateFrameNames('red-run-southeast', 0, 5), 6, false, false);
        game.physics.p2.enable(this.american);
        game.physics.p2.enableBody(this.red, true);
        this.american.body.setCircle(20);
        this.american.body.damping = .5;
        this.american.body.fixedRotation = true;
        this.red.scale.setTo(1.25, 1.25);
        this.red.body.setCircle(20);
        this.red.body.damping = .9;
        this.red.body.fixedRotation = true;
        this.red.body.data.gravityScale = 0;


        // cursors = game.input.keyboard.createCursorKeys();

        this.currentPlayer = this.red; //debug purposes
        this.currentPlayer.name = "red";

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

        if (this.cursors.left.isDown) {
            if (this.currentPlayer.name === 'american') {   // debug purposes set currentPlayer to be whatever player in the console at runtime
                this.american.body.moveLeft(100);
                this.american.animations.play('american-west');
            } else if (this.currentPlayer.name === 'red') {
                this.red.body.moveLeft(100);
                this.red.animations.play('red-run-west');
            }
        }

        else if (this.cursors.right.isDown) {//  Move to the right
            if (this.currentPlayer.name === 'american') {
                this.american.body.moveRight(100);
                this.american.animations.play('american-east');
            } else if (this.currentPlayer.name == "red") {
                this.red.body.moveRight(100);
                this.red.animations.play('red-run-east');
            }
        }
        else if (this.cursors.up.isDown) { //move up
            if (this.currentPlayer.name === 'american') {
                this.american.body.moveUp(100);
                this.american.animations.play('american-north');
            } else if (this.currentPlayer.name === 'red') {
                this.red.body.moveUp(100);
                this.red.animations.play('red-run-north');
            }
        } else if (this.cursors.down.isDown) {// move dowm
            if (this.currentPlayer.name === 'american') {
                this.american.animations.play('american-south');
                this.american.body.moveDown(100);
            } else if (this.currentPlayer.name === 'red') {
                this.red.animations.play('red-run-south');
                this.red.body.moveDown(100);
            }

        }
        else {
            if (this.currentPlayer.name === 'american') {
                this.american.animations.play('american-stand');
            } else if (this.currentPlayer.name === 'red') {
                this.red.animations.play('red-stand-north');
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

        //this.timeLabel = game.add.text(15, 20, '5:00 AM', { font: '12px Arial Black', fill: '#000000' });

        this.timeLabel = game.add.text(this.info_panel.x + 20, this.info_panel.y + 30,
            "10:00 AM");

        this.timeLabel.font = 'Roboto';
        this.timeLabel.fontSize = 18;

        //this.timeLabel.align = 'center';
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

        this.cursors = game.input.keyboard.createCursorKeys();

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
    }
};
