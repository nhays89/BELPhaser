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
        this.map = game.add.tilemap('map');

        this.map.addTilesetImage('wood_tileset');
        this.map.addTilesetImage('trees_plants_rocks');
        this.map.addTilesetImage('town');
        this.map.addTilesetImage('Castle');
        this.map.addTilesetImage('mountain_landscape');
        this.map.addTilesetImage('tiled_collision');

        this.baselayer = this.map.createLayer('base');
        this.rocklayer = this.map.createLayer('rock');
        this.castlelayer = this.map.createLayer('castle');
        this.extralayer = this.map.createLayer('extra');

        this.collisionLayer = this.map.createLayer('collision');
        this.game.physics.arcade.enable(this.collisionLayer, Phaser.Physics.ARCADE, true);
        this.collisionLayer2 = game.physics.p2.convertCollisionObjects(this.map, "collision2");


        this.setupUnits();
        this.setupUI();
        this.cursors = game.input.keyboard.createCursorKeys();

        // this.pathfinding = game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        // this.pathfinding.setGrid(this.collisionLayer.layer.data);
        // this.pathfinding.setAcceptableTiles([0, 1291]);
        // this.pathfinding.enableDiagonals();
        // this.pathfinding.enableCornerCutting();

        this.finder = new PF.AStarFinder();
        //this.collisionGrid = new PF.Grid(this.collisionLayer.layer.data);
        this.collisionGrid = new PF.Grid([
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]);

        this.pathfinder = new Pathfinder(this.collisionLayer.layer.data, 32, 32, [1291, 0]);


        // this.easystar = new EasyStar.js();
        // this.easystar.setGrid(this.collisionLayer.layer.data);
        // this.easystar.setAcceptableTiles([0, 1291]);
        // this.easystar.enableDiagonals();
        // this.easystar.enableCornerCutting();
    },

    update: function () {
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

        this.soldierGroups.forEach(function (group) {
            group.forEach(function (soldier) {
                soldier.update();

                if (soldier.alive) {
                    soldier.getNearbyEnemies();
                }
            })
        });

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            
            // 9, 4
            var path = this.pathfinder.findPath(0, 0, 9 * 32, 4 * 32);
            console.log(path);
            // this.pathfinding.findPath(0, 0, 7, 80, function (path) {
            //     if (path === null) {
            //         console.log("The path to the destination" +
            //             "point was not found.");
            //     } else {
            //
            //         for (var i = 0; i < path.length; i++) {
            //             console.log("P: " + i + ", X: " + path[i].x + ",Y: " + path[i].y);
            //         }
            //
            //     }
            // });

            // this.soviet.sprite.animations.play('soviet-die-west');
            // var found = this.getNearbyEnemies(this.soviet);
            // console.log('Num enemies: ' + this.getNearbyEnemies(this.soviet));
        }

        if (this.soviet && this.soviet.alive) {
            if (this.cursors.left.isDown) {
                if (this.currentPlayer.name === 'american') {   // debug purposes set currentPlayer to be whatever player in the console at runtime
                    this.american.body.moveLeft(100);
                    this.american.animations.play('american-west');
                } else if (this.currentPlayer.name === 'soviet') {
                    this.soviet.body.moveLeft(100);
                    this.soviet.animations.play('soviet-run-west');
                    this.soviet.direction = 'west';
                }
            } else if (this.cursors.right.isDown) { // Move to the right
                if (this.currentPlayer.name === 'american') {
                    this.american.body.moveRight(100);
                    this.american.animations.play('american-east');
                } else if (this.currentPlayer.name == "soviet") {
                    this.soviet.body.moveRight(100);
                    this.soviet.animations.play('soviet-run-east');
                    this.soviet.direction = 'east';
                }
            } else if (this.cursors.up.isDown) { //move up
                if (this.currentPlayer.name === 'american') {
                    this.american.body.moveUp(100);
                    this.american.animations.play('american-north');
                } else if (this.currentPlayer.name === 'soviet') {
                    this.soviet.body.moveUp(100);
                    this.soviet.animations.play('soviet-run-north');
                    this.soviet.direction = 'north';
                }
            } else if (this.cursors.down.isDown) { // move dowm
                if (this.currentPlayer.name === 'american') {
                    this.american.animations.play('american-south');
                    this.american.body.moveDown(100);
                } else if (this.currentPlayer.name === 'soviet') {
                    this.soviet.animations.play('soviet-run-south');
                    this.soviet.body.moveDown(100);
                    this.soviet.direction = 'south';
                }
            } else {
                if (this.currentPlayer.name === 'american') {
                    this.american.animations.play('american-south');
                } else if (this.currentPlayer.name === 'soviet') {
                    this.soviet.animations.play('soviet-stand-south');
                    this.soviet.direction = 'south';
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
    },
    render: function () {

        // this.soviet.body.debug = true;
        // game.debug.spriteInfo(this.soviet, 32, 32);
        // game.debug.quadTree(this.quadTree);
        // game.debug.geom(this.viewCircle, '#00bff3', false);
    },

    setupUnits: function () {
        // sprite that's used with quadtree to find a circle around the target sprite
        // this.viewSprite = game.add.sprite(0, 0);

        this.viewSprite = new Phaser.Rectangle(0, 0, 10, 10);
        // for debugging view distance
        this.viewCircle = new Phaser.Circle(0, 0, 200);

        this.soldierGroups = [];
        this.alliesGroup = [];
        this.soldierGroups.push(this.alliesGroup);

        this.sovietsGroup = [];
        this.soldierGroups.push(this.sovietsGroup);

        this.quadTree = new Phaser.QuadTree(0, 0, game.width, game.height, 5, 4, 0);

        this.soviet = new Soviet(game, 275, 275);
        this.sovietsGroup.push(this.soviet);

        for (var i = 0; i < 2; i++) {

            var x = game.world.randomX;
            var y = game.world.randomY;

            this.american = new American(game, x, y);
            this.alliesGroup.push(this.american);
            this.quadTree.insert(this.american);
        }

        this.american = new American(game, 150, 150);
        this.alliesGroup.push(this.american);
        this.quadTree.insert(this.american);

        this.quadTree.insert(this.soviet);

        this.currentPlayer = this.soviet; //debug purposes
        this.currentPlayer.name = "soviet";
    },
    pauseGame: function () {
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
    }
};

