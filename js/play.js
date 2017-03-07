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
        this.createMap();
        this.createGameObjects();
        this.setupUI();
        this.setupInput();

        this.pathDebug = game.add.graphics(0, 0);
        this.pathDebug.coords = [5, 5, 30, 30];
        this.pathDebug.on = false;

        this.cursors = game.input.keyboard.createCursorKeys();
        this.viewSprite = new Phaser.Rectangle(0, 0, 10, 10);
        this.viewCircle = new Phaser.Circle(0, 0, 200);

    },

    update: function () {
        this.detectCameraMove();
        this.updateSelectionRect();
        this.updateSelectedGroup(game.world.getByName("americans"));
        this.updateGameObjects();
        

         if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {

            if (this.pathDebug.on) {

                this.pathDebug.clear();

                // this.pathDebug.beginFill(0xFF0000);
                this.pathDebug.lineStyle(5, 0xffd900, 1);

                var path = game.pathfinder.findPath(this.pathDebug.coords[0] * 33,
                    this.pathDebug.coords[1] * 33, this.pathDebug.coords[2] * 33,
                    this.pathDebug.coords[3] * 33);
                console.log(path);

                for (var i = 0; i < path.length; i++) {
                    if (i === 0) {
                        this.pathDebug.moveTo(path[i].x, path[i].y);
                    } else {
                        this.pathDebug.lineTo(path[i].x, path[i].y);
                    }
                }
            }
        }

        // game.physics.arcade.collide(this.americansGroup, this.collisionLayer);

        // this.americansGroup.sort('y', Phaser.Group.SORT_ASCENDING);

        if (this.currentPlayer) { //debug
            if (this.cursors.left.isDown) {
                this.currentPlayer.direction = "west";
                this.currentPlayer.body.moveLeft(200);
                this.currentPlayer.animations.play(this.currentPlayer.name + '-run-' + this.currentPlayer.direction);
            } else if (this.cursors.right.isDown) { // Move to the right
                this.currentPlayer.direction = "east";
                this.currentPlayer.body.moveRight(200);
                this.currentPlayer.animations.play(this.currentPlayer.name + '-run-' + this.currentPlayer.direction);
            }

            if (this.cursors.up.isDown) { //move up
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
    setupUI: function () {
        var cameraViewPort = game.camera.view;

        var graphics = new Phaser.Graphics(game, 0, 0);
        graphics.lineStyle(2, 0xd9d9d9, 1);

        graphics.drawRect(0, cameraViewPort.height - (cameraViewPort.height * .25), (cameraViewPort.width * .25), cameraViewPort.height * .25);

        graphics.fixedToCamera = true;
        //this.minimap.y = this.minimap.y - this.minimap.height;
        //this.minimap.fixedToCamera = true;

        game.world.add(graphics);

        this.select = { //stores data about mouse events for the rectangle selection
            "origin"  : new Phaser.Point(),
            "current" : new Phaser.Point(),
            "topLeft" : new Phaser.Point(),
            "width"   : 0,
            "height"  : 0,
            "isActive": false,
            "rect"    : new Phaser.Graphics(game, 0, 0)
        };

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


    setupInput: function() {
        
        // prevent browser default context menu from appearing
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

        game.input.mousePointer.leftButton.onUp.add(this.onLeftButtonUp, this);
        game.input.mousePointer.rightButton.onDown.add(this.onRightButtonDown, this);
        game.input.mousePointer.rightButton.onUp.add(this.onRightButtonUp, this);

    },

    updateSelectionRect: function () {
        var mousePointer = game.input.mousePointer;
        if (mousePointer.leftButton.isDown) {
        this.select.current.setTo(mousePointer.position.x + game.camera.x, mousePointer.position.y + game.camera.y);
        if (this.select.isActive) { //if we have a point stored from a recent down event
            //console.log(mousePointer.position.x + " : " + mousePointer.position.y);
            //console.log("origin: " + this.select.origin.x + ": " + this.select.origin.y);

            //console.log(this.select.current.x + " : " + this.select.current.y);



           // this.select.height = (Math.abs(this.select.origin.y - this.select.current.y));
           // this.select.width = (Math.abs(this.select.origin.x - this.select.current.x));

           // var width = this.select.width;
          //  var height = this.select.height;
        var gameCamX = game.camera.x;
                var gameCamY = game.camera.y;
                if (this.select.origin.x === this.select.current.x && this.select.origin.y === this.select.current.y) {
                    //console.log("same");
                    return;
                }

                if (this.select.origin.x < this.select.current.x && this.select.current.y < this.select.origin.y) { //its to the right and above
                    this.select.topLeft.setTo(this.select.origin.x , this.select.current.y);
                } else if (this.select.origin.x < this.select.current.x && this.select.current.y > this.select.origin.y) { //its to the right and below
                    this.select.topLeft.setTo(this.select.origin.x, this.select.origin.y);
                } else if (this.select.origin.x > this.select.current.x && this.select.current.y > this.select.origin.y) { //its to the left and below
                    this.select.topLeft.setTo(this.select.current.x, this.select.origin.y);
                } else { //its to the left and above

                    this.select.topLeft.setTo(this.select.current.x, this.select.current.y);
                }
                var width = (Math.abs(this.select.origin.x - this.select.current.x));
                var height = (Math.abs(this.select.origin.y - this.select.current.y));
                var graphics = this.select.rect;
                graphics.clear();

                graphics.lineStyle(1, 0x80ff00, 1);
                graphics.drawRect(this.select.topLeft.x, this.select.topLeft.y, width, height);
                game.world.add(graphics);
            } else { //capture the current coordinate and store as origin
                var graphics = this.select.rect;
                this.select.origin.setTo(this.select.current.x, this.select.current.y);
                graphics.lineStyle(1, 0x80ff00, 1);
                graphics.drawRect(this.select.origin.x, this.select.origin.y, 1,1); //print the press to the screen
                game.world.add(graphics);
                this.select.isActive = true;

            }
        }
    },


    getNearbySoviet: function(point) {
    
     var triggerDistance = 100;
     var closestSovietInRange = null;
     var closestDistance = Number.MAX_SAFE_INTEGER;
         game.world.getByName("soviets").forEachAlive(function(soviet) { 
         var distance = Phaser.Math.distance(soviet.x, soviet.y, point.x, point.y);
        if ( Phaser.Math.distance(soviet.x, soviet.y, point.x, point.y) <= triggerDistance) { 
             if(distance < closestDistance) {
                 closestDistance = distance;
                 closestSovietInRange = soviet;
             }
        }
      }, this);
      return closestSovietInRange;
      },

    render: function () {
        //        var americans = game.world.getByName("americans");

        //game.debug.game.debug.spriteInfo(americans.children[0], 200, 200);

        //         americans.forEach(function(child) {
        //            // game.debug.body(child, 200,  200);
        //             game.debug.spriteInfo(child, 50, 50);


        // }, this);
        // this.soviet.sprite.body.debug = true;
        // game.debug.spriteInfo(this.soviet.sprite, 32, 32);
        // game.debug.quadTree(this.quadTree);
        // game.debug.geom(this.viewCircle, '#00bff3', false);
    },


    setupUnits: function () {
        // sprite that's used with quadtree to find a circle around the target sprite
        // this.viewSprite = game.add.sprite(0, 0);

        this.viewSprite = new Phaser.Rectangle(0, 0, 10, 10);
        // for debugging view distance
        this.viewCircle = new Phaser.Circle(0, 0, 200);

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

    detectCameraMove: function () {
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

    updateGameObjects: function () {
   
        var americans = game.world.getByName("americans");
        var soviets = game.world.getByName("soviets");
        if(americans) {
             americans.forEachAlive(function(american){   
               american.update();
        }, this);
        } else {
            //create more soon or game over
        }
        if(soviets) {
            soviets.forEachAlive(function(soviet){
                soviet.update();
            }, this);
        } else {
            //create more soon or game over
        }
    },


//     addToGroup(group, )

    
    resetCoords: function(groupName) {
//         game.world.getByName(groupName).children.forEach(function(child) {
//             child.x = child.x + this.spawnPoint.x; //reset relative to top left corner
//             child.y = child.y + this.spawnPoint.y; //reset relative to top left corner
//             child.body.x = child.x;
//             child.body.y = child.y;
//          //   console.log(child.x);
//          //   console.log(child.body.x);
//         }, this);

    },

    addToGroup: function (group, num, x,y,numCols) {    
        num = num || 10;
        var width = 30;
        var height = 30;
        for (var i = 0; i < num; i++) {
            var col = i * width % (numCols * width);
            var row = height * Math.floor(i / numCols);
            var soldier = group.create(col  + x, row + y); //uses constructor specified in group.classType
            this.quadTree.insert(soldier.body);
            soldier.name = soldier.key;
        }
    },


    createMap: function () {
        this.map = game.add.tilemap('map');

        this.map.addTilesetImage('tiled_collision');
        this.map.addTilesetImage('wood_tileset');
        this.map.addTilesetImage('trees_plants_rocks');
        this.map.addTilesetImage('town');
        this.map.addTilesetImage('Castle');
        this.map.addTilesetImage('mountain_landscape');

        this.collisionLayer = this.map.createLayer('collision');

        this.collisionLayer.resizeWorld();

        this.map.setCollisionByIndex(1289, true, 0);
        this.map.setCollisionByIndex(1291, false, 0);

        game.physics.p2.convertTilemap(this.map, this.collisionLayer);
        // this.game.physics.arcade.enable(this.collisionLayer, Phaser.Physics.ARCADE, true);

        this.baselayer = this.map.createLayer('base');
        this.rocklayer = this.map.createLayer('rock');
        this.castlelayer = this.map.createLayer('castle');
        this.extralayer = this.map.createLayer('extra');



        game.pathfinder = new Pathfinder(this.collisionLayer.layer.data, 32, 32, [1291, 0]);
        this.collisionGrid = new PF.Grid([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]);


        this.baselayer.resizeWorld();
        //this.collisionLayer = game.physics.p2.convertCollisionObjects(this.map, "collision");
        this.quadTree = new Phaser.QuadTree(0, 0, game.width, game.height, 5, 4, 0);
        var offset = 100;
        this.spawnPoint = new Phaser.Point(game.world.centerX - offset, game.world.centerY - offset);
    },


    createGameObjects: function () {

        var americanGroup = new Phaser.Group(game, game.world, "americans", false);
        americanGroup.classType = American; //sets the type of object to create when group.create is called
        game.world.add(americanGroup);
        var sovietGroup = new Phaser.Group(game, game.world, "soviets", false);
        sovietGroup.classType = Soviet;
        game.world.add(sovietGroup);
        americanGroup = this.addToGroup(americanGroup,10,1000,1000,5);
        sovietGroup = this.addToGroup(sovietGroup, 10, 1250,1250,3);
        this.currentPlayer = game.world.getByName("americans").children[0]; //testing
    },

    //@param - Phaser.Group - each member of the group must have a physics body
    updateSelectedGroup: function(group) {
        if(game.input.mousePointer.leftButton.isDown) {
            group.forEach(function(member) {
            var wasSelectedPreviously = member.selected;
            var nowSelected =  member.isSelected(this.select.rect.getLocalBounds());
 
            if(wasSelectedPreviously && nowSelected) {//then no need to set body ring again
                return;
            }else if(wasSelectedPreviously && !(nowSelected)) {//then we need to remove the body ring
                member.removeBodyRing();
            } else if(!(wasSelectedPreviously) && nowSelected) {//then we need to add body ring
                member.setBodyRing();
            }
        },this);

        }
        //console.log("left button down");
    },

    onLeftButtonUp: function(pointer, mouseEvent) {


        this.updateSelectedGroup(game.world.getByName("americans"));
        console.log(" in left button up");


        this.select.isActive = false;
        this.select.origin.setTo(0, 0);
        this.select.current.setTo(0, 0);
        this.select.topLeft.setTo(0, 0);
        this.select.width = 0;
        this.select.height = 0;
        //console.log("on left button up");

        this.select.rect.clear();
    },
    onRightButtonUp: function (pointer, mouseEvent) {
        // console.log("on right button up");
        // console.log(pointer);
        // console.log(mouseEvent);
    },

    onRightButtonDown: function (pointer, mouseEvent) {
        
        this.americansGroupd.forEach(function (soldier) {
            if (soldier.selected) {
                soldier.cancelMovement();
                soldier.moveTo(pointer.event.x + game.camera.x, pointer.event.y + game.camera.y);
            }
        });
        // console.log("on right button down");
        // console.log(pointer);
        // console.log(mouseEvent);
    },


};
