WebFontConfig = {
    google: {
        families: ['Roboto']
    }
};

var text = null;
var playState = {
    preload: function() {
        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    create: function() {
        this.createMap();
        this.createGameObjects();
        this.setupUI();
        this.cursors = game.input.keyboard.createCursorKeys();
        this.setUpEventListeners();
    },

    update: function() {
        // Used to check if the camera's coordinates were changed.
        // The camera's coordinates won't change if they have reached the bounds of the world.
        this.detectCameraMove();
        //this.updateGameObjects();
        this.updateSelectionRect();
        var mousePointer = game.input.mousePointer;
        if (mousePointer.leftButton.isDown) {
            console.log("mouse down");

        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            // this.soviet.sprite.animations.play('soviet-die-west');
            // var found = this.getNearbyEnemies(this.soviet);
            // console.log('Num enemies: ' + this.getNearbyEnemies(this.soviet));
        }


        if (this.currentPlayer) {
            if (this.cursors.left.isDown) {
                this.currentPlayer.direction = "west";
                this.currentPlayer.body.moveLeft(200);
                this.currentPlayer.animations.play(this.currentPlayer.name + '-run-' + this.currentPlayer.direction);
            } else if (this.cursors.right.isDown) { // Move to the right
                this.currentPlayer.direction = "east";
                this.currentPlayer.body.moveRight(200);
                this.currentPlayer.animations.play(this.currentPlayer.name + '-run-' + this.currentPlayer.direction);
            } else if (this.cursors.up.isDown) { //move up
                this.currentPlayer.direction = "north";
                this.currentPlayer.body.moveUp(200);
                this.currentPlayer.animations.play(this.currentPlayer.name + '-run-' + this.currentPlayer.direction);
            } else if (this.cursors.down.isDown) { // move dowm
                this.currentPlayer.direction = "south";
                this.currentPlayer.body.moveDown(200);
                this.currentPlayer.animations.play(this.currentPlayer.name + '-run-' + this.currentPlayer.direction);
            } else {
                this.currentPlayer.animations.play(this.currentPlayer.name + '-stand-' + this.currentPlayer.direction);
            }
        }
    },
    setupUI: function() {
        var cameraViewPort = game.camera.view;


        var graphics = new Phaser.Graphics(game, 0, 0);
        graphics.lineStyle(2, 0xd9d9d9, 1);

        graphics.drawRect(0, cameraViewPort.height - (cameraViewPort.height * .25), (cameraViewPort.width * .25), cameraViewPort.height * .25);

        graphics.fixedToCamera = true;

        game.world.add(graphics);

        this.selectRect = { //stores data about mouse events for the rectangle selection
            "origin": new Phaser.Point(),
            "current": new Phaser.Point(),
            "topLeft": new Phaser.Point(),
            "width": 0,
            "height": 0,
            "isActive": false,
            "rect": new Phaser.Graphics(game, 0, 0)
        };

        var minimapImg;
        this.minimapImg = game.add.sprite(0, cameraViewPort.height - (cameraViewPort.height * .25), 'minimap_image');
        this.minimapImg.fixedToCamera = true;
        var scaleWidth = cameraViewPort.width * .25 / this.minimapImg.width
        var scaleHeight = cameraViewPort.height * .25 / this.minimapImg.height;
        this.minimapImg.scale.setTo(scaleWidth, scaleHeight);

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

        this.minimap_loc.lineStyle(1, 0xd9d9d9, 1);
        this.minimap_loc.drawRect(0, 0,
            game.camera.width * this.minimapImg.scale.x,
            game.camera.height * this.minimapImg.scale.y);

        var pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        pKey.onDown.add(this.pauseGame, this);
    },

    setUpEventListeners: function() {
        game.input.mousePointer.leftButton.onDown.add(this.onLeftButtonDown, this);
        game.input.mousePointer.leftButton.onUp.add(this.onLeftButtonUp, this);
        game.input.mousePointer.rightButton.onDown.add(this.onRightButtonDown, this);
        game.input.mousePointer.rightButton.onUp.add(this.onRightButtonUp, this);
    },

    updateSelectionRect: function() {
        var mousePointer = game.input.mousePointer;
        if (mousePointer.leftButton.isDown) {

            if (this.selectRect.isActive) { //if we have a point stored from a recent down event

                this.selectRect.height = (Math.abs(this.selectRect.origin.y - this.selectRect.current.y));
                this.selectRect.width = (Math.abs(this.selectRect.origin.x - this.selectRect.current.x));

                var width = this.selectRect.width;
                var height = this.selectRect.height;

                if (this.selectRect.origin.x === this.selectRect.current.x && this.selectRect.origin.y === this.selectRect.current.y) {
                    return;
                }

                if (this.selectRect.origin.x < this.selectRect.current.x && this.selectRect.current.y < this.selectRect.origin.y) { //its to the right and above 
                    this.selectRect.topLeft.setTo(this.selectRect.origin.x, this.selectRect.current.y);
                } else if (this.selectRect.origin.x < this.selectRect.current.x && this.selectRect.current.y > this.selectRect.origin.y) { //its to the right and below 
                    this.selectRect.topLeft.setTo(this.selectRect.origin.x, this.selectRect.origin.y);
                } else if (this.selectRect.origin.x > this.selectRect.current.x && this.selectRect.current.y > this.selectRect.origin.y) { //its to the left and below
                    this.selectRect.topLeft.setTo(this.selectRect.current.x, this.selectRect.origin.y);
                } else { //its to the left and above

                    this.selectRect.topLeft.setTo(this.selectRect.current.x, this.selectRect.current.y);
                }
                var graphics = this.selectRect.rect;
                graphics.clear();
                graphics.lineStyle(1, 0x80ff00, 1);
                graphics.drawRect(this.selectRect.topLeft.x, this.selectRect.topLeft.y, this.selectRect.width, this.selectRect.height);
                game.world.add(graphics);
            } else { //capture the coordinate and store   
                this.selectRect.origin.setTo(mousePointer.position.x, mousePointer.position.y);
                this.selectRect.isActive = true;

            }


        }
    },




    render: function() {

        // this.soviet.sprite.body.debug = true;
        // game.debug.spriteInfo(this.soviet.sprite, 32, 32);
        // game.debug.quadTree(this.quadTree);
        // game.debug.geom(this.viewCircle, '#00bff3', false);
    },

    setupUnits: function() {
        this.soldierGroups = [];
        this.alliesGroup = [];
        this.soldierGroups.push(this.alliesGroup);

        this.sovietsGroup = [];
        this.soldierGroups.push(this.sovietsGroup);

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
    pauseGame: function() {
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

    pauseMenuListener: function(sprite, pointer) {
        console.log('in here');
    },

    detectCameraMove: function() {
        var tempCamera;

        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            tempCamera = game.camera.y;
            game.camera.y -= 20;
            if (tempCamera != game.camera.y) {
                this.minimap_loc.y -= 20 * this.minimapImg.scale.y;
            }
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
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
        } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            tempCamera = game.camera.x;
            game.camera.x += 20;
            if (tempCamera != game.camera.x) {
                this.minimap_loc.x += 20 * this.minimapImg.scale.x;
            }
        }
    },

    updateGameObjects: function() {
//         this.soldierGroups.forEach(function(group) {
//             group.forEach(function(soldier) {
//                 soldier.update();

//                 if (soldier.alive) {
//                     soldier.getNearbyEnemies();
//                 }
//             })
//         });

    },


    createAmericans: function(numOfAmericans) {
        var americanGroup = new Phaser.Group(game, game.world, "americans", false);
        americanGroup.classType = American; //sets the type of object to create when group.create is called
        //         americanGroup.alignIn(game.world.bounds, Phaser.CENTER);    
        for (var i = 0; i < 10; i++) {

            var x = 1000; //default
            var y = 1000;
            var american = americanGroup.create(x, y, "american"); // creates a new American
            this.quadTree.insert(american.body);
            american.name = american.key;

            //game.debug.spriteInfo(american, 32, 32);
        }

        americanGroup.align(5, 2, 40, 40);
        //work around for p2 physics movement of body relative to sprite

        //         game.world.getByName("americans").children.forEach(function(child) {
        //             child.x = child.x + this.spawnPoint.x; //reset relative to top left corner
        //             child.y = child.y + this.spawnPoint.y; //reset relative to top left corner
        //             child.body.x = child.x;
        //             child.body.y = child.y;
        //             console.log(child.x);
        //             console.log(child.body.x);
        //         }, this);

        //         // 
        //americanGroup.enableBodyDebug = true;

        //

        return americanGroup;

    },


    createSoviets: function() {



    },



    createMap: function() {
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
        //this.collisionLayer = game.physics.p2.convertCollisionObjects(this.map, "collision");
        this.quadTree = new Phaser.QuadTree(0, 0, game.width, game.height, 5, 4, 0);
        var offset = 100;
        this.spawnPoint = new Phaser.Point(game.world.centerX - offset, game.world.centerY - offset);
    },


    createGameObjects: function() {
        
        //TODO
        //Make Soviets
        //Make Tank

        //Make Americans            
        var americans = this.createAmericans();
        this.currentPlayer = game.world.getByName("americans").children[0]; //will soon no longer be under user cursor control (selection via mouse only)
    },

    onLeftButtonDown: function(pointer, mouseEvent) {
        console.log("on left button down");
        console.log(pointer);
        console.log(mouseEvent);
    },

    onLeftButtonUp: function(pointer, mouseEvent) {

        //TODO
        //determine soldiers in rect area
        //set selected prop
        //process logic

        //reset
        this.selectRect.isActive = false;
        this.selectRect.origin.setTo(0, 0);
        this.selectRect.current.setTo(0, 0);
        this.selectRect.topLeft.setTo(0, 0);
        this.selectRect.width = 0;
        this.selectRect.height = 0;
        this.selectRect.rect.clear();
    },
    onRightButtonUp: function(pointer, mouseEvent) {


        //TODO 
        //on right click
        //if soldiers selected
        //capture phaser.point xy
        //call func A*
        //get return coords
        //convert coords to sequential commands on stack for each soldier
        


        console.log("on right button up");
        console.log(pointer);
        console.log(mouseEvent);
    },

    onRightButtonDown: function(pointer, mouseEvent) {
        console.log("on right button down");
        console.log(pointer);
        console.log(mouseEvent);
    },


};