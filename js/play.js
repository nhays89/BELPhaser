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
        var groups = [];

        var map = game.add.tilemap('mountains');

        map.addTilesetImage('mountain_landscape', 'mountain_landscape');
        map.addTilesetImage('wood_tileset', 'wood_tileset');
        var grassLayer = map.createLayer('grass');
        var obstacleLayer = map.createLayer('obstacles');
        grassLayer.resizeWorld();
        obstacleLayer.resizeWorld();


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
