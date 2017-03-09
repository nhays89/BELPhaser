function Soviet(game, x, y) {
    Soldier.call(this, game, x, y, 'soviet');
    this.type = "Soviet";
    this.animations.add('soviet-stand-north', ['soviet-stand-north'], 1, false, false);
    this.animations.add('soviet-stand-northwest', ['soviet-stand-northwest'], 1, false, false);
    this.animations.add('soviet-stand-west', ['soviet-stand-west'], 1, false, false);
    this.animations.add('soviet-stand-southwest', ['soviet-stand-southwest'], 1, false, false);
    this.animations.add('soviet-stand-south', ['soviet-stand-south'], 1, false, false);
    this.animations.add('soviet-stand-southeast', ['soviet-stand-southeast'], 1, false, false);
    this.animations.add('soviet-stand-east', ['soviet-stand-east'], 1, false, false);
    this.animations.add('soviet-stand-northeast', ['soviet-stand-northeast'], 1, false, false);

    this.animations.add('soviet-run-east', Phaser.Animation.generateFrameNames('soviet-run-east', 0, 5), 6, false, false);
    this.animations.add('soviet-run-west', Phaser.Animation.generateFrameNames('soviet-run-west', 0, 5), 6, false, false);
    this.animations.add('soviet-run-north', Phaser.Animation.generateFrameNames('soviet-run-north', 0, 5), 6, false, false);
    this.animations.add('soviet-run-south', Phaser.Animation.generateFrameNames('soviet-run-south', 0, 5), 6, false, false);

    this.animations.add('soviet-run-northwest', Phaser.Animation.generateFrameNames('soviet-run-northwest', 0, 5), 6, false, false);
    this.animations.add('soviet-run-northeast', Phaser.Animation.generateFrameNames('soviet-run-northeast', 0, 5), 6, false, false);
    this.animations.add('soviet-run-southwest', Phaser.Animation.generateFrameNames('soviet-run-southwest', 0, 5), 6, false, false);

    this.animations.add('soviet-run-southeast', Phaser.Animation.generateFrameNames('soviet-run-southeast', 0, 5), 6, false, false);

    this.animations.add('soviet-fire-north', Phaser.Animation.generateFrameNames('soviet-fire-north', 0, 5), 6, false, false);
    this.animations.add('soviet-fire-south', Phaser.Animation.generateFrameNames('soviet-fire-south', 0, 5), 6, false, false);
    this.animations.add('soviet-fire-west', Phaser.Animation.generateFrameNames('soviet-fire-west', 0, 5), 6, false, false);
    this.animations.add('soviet-fire-east', Phaser.Animation.generateFrameNames('soviet-fire-east', 0, 5), 6, false, false);
    this.animations.add('soviet-fire-northwest', Phaser.Animation.generateFrameNames('soviet-fire-northwest', 0, 5), 6, false, false);
    this.animations.add('soviet-fire-northeast', Phaser.Animation.generateFrameNames('soviet-fire-northeast', 0, 5), 6, false, false);
    this.animations.add('soviet-fire-southwest', Phaser.Animation.generateFrameNames('soviet-fire-southwest', 0, 5), 6, false, false);
    this.animations.add('soviet-fire-southeast', Phaser.Animation.generateFrameNames('soviet-fire-southeast', 0, 5), 6, false, false);

    this.animations.add('soviet-die-west', Phaser.Animation.generateFrameNames('soviet-die-west', 0, 14), 14, false, false);
    this.animations.add('soviet-die-east', Phaser.Animation.generateFrameNames('soviet-die-east', 0, 14), 14, false, false);
}


Soviet.prototype = Object.create(Soldier.prototype);
Soviet.prototype.constructor = Soviet;

Soviet.prototype.update = function() {
if(this.health <= 0) {
    this.alive = false;
    this.die(); //removed from group in 7000 millis
} else {

    this.updateNearbyEnemies(); //removes dead soldiers 

     if(this.targetEnemy) {
        if(!(this.targetEnemy.alive)) {//if we had a targetEnemy but he is dead
            this.currentPath = []; //reset
            this.targetEnemy = null; //reset
        }
    }

    var newTargetEnemy;

    if(this.targetEnemy) {
        if(this.enemiesInAttackRadius.contains(this.targetEnemy)) {
          this.shoot(this.targetEnemy);
        } else if(newTargetEnemy = this.enemiesInAttackRadius.getClosestTo(this)) {
          this.currentPath = [];
          this.targetEnemy = newTargetEnemy;
          this.shoot(this.targetEnemy);
        } else if(newTargetEnemy = this.enemiesInViewRadius.getClosestTo(this)) {
              if(newTargetEnemy !== this.targetEnemy) {
                this.targetEnemy = newTargetEnemy;
                var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(this.targetEnemy.body.x, this.targetEnemy.body.y));
                 if(path.length > 0) {//if there is a path -
                    this.addPath(path);
                   } 
                 } else {
                    if(this.currentPath.length === 0) {
                      var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(this.targetEnemy.body.x, this.newTargetEnemy.body.y));
                      if(path.length > 0) {//if there is a path -
                        this.addPath(path);
                    } 

                    }

                 }
               this.step();
        } else {
          this.step();
        }



    } else {//we don't have a target enemy
          if(newTargetEnemy = this.enemiesInAttackRadius.getClosestTo(this)) {
                this.currentPath = [];
                this.targetEnemy = newTargetEnemy;
                shoot(this.targetEnemy);
            } else if(newTargetEnemy = this.enemiesInViewRadius.getClosestTo(this)) {
                this.targetEnemy = newTargetEnemy;
                var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(this.targetEnemy.body.x, this.targetEnemy.body.y));
                 if(path.length > 0) {//if there is a path -
                    this.addPath(path);
                   } 
                   this.step();
            } else {
              if(this.currentPath.length === 0) {
                      var rndCoord = this.generateRandCoord();
                      var myCoord = new Phaser.Point(this.body.x, this.body.y);
                      var path = this.generatePath(myCoord, rndCoord);
                      if(path.length > 0) {//if there is a path -
                           this.addPath(path);
                      }
                  }
                  this.step(); //keep moving or standing while on the lookout for enemies
            }
    }







}



//     if(this.targetEnemy && this.enemiesInAttackRadius.contains(this.targetEnemy)) {// we have a targetEnemy and he is nearby
//           shoot(this.targetEnemy); //shoot him
//     } else {//we don't have a targetEnemy || he is outside our attack radius 
//           if (newTargetEnemy = this.enemiesInAttackRadius.getClosestTo(this)) {//someone else is in our attack radius
//               this.currentPath = []; //reset
//               this.targetEnemy = newTargetEnemy;//assign as new target enemy
//               shoot(this.targetEnemy);//shoot him
//           } else if(newTargetEnemy = this.enemiesInViewRadius.getClosestTo(this)) {//someone else in our view radius
//             if(newTargetEnemy )
//              this.targetEnemy = newTargetEnemy;
//              var path = this.generatePath(new Phaser.Point(this.body.x, this.body.y), new Phaser.Point(newTargetEnemy.body.x, newTargetEnemy.body.y));
//              if(path.length > 0) {//if there is a path -
//                 this.addPath(path);
//                } 
//                this.step();

//           } else {
//               if(this.currentPath.length === 0) {
//                   var rndCoord = this.generateRandCoord();
//                   var myCoord = new Phaser.Point(this.body.x, this.body.y);
//                   var path = this.generatePath(myCoord, rndCoord);
//                   if(path.length > 0) {//if there is a path -
//                        this.addPath(path);
//                   }
//               }
//               this.step(); //keep moving or standing while on the lookout for enemies
//         }
//    }

// }






};
