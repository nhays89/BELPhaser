var loadState = {

    preload: function () {
        var loadingLabel = game.add.text(200, 200, 'Loading...',
            {font: '30px Courier', fill: '#000000'});

        //map files
        game.load.image('town', 'assets/map/town.png');
        game.load.image('Castle', 'assets/map/Castle.png');
        game.load.image('mountain_landscape', 'assets/map/mountain_landscape.png');
        game.load.image('wood_tileset', 'assets/map/wood_tileset.png');
        game.load.image('trees_plants_rocks', 'assets/map/trees_plants_rocks.png');
        game.load.image('tiled_collision', 'assets/map/tiled_collision.png');

        game.load.tilemap('map', './assets/map/bel-map.json', null, Phaser.Tilemap.TILED_JSON);

        //atlas spritesheet
        game.load.atlas('soviet', './assets/soldiers/soviet/soviet-soldier.png', './assets/soldiers/soviet/soviet-soldier.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        game.load.atlas('american', './assets/soldiers/american/american-soldier.png', './assets/soldiers/american/american-soldier.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

        //load needed physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        //game.physics.startSystem(Phaser.Physics.ARCADE);

        //load ui
        game.load.image('minimap_frame', 'assets/ui/minimap_silver.png');
        game.load.image('info_panel', 'assets/ui/info_panel_silver.png');
        game.load.image('pause_menu', 'assets/ui/pause_menu_silver.png');
        game.load.spritesheet('button', 'assets/ui/button_silver.png');
        game.load.image('minimap_image', 'assets/map/bel-map.png');

    },
    create: function () {
        game.state.start('menu');
    }
};