function Soldier(game, x, y, key) {
    Body.call(this, game, x, y, key);

    this.game.physics.p2.enable(this);
    //  this.body.debug = true;
    // this.game.physics.p2.enable(this);
    this.body.collideWorldBounds = true;
    this.body.setCircle(this.body.radius);
    this.body.damping = .999999999999;
    this.body.fixedRotation = true;
    this.currentPath = [];
    this.enemiesInViewRadius = new Phaser.Group(game, null, "enemiesInViewRadius");
    this.enemiesInAttackRadius = new Phaser.Group(game, null, "enemiesInAttackRadius");
    this.targetEnemy = null;
    this.currentCoords = {};
    this.destinationCoords = {};
    this.closestEnemy = null;
    this.ignoreEnemies = false;
    this.type = "Soldier";
    this.alive = true;
    this.selected = false;
    this.viewRadius = 250;
    this.attackRadius = 150;
    this.health = 100;
    this.damage = 20;
    this.direction = 'south';
    this.currentSpeed;
    this.pixelsPerSecond;
    this.cooldowns = {
        'weapon': false
    };

    // this.bulletSplash = game.add.sprite(0, 0, 'bulletSplash');
    // this.bulletSplash.anchor.setTo(0.5, 0.5);
    // this.sprite.addChild(this.bulletSplash);
    // this.bulletSplash.animations.add('bulletSplash');



    this.weaponCooldownDuration = 1500;
    this.shootAnimation = {};

    this.speed = 100;
    this.pathDebug = game.add.graphics(0, 0);
    this.pathDebug.on = true;
    this.currentPath = [];
    this.tween = game.add.tween(this);
};

Soldier.prototype = Object.create(Body.prototype);
Soldier.prototype.constructor = Soldier;


Soldier.prototype.shoot = function (enemy) {
    // if (!this.bulletSplash) {
    //     this.bulletSplash = game.add.sprite(0, 0, 'bulletSplash');
    //     this.bulletSplash.animations.add('bulletSplash');
    // }
    var radians = game.physics.arcade.angleBetween(enemy, this);
    this.direction = this.getDirection(radians);

    if (!this.cooldowns['weapon']) {
        this.shootAnimation = this.animations.play(this.faction + '-fire-' + this.direction);
        //enemy.bulletSplash.animations.play('bulletSplash');

        this.cooldowns['weapon'] = true;
        game.time.events.add(this.weaponCooldownDuration, function () {
            this.cooldowns['weapon'] = false;
        }, this);

        this.shootAnimation.onComplete.add(function () {
            this.animations.play(this.faction + '-stand-' + this.direction);
        }, this);

        enemy.health -= this.damage;
    }
};

// Soldier.prototype.update = function () {
//     if (this.alive && this.health <= 0) {
//         this.die();
//     }
//
//
// };

Soldier.prototype.die = function () {
    var deathDir;
    switch(direction) {
        case "north":deathDir = "west"; break;
        case "northwest": deathDir = "west"; break;
        case "west": deathDir = "west"; break;
        case "southwest": deathDir = "west"; break;
        case "south": deathDir = "east"; break;
        case "southeast": deathDir = "east"; break;
        case "east": deathDir = "east"; break;
        case "northeast": deathDir = "east"; break;
    }

    this.animations.play(this.faction + '-die-' + deathDir);
    game.time.events.add(7000, function () {  //remove from world in 7000 millis
        this.destroy();
    }, this);
};

Soldier.prototype.getDirection = function(radians) {
    var degrees = Phaser.Math.radToDeg(radians);

    if (degrees >= -22.5 && degrees < 22.5) {
        return 'west';
    } else if (degrees >= 22.5 && degrees < 67.5) {
        return 'northwest';
    } else if (degrees >= 67.5 && degrees < 112.5) {
        return 'north';
    } else if (degrees >= 112.5 && degrees < 157.5) {
        return 'northeast';
    } else if (degrees >= -157.5 && degrees < -112.5) {
        return 'southeast';
    } else if (degrees >= -112.5 && degrees < -67.5) {
        return 'south';
    } else if (degrees >= -67.5 && degrees < -22.5) {
        return 'southwest';
    } else {
        return 'east';
    }
};



Soldier.prototype.updateClosestEnemy = function() {
    this.closestEnemy = this.enemiesInAttackRadius.getClosestTo(this);
}


Soldier.prototype.updateNearbyEnemies = function () {
    var viewDiameter = this.viewRadius * 2;
    playState.viewSprite.centerOn(this.x, this.y);
    playState.viewSprite.resize(viewDiameter, viewDiameter);

    // for debugging view distance
    playState.viewCircle.setTo(this.x, this.y, viewDiameter);
    this.enemiesInViewRadius.removeChildren();
    this.enemiesInAttackRadius.removeChildren();
    var found = playState.quadTree.retrieve(playState.viewSprite);
    var distance;

    for (var i = 0; i < found.length; i++) {

        // game.physics.arcade.collide(this.body, found[i].body);

        // if enemy
        if (found[i].alive && (this instanceof American && found[i] instanceof Soviet ||
            this instanceof Soviet && found[i] instanceof American)) {
            distance = Phaser.Math.distance(this.x, this.y,
                found[i].x, found[i].y);

            if (distance <= this.attackRadius) {
                this.enemiesInAttackRadius.add(found[i]);
//                 if (!this.cooldowns['weapon']) {
//                     this.shoot(found[i]);
//                 }
            } else if (distance <= this.viewRadius) {
                // walk closer
                // this.moveTo(found[i].sprite.x, found[i].sprite.y);
                this.enemiesInViewRadius.push(found[i]);
            }
        }
    }
};


Soldier.prototype.stand = function () {
    this.currentPath = [];
    this.animations.stop();
    this.animations.play(this.key + '-stand-' + this.direction);
};

/*
@param Phaser.Point(x,y)

*/
Soldier.prototype.generatePath = function(targetPoint, destinationPoint) {             
        var path = game.pathfinder.findPath(targetPoint.x, targetPoint.y, destinationPoint.x, destinationPoint.y); //get new path to destination
           if(path.length> 0) {
               this.currentPath = path;
               this.currentCoords = this.currentPath.shift();
           } 
};

Soldier.prototype.step = function () {
        var self = this;
        this.destinationCoords = this.currentPath[0]; //destinationCoords
        if(this.destinationCoords) {
            
        } else {
            stand();
        }
            if (Phaser.Math.distance(this.currentCoords.x, this.currentCoords.y, this.destinationCoords.x, this.destinationCoords.y) > this.currentCoords.distance) {
                 this.currentCoords = this.currentPath.shift();

            }
            this.animations.play(this.key + '-run-' + this.currentCoords.direction);
             if (this.currentCoords.direction === 'north') {
                this.direction = 'north';
                this.moveNorth(pixelsPerSecond);
            } else if (this.currentCoords.direction === 'northeast') {
                this.direction = 'northeast';
                this.moveNorthEast(pixelsPerSecond);
            } else if (this.currentCoords.direction === 'east') {
                this.direction = 'east';
                this.moveEast(pixelsPerSecond);
            } else if (this.currentCoords.direction === 'southeast') {
                this.direction = 'southeast';
                this.moveSouthEast(pixelsPerSecond);
            } else if (this.currentCoords.direction === 'south') {
                this.direction = 'south';
                this.moveSouth(pixelsPerSecond);
            } else if (this.currentCoords.direction === 'southwest') {
                this.direction = 'southwest';
                this.moveSouthWest(pixelsPerSecond);
            } else if (this.currentCoords.direction === 'west') {
                this.direction = 'west';
                this.moveWest(pixelsPerSecond);
            } else {
                this.direction = 'northwest';
                this.moveNorthWest(pixelsPerSecond);
            }
        }

        

        // this.body.onMoveComplete.addOnce(function () {
        //     this.isMoving = false;
        //         if (self.currentPath.length <= 0) {
        //             self.cancelMovement();
        //         } else {
        //             self.moveTo(); // moveTo without coords, will take from the currentPath
        //         }
        // }, this);
        // this.body.moveTo(duration, this.currentCoords.distance);

        // this.tween = game.add.tween(this).to({ x: this.currentCoords.x, y: this.currentCoords.y },
        //                 duration, Phaser.Easing.Linear.None, true);
        //
        // this.tween.onComplete.add(function () {
        //     this.isMoving = false;
        //     if (self.currentPath.length <= 0) {
        //         self.cancelMovement();
        //     } else {
        //         self.moveTo(); // moveTo without coords, will take from the currentPath
        //     }
        // }, this);

        // for displaying the soldier's path.
        if (this.pathDebug.on) {
            this.pathDebug.clear();

            this.pathDebug.lineStyle(5, game.rnd.integer(), 1);

            for (var i = 0; i < this.currentPath.length; i++) {
                if (i === 0) {
                    this.pathDebug.moveTo(this.body.x, this.body.y);
                } else {
                    this.pathDebug.lineTo(this.currentPath[i].x, this.currentPath[i].y);
                }
            }
        }
    
};

Soldier.prototype.moveNorth = function (distance) {
    this.body.moveUp(distance);
};
Soldier.prototype.moveNorthEast = function (distance) {
    this.body.moveUp(distance);
    this.body.moveRight(distance);
};
Soldier.prototype.moveEast = function (distance) {
    this.body.moveRight(distance);
};
Soldier.prototype.moveSouthEast = function (distance) {
    this.body.moveDown(distance);
    this.body.moveRight(distance);
};Soldier.prototype.moveSouth = function (distance) {
    this.body.moveDown(distance);
};
Soldier.prototype.moveSouthWest = function (distance) {
    this.body.moveDown(distance);
    this.body.moveLeft(distance);
};
Soldier.prototype.moveWest = function (distance) {
    this.body.moveLeft(distance);
};
Soldier.prototype.moveNorthWest = function (distance) {
    this.body.moveUp(distance);
    this.body.moveLeft(distance);

};
