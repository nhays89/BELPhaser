function American(x, y) {
    this.faction = 'american';

    this.sprite = game.add.sprite(x, y, 'american');

    this.sprite.animations.add('american-stand-north', ['american-stand-north'], 1, false, false);
    this.sprite.animations.add('american-stand-northwest', ['american-stand-northwest'], 1, false, false);
    this.sprite.animations.add('american-stand-west', ['american-stand-west'], 1, false, false);
    this.sprite.animations.add('american-stand-southwest', ['american-stand-southwest'], 1, false, false);
    this.sprite.animations.add('american-stand-south', ['american-stand-south'], 1, false, false);
    this.sprite.animations.add('american-stand-southeast', ['american-stand-southeast'], 1, false, false);
    this.sprite.animations.add('american-stand-east', ['american-stand-east'], 1, false, false);
    this.sprite.animations.add('american-stand-northeast', ['american-stand-northeast'], 1, false, false);

    this.sprite.animations.add('american-run-east', Phaser.Animation.generateFrameNames('american-run-east', 0, 5), 6, false, false);
    this.sprite.animations.add('american-run-west', Phaser.Animation.generateFrameNames('american-run-west', 0, 5), 6, false, false);
    this.sprite.animations.add('american-run-north', Phaser.Animation.generateFrameNames('american-run-north', 0, 5), 6, false, false);
    this.sprite.animations.add('american-run-south', Phaser.Animation.generateFrameNames('american-run-south', 0, 5), 6, false, false);

    this.sprite.animations.add('american-run-northwest', Phaser.Animation.generateFrameNames('american-run-northwest', 0, 5), 6, false, false);
    this.sprite.animations.add('american-run-northeast', Phaser.Animation.generateFrameNames('american-run-northeast', 0, 5), 6, false, false);
    this.sprite.animations.add('american-run-southweset', Phaser.Animation.generateFrameNames('american-run-southwest', 0, 5), 6, false, false);
    this.sprite.animations.add('american-run-southeast', Phaser.Animation.generateFrameNames('american-run-southeast', 0, 5), 6, false, false);

    this.sprite.animations.add('american-fire-north', Phaser.Animation.generateFrameNames('american-fire-north', 0, 5), 6, false, false);
    this.sprite.animations.add('american-fire-south', Phaser.Animation.generateFrameNames('american-fire-south', 0, 5), 6, false, false);
    this.sprite.animations.add('american-fire-west', Phaser.Animation.generateFrameNames('american-fire-west', 0, 5), 6, false, false);
    this.sprite.animations.add('american-fire-east', Phaser.Animation.generateFrameNames('american-fire-east', 0, 5), 6, false, false);
    this.sprite.animations.add('american-fire-northwest', Phaser.Animation.generateFrameNames('american-fire-northwest', 0, 5), 6, false, false);
    this.sprite.animations.add('american-fire-northeast', Phaser.Animation.generateFrameNames('american-fire-northeast', 0, 5), 6, false, false);
    this.sprite.animations.add('american-fire-southwest', Phaser.Animation.generateFrameNames('american-fire-southwest', 0, 5), 6, false, false);
    this.sprite.animations.add('american-fire-southeast', Phaser.Animation.generateFrameNames('american-fire-southeast', 0, 5), 6, false, false);

    this.sprite.animations.add('american-die-west', Phaser.Animation.generateFrameNames('american-die-west', 0, 14), 14, false, false);
    this.sprite.animations.add('american-die-east', Phaser.Animation.generateFrameNames('american-die-east', 0, 14), 14, false, false);

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
