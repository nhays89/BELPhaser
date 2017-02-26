function American(x, y) {
    this.faction = 'green';

    this.sprite = game.add.sprite(x, y, 'green');

    this.sprite.animations.add('green-stand-north', ['green-stand-north'], 1, false, false);
    this.sprite.animations.add('green-stand-northwest', ['green-stand-northwest'], 1, false, false);
    this.sprite.animations.add('green-stand-west', ['green-stand-west'], 1, false, false);
    this.sprite.animations.add('green-stand-southwest', ['green-stand-southwest'], 1, false, false);
    this.sprite.animations.add('green-stand-south', ['green-stand-south'], 1, false, false);
    this.sprite.animations.add('green-stand-southeast', ['green-stand-southeast'], 1, false, false);
    this.sprite.animations.add('green-stand-east', ['green-stand-east'], 1, false, false);
    this.sprite.animations.add('green-stand-northeast', ['green-stand-northeast'], 1, false, false);

    this.sprite.animations.add('green-run-east', Phaser.Animation.generateFrameNames('green-run-east', 0, 5), 6, false, false);
    this.sprite.animations.add('green-run-west', Phaser.Animation.generateFrameNames('green-run-west', 0, 5), 6, false, false);
    this.sprite.animations.add('green-run-north', Phaser.Animation.generateFrameNames('green-run-north', 0, 5), 6, false, false);
    this.sprite.animations.add('green-run-south', Phaser.Animation.generateFrameNames('green-run-south', 0, 5), 6, false, false);

    this.sprite.animations.add('green-run-northwest', Phaser.Animation.generateFrameNames('green-run-northwest', 0, 5), 6, false, false);
    this.sprite.animations.add('green-run-northeast', Phaser.Animation.generateFrameNames('green-run-northeast', 0, 5), 6, false, false);
    this.sprite.animations.add('green-run-southweset', Phaser.Animation.generateFrameNames('green-run-southwest', 0, 5), 6, false, false);
    this.sprite.animations.add('green-run-southeast', Phaser.Animation.generateFrameNames('green-run-southeast', 0, 5), 6, false, false);

    this.sprite.animations.add('green-fire-north', Phaser.Animation.generateFrameNames('green-fire-north', 0, 5), 6, false, false);
    this.sprite.animations.add('green-fire-south', Phaser.Animation.generateFrameNames('green-fire-south', 0, 5), 6, false, false);
    this.sprite.animations.add('green-fire-west', Phaser.Animation.generateFrameNames('green-fire-west', 0, 5), 6, false, false);
    this.sprite.animations.add('green-fire-east', Phaser.Animation.generateFrameNames('green-fire-east', 0, 5), 6, false, false);
    this.sprite.animations.add('green-fire-northwest', Phaser.Animation.generateFrameNames('green-fire-northwest', 0, 5), 6, false, false);
    this.sprite.animations.add('green-fire-northeast', Phaser.Animation.generateFrameNames('green-fire-northeast', 0, 5), 6, false, false);
    this.sprite.animations.add('green-fire-southwest', Phaser.Animation.generateFrameNames('green-fire-southwest', 0, 5), 6, false, false);
    this.sprite.animations.add('green-fire-southeast', Phaser.Animation.generateFrameNames('green-fire-southeast', 0, 5), 6, false, false);

    this.sprite.animations.add('green-die-west', Phaser.Animation.generateFrameNames('green-die-west', 0, 14), 14, false, false);
    this.sprite.animations.add('green-die-east', Phaser.Animation.generateFrameNames('green-die-east', 0, 14), 14, false, false);

    game.physics.p2.enable(this.sprite);
    this.sprite.body.setCircle(20);
    this.sprite.body.damping = .9999999999;
    this.sprite.body.fixedRotation = true;

    Soldier.call(this, this.sprite);
}

American.prototype.init = function () {

};

American.prototype = new Soldier();
American.constructor = American;
