Soldier = function(game,x,y,key, frame) {
    Phaser.Sprite.call(this, game, x, y, key); //extend
    this.type = "Soldier";
    this.alive = true;
    this.selected = false;
    //this.sprite = sprite;
    this.viewRadius = 250;
    this.attackRadius = 150;

    this.enemiesInViewRadius = [];
    this.enemiesInAttackRadius = [];

    this.health = 100;
    this.damage = 20;

    this.direction = 'north';

    this.cooldowns = {
        'weapon': false
    };

    // this.bulletSplash = game.add.sprite(0, 0, 'bulletSplash');
    // this.bulletSplash.anchor.setTo(0.5, 0.5);
    // this.sprite.addChild(this.bulletSplash);
    // this.bulletSplash.animations.add('bulletSplash');

    this.weaponCooldownDuration = 1500;
    this.shootAnimation = {};
    
    
}


Soldier.prototype = Object.create(Phaser.Sprite.prototype);
Soldier.prototype.constructor = Soldier;


Soldier.prototype.shoot = function (enemy) {
    // if (!this.bulletSplash) {
    //     this.bulletSplash = game.add.sprite(0, 0, 'bulletSplash');
    //     this.bulletSplash.animations.add('bulletSplash');
    // }
    var radians = game.physics.arcade.angleBetween(enemy.sprite, this.sprite);
    this.direction = this.getDirection(radians);

    if (!this.cooldowns['weapon']) {
        this.shootAnimation = this.sprite.animations.play(this.faction + '-fire-' + this.direction);
        //enemy.bulletSplash.animations.play('bulletSplash');

        this.cooldowns['weapon'] = true;
        game.time.events.add(this.weaponCooldownDuration, function () {
            this.cooldowns['weapon'] = false;
        }, this);

        this.shootAnimation.onComplete.add(function () {
            this.sprite.animations.play(this.faction + '-stand-' + this.direction);
        }, this);

        enemy.health -= this.damage;
    }
};

Soldier.prototype.update = function () {
    if (this.alive && this.health <= 0) {
        this.die();
    }
};

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
    this.sprite.animations.play(this.faction + '-die-' + deathDir);
    game.time.events.add(7000, function () {
        this.sprite.destroy();
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
    playState.viewSprite.centerOn(this.sprite.x, this.sprite.y);
    playState.viewSprite.resize(viewDiameter, viewDiameter);

    // for debugging view distance
    playState.viewCircle.setTo(this.sprite.x, this.sprite.y, viewDiameter);

    var found = playState.quadTree.retrieve(playState.viewSprite);
    var distance;

    this.enemiesInViewRadius = [];
    this.enemiesInAttackRadius = [];
    for (var i = 0; i < found.length; i++) {

        // if enemy
        if (found[i].alive && (this instanceof American && found[i] instanceof Soviet ||
            this instanceof Soviet && found[i] instanceof American)) {
            distance = Phaser.Math.distance(this.sprite.x, this.sprite.y,
                found[i].sprite.x, found[i].sprite.y);

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

Soldier.prototype.moveTo = function (x, y) {
    // implement A* here
};
