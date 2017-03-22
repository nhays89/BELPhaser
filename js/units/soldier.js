function Soldier(game, x, y, key) {
    Body.call(this, game, x, y, key);

    this.game.physics.p2.enable(this);
    this.gunReady = false;
    this.body.radius = 16;
    this.body.collideWorldBounds = true;
    this.body.setCircle(this.body.radius);
    this.body.damping = .999999999999;
    this.body.fixedRotation = true;
    this.currentPath = []; //stack of coordinates used to move soldiers
    this.enemiesInViewRadius = []; //enemies that are really close by
    this.enemiesInAttackRadius = []; //enemies that are close
    this.targetEnemy = null; //current enemy to attack
    this.currentCoord = {}; //current coord of this soldier in world coordinates
    this.anchorCoord = {}; //coord on currentPath from which you previously left
    this.destinationCoord = {}; //next coord on currentPath to which you are headed towards
    this.finalDestination = null; //we will rerun pathfinder if we get stuck and we are not 'maxRetryDistance' to destination.
    this.type = "Soldier";
    this.alive = true;
    this.selected = false;
    this.viewRadius = 350;
    this.attackRadius = 150;
    this.health = 100;
    this.damage = 20;
    this.direction = 'south';
    this.pixelsPerSecond = 100;
    this.maxRetryDistance = 250; //distance around destinationCoord to retry path algo if stuck
    this.cooldowns = {
        'weapon': false
    };
    this.bodyRingColor;
    this.weaponCooldownDuration = 750;
    this.shootAnimation = {};
};

Soldier.prototype = Object.create(Body.prototype);
Soldier.prototype.constructor = Soldier;

/**
    Soldier shoots an enemy only if his weapon is 'cooled down'.
    @param enemy - the enemy soldier
*/
Soldier.prototype.shoot = function(enemy) {
    var radians = game.physics.arcade.angleBetween(this, enemy);
    this.direction = this.getDirection(radians);

    if (!this.cooldowns['weapon']) {
        this.shootAnimation = this.animations.play(this.key + '-fire-' + this.direction, 6, true);
        if (this.key === "american") {
            playState.audioClips[this.key + "-gun-shot"].volume = .2;
        } else {
            playState.audioClips[this.key + "-gun-shot"].volume = .3;
        }
        playState.audioClips[this.key + "-gun-shot"].play();

        this.cooldowns['weapon'] = true;
        this.isShooting = true;
        game.time.events.add(1000, function() {
            this.isShooting = false;
        }, this);

        game.time.events.add(this.weaponCooldownDuration, function() {
            this.cooldowns['weapon'] = false;
        }, this);

        enemy.health -= this.damage;
    }
};

/**
    Executed when the sound bites have finished loading.
*/
Soldier.prototype.setGunReady = function() {
    this.gunReady = true;
};

/**
    Each soldier is removed from canvas after 7 seconds.
*/
Soldier.prototype.die = function() {
    var deathDir;
    switch (this.direction) {
        case "north":
            deathDir = "west";
            break;
        case "northwest":
            deathDir = "west";
            break;
        case "west":
            deathDir = "west";
            break;
        case "southwest":
            deathDir = "west";
            break;
        case "south":
            deathDir = "east";
            break;
        case "southeast":
            deathDir = "east";
            break;
        case "east":
            deathDir = "east";
            break;
        case "northeast":
            deathDir = "east";
            break;
    }
    this.animations.stop();
    this.animations.play(this.key + '-die-' + deathDir);
    playState.audioClips[this.key + "-dying"].play();
    if (playState.audioClips[this.key + '-gun-shot'].isPlaying) {
        playState.audioClips[this.key + '-gun-shot'].fadeOut(100);
    }

    game.time.events.add(7000, function() { //remove from world in 7000 millis
        this.destroy();
    }, this);
};

/**
    Converts an angle in radians to a direction.

    @param radians - expecting an angle in radians.
*/
Soldier.prototype.getDirection = function(radians) {
    var degrees = Phaser.Math.radToDeg(radians);

    if (degrees >= -22.5 && degrees < 22.5) {
        return 'east';
    } else if (degrees >= 22.5 && degrees < 67.5) {
        return 'southeast';
    } else if (degrees >= 67.5 && degrees < 112.5) {
        return 'south';
    } else if (degrees >= 112.5 && degrees < 157.5) {
        return 'southwest';
    } else if (degrees >= -157.5 && degrees < -112.5) {
        return 'northwest';
    } else if (degrees >= -112.5 && degrees < -67.5) {
        return 'north';
    } else if (degrees >= -67.5 && degrees < -22.5) {
        return 'northeast';
    } else {
        return 'west';
    }
};

/**
    Locates enemies nearby and updates soldier arrays accordingly.
*/
Soldier.prototype.updateNearbyEnemies = function() {
    var viewDiameter = this.viewRadius * 2;
    playState.viewSprite.centerOn(this.x, this.y);
    playState.viewSprite.resize(viewDiameter, viewDiameter);

    // for debugging view distance
    playState.viewCircle.setTo(this.x, this.y, viewDiameter);
    this.enemiesInAttackRadius = [];
    this.enemiesInViewRadius = [];

    var found = [];
    if (this instanceof American) {
        found = game.world.getByName('soviets').children;
    } else {
        found = game.world.getByName('americans').children;
    }
    var distance;
    var length = found.length;

    for (var i = 0; i < length; i++) {
        // if enemy
        if (found[i].alive && (this instanceof American && found[i] instanceof Soviet ||
                this instanceof Soviet && found[i] instanceof American)) {
            distance = Phaser.Math.distance(this.x, this.y,
                found[i].x, found[i].y);

            if (distance <= this.attackRadius) {
                this.enemiesInAttackRadius.push(found[i]);
            } else if (distance <= this.viewRadius) {
                this.enemiesInViewRadius.push(found[i]);
            }
        }
    }
};

/**

    Gets the cloest enemy (in pixels) in a given list of enmeies.

    @param list - the list of enemies to check this soldier against. 

*/
Soldier.prototype.getClosestIn = function(list) {

    var closestEnemy;
    var closestDistance;

    if (list.length > 0) {

        for (var i = 0; i < list.length; i++) {

            var distance = Phaser.Math.distance(this.x, this.y, list[i].x, list[i].y);

            if (!closestEnemy) { //0

                closestEnemy = list[i];
                closestDistance = distance;

            } else {

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEnemy = list[i];
                }

            }

        }

    }

    return closestEnemy;
};

/**
    Generates a random coordinate used to spawn soviets.

*/

Soldier.prototype.generateRandCoord = function() {

    for (var i = 0; i < 10; i++) {
        var randx = game.rnd.integerInRange(0, 3200); //get coords off camera
        var randy = game.rnd.integerInRange(0, 3200); //get coords off camera
        var valid = game.pathfinder.isWalkable(randx, randy);
        if (valid) {
            return new Phaser.Point(randx, randy);
        }
    }


};

/**
    Sets this soldier to stand facing current direction.
*/

Soldier.prototype.stand = function() {
    this.currentPath = [];
    // this.animations.stop();

    this.animations.play(this.key + '-stand-' + this.direction);
};

/*
    Adds a path to soldiers currentPath stack. 
     
     @param Phaser.Point(x,y)

 */
Soldier.prototype.addPath = function(path) {
    this.currentPath = path;
    this.currentCoord = this.currentPath.shift(); //get my current xy
    this.anchorCoord = this.currentCoord; //set the anchor point to my xy

};

/**
    Generates a path using pathfinder.js from soldiers current coordinate to destination coordinate.
    Path returned will be a sequence of coordinate objects containing x,y locations and direction.
*/
Soldier.prototype.generatePath = function(targetPoint, destinationPoint) {
    return game.pathfinder.findPath(targetPoint.x, targetPoint.y, destinationPoint.x, destinationPoint.y); //get new path to destination
};

/**
    Runs the animation loop forward on every soldier update. 

*/
Soldier.prototype.step = function() {
    var self = this;
    if (this.isShooting) {
        return;
    }

    var nextCoord = this.currentPath[0]; //destinationCoord


    if (nextCoord && this.anchorCoord) { //if we have an anchorCoord and still have a destinationCoord
        var currentCoord = { x: this.body.x, y: this.body.y };
        var distance = Phaser.Math.distance(this.anchorCoord.x, this.anchorCoord.y, currentCoord.x, currentCoord.y);
        if ((distance >= this.anchorCoord.distance)) { //if we have arrived at destination coord or gone slightly past
            var currentDirection = this.anchorCoord.direction;
            this.anchorCoord = this.currentPath.shift(); //set our new anchorCoord = to the next coord
            if (!this.anchorCoord.direction) { //reached final destinationCoord
                this.anchorCoord.direction = currentDirection;
            }
        }
        if (!playState.audioClips['american-march'].isPlaying && this instanceof American) {

            playState.audioClips['american-march'].play();
        }
        this.animations.play(this.key + '-run-' + this.anchorCoord.direction);
        if (this.anchorCoord.direction === 'north') {
            this.direction = 'north';
            this.moveNorth(this.pixelsPerSecond);
        } else if (this.anchorCoord.direction === 'northeast') {
            this.direction = 'northeast';
            this.moveNorthEast(this.pixelsPerSecond);
        } else if (this.anchorCoord.direction === 'east') {
            this.direction = 'east';
            this.moveEast(this.pixelsPerSecond);
        } else if (this.anchorCoord.direction === 'southeast') {
            this.direction = 'southeast';
            this.moveSouthEast(this.pixelsPerSecond);
        } else if (this.anchorCoord.direction === 'south') {
            this.direction = 'south';
            this.moveSouth(this.pixelsPerSecond);
        } else if (this.anchorCoord.direction === 'southwest') {
            this.direction = 'southwest';
            this.moveSouthWest(this.pixelsPerSecond);
        } else if (this.anchorCoord.direction === 'west') {
            this.direction = 'west';
            this.moveWest(this.pixelsPerSecond);
        } else {
            this.direction = 'northwest';
            this.moveNorthWest(this.pixelsPerSecond);
        }
    } else {
        this.stand();
    }


};

Soldier.prototype.moveNorth = function(distance) {
    this.body.moveUp(distance);
};
Soldier.prototype.moveNorthEast = function(distance) {
    this.body.moveUp(distance);
    this.body.moveRight(distance);
};
Soldier.prototype.moveEast = function(distance) {
    this.body.moveRight(distance);
};
Soldier.prototype.moveSouthEast = function(distance) {
    this.body.moveDown(distance);
    this.body.moveRight(distance);
};
Soldier.prototype.moveSouth = function(distance) {
    this.body.moveDown(distance);
};
Soldier.prototype.moveSouthWest = function(distance) {
    this.body.moveDown(distance);
    this.body.moveLeft(distance);
};
Soldier.prototype.moveWest = function(distance) {
    this.body.moveLeft(distance);
};
Soldier.prototype.moveNorthWest = function(distance) {
    this.body.moveUp(distance);
    this.body.moveLeft(distance);

};
