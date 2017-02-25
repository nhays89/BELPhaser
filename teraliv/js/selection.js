var game;
var pos = {
    start: null,
    current: null,
    rect: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
    }
};

var group;
var selectedArray = [];
// var canvas;
var box = document.querySelector('#selection-box');
var tint = 0x2ae03b;
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'playground', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('map', './assets/dorian-map.png');
	game.load.spritesheet('infantry', './assets/infantry.png', 76, 97);
    console.log(box);
    // uncomment to prevent context menu
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
}

function create() {
    // game.stage.backgroundColor = "#4488AA";
    game.add.tileSprite(0, 0, 1524, 844, 'map');
    // game.add.sprite(300, 300, 'infantry');
    // game.physics.startSystem(Phaser.Physics.ARCADE);

    // canvas = document.querySelector('#playground');
    // console.log('left: ' + canvas.offsetLeft);
    // console.log('top: ' + canvas.offsetTop);

    group = game.add.group();
    group.enableBody = true;

    for (var i = 0; i < 8; i++) {
        createBaddie();
    }

    // console.log("Total units: " + group.children.length);

    game.input.onDown.add(mouseDragStart, this);
    game.input.addMoveCallback(mouseDragMove, this);
    game.input.onUp.add(mouseDragEnd, this);
    // game.input.onDown.add(mouseClicked, this);


}

function update() {
    setDedstinationPoint();
    controlWithMouse();
}

function render() {
    group.forEach(function(player) {
        game.debug.body(player);
        // game.debug.text('anchor', player.x, player.y, 'red', 10);
        game.debug.pixel(player.x + 20, player.y + 10, 'red', 4);
        // game.debug.pointer(game.input.activePointer);
        if (player.current) {
            // game.debug.spriteInfo(player);  // Sprite debug info
        }
    });
}


var createBaddie = function createBaddie() {
    var player = group.create(100 + Math.random() * 500, 50 + Math.random() * 500, 'infantry');
    // var player = group.create(100, 50, 'infantry');
    player.newDestination = {x: null, y: null};
    player.oldDestination = {x: null, y: null};
    player.destinationIsSet = false;
    player.selected = false;
    player.current = false;

    // baddie.scale.set(.25)
    // console.log(player.offsetX, player.offsetY);

    player.body.width  = 35;
    player.body.height = 45;

    player.body.offset.x = 20;
    player.body.offset.y = 10;

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    player.animations.add('E',  [38, 39, 40, 41, 42, 43], 10, true);
	player.animations.add('W',  [25, 24, 23, 22, 21, 20], 10, true);
	player.animations.add('N',  [8, 9, 10, 11, 12, 13],   10, true);
	player.animations.add('S',  [32, 33, 34, 35, 36, 37], 10, true);
	player.animations.add('NE', [50, 51, 52, 53, 54, 55], 10, true);
	player.animations.add('NW', [19, 18, 17, 16, 15, 14], 10, true);
	player.animations.add('SW', [26, 27, 28, 29, 30, 31], 10, true);
	player.animations.add('SE', [38, 39, 40, 41, 42, 43], 10, true);
	player.animations.add('STAND', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85], 10, true);

    return player;
}

var mouseDragStart = function mouseDragStart() {
    box.style.height = 0;
    box.style.width = 0;
    box.style.left = 0;
    box.style.top = 0;

    if (!pos.isActive) {
        pos.start = {
            x: game.input.mousePointer.position.x,
            y: game.input.mousePointer.position.y
        }
        box.classList.add('active');
        // box.style.top = canvas.offsetTop + pos.start.y;
        // box.style.left = canvas.offsetLeft + pos.start.x;
        box.style.top = pos.start.y;
        box.style.left = pos.start.x;
        pos.isActive = true;
    }
    // get mouse position
};

var mouseDragMove = function mouseDragMove(sprite, pointer, dragX, dragY, snapPoint) {
    if (pos.isActive) {
        pos.current = {
            x: game.input.mousePointer.position.x,
            y: game.input.mousePointer.position.y
        }
        if (pos.current.x > pos.start.x) {
            box.style.width = pos.current.x - pos.start.x;
        } else {
            // box.style.left = canvas.offsetLeft + pos.current.x;
            // box.style.width = pos.start.x - pos.current.x;
            box.style.left = pos.current.x;
            box.style.width = pos.start.x - pos.current.x;
        }

        if (pos.current.y > pos.start.y) {
            box.style.height = pos.current.y - pos.start.y;
        } else {
            // box.style.top = canvas.offsetTop + pos.current.y;
            box.style.top = pos.current.y;
            box.style.height = pos.start.y - pos.current.y;
        }


    }
};

var mouseDragEnd = function mouseDragEnd() {
    if (pos.isActive && pos.start && pos.current) {
        pos.isActive = false;
        if (pos.start.x > pos.current.x) {
            pos.rect.left = pos.current.x;
            pos.rect.right = pos.start.x;
        } else {
            pos.rect.left = pos.start.x;
            pos.rect.right = pos.current.x;
        }
        if (pos.start.y > pos.current.y) {
            pos.rect.bottom = pos.start.y;
            pos.rect.top = pos.current.y;
        } else {
            pos.rect.bottom = pos.current.y;
            pos.rect.top = pos.start.y;
        }

        // uncomment to hide rect box
        box.classList.remove('active');
        checkSprites();
    }
};

// var mouseClicked = function mouseClicked() {
//     var x = game.input.activePointer.x;
//     var y = game.input.activePointer.y;
//
//     group.forEach(function (item, index) {
//         var bottom = (item.y + item.body.height + 10);
//         var left = item.x + 20;
//         var right = (item.x + item.body.width + 20);
//         var top = item.y + 10;
//         item.tint = 0xffffff;
//
//         console.log(x, y);
//
//         if (left <= x && right >= x && top <= y && bottom >= y) {
//                 item.tint = tint;
//                 selectedArray.push(item);
//                 console.log('unit selected');
//         }
//     }, this);
// }

var checkSprites = function checkSprites() {
    console.clear();
    selectedArray.length = 0;

    group.forEach(function (item, index) {
        var bottom = (item.y + item.body.height + 10);
        var left = item.x + 20;
        var right = (item.x + item.body.width + 20);
        var top = item.y + 10;
        item.tint = 0xffffff;

        // console.log(x, y);

        if (left >= pos.rect.left && right <= pos.rect.right &&
            top >= pos.rect.top && bottom <= pos.rect.bottom) {
                // console.log('unit selected');
                // console.log({
                //     bottom: bottom,
                //     left: left,
                //     right: right,
                //     top: top
                // }, pos.rect);
                item.tint = tint;
                selectedArray.push(item);
                // item.current = true;
                // console.log('Selected Units: ' + selectedArray.length);
            }
    }, this);
};


function setDedstinationPoint() {
    var x, y;
    var oldDestination = false;

    if (game.input.activePointer.rightButton.isDown) {
        x = game.input.activePointer.x;
		y = game.input.activePointer.y;
    }
    else {
        oldDestination = true;
    }

    for (var i = 0; i < selectedArray.length; i++) {
        var player = selectedArray[i];
        player.destinationIsSet = true;

        if (!oldDestination) {
            player.newDestination.x = x;
            player.newDestination.y = y;
            player.oldDestination.x = x;
            player.oldDestination.y = y;
        }
        else {
            player.newDestination.x = player.oldDestination.x;
            player.newDestination.y = player.oldDestination.y;
        }
    }
    // console.log('Selected Units: ' + selectedArray.length);
}


function controlWithMouse() {

    for (var i = 0; i < group.children.length; i++) {
        // var player = selectedArray[i];
        var player = group.children[i];

        game.physics.arcade.collide(player, group);

        if (player.destinationIsSet && player.newDestination.x != null && player.newDestination.y != null) {
            var differenceX = Math.abs(player.newDestination.x - player.centerX);
    		var differenceY = Math.abs(player.newDestination.y - player.centerY);

            player.angle = game.physics.arcade.moveToXY(player, player.newDestination.x - 38, player.newDestination.y - 48.5);

            // Swith sprite animations
    		if (player.angle >= -0.3 && player.angle <= 0.3) {
    			player.animations.play('E');
    		}
    		else if (player.angle > 0.3 && player.angle <= 1.2) {
    			player.animations.play('SE');
    		}
    		else if (player.angle > 1.2 && player.angle <= 1.9) {
    			player.animations.play('S');
    		}
    		else if (player.angle > 1.9 && player.angle <= 2.7) {
    			player.animations.play('SW');
    		}
    		else if (player.angle > 2.7 && player.angle <= Math.PI) {
    			player.animations.play('W');
    		}
    		else if ( (player.angle >= (Math.PI * -1) ) && player.angle <= -2.8) {
    			player.animations.play('W');
    		}
    		else if (player.angle > -2.8 && player.angle <= -1.9) {
    			player.animations.play('NW');
    		}
    		else if (player.angle > -1.9 && player.angle <= -1.3) {
    			player.animations.play('N');
    		}
    		else if (player.angle > -1.3 && player.angle < -0.3) {
    			player.animations.play('NE');
    		}

    		// Check destination point
    		if ( (differenceX <= 2) && (differenceY <= 2) ) {
                player.oldDestination.x = null;
                player.oldDestination.y = null;
                player.destinationIsSet = false;
    		}
        }
        else {
    		player.body.velocity.x = 0;
    		player.body.velocity.y = 0;
    		player.animations.play('STAND');
    	}
    }
}
