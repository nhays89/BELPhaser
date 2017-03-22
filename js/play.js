WebFontConfig = {
    google: {
        families: ['Roboto']
    }
};

var text = null;
/**
    Main state to execute animation loop.
*/


var playState = {
    preload: function() {
        //  Load the Google WebFont Loader script
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    },

    /**
        Create all necessary game objects.
    */
    create: function() {
        this.createAudio();
        this.createMap();
        this.createGameObjects();
        this.setupUI();
        this.setupInput();
        this.setupPauseMenu();
        this.createGameTimer();
    },

    /**
        Called every animation frame by Phaser.
    */
    update: function() {
        this.detectCameraMove();
        this.updateSelectionRect();
        this.updateSelectedGroup(game.world.getByName("americans"));
        this.updateGameObjects();
    },

    /**
        Loads the sound files into the game. 
    */
    createAudio: function() {
        this.audioClips = {};
        this.audioClips['american-gun-shot'] = game.add.audio('american-gun-shot');
        this.audioClips['american-gun-shot'].volume = .3;
        this.audioClips['american-march'] = game.add.audio("american-march");
        this.audioClips['american-march'].volume = .1;
        this.audioClips['soviet-gun-shot'] = game.add.audio("soviet-gun-shot");
        this.audioClips['soviet-gun-shot'].volume = .3;
        this.audioClips.intro = game.add.audio("intro");
        this.audioClips.bombs = game.add.audio("bombs");
        this.audioClips['soviet-dying'] = game.add.audio('soviet-dying');
        this.audioClips['soviet-dying'].volume = .2;
        this.audioClips['american-dying'] = game.add.audio('american-dying');
        this.audioClips['american-dying'].volume = 1;
        this.audioClips['intro-dramatic-effect'] = game.add.audio('intro-dramatic-effect');
        this.audioClips.moveBeep = game.add.audio("move-beep");
        this.audioClips.killBeep = game.add.audio('kill-beep');
        this.audioClips.roger = game.add.audio('roger');
        this.audioClips['intro-dramatic-effect'].onDecoded.add(function() {
            this.audioClips['intro-dramatic-effect'].play();
            this.audioClips['intro-dramatic-effect'].onStop.add(function() {
                this.audioClips.bombs.play(undefined, 0, 1, true);
            }, this);
        }, this);
        this.audioClips.intro.onDecoded.add(function() {
            this.audioClips.intro.play();
        }, this);

    },

    /**
        Creates the minimap, selection, time. 

    */
    setupUI: function() {
        var cameraViewPort = game.camera.view;

        this.minimap = game.add.sprite(-16, game.canvas.height + 14, 'minimap_frame');
        this.minimap.scale.setTo(2, 2);
        this.minimap.y = this.minimap.y - this.minimap.height;
        this.minimap.fixedToCamera = true;

        this.select = { //stores data about mouse events for the rectangle selection
            "origin": new Phaser.Point(), //origin of mouse click
            "current": new Phaser.Point(), //current mouse position
            "topLeft": new Phaser.Point(), //top left mouse position
            "width": 0, //rectangle width
            "height": 0, //rectangle height
            "isActive": false, //determines if a previous point was stored
            "rect": new Phaser.Graphics(game, 0, 0)
        };

        this.minimapImg = game.add.sprite(this.minimap.x + 26, this.minimap.y + 26, 'minimap_image');
        this.minimapImg.fixedToCamera = true;
        // 166 and 132 are the number of pixels (width / height) of the minimap frame
        // multiplied by the scale of the minimap frame
        this.minimapImg.scale.setTo(168 * (this.minimap.scale.x + .12) / this.minimapImg.width,
            132 * (this.minimap.scale.y + .17) / this.minimapImg.height);

        this.info_panel = game.add.sprite(game.canvas.width / 2, 0, 'info_panel');
        this.info_panel.scale.setTo(2, 2);
        this.info_panel.x = this.info_panel.x - this.info_panel.width / 2;
        this.info_panel.fixedToCamera = true;

        var text_style = {
            font: 'bold 18px Roboto',
            fill: '#000000',
            align: 'center',
            strokeThickness: 1
        };

        this.totalTimeLabel = game.add.text(this.info_panel.x + 20, this.info_panel.y + 30,
            'ELAPSED: ', text_style);
        this.totalTimeLabel.fixedToCamera = true;

        this.levelTimeLabel = game.add.text(this.info_panel.x + 220,
            this.info_panel.y + 30, 'REMAINING: ', text_style);
        this.levelTimeLabel.fixedToCamera = true;

        this.levelLabel = game.add.text(this.info_panel.x + 470,
            this.info_panel.y + 30, 'LEVEL: ', text_style);
        this.levelLabel.fixedToCamera = true;

        this.minimap_loc_sprite = game.add.sprite(this.minimapImg.x, this.minimapImg.y);
        this.minimap_loc = game.add.graphics(0, 0);

        this.minimap_loc_sprite.addChild(this.minimap_loc);
        this.minimap_loc_sprite.fixedToCamera = true;

        this.minimap_loc.lineStyle(1, 0xd9d9d9, 1);
        this.minimap_loc.drawRect(game.camera.position.x * this.minimapImg.scale.x,
            game.camera.position.y * this.minimapImg.scale.y,
            game.camera.width * this.minimapImg.scale.x,
            game.camera.height * this.minimapImg.scale.y);

        var pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        pKey.onDown.add(this.pauseGame, this);
    },

    /**
        Executes on game end.
    */

    showGameOver: function() {
        var text_style = {
            font: 'bold 18px Roboto',
            fill: '#000000',
            align: 'center',
            strokeThickness: 1
        };

        this.game_over_dialog = game.add.sprite(game.camera.x + (game.camera.width / 2),
            game.camera.y + (game.camera.height / 2), 'menu');
        this.game_over_dialog.scale.setTo(1.8, 1.8);
        this.game_over_dialog.anchor.setTo(0.5, 0.5);

        this.restart_button = game.add.button(0, 0, 'button');
        this.restart_button.x = -(this.restart_button.width / 2);
        this.restart_button.y = (this.restart_button.height / 2);

        var minutes = Math.floor(this.elapsedTimer.seconds / 60);
        var seconds = Math.floor(this.elapsedTimer.seconds % 60);

        this.game_over_text = game.add.text(this.game_over_dialog.x, this.game_over_dialog.y,
            'Game Over: \n You lasted ' + minutes + ' minutes and ' + seconds + ' seconds.', text_style);
        this.restart_game_button_text = game.add.text(0, 0, 'RESTART', text_style);
        this.restart_game_button_text.x = this.restart_button.x + this.game_over_dialog.x + 15;
        this.restart_game_button_text.y = this.restart_button.y + this.game_over_dialog.y + 37;

        this.game_over_dialog.addChild(this.restart_button);

        this.game_over_text.x = (this.game_over_dialog.x - this.game_over_dialog.width / 3) + 30;
        this.game_over_text.y = (this.game_over_dialog.y - this.game_over_dialog.height / 3);

        game.input.mouse.mouseDownCallback = this.menuHandler;
        game.paused = true;
    },

    /**
        Starts the game clock.
    */
    createGameTimer: function() {
        this.elapsedTimer = game.time.create(false);
        this.elapsedTimer.start();

        game.time.events.loop(1000, function() { //fires every second until the game is over
            this.updateGameTimer();
        }, this);
    },

    /**
        Set up for input handlers.
    */
    setupInput: function() {

        // prevent browser default context menu from appearing
        game.canvas.oncontextmenu = function(e) {
            e.preventDefault();
        };

        //setup input handling
        game.input.mousePointer.leftButton.onUp.add(this.onLeftButtonUp, this);
        game.input.mousePointer.rightButton.onDown.add(this.onRightButtonDown, this);
        game.input.mousePointer.rightButton.onUp.add(this.onRightButtonUp, this);
    },

    /**
        Updates the soldier selection area.
    */
    updateSelectionRect: function() {
        var mousePointer = game.input.mousePointer;

        if (mousePointer.leftButton.isDown) {
            this.select.current.setTo(mousePointer.position.x + game.camera.x, mousePointer.position.y + game.camera.y);

            if (this.select.isActive) { //if we have a point stored from a recent down event

                if (this.select.origin.x === this.select.current.x && this.select.origin.y === this.select.current.y) {
                    return;
                }

                if (this.select.origin.x < this.select.current.x &&
                    this.select.current.y < this.select.origin.y) { //its to the right and above

                    this.select.topLeft.setTo(this.select.origin.x, this.select.current.y);

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
                graphics.drawRect(this.select.origin.x, this.select.origin.y, 1, 1); //print the press to the screen
                game.world.add(graphics);
                this.select.isActive = true;
            }
        }
    },

    /**
        Function to get soviets adjacent to a mouse click in the game world.
    */
    getNearbySoviet: function(point) {

        var triggerDistance = 100;
        var closestSovietInRange = null;
        var closestDistance = Number.MAX_SAFE_INTEGER;
        var soviets = game.world.getByName("soviets");
        if (soviets) {
            soviets.forEachAlive(function(soviet) {
                var distance = Phaser.Math.distance(soviet.x, soviet.y, point.x, point.y);
                if (Phaser.Math.distance(soviet.x, soviet.y, point.x, point.y) <= triggerDistance) {
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestSovietInRange = soviet;
                    }
                }
            }, this);
        }
        return closestSovietInRange;
    },

    render: function() {},

    /**
        Pauses the game.
    */
    pauseGame: function() {
        if (game.paused) {
            game.paused = false;
            this.pause_group.visible = false;
            this.elapsedTimer.resume();
        } else {
            game.paused = true;
            this.pause_group.visible = true;
            this.pause_group.x = game.camera.x + (game.camera.width / 2);
            this.pause_group.y = game.camera.y + (game.camera.height / 2);
            this.elapsedTimer.pause();
        }
    },

    /**
        Setup the pause menu.
    */
    setupPauseMenu: function() {
        this.pause_group = game.add.group();
        this.pause_group.visible = false;
        this.pause_menu = game.add.sprite(0, 0, 'menu');
        this.pause_menu.scale.setTo(1.8, 1.8);
        this.pause_menu.anchor.setTo(0.5, 0.5);

        this.unpause_button = game.add.button(0, 0, 'button');
        this.restart_button = game.add.button(0, 0, 'button');

        this.pause_menu.addChild(this.unpause_button);
        this.pause_menu.addChild(this.restart_button);

        this.unpause_button.x = -(this.unpause_button.width / 2);
        this.unpause_button.y = -(this.unpause_button.height * 1.5);

        this.restart_button.x = -(this.restart_button.width / 2);

        var text_style = {
            font: 'bold 18px Roboto',
            fill: '#000000',
            align: 'center',
            strokeThickness: 1
        };
        this.unpause_text = game.add.text(this.unpause_button.x + 12,
            this.unpause_button.y - 22,
            'CONTINUE', text_style);

        this.restart_text = game.add.text(this.restart_button.x - 10,
            this.restart_button.y + 22,
            'RESTART GAME', text_style);
        this.pause_group.add(this.pause_menu);
        this.pause_group.add(this.unpause_text);
        this.pause_group.add(this.restart_text);

        game.input.mouse.mouseDownCallback = this.menuHandler;
    },

    /**
        Handles menu state.
    */
    menuHandler: function(event) {

        if (game.paused) {
            var unpause_bounds = playState.unpause_button.getBounds();
            var restart_bounds = playState.restart_button.getBounds();

            if (Phaser.Rectangle.contains(unpause_bounds, event.x, event.y)) {
                playState.pauseGame();
            } else if (Phaser.Rectangle.contains(restart_bounds, event.x, event.y)) {
                game.paused = false;
                game.state.start(game.state.current);
            }
        }
    },

    /**
        Updates the camera and minimap within the game world.
    */
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

    /**
        Primarily serves to spawn soldiers, and coordinate timing of game based events. 
        Called every second from the start of the game.
    */
    updateGameTimer: function() {

        //after levelInterval seconds increase the level
        if (Math.floor(this.elapsedTimer.seconds) % this.levelInterval === 0) {
            this.level++;
            this.levelLabel.text = 'LEVEL: ' + this.level;
        }
        if (this.numOfAmericans <= 0) {
            this.showGameOver();
        }


        this.clockTicks++;
        var levelTime = Math.floor(this.elapsedTimer.seconds) % this.levelInterval;
        var elapsedMinutes = Math.floor(this.elapsedTimer.seconds / 60);
        var elapsedSeconds = Math.floor(this.elapsedTimer.seconds % 60);
        var levelMinutes = Math.floor((this.levelInterval - levelTime) / 60);
        var levelSeconds = Math.floor((this.levelInterval - levelTime) % 60);

        this.totalTimeLabel.text = 'ELAPSED: ' + elapsedMinutes +
            ((elapsedSeconds > 9) ? ':' + elapsedSeconds : ':0' + elapsedSeconds);
        this.levelTimeLabel.text = 'REMAINING: ' + levelMinutes +
            ((levelSeconds > 9) ? ':' + levelSeconds : ':0' + levelSeconds);

        //every 'spawnInterval' seconds create a soviet
        if (this.clockTicks % this.spawnInterval === 0) { //can be adjusted depending on when we want soldiers to arrive'
            this.audioClips.bombs.play();
            //spawn this event
            var sovietEvent = game.time.events.add(1000, function() {

                var soviets = game.world.getByName("soviets");
                var coord = playState.getSovietSpawnPoint();

                playState.addToGroup(soviets, 1, coord.x, coord.y);
            }, this);

            //execute this event above 'spawnSovietCount' times
            //...each level increase will increase the number of spawned soldiers at each spawn interval
            sovietEvent.repeatCount = this.spawnSovietCount * this.level;

            var americanEvent = game.time.events.add(1000, function() {
                var americans = game.world.getByName('americans');
                playState.addToGroup(americans, 1, this.americanSpawnPoint.x, this.americanSpawnPoint.y);
            }, this);

        }
    },


    /** 
        Main game loop.
    */
    updateGameObjects: function() {

        var americans = game.world.getByName("americans");
        var soviets = game.world.getByName("soviets");

        if (americans) {
            americans.forEachAlive(function(american) {
                american.update();
            }, this);
        } else {
            //create more soon or game over
        }
        if (soviets) {
            soviets.forEachAlive(function(soviet) {
                // console.log(soviet.alive);
                soviet.update();
            }, this);
        } else {
            //create more soon or game over
        }
        game.input.mousePointer.rightButton.reset(); //resets to right button up after every update
    },

    /**
        Adds soldiers to a Phaser.Group.
        @param group - a Phaser.Group object.
        @param num - number of soldiers to add to the group.
        @param x - the x coordinate of the group.
        @param y = the y coordinate of the group.
        @param numCols - the number of columns to arrange the soldiers.
    */
    addToGroup: function(group, num, x, y, numCols) {
        var soldier;
        num = num || 1;
        numCols = numCols || 1;
        x = x || 16;
        y = y || 16;
        var width = 30;
        var height = 30;
        for (var i = 0; i < num; i++) {
            var col = i * width % (numCols * width);
            var row = height * Math.floor(i / numCols);
            soldier = group.create(col + x, row + y); //uses constructor specified in group.classType

            this.quadTree.insert(soldier.body);
            soldier.name = soldier.key;

            if (soldier instanceof American) {
                this.numOfAmericans++;
            } else {
                this.numOfSoviets++;
            }
        }
    },

    /**
        Creates the background from a tilemap. Collision detection on P2 polygons,
        and pathfinder object are also setup here.  
    */
    createMap: function() {
        this.map = game.add.tilemap('map');

        this.map.addTilesetImage('tiled_collision');
        this.map.addTilesetImage('wood_tileset');
        this.map.addTilesetImage('trees_plants_rocks');
        this.map.addTilesetImage('town');
        this.map.addTilesetImage('Castle');
        this.map.addTilesetImage('mountain_landscape');

        this.collisionLayer = this.map.createLayer('collision');

        this.baseLayer = this.map.createLayer('base');
        this.castlFloorLayer = this.map.createLayer('castle_floor');
        this.castleWallLayer = this.map.createLayer('castle_wall');
        this.castleLayer = this.map.createLayer('castle');
        this.rockLayer = this.map.createLayer('rock-foilage');
        this.rock2Layer = this.map.createLayer('rock2');

        game.pathfinder = new Pathfinder(this.collisionLayer.layer.data, 32, 32, [1291, 0]);

        this.baseLayer.resizeWorld();
        this.collision2Layer = game.physics.p2.convertCollisionObjects(this.map, "poly_collision");
        this.quadTree = new Phaser.QuadTree(0, 0, game.width, game.height, 5, 4, 0);
        var offset = 100;
        this.spawnPoint = new Phaser.Point(game.world.centerX - offset, game.world.centerY - offset);

        game.camera.x = game.world.centerX - (game.camera.width / 2);
        game.camera.y = game.world.centerY - (game.camera.height / 2);
    },

    /**
        Creates soldiers and game related entities. 
    */
    createGameObjects: function() {

        this.clockTicks = 0;
        this.spawnInterval = 60; //every so many seconds spawn soldiers
        this.spawnSovietCount = 6; //this number + 1 is how many soldiers will spawn at each spawn interval

        this.level = 0;
        this.levelInterval = 60;

        this.numOfSoviets = 0;
        this.numOfAmericans = 0;

        this.americanSpawnPoint = new Phaser.Point(game.world.centerX - 100, game.world.centerY);

        this.cursors = game.input.keyboard.createCursorKeys();

        this.viewSprite = new Phaser.Rectangle(0, 0, 10, 10);
        this.viewCircle = new Phaser.Circle(0, 0, 200);

        var americanGroup = new Phaser.Group(game, game.world, "americans", false);
        americanGroup.classType = American; //sets the type of object to create when group.create is called
        game.world.add(americanGroup);


        var sovietGroup = new Phaser.Group(game, game.world, "soviets", false);
        sovietGroup.classType = Soviet;
        game.world.add(sovietGroup);
        this.createSpawnPoints();
        var scout = this.getSovietSpawnPoint();

        this.addToGroup(americanGroup, 6, this.americanSpawnPoint.x, this.americanSpawnPoint.y, 3);
        this.addToGroup(sovietGroup, 1, 800, 800, 1);

    },
    /**
        Random spawn points for Soviets.
    */
    createSpawnPoints: function() {
        this.sovietSpawnPoints = [
            new Phaser.Rectangle(48, 48, 40, 40),
            new Phaser.Rectangle(3184, 2608, 40, 40),
            new Phaser.Rectangle(1456, 3184, 40, 40),
            new Phaser.Rectangle(48, 2608, 40, 40),
            new Phaser.Rectangle(48, 624, 40, 40),
            new Phaser.Rectangle(3152, 48, 40, 40),
            new Phaser.Rectangle(2896, 48, 40, 40),
            new Phaser.Rectangle(3152, 1584, 40, 40),
            new Phaser.Rectangle(656, 3184, 40, 40)
        ];
    },

    /**
        @ Fisher-Yates shuffle algo
        @param array - the array to shuffle
    */
    shuffle: function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    /** 
        Gets a random spawn point not in camera bounds. 
    */
    getSovietSpawnPoint: function() {
        this.sovietSpawnPoints = this.shuffle(this.sovietSpawnPoints);
        for (var i = 0; i < this.sovietSpawnPoints.length; i++) {
            if (!Phaser.Rectangle.intersects(this.sovietSpawnPoints[i], game.camera.view)) {
                return this.sovietSpawnPoints[i];
            }
        }
        //default spawn if none found - very rare unless user has 3200 * 3200 resolution
        return new Phaser.Rectangle(3152, 48, 40, 40);
    },

    /**
        Updates the group members selected property.
        @param - Phaser.Group - each member of the group must have a physics body
    */
    updateSelectedGroup: function(group) {

        if (group) {

            if (game.input.mousePointer.leftButton.isDown) {
                this.numSelected = 0;
                group.forEach(function(member) {
                    if (member.alive) {

                        var wasSelectedPreviously = member.selected;
                        var nowSelected = member.isSelected(this.select.rect.getLocalBounds());
                        if (nowSelected) this.numSelected++;
                        if (wasSelectedPreviously && nowSelected) { //then no need to set body ring again
                            return;
                        } else if (wasSelectedPreviously && !(nowSelected)) { //then we need to remove the body ring
                            member.removeBodyRing();
                        } else if (!(wasSelectedPreviously) && nowSelected) { //then we need to add body ring
                            member.setBodyRing();
                        }
                    }
                }, this);
            }
        }
    },

    /**
        Handles left button release.
    */
    onLeftButtonUp: function(pointer, mouseEvent) {

        this.updateSelectedGroup(game.world.getByName("americans"));

        this.select.isActive = false;
        this.select.origin.setTo(0, 0);
        this.select.current.setTo(0, 0);
        this.select.topLeft.setTo(0, 0); //top left of selection rect
        this.select.width = 0; //width of rect
        this.select.height = 0; //height of rect

        this.select.rect.clear();
    },

    /**
        Handles right button release.
    */
    onRightButtonUp: function(pointer) {
        //TO DO
    },
    /**
        Handles right button press.
    */
    onRightButtonDown: function(pointer) {
        // TO DO
    },
};
