var loadState = {

    preload: function () {
        var loadingLabel = game.add.text(80, 150, 'loading...',
            { font: '30px Courier', fill: '#ffffff' });
            
      	game.load.tilemap('map', './assets/map/bel-map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Castle', 'assets/map/Castle.png');     
        game.load.atlas('red', './assets/soldiers/red/red-soldier.png','./assets/soldiers/red/red-soldier.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        game.load.atlas('green', './assets/soldiers/green/green-soldier.png','./assets/soldiers/green/green-soldier.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.load.spritesheet('mountain_landscape', 'assets/mountain_landscape.png', 32, 32, 16);
        game.load.spritesheet('wood_tileset', 'assets/wood_tileset.png', 32, 32, 16);
        game.load.image('minimap_frame', 'assets/ui/minimap.png');
        game.load.image('action_menu', 'assets/ui/action_menu.png');
        game.load.image('info_panel', 'assets/ui/info_panel.png');
        game.load.image('pause_menu', 'assets/ui/pause_menu.png');
        game.load.image('town', 'assets/town.png');
        game.load.image('trees_plants_rocks', 'assets/trees_plants_rocks.png');
        game.load.image('minimap_image', 'assets/map/bel-map.png');
    },
    create: function () {
        game.state.start('menu');
    }
};
