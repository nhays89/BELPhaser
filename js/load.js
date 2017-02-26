var loadState = {

    preload: function () {
        var loadingLabel = game.add.text(80, 150, 'loading...',
            { font: '30px Courier', fill: '#ffffff' });

<<<<<<< HEAD
         //map files
         game.load.image('town', 'assets/map/town.png');
         game.load.image('Castle', 'assets/map/Castle.png');  
         game.load.image('mountain_landscape', 'assets/map/mountain_landscape.png');
         game.load.image('wood_tileset', 'assets/map/wood_tileset.png');   
         game.load.image('trees_plants_rocks', 'assets/map/trees_plants_rocks.png');

      	 game.load.tilemap('map', './assets/map/bel-map.json', null, Phaser.Tilemap.TILED_JSON);
         
         //atlas spritesheet  
         game.load.atlas('soviet', './assets/soldiers/soviet/soviet-soldier.png','./assets/soldiers/soviet/soviet-soldier.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
         game.load.atlas('american', './assets/soldiers/american/american-soldier.png','./assets/soldiers/american/american-soldier.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        
         //load needed physics
         game.physics.startSystem(Phaser.Physics.P2JS);
         game.physics.startSystem(Phaser.Physics.ARCADE);
        
         //load ui
         game.load.image('minimap_frame', 'assets/ui/minimap.png');
         game.load.image('action_menu', 'assets/ui/action_menu.png');
         game.load.image('info_panel', 'assets/ui/info_panel.png');
         game.load.image('pause_menu', 'assets/ui/pause_menu.png');
         game.load.image('minimap_image', 'assets/map/bel-map.png');
        
=======
        //map files
        game.load.image('town', 'assets/map/town.png');
        game.load.image('Castle', 'assets/map/Castle.png');
        game.load.image('mountain_landscape', 'assets/map/mountain_landscape.png');
        game.load.image('wood_tileset', 'assets/map/wood_tileset.png');
        game.load.image('trees_plants_rocks', 'assets/map/trees_plants_rocks.png');

        game.load.tilemap('map', './assets/map/bel-map.json', null, Phaser.Tilemap.TILED_JSON);

        //atlas spritesheet
        game.load.atlas('red', './assets/soldiers/red/red-soldier.png', './assets/soldiers/red/red-soldier.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
        game.load.atlas('green', './assets/soldiers/green/green-soldier.png', './assets/soldiers/green/green-soldier.json', null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);

        // gun effects
        game.load.spritesheet('bulletSplash', './assets/soldiers/bullet-splash.png', 9, 13, 4);
        game.load.spritesheet('bulletSplash2', './assets/soldiers/bullet-splash2.png', 9, 13, 8);

        //load needed physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //load ui
        game.load.image('minimap_frame', 'assets/ui/minimap.png');
        game.load.image('action_menu', 'assets/ui/action_menu.png');
        game.load.image('info_panel', 'assets/ui/info_panel.png');
        game.load.image('pause_menu', 'assets/ui/pause_menu.png');
        game.load.image('minimap_image', 'assets/map/bel-map.png');

>>>>>>> 174660a0b4b6f79fdef634cca434b1f0fe507e68
    },
    create : function () {
        game.state.start('menu');
    }
};
