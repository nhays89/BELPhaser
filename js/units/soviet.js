function Soviet(x, y) {
    this.faction = 'red';

    this.sprite = game.add.sprite(x, y, 'red');

    this.sprite.animations.add('red-stand-north', ['red-stand-north'], 1, false, false);
    this.sprite.animations.add('red-stand-northwest', ['red-stand-northwest'], 1, false, false);
    this.sprite.animations.add('red-stand-west', ['red-stand-west'], 1, false, false);
    this.sprite.animations.add('red-stand-southwest', ['red-stand-southwest'], 1, false, false);
    this.sprite.animations.add('red-stand-south', ['red-stand-south'], 1, false, false);
    this.sprite.animations.add('red-stand-southeast', ['red-stand-southeast'], 1, false, false);
    this.sprite.animations.add('red-stand-east', ['red-stand-east'], 1, false, false);
    this.sprite.animations.add('red-stand-northeast', ['red-stand-northeast'], 1, false, false);

    this.sprite.animations.add('red-run-east', Phaser.Animation.generateFrameNames('red-run-east', 0, 5), 6, false, false);
    this.sprite.animations.add('red-run-west', Phaser.Animation.generateFrameNames('red-run-west', 0, 5), 6, false, false);
    this.sprite.animations.add('red-run-north', Phaser.Animation.generateFrameNames('red-run-north', 0, 5), 6, false, false);
    this.sprite.animations.add('red-run-south', Phaser.Animation.generateFrameNames('red-run-south', 0, 5), 6, false, false);
    this.sprite.animations.add('red-run-northwest', Phaser.Animation.generateFrameNames('red-run-northwest', 0, 5), 6, false, false);
    this.sprite.animations.add('red-run-northeast', Phaser.Animation.generateFrameNames('red-run-northeast', 0, 5), 6, false, false);
    this.sprite.animations.add('red-run-southwest', Phaser.Animation.generateFrameNames('red-run-southwest', 0, 5), 6, false, false);
    this.sprite.animations.add('red-run-southeast', Phaser.Animation.generateFrameNames('red-run-southeast', 0, 5), 6, false, false);

    this.sprite.animations.add('red-fire-north', Phaser.Animation.generateFrameNames('red-fire-north', 0, 5), 6, false, false);
    this.sprite.animations.add('red-fire-south', Phaser.Animation.generateFrameNames('red-fire-south', 0, 5), 6, false, false);
    this.sprite.animations.add('red-fire-west', Phaser.Animation.generateFrameNames('red-fire-west', 0, 5), 6, false, false);
    this.sprite.animations.add('red-fire-east', Phaser.Animation.generateFrameNames('red-fire-east', 0, 5), 6, false, false);
    this.sprite.animations.add('red-fire-northwest', Phaser.Animation.generateFrameNames('red-fire-northwest', 0, 5), 6, false, false);
    this.sprite.animations.add('red-fire-northeast', Phaser.Animation.generateFrameNames('red-fire-northeast', 0, 5), 6, false, false);
    this.sprite.animations.add('red-fire-southwest', Phaser.Animation.generateFrameNames('red-fire-southwest', 0, 5), 6, false, false);
    this.sprite.animations.add('red-fire-southeast', Phaser.Animation.generateFrameNames('red-fire-southeast', 0, 5), 6, false, false);

    this.sprite.animations.add('red-die-west', Phaser.Animation.generateFrameNames('red-die-west', 0, 14), 14, false, false);
    this.sprite.animations.add('red-die-east', Phaser.Animation.generateFrameNames('red-die-east', 0, 14), 14, false, false);

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

