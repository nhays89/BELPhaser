var loadState = {

    preload: function () {
        var loadingLabel = game.add.text(80, 150, 'loading...',
            { font: '30px Courier', fill: '#ffffff' });

        game.physics.startSystem(Phaser.Physics.P2JS);

        game.load.tilemap('mountains', 'assets/mountains.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.spritesheet('mountain_landscape', 'assets/mountain_landscape.png', 32, 32, 16);
        game.load.spritesheet('wood_tileset', 'assets/wood_tileset.png', 32, 32, 16);
        game.load.image('minimap_frame', 'assets/ui/minimap.png');
        game.load.image('action_menu', 'assets/ui/action_menu.png');
        game.load.image('info_panel', 'assets/ui/info_panel.png');
        game.load.image('pause_menu', 'assets/ui/pause_menu.png');
        game.load.image('minimap_image', 'assets/bel-map.png');

      	game.load.tilemap('map', './assets/bel-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Castle', 'assets/Castle.png');

        game.load.image('town', 'assets/town.png');
        game.load.image('trees_plants_rocks', 'assets/trees_plants_rocks.png');

        game.load.atlas('american', './assets/soldiers/american/american.png'
            ,'./assets/soldiers/american/american.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
       game.load.atlas('red', './assets/soldiers/red/soldier-red.png'
           ,'./assets/soldiers/red/soldier-red.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

    },
    create: function () {
        game.state.start('menu');
    }
};
