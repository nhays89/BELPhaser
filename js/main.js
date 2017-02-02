// var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
//     preload: preload,
//     create: create,
//     update: update
// });
//
// function preload() {
//     game.load.image('map', 'assets/(2)Switchback.jpg');
//     game.load.spritesheet('usa-walk-e',
//         'assets/soldiers/american/T-INFANTRY C-USA A-WALK D-E.png', 160, 160);
// };
//
//
// var someGroup;
// function create() {
//
//     game.physics.startSystem(Phaser.Physics.ARCADE);
//     someGroup = game.add.group();
//     someGroup.enableBody = true;
//
//     var ground =
//
//
//
//
//     game.add.image(0, 0, 'map');
//     var soldier = this.game.add.sprite(300, 200, 'usa-walk-e');
//     var walk = soldier.animations.add('walk', [], 16, true);
//
//     soldier.animations.play('walk');
// };
//
// function update() {
//
// };
//
//


var game = new Phaser.Game(800, 400, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, player;

BasicGame.Boot.prototype =
    {
        preload: function () {
            game.load.image('cube', 'assets/cube.png');

            game.time.advancedTiming = true;

            // Add and enable the plug-in.
            game.plugins.add(new Phaser.Plugin.Isometric(game));

            // Start the IsoArcade physics system.
            game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

            // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
            // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
            game.iso.anchor.setTo(0.5, 0.2);


        },
        create: function () {
            // Create a group for our tiles, so we can use Group.sort
            isoGroup = game.add.group();

            // Set the global gravity for IsoArcade.
            game.physics.isoArcade.gravity.setTo(0, 0, -500);

            // Let's make a load of cubes on a grid, but do it back-to-front so they get added out of order.
            var cube;
            for (var xx = 256; xx > 0; xx -= 80) {
                for (var yy = 256; yy > 0; yy -= 80) {
                    // Create a cube using the new game.add.isoSprite factory method at the specified position.
                    // The last parameter is the group you want to add it to (just like game.add.sprite)
                    cube = game.add.isoSprite(xx, yy, 0, 'cube', 0, isoGroup);
                    cube.anchor.set(0.5);

                    // Enable the physics body on this cube.
                    game.physics.isoArcade.enable(cube);

                    // Collide with the world bounds so it doesn't go falling forever or fly off the screen!
                    cube.body.collideWorldBounds = true;

                    // Add a full bounce on the x and y axes, and a bit on the z axis.
                    cube.body.bounce.set(1, 1, 0.2);

                    // Add some X and Y drag to make cubes slow down after being pushed.
                    cube.body.drag.set(100, 100, 0);
                }
            }

            // Create another cube as our 'player', and set it up just like the cubes above.
            player = game.add.isoSprite(128, 128, 0, 'cube', 0, isoGroup);
            player.tint = 0x86bfda;
            player.anchor.set(0.5);
            game.physics.isoArcade.enable(player);
            player.body.collideWorldBounds = true;

            // Set up our controls.
            this.cursors = game.input.keyboard.createCursorKeys();

            this.game.input.keyboard.addKeyCapture([
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.SPACEBAR
            ]);

            var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

            space.onDown.add(function () {
                player.body.velocity.z = 300;
            }, this);
        },
        update: function () {
            // Move the player at this speed.
            var speed = 100;

            if (this.cursors.up.isDown) {
                player.body.velocity.y = -speed;
            }
            else if (this.cursors.down.isDown) {
                player.body.velocity.y = speed;
            }
            else {
                player.body.velocity.y = 0;
            }

            if (this.cursors.left.isDown) {
                player.body.velocity.x = -speed;
            }
            else if (this.cursors.right.isDown) {
                player.body.velocity.x = speed;
            }
            else {
                player.body.velocity.x = 0;
            }

            // Our collision and sorting code again.
            game.physics.isoArcade.collide(isoGroup);
            game.iso.topologicalSort(isoGroup);
        },
        render: function () {
            game.debug.text("Move with cursors, jump with space!", 2, 36, "#ffffff");
            game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
        }
    };

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');