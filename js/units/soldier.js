function Soldier(game, x, y, key) {
    Body.call(this, game, x, y, key);

    this.game.physics.p2.enable(this);
    //  this.body.debug = true;
    // this.game.physics.p2.enable(this);
    this.body.collideWorldBounds = true;
    this.body.setCircle(this.body.radius);
    this.body.damping = .9999999999;
    this.body.fixedRotation = true;

    this.type = "Soldier";
    this.alive = true;
    this.selected = false;

    this.viewRadius = 250;
    this.attackRadius = 150;

    this.enemiesInViewRadius = [];
    this.enemiesInAttackRadius = [];

    this.health = 100;
    this.damage = 20;

    this.direction = 'south';

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
    if (this.direction.indexOf('east') >= 0) {
        deathDir = 'east';
    } else if (this.direction.indexOf('west') >= 0) {
        deathDir = 'west';
    } else if (this.direction.indexOf('north') >= 0) {
        deathDir = 'west';
    } else {
        deathDir = 'east';
    }

    this.alive = false;
    this.animations.play(this.faction + '-die-' + deathDir);
    game.time.events.add(7000, function () {
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

Soldier.prototype.getNearbyEnemies = function () {
    var viewDiameter = this.viewRadius * 2;
    playState.viewSprite.centerOn(this.x, this.y);
    playState.viewSprite.resize(viewDiameter, viewDiameter);

    // for debugging view distance
    playState.viewCircle.setTo(this.x, this.y, viewDiameter);

    var found = playState.quadTree.retrieve(playState.viewSprite);
    var distance;

    this.enemiesInViewRadius = [];
    this.enemiesInAttackRadius = [];
    for (var i = 0; i < found.length; i++) {

        // game.physics.arcade.collide(this.body, found[i].body);

        // if enemy
        if (found[i].alive && (this instanceof American && found[i] instanceof Soviet ||
            this instanceof Soviet && found[i] instanceof American)) {
            distance = Phaser.Math.distance(this.x, this.y,
                found[i].x, found[i].y);

            if (distance <= this.attackRadius) {
                this.enemiesInAttackRadius.push(found[i]);
                if (!this.cooldowns['weapon']) {
                    this.shoot(found[i]);
                }
            } else if (distance <= this.viewRadius) {
                // walk closer
                // this.moveTo(found[i].sprite.x, found[i].sprite.y);
                this.enemiesInViewRadius.push(found[i])
            }
        }
    }
};

Soldier.prototype.update = function() {

    if (this.isMoving) {
        this.animations.play(this.key + '-run-' + this.currentCoords.direction);
        this.moveTo();
    } else {
        this.cancelMovement();
    }

};

Soldier.prototype.cancelMovement = function () {
    this.currentPath = [];
    this.isMoving = false;
    this.tween.stop();
    this.animations.stop();
    if (this.currentCoords)
        this.animations.play(this.key + '-stand-' + this.currentCoords.direction);
};

Soldier.prototype.moveTo = function (x, y) {
    //this.body.moves = false;

    if (this.currentPath.length <= 0) {
        this.currentPath = game.pathfinder.findPath(this.body.x, this.body.y, x, y);
        if (this.currentPath.length <= 0) {
            console.log("No path found.");
            return;
        }
    }
    if (this.currentPath.length > 0) {
        var self = this;
        this.isMoving = true;
        this.currentCoords = this.currentPath.shift();
        var duration = (this.currentCoords.distance / this.speed) * 1000;



        // game.physics.arcade.moveToXY(this, this.currentCoords.x, this.currentCoords.y, 100);
        this.animations.play(this.key + '-run-' + this.currentCoords.direction);

        if (this.currentCoords.direction == 'north') {
            this.moveNorth(duration);
        } else if (this.currentCoords.direction == 'northeast') {
            this.moveNorthEast(duration);
        } else if (this.currentCoords.direction == 'east') {
            this.moveEast(duration);
        } else if (this.currentCoords.direction == 'southeast') {
            this.moveSouthEast(duration);
        } else if (this.currentCoords.direction == 'south') {
            this.moveSouth(duration);
        } else if (this.currentCoords.direction == 'southwest') {
            this.moveSouthWest(duration);
        } else if (this.currentCoords.direction == 'west') {
            this.moveWest(duration);
        } else {
            this.moveNorthWest(duration);
        }

        if (Phaser.Math.distance(this.x, this.y, this.currentCoords.x, this.currentCoords.y) <= 10) {
            this.isMoving = false;
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
