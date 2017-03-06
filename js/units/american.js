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
    
    if(game.input.mousePointer.rightButton.isUp) {//if user right clicked
        if(this.selected) {//and we are selected
            var targetEnemyNearClick = this.getNearbySoviet(game.input.mousePointer.position);
            if(targetEnemyNearClick) {//if user clicked near enemy
                this.targetEnemy = targetEnemyNearClick;
                this.ignoreEnemies = false; //kill enemies along the way if needed
            } else {//user clicked in space
               if(this.enemiesInAttackRadius.children.length > 0) { //we are trying to retreat
                   this.ignoreEnemies = true;//don't attack enemies on our way out (set this back to false when we reach destination)
               } else {
                   this.ignoreEnemies = false;//keep our gaurd up
               }
               this.targetEnemy = null;//if we had a target, remove it
               this.currentPath = game.pathfinder.findPath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(targetEnemy.body.x, targetEnemy.body.y)); //get new path to destination
            }
        }
    }   
    
    var enemyInView;
    var enemyInAttack;
    if(this.ignoreEnemies === false) {//we can attack at will
        if(enemyInAttack = this.enemiesInAttackRadius.getClosestTo(this)) {//if we have an enemy in attack radius & he is really close
            this.currentPath = null;//if we were walking somewhere, stop and shoot
            this.shoot(this.closestEnemy);
         } else if(enemyInView = this.enemiesInViewRadius.getClosestTo(this)) {//we have an enemy in view radius but he is far away
            
            if(this.targetEnemy !== enemyInView) { //if its not our current target soldier 
                this.targetEnemy = enemyInView; //he is now
                this.currentPath = game.pathfinder.findPath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(this.targetEnemy.body.x, this.targetEnemy.body.y));
                    
            }
            //moveTo(next on stack)
         } else if(this.targetEnemy && this.targetEnemy.isAlive) { //we are still looking for him
            this.currentPath = game.pathfinder.findPath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(this.targetEnemy.body.x, this.targetEnemy.body.y));
            //moveTo(next on stack)
         } else if(this.currentPath.length > 0) { //go to next coordinate
             //moveTo(next on stack)
         } else { //were have no where to go
             this.stand();
         }
     } else { //we are currently ignoreEnemies
        if(this.currentPath == null || this.currentPath.length === 0) {//we have reached destination
            this.ignoreEnemies = false;
        } else { //we still have destination coords 
            //moveTo(next on stack);
        }
     }

}
    
}