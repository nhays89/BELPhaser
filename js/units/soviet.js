/*function Soviet(x, y) {
    this.faction = 'soviet';

    this.sprite = game.add.sprite(x, y, 'soviet');

    this.sprite.animations.add('soviet-stand-north', ['soviet-stand-north'], 1, false, false);
    this.sprite.animations.add('soviet-stand-northwest', ['soviet-stand-northwest'], 1, false, false);
    this.sprite.animations.add('soviet-stand-west', ['soviet-stand-west'], 1, false, false);
    this.sprite.animations.add('soviet-stand-southwest', ['soviet-stand-southwest'], 1, false, false);
    this.sprite.animations.add('soviet-stand-south', ['soviet-stand-south'], 1, false, false);
    this.sprite.animations.add('soviet-stand-southeast', ['soviet-stand-southeast'], 1, false, false);
    this.sprite.animations.add('soviet-stand-east', ['soviet-stand-east'], 1, false, false);
    this.sprite.animations.add('soviet-stand-northeast', ['soviet-stand-northeast'], 1, false, false);

    this.sprite.animations.add('soviet-run-east', Phaser.Animation.generateFrameNames('soviet-run-east', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-run-west', Phaser.Animation.generateFrameNames('soviet-run-west', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-run-north', Phaser.Animation.generateFrameNames('soviet-run-north', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-run-south', Phaser.Animation.generateFrameNames('soviet-run-south', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-run-northwest', Phaser.Animation.generateFrameNames('soviet-run-northwest', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-run-northeast', Phaser.Animation.generateFrameNames('soviet-run-northeast', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-run-southwest', Phaser.Animation.generateFrameNames('soviet-run-southwest', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-run-southeast', Phaser.Animation.generateFrameNames('soviet-run-southeast', 0, 5), 6, false, false);

    this.sprite.animations.add('soviet-fire-north', Phaser.Animation.generateFrameNames('soviet-fire-north', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-fire-south', Phaser.Animation.generateFrameNames('soviet-fire-south', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-fire-west', Phaser.Animation.generateFrameNames('soviet-fire-west', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-fire-east', Phaser.Animation.generateFrameNames('soviet-fire-east', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-fire-northwest', Phaser.Animation.generateFrameNames('soviet-fire-northwest', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-fire-northeast', Phaser.Animation.generateFrameNames('soviet-fire-northeast', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-fire-southwest', Phaser.Animation.generateFrameNames('soviet-fire-southwest', 0, 5), 6, false, false);
    this.sprite.animations.add('soviet-fire-southeast', Phaser.Animation.generateFrameNames('soviet-fire-southeast', 0, 5), 6, false, false);

    this.sprite.animations.add('soviet-die-west', Phaser.Animation.generateFrameNames('soviet-die-west', 0, 14), 14, false, false);
    this.sprite.animations.add('soviet-die-east', Phaser.Animation.generateFrameNames('soviet-die-east', 0, 14), 14, false, false);

    game.physics.p2.enable(this.sprite);
    this.sprite.body.setCircle(15);
    this.sprite.body.damping = .9999999999;
    this.sprite.body.fixedRotation = true;

    Soldier.call(this, this.sprite);
}

Soviet.prototype.init = function () {

};

Soviet.prototype = new Soldier();
Soviet.constructor = Soviet;

*/