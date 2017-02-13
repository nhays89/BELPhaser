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


var game = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'test', null, true, false);

var BasicGame = function (game) {
};

BasicGame.Boot = function (game) {
};

var isoGroup, player, map, layer, groundGroup, collisionGroup,
    obstacleGroup, automapGroup, objectGroup, cursors;

BasicGame.Boot.prototype =
    {
        preload: function () {

            game.time.advancedTiming = true;

            // Set world size
            game.world.setBounds(0, 0, 1920, 1080);

            game.load.tilemap('tilemap', 'assets/grassland_test.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.tilemap('mountains', 'assets/mountains.json', null, Phaser.Tilemap.TILED_JSON);

            game.load.spritesheet('mountain_landscape', 'assets/mountain_landscape.png', 32, 32, 16);
            game.load.spritesheet('wood_tileset', 'assets/wood_tileset.png', 32, 32, 16);

            game.load.image('minimap_frame', 'assets/ui/minimap.png');
            game.load.image('minimap_image', 'assets/map/mountains.png');

            game.load.spritesheet('collision', 'assets/tiled_collision.png', 64, 32, 15);
            game.load.spritesheet('grassland', 'assets/grassland.png', 64, 128, 128);
            game.load.spritesheet('water', 'assets/grassland_water.png', 64, 64, 64);
            game.load.spritesheet('tall structures', 'assets/grassland_structures.png', 64, 256, 32);
            game.load.spritesheet('trees', 'assets/grassland_trees.png', 128, 256, 16);
            game.load.spritesheet('set_rules', 'assets/set_rules.png', 64, 32, 8);
            game.load.spritesheet('tiled_grassland_2x2', 'assets/tiled_grassland_2x2.png', 128, 64, 32);
            game.load.spritesheet('rottentower', 'assets/rottentower.png', 358, 358, 1);

        },
        create : function () {
            var groups = [];

            //var map = game.add.tilemap('tilemap');
            var map = game.add.tilemap('mountains');


            map.addTilesetImage('mountain_landscape', 'mountain_landscape');
            map.addTilesetImage('wood_tileset', 'wood_tileset');
            var grassLayer = map.createLayer('grass');
            var obstacleLayer = map.createLayer('obstacles');
            grassLayer.resizeWorld();
            obstacleLayer.resizeWorld();

            var minimap = game.add.sprite(-2, game.canvas.height - 270, 'minimap_frame');
            minimap.fixedToCamera = true;

            var minimapImg = game.add.sprite(15, game.canvas.height - 255, 'minimap_image');
            minimapImg.fixedToCamera = true;
            minimapImg.scale.setTo(0.025, 0.025);

            cursors = game.input.keyboard.createCursorKeys();


            // map.addTilesetImage('water', 'water');
            //layer = map.createLayer('ground');
            // layer.resizeWorld();

            // var tilesetNum;
            // var tileset;
            // var tileIndex;
            // var tile;
            //
            // for (var i = 0; i < map.layers.length; i++) {
            //     groups[map.layers[i].name] = game.add.group();
            //
            //     if (map.layers[i].name == 'collision') continue;
            //
            //     for (var x = 0; x < map.layers[i].width; x++) {
            //         for (var y = 0; y < map.layers[i].height; y++) {
            //             tileIndex = map.layers[i].data[x][y].index;
            //             if (tileIndex < 0) continue;
            //
            //             tilesetNum = map.tiles[tileIndex][2];
            //             tileset = map.tilesets[tilesetNum];
            //
            //             tile = game.add.isoSprite(x * 32, y * 32, 0, tileset.name,
            //                 tileIndex - tileset.firstgid, groups[map.layers[i].name]);
            //             tile.anchor.set(0.5);
            //         }
            //     }
            // }
        },
        update : function () {

            if (cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                game.camera.y -= 12;
            }
            else if (cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                game.camera.y += 12;
            }

            if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                game.camera.x -= 12;
            }
            else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                game.camera.x += 12;
            }
        },
        render : function () {
            // game.debug.text("Move with cursors, jump with space!", 2, 36, "#ffffff");
            // game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
        }
    };


game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');