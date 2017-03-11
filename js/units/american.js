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

    this.health = 200;
}

American.prototype = Object.create(Soldier.prototype);
American.prototype.constructor = American;


//only objects that are 'alive' will be called in this function
American.prototype.update = function() {
if(this.health <= 0) {
    this.removeBodyRing();
    console.log("in here outside");
    if(this.alive) {
        console.log("in here");
        this.currentPath = [];
        this.body.destroy();
        this.enemiesInAttackRadius = []; //clear
        this.enemiesInViewRadius = []; //clear
        this.ignoreEnemies = false;
        if(this.selected) {
            this.removeBodyRing();
        }
        this.selected = false;
        this.alive = false;
        playState.numOfAmericans--;
        this.die(); //removed from group in 7000 millis
    }
} else {
    this.updateNearbyEnemies();
    if(this.targetEnemy) {
        if(!this.targetEnemy.alive) {//if we had a targetEnemy but he is dead
            this.currentPath = []; //reset
            this.targetEnemy = null; //reset
            this.ignoreEnemies = false; //reset
            this.finalDestination = null;
        }
    }
    if(this.currentPath.length === 0) {// we have reached our destination
        if(!this.targetEnemy) {
             this.ignoreEnemies = false;
        }
       
    }

    if(this.selected) {//if we are selected
        this.removeBodyRing();
        this.setBodyRing();
    }

    if(game.input.mousePointer.rightButton.isDown) {//if user right clicked
        if(this.selected) {//and we are selected
           // this.selected = false; //reset
            this.removeBodyRing(); //reset
            var destinationPoint;
            var targetEnemyNearClick = playState.getNearbySoviet(new Phaser.Point(game.input.mousePointer.worldX, game.input.mousePointer.worldY));
            if(targetEnemyNearClick) {//if user clicked near enemy
                this.targetEnemy = targetEnemyNearClick;
                this.ignoreEnemies = true; //don't kill enemies along the way 
                destinationPoint = new Phaser.Point(this.targetEnemy.body.x, this.targetEnemy.body.y); //destination is the enemy soldier   
               // this.finalDestination = destinationPoint;       
            } else {//user clicked in space
               if(this.enemiesInAttackRadius.length > 0 || this.enemiesInViewRadius.length > 0) { //we are trying to retreat
                   this.ignoreEnemies = true;//don't attack enemies on our way out (sets back to false when we reach destination)
               } else {
                   this.ignoreEnemies = false;//keep our gaurd up
               }
               this.targetEnemy = null;//if we had a target, remove it
               destinationPoint = new Phaser.Point(game.input.mousePointer.worldX, game.input.mousePointer.worldY)//destination is the click
               this.finalDestination = destinationPoint;
            }
            var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(destinationPoint.x, destinationPoint.y)); // sets currentPath implictly
               if(path.length > 0) {//if there is a path -
                this.addPath(path);
               } else {
                //console.log("in rightButton is down user clicked in space");
               }
        }
    }   

   
    if(this.ignoreEnemies === false) {//we can attack when enemies are nearby
        var newTargetEnemy;
        if(this.targetEnemy && this.enemiesInAttackRadius.includes(this.targetEnemy)) {// we have a targetEnemy and he is nearby
              this.finalDestination = null;
              this.shoot(this.targetEnemy); //shoot him
        } else {//we don't have a targetEnemy || he is outside our attack radius 
         if(newTargetEnemy = this.getClosestIn(this.enemiesInAttackRadius)) {//someone else is in our attack radius
              this.finalDestination = null;
              this.targetEnemy = newTargetEnemy;//assign as new target enemy
              
              this.shoot(this.targetEnemy);//shoot him
          } else if(newTargetEnemy = this.getClosestIn(this.enemiesInViewRadius)) {//someone in our view radius
                if(!this.targetEnemy) {
                     this.targetEnemy = newTargetEnemy;
                     this.finalDestination = new Phaser.Point(this.targetEnemy.x, this.targetEnemy.y);
                     var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(newTargetEnemy.body.x, newTargetEnemy.body.y)); // sets currentPath implictly
                     if(path.length > 0) {//if there is a path -
                        this.addPath(path); //add to currentPath
                     }
                }
                this.step();
          } else {
              if(this.targetEnemy) {
                  if(this.currentPath.length > 0) {//if empty
                  var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(this.targetEnemy.body.x, this.targetEnemy.body.y)); // sets currentPath implictly
                     if(path.length > 0) {//if there is a path -
                        this.addPath(path); //add to currentPath
                     }
                  }
              }
              this.step(); //keep moving or standing while on the lookout for enemies
          }
      }
    } else {//we are currently ignoring enemies
        if(this.targetEnemy && this.enemiesInAttackRadius.includes(this.targetEnemy)) {//if we have a targetEnemy and he is nearby
            this.finalDestination = null;
            this.shoot(this.targetEnemy); 
        } else { //our targetEnemy is not in our attack radius
            if (this.currentPath.length === 0) {//reached our destination
                if(this.targetEnemy) {
                 var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(this.targetEnemy.x, this.targetEnemy.y)); // sets currentPath implictly
                 if(path.length > 0) {//if there is a path -
                    this.addPath(path); //add to currentPath
                  } 
                }
                this.ignoreEnemies = false; //reset

            }   
            this.step(); //stand gaurd or keep running towards destination
       }
   }

   if(this.finalDestination) {//if we haven't reached our desination
       if(this.currentPath.length === 0) {
           if(!this.targetEnemy) {
              if(Phaser.Math.distance(this.body.x, this.body.y, this.finalDestination.x, this.finalDestination.y) > this.maxRetryDistance) {
                 var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(this.finalDestination.x, this.finalDestination.y)); // sets currentPath implictly
                 if(path.length > 0) {//if there is a path -
                    this.addPath(path); //add to currentPath
                  } 
           } 
           }
           
           
       }
       
   }


} 
};