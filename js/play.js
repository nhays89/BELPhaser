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

var text = null;
var playState = {
    preload: function () {
        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
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

        //nick map
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
       // cursors = game.input.keyboard.createCursorKeys(); 




         
        this.setupUI();
    },

    update : function () {
        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            game.camera.y -= 20;
            if (!game.camera.atLimit.y) {
                this.minimap_loc.y -= 20 * this.minimapImg.scale.y;
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            game.camera.y += 20;
            if (!game.camera.atLimit.y) {
                this.minimap_loc.y += 20 * this.minimapImg.scale.y;
            }
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            game.camera.x -= 20;
            if (!game.camera.atLimit.x) {
                this.minimap_loc.x -= 20 * this.minimapImg.scale.x;
            }
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            game.camera.x += 20;
            if (!game.camera.atLimit.x) {
                this.minimap_loc.x += 20 * this.minimapImg.scale.x;
            }
        }

        if (this.cursors.left.isDown ){   //  Move to the left
         if(this.cursors.up.isDown) {
         	american.body.moveLeft(100);
         	american.body.moveUp(100);
         	american.animations.play('american-northwest');
         }
           // american.body.velocity.x = -100;
           american.body.moveLeft(100);
         //  american.body.thrust(50);
           american.animations.play('american-west');  
    }
    else if (this.cursors.right.isDown) {//  Move to the right
           //american.body.thrust(50);
           american.body.moveRight(100);
           // american.body.velocity.x= 100;
            american.animations.play('american-east');
    }
    else if(this.cursors.up.isDown) { //move up
    american.body.thrust(50);
    	// american.body.velocity.y= 100;
    		american.body.moveUp(100);
         american.animations.play('american-north');
    } else if(this.cursors.down.isDown) {// move dowm
    	//american.body.velocity.y= -100;
    	//american.body.thrust(50);
    	american.animations.play('american-south');
    	american.body.moveDown(100);
	}
    else {
    	american.animations.play('american-stand');
           
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
