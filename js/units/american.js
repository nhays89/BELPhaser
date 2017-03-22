/**
    American soldier.
*/
function American(game, x, y) {
    Soldier.call(this, game, x, y, 'american');
    this.type = "American";
    this.ignoreEnemies = false;
    this.animations.add('american-stand-north', ['american-stand-north'], 1, false, false);
    this.animations.add('american-stand-northwest', ['american-stand-northwest'], 1, false, false);
    this.animations.add('american-stand-west', ['american-stand-west'], 1, false, false);
    this.animations.add('american-stand-southwest', ['american-stand-southwest'], 1, false, false);
    this.animations.add('american-stand-south', ['american-stand-south'], 1, false, false);
    this.animations.add('american-stand-southeast', ['american-stand-southeast'], 1, false, false);
    this.animations.add('american-stand-east', ['american-stand-east'], 1, false, false);
    this.animations.add('american-stand-northeast', ['american-stand-northeast'], 1, false, false);

    this.animations.add('american-run-east', Phaser.Animation.generateFrameNames('american-run-east', 0, 5), 6, false, false);
    this.animations.add('american-run-west', Phaser.Animation.generateFrameNames('american-run-west', 0, 5), 6, false, false);
    this.animations.add('american-run-north', Phaser.Animation.generateFrameNames('american-run-north', 0, 5), 6, false, false);
    this.animations.add('american-run-south', Phaser.Animation.generateFrameNames('american-run-south', 0, 5), 6, false, false);

    this.animations.add('american-run-northwest', Phaser.Animation.generateFrameNames('american-run-northwest', 0, 5), 6, false, false);
    this.animations.add('american-run-northeast', Phaser.Animation.generateFrameNames('american-run-northeast', 0, 5), 6, false, false);
    this.animations.add('american-run-southwest', Phaser.Animation.generateFrameNames('american-run-southwest', 0, 5), 6, false, false);
    this.animations.add('american-run-southeast', Phaser.Animation.generateFrameNames('american-run-southeast', 0, 5), 6, false, false);

    this.animations.add('american-fire-north', Phaser.Animation.generateFrameNames('american-fire-north', 0, 5), 6, false, false);
    this.animations.add('american-fire-south', Phaser.Animation.generateFrameNames('american-fire-south', 0, 5), 6, false, false);
    this.animations.add('american-fire-west', Phaser.Animation.generateFrameNames('american-fire-west', 0, 5), 6, false, false);
    this.animations.add('american-fire-east', Phaser.Animation.generateFrameNames('american-fire-east', 0, 5), 6, false, false);
    this.animations.add('american-fire-northwest', Phaser.Animation.generateFrameNames('american-fire-northwest', 0, 5), 6, false, false);
    this.animations.add('american-fire-northeast', Phaser.Animation.generateFrameNames('american-fire-northeast', 0, 5), 6, false, false);
    this.animations.add('american-fire-southwest', Phaser.Animation.generateFrameNames('american-fire-southwest', 0, 5), 6, false, false);
    this.animations.add('american-fire-southeast', Phaser.Animation.generateFrameNames('american-fire-southeast', 0, 5), 6, false, false);

    this.animations.add('american-die-west', Phaser.Animation.generateFrameNames('american-die-west', 0, 14), 14, false, false);
    this.animations.add('american-die-east', Phaser.Animation.generateFrameNames('american-die-east', 0, 14), 14, false, false);
    this.fullHealth = 200;
    this.health = 200;
}

American.prototype = Object.create(Soldier.prototype); //all Americans inherit from Soldier
American.prototype.constructor = American;


/**
    Called on each american currently in game every update cycle.
*/
American.prototype.update = function() {
    if (this.health <= 0) { //if he is 'dead' but not removed from the game
        this.removeBodyRing();
        if (this.alive) { //first time his health is below or at 0
            this.currentPath = []; //recycle
            this.body.destroy();
            this.enemiesInAttackRadius = []; //recycle
            this.enemiesInViewRadius = []; //recycle
            this.ignoreEnemies = false;
            if (this.selected) {
                this.removeBodyRing();
            }
            this.selected = false;
            this.alive = false;
            playState.numOfAmericans--;
            this.die(); //removed from game in 7000 millis
        }
    } else { //we are still alive

        this.updateNearbyEnemies();

        if (this.targetEnemy) {
            if (!this.targetEnemy.alive) { //if we had a targetEnemy but he is dead
                this.currentPath = []; //reset
                this.targetEnemy = null; //reset
                this.ignoreEnemies = false; //reset
                this.finalDestination = null; //reset
                if (this.isShooting) { //if our enemy is dead and we are shooting
                    if (playState.audioClips[this.key + '-gun-shot'].isPlaying) {
                        playState.audioClips[this.key + '-gun-shot'].fadeOut(100);
                    }
                    if (this.shootAnimation.isPlaying) {
                        this.shootAnimation.stop();
                    }
                }
            }
        }
        if (this.currentPath.length === 0 && !this.finalDestination) { // when we have reached our destination
            if (!this.targetEnemy) { //and we don't have a target enemy
                this.ignoreEnemies = false; //if we were ignoring, reset
            }

        }

        if (this.selected) { //if we are selected
            this.removeBodyRing(); //remove
            this.setBodyRing(); //redraw
        }

        if (this.finalDestination && this.targetEnemy) { //if we have a destination and a target enemy
            if (this.enemiesInAttackRadius.includes(this.targetEnemy)) { //and he is nearby
                this.finalDestination = null; //reset
                this.currentPath = []; //reset
            }
        }

        if (this.finalDestination) { //if we still have a final destination
            if (this.currentPath.length === 0) { //but we have no coords on our stack
                if (this.targetEnemy) { //then if we have a target enemy
                    this.finalDestination = new Phaser.Point(this.targetEnemy.x, this.targetEnemy.y); //lets update our final destination
                    var path = this.generatePath(new Phaser.Point(this.x, this.y), new Phaser.Point(this.finalDestination.x, this.finalDestination.y)); // sets currentPath implictly
                    if (path.length > 0) { //if there is a path -
                        this.addPath(path); //add to currentPath
                    }
                } else { // we don't have a target enemy
                    if (Phaser.Math.distance(this.x, this.y, this.finalDestination.x, this.finalDestination.y) > this.maxRetryDistance) { //but are we stuck?
                        var path = this.generatePath(new Phaser.Point(this.x, this.y), new Phaser.Point(this.finalDestination.x, this.finalDestination.y));
                        if (path.length > 0) { //if there is a path -
                            this.addPath(path); //add to currentPath
                        }
                    } else { //we are not stuck || within maxRetryDistance
                        this.finalDestination = null;
                    }
                }
            }

        }
        if (game.input.mousePointer.rightButton.isDown) { //if user right clicked
            if (this.selected) { //and we are selected
                this.maxRetryDistance = playState.numSelected * 40; //update 
                var destinationPoint;
                var targetEnemyNearClick = playState.getNearbySoviet(new Phaser.Point(game.input.mousePointer.worldX, game.input.mousePointer.worldY));
                if (targetEnemyNearClick) { //if user clicked near enemy
                    this.targetEnemy = targetEnemyNearClick;
                    this.ignoreEnemies = true; //don't kill enemies along the way 
                    playState.audioClips.killBeep.volume = .5;
                    playState.audioClips.killBeep.play();
                    playState.audioClips.roger.play();
                    destinationPoint = new Phaser.Point(this.targetEnemy.body.x, this.targetEnemy.body.y); //destination is the enemy soldier   
                    this.finalDestination = destinationPoint;
                } else { //user clicked in space
                    playState.audioClips.moveBeep.volume = .5;
                    playState.audioClips.moveBeep.play();
                    if (this.enemiesInAttackRadius.length > 0 || this.enemiesInViewRadius.length > 0) { //we are trying to retreat
                        this.ignoreEnemies = true; //don't attack enemies on our way out (sets back to false when we reach destination)
                    } else {
                        this.ignoreEnemies = false; //keep our gaurd up
                    }
                    this.targetEnemy = null; //if we had a target, remove it
                    destinationPoint = new Phaser.Point(game.input.mousePointer.worldX, game.input.mousePointer.worldY) //destination is the click
                    this.finalDestination = destinationPoint;
                }
                var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(destinationPoint.x, destinationPoint.y)); // sets currentPath implictly
                if (path.length > 0) { //if there is a path -
                    this.addPath(path);
                }
            }
        }


        if (this.ignoreEnemies === false) { //we can attack when enemies are nearby
            var newTargetEnemy;
            if (this.targetEnemy && this.enemiesInAttackRadius.includes(this.targetEnemy)) { // we have a targetEnemy and he is nearby
                this.finalDestination = null;
                this.shoot(this.targetEnemy); //shoot him
            } else { //we don't have a targetEnemy || he is outside our attack radius 
                if (newTargetEnemy = this.getClosestIn(this.enemiesInAttackRadius)) { //someone else is in our attack radius
                    this.finalDestination = null;
                    this.targetEnemy = newTargetEnemy; //assign as new target enemy
                    this.shoot(this.targetEnemy); //shoot him
                } else if (newTargetEnemy = this.getClosestIn(this.enemiesInViewRadius)) { //someone in our view radius
                    if (!this.targetEnemy) {
                        this.targetEnemy = newTargetEnemy;
                        this.finalDestination = new Phaser.Point(this.targetEnemy.x, this.targetEnemy.y);
                        var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(newTargetEnemy.body.x, newTargetEnemy.body.y)); // sets currentPath implictly
                        if (path.length > 0) { //if there is a path -
                            this.addPath(path); //add to currentPath
                        }
                    }
                    this.step(); //update position 
                } else {
                    this.step(); //update position
                }
            }
        } else { //we are currently ignoring enemies
            if (this.targetEnemy && this.enemiesInAttackRadius.includes(this.targetEnemy)) { //if we have a targetEnemy and he is nearby
                this.shoot(this.targetEnemy);
            } else { //our targetEnemy is not in our attack radius
                this.step(); //stand gaurd or keep running towards destination

            }
        }

        if (this.finalDestination) { //if we haven't reached our final desination
            if (this.currentPath.length === 0) { //but we have no coords on our stack
                if (Phaser.Math.distance(this.body.x, this.body.y, this.finalDestination.x, this.finalDestination.y) > this.maxRetryDistance) {
                    var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(this.finalDestination.x, this.finalDestination.y)); // sets currentPath implictly
                    if (path.length > 0) { //if there is a path -
                        this.addPath(path); //add to currentPath
                    }
                }

            }

        }


    }
};
