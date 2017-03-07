function American(game, x, y) {
    Soldier.call(this, game, x, y, 'american');
    this.type = "American";
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
    this.animations.add('american-run-southweset', Phaser.Animation.generateFrameNames('american-run-southwest', 0, 5), 6, false, false);
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

}

American.prototype = Object.create(Soldier.prototype);
American.prototype.constructor = American;

American.prototype.update = function() {



if(this.health <= 0) {
    this.selected = false;
    this.alive = false;
    this.die(); //removed from group in 7000 millis
} else {
    this.updateNearbyEnemies();
    if(this.targetEnemy && !this.targetEnemy.isAlive) {//if we have a targetEnemy and he is dead
        this.targetEnemy = null; //reset
        this.ignoreEnemies = false; //reset
    }
    if(game.input.mousePointer.rightButton.isUp) {//if user right clicked
        if(this.selected) {//and we are selected
            var targetEnemyNearClick = this.getNearbySoviet(game.input.mousePointer.position);
            if(targetEnemyNearClick) {//if user clicked near enemy
                this.targetEnemy = targetEnemyNearClick;
                this.ignoreEnemies = true; //don't kill enemies along the way 
            } else {//user clicked in space
               if(this.enemiesInAttackRadius.length > 0) { //we are trying to retreat
                   this.ignoreEnemies = true;//don't attack enemies on our way out (set this back to false when we reach destination)
               } else {
                   this.ignoreEnemies = false;//keep our gaurd up
               }
               this.targetEnemy = null;//if we had a target, remove it
               var isPath = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(targetEnemy.body.x, targetEnemy.body.y));
                   if(isPath) {//if there is a path
                       step();
                   } else {
                       //keep doing what you were doing
                   }
            }
        }
    }   
    
    var enemyInView;
    var enemyInAttack;
    if(this.ignoreEnemies === false) {//we can attack when enemies are nearby
        var newTargetEnemy;
        if(this.targetEnemy && this.enemiesInAttackRadius.contains(this.targetEnemy)) {// we have a targetEnemy and he is nearby
              shoot(this.targetEnemy); //shoot him
        } else {//we don't have a targetEnemy || he is outside our attack radius 
         if(newTargetEnemy = this.enemiesInAttackRadius.getClosestTo(this)) {//someone else is in our attack radius
              this.targetEnemy = newTargetEnemy;//assign as new target enemy
              shoot(this.targetEnemy);//shoot him
          }else if(newTargetEnemy = this.enemiesInViewRadius.getClosestTo(this)) {//someone else in our view radius
             this.targetEnemy = newTargetEnemy;
             var isPath = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(newTargetEnemy.body.x, newTargetEnemy.body.y));
             if(isPath) {//if there is a path
                   step(); //chase him
               } else {
                   console.log("in new target enemy view radius no path");
               }
          } else {
              this.step(); //keep moving or standing while on the lookout for enemies
          }
      }
    } else {//we are currently ignoring enemies
        if(this.targetEnemy && this.enemiesInAttackRadius.contains(this.targetEnemy)) {//if we have a targetEnemy and he is nearby
            shoot(this.targetEnemy); 
        } else {
            step();
        }
     }
}
    
};