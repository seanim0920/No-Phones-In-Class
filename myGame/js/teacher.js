TeacherPreload = function(game) {
	// preload images
	game.load.audio('speech', 'assets/audio/gibberish.mp3');
	game.load.audio('badend', 'assets/audio/badend.mp3');
	game.load.audio('caught', 'assets/audio/caught2.mp3');
	game.load.audio('alert', 'assets/audio/exclamation.wav');
	game.load.audio('warn', 'assets/audio/warning.mp3');
	game.load.video('warning', 'assets/video/warning.webm');
	game.load.video('turnleft', 'assets/video/turnleft.webm');
	game.load.video('turnright', 'assets/video/turnright.webm');
	game.load.video('walkleft', 'assets/video/walkleft.webm');
	game.load.video('walkright', 'assets/video/walkright.webm');
	game.load.video('returnleft', 'assets/video/returnleft.webm');
	game.load.video('returnright', 'assets/video/returnright.webm');
	game.load.video('peek', 'assets/video/peek.webm');
	game.load.video('draw', 'assets/video/drawing.webm');
	game.load.video('appear', 'assets/video/pop.webm');
	game.load.image('come', 'assets/img/coming.png');
	game.load.audio('pop', 'assets/audio/whoosh.mp3');
}

//constructor for teacher
var Teacher = function(game, x, y, frontlayer, backlayer) {
	this.WAIT_UNTIL_START = 1;

	this.startDelay = 10;
	this.endDelay = 15;
	this.safe_zone = -75;
	this.offset_y = y;
	//refer to the constructor for the sprite object in Phaser
	this.creepy = game.add.audio('music');
	this.warnsound = game.add.audio('warn');
	this.alert = game.add.audio('alert');
	this.warnvid = game.add.video('warning');
	this.peek = game.add.video('peek');
	this.turnright = game.add.video('turnright');
	this.turnleft = game.add.video('turnleft');
	this.walkright = game.add.video('walkright');
	this.walkleft = game.add.video('walkleft');
	this.returnright = game.add.video('returnright');
	this.returnleft = game.add.video('returnleft');
	this.goback = game.add.video('goback');
	this.music = game.add.audio('speech');
	this.appear = game.add.video('appear');
	this.teacherAnim = game.add.video('draw');
	this.disappear = game.add.audio('pop');
	this.music.play('', 0, 1, true);
	Phaser.Sprite.call(this, game, x, y);	
	this.anchor.setTo(0.5,1);
	this.scale.setTo(1);
	this.caught = false;
	this.caughtCallback = function(){};
	this.loadTexture(this.teacherAnim);
	this.teacherAnim.play(true);
	this.canSeePlayer = true;
	this.speed = 1;
	this.distance = 100;
	this.lost = false;
	this.frontlayer = frontlayer;
	this.backlayer = backlayer;
	this.originalY = y;

	game.time.events.add(Phaser.Timer.SECOND * (this.WAIT_UNTIL_START), this.move, this, true);
};

//set snow's prototype to that from the phaser sprite object
Teacher.prototype = Object.create(Phaser.Sprite.prototype);
//set the constructor for the prototype
Teacher.prototype.constructor = Teacher;

Teacher.prototype.setPlayerVisibility = function(visible) {
	this.canSeePlayer = visible;
};

//have teacher hide behind one of the students
//students come in from the sides. sometimes the teacher will leave from the sides and hide behind one of them. scare them and the teacher will come out.
Teacher.prototype.init_vignette = function(vignette, frame)
{
	this.vignette = vignette;
	this.vignetteFrame = frame;
};

Teacher.prototype.screen_fadeTo = function(_alpha)
{
	game.add.tween(this.vignetteFrame).to({alpha: _alpha},Phaser.Timer.SECOND,Phaser.Easing.Circular.Out, true);
	game.add.tween(this.vignette).to({alpha: _alpha},Phaser.Timer.SECOND,Phaser.Easing.Circular.Out, true);
}

Teacher.prototype.pop = function() {
	this.disappear.play();
	if (!this.stopMoving) {
	this.stopMoving = true;

	this.music.pause();
	//game.add.tween(this.spawner).to( { x: '-850' }, 2000, Phaser.Easing.Circular.Out, true)
	tween = game.add.tween(this).to( { y: 2400 }, 600, Phaser.Easing.Circular.Out, true);
	tween.onComplete.add(function () {
		this.screen_fadeTo(0.85);
		this.frontlayer.add(this);
		this.creepy.play();
		this.x = game.rnd.realInRange(500, game.world.width - 500);
		game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 6)), function() {
			this.y = this.originalY;
			this.loadTexture(this.appear);	
			this.appear.play();	
			this.creepy.stop();
			this.appear.onComplete.addOnce(function() {
				if (Math.abs(game.input.x - this.x) <= 400) {
					console.log("you failed, he was at" + this.x + "with a distance of " +Math.abs(game.input.x - this.x) + "with a height of " + this.y );
					game.state.start('End', true, false, {finalscore: 0});
				} else {
					this.scale.setTo(1);
					this.loadTexture(this.teacherAnim);
					this.backlayer.add(this);
					this.neutralStance();
					game.camera.flash(0x000000, 400);
					this.screen_fadeTo(0);
				}
			}, this);
		}, this);
	}, this);
	}
};

Teacher.prototype.move = function(goRight) {
	if (!this.stopMoving) {
		this.stopMoving = true;
		//mutate first to fit the format of the other clips

		this.music.pause();
		let turnAnim = this.turnleft;
		if (goRight) {
			turnAnim = this.turnright;
		}
		this.loadTexture(turnAnim);
		turnAnim.play();
		turnAnim.onComplete.addOnce(function() {
			this.music.resume();
			var speed = 5;
			if (!goRight) {
				speed *= -1;
			}
			let walkAnim = this.walkleft;
			if (goRight) {
				walkAnim = this.walkright;
			}
			this.loadTexture(walkAnim);
			walkAnim.play(true);
			var check = game.time.events.loop(0, moveTeacherAndCheckIfOutOfBounds, this, speed, check, stop, walkAnim);
			var stop = game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 3)), returnToIdle, this, check, stop, walkAnim);
		}, this);

		moveTeacherAndCheckIfOutOfBounds = function(speed, check, stop, walkAnim) {
			if ((this.x + speed < 400 || this.x + speed > game.world.width - 400)) {
				returnToIdle.call(this, check,stop,walkAnim);
			}
			this.x += speed;
		}

		returnToIdle = function(check, stop, walkAnim) {
			game.time.events.remove(check);
			game.time.events.remove(stop);
			walkAnim.stop();
			returnAnim = this.returnleft;
			if (goRight) {
				returnAnim = this.returnright;
			}
			this.loadTexture(returnAnim);
			returnAnim.play();
			returnAnim.onComplete.addOnce(function() {
				this.neutralStance();
			}, this);
		}
	}
};

Teacher.prototype.turn = function(peekRight) {
  if (!this.stopMoving) {
    this.stopMoving = true;
    var turnAnim = this.peek;
    var peekStart = 0.65;
    var peekDuration = 1;
    this.music.pause();
    this.loadTexture(turnAnim);
    turnAnim.play();
    game.time.events.add(Phaser.Timer.SECOND * (peekStart), 
      function () {
        var check = game.time.events.loop(0, () => {
          if (this.checkIfVisible()) {
            game.time.events.remove(check);
            this.caught = true;
            this.alert.play();
          }
        }, this, peekRight);
        game.time.events.add(Phaser.Timer.SECOND * (peekDuration), function() {game.time.events.remove(check)}, this);
      },
    this);
    turnAnim.onComplete.addOnce(this.checkIfYouLost, this);
	}
};

Teacher.prototype.checkIfVisible = function() {
	//console.log('peeking direction? ' + peekRight);
	if (this.canSeePlayer == true) {
		return true;
	}
};

Teacher.prototype.checkIfYouLost = function() {
	console.log('did you lose?');
	if (this.caught) {
		this.stopMoving = false;
		this.pop();
		//this.caughtCallback();
		console.log('yeah');
	} else {
		this.neutralStance();
	}
};

Teacher.prototype.setCallbackWhenCaught = function(callback) {
	this.caughtCallback = callback;
};

Teacher.prototype.neutralStance = function() {
	this.y = this.originalY;
	this.music.resume();
	this.idle();
};

Teacher.prototype.idle = function() {
	this.stopMoving = false;
	this.caught = false;
	if (this.startDelay > 3) {
		this.startDelay -= Math.random()/6;
	}
	if (this.endDelay > 7) {
		this.endDelay -= Math.random()/6;
	}
	this.loadTexture(this.teacherAnim);
	var delay = game.rnd.realInRange(this.startDelay, this.endDelay);
	var right = 0;
	var left = 1;
	var move = game.rnd.integerInRange(0, 4);
	var direction = game.rnd.integerInRange(right, left);
	game.time.events.add(Phaser.Timer.SECOND * (delay), function () {
		if (!this.stopMoving) {
			if (move < 4) {
				this.turn(direction == right);
			}
			else {
				var direction = right;
				if (this.x >= game.world.centerX) {
					direction = left;
				}
				this.move(direction == right);
			}
		}
	}, this);
};

Teacher.prototype.hearNoise = function() {
	if (!this.stopMoving) {
		this.pop();
	}
};

/*
Teacher.prototype.come = function() {
	game.time.events.removeAll();
	this.neutralStance();
	this.stopMoving = true;
	//mutate first to fit the format of the other clips
	//this.scale.setTo(1);
	this.music.pause();
	this.loadTexture('come');
	var check = game.time.events.loop(0, function () {
		if (this.distance <= 0) {
			game.time.events.remove(check);
			if (Math.abs(game.input.x - this.x) <= 40) {
				var wait = game.time.events.loop(0, function () {
					if (!this.canSeePlayer) {
						game.time.events.remove(wait);
						if (Math.abs(this.x - game.input.x) < 300)
							game.state.start('End', true, false, {finalscore: this.score});
					}
				});
			}
		}
		this.y += 12;
		this.distance -= 1;
		this.scale.setTo(0.9 + (100-this.distance)/40);
		if (this.x < game.input.x) {
			this.x += 1;
		} else {
			this.x -= 1;
		}
		if (!this.bottom) {
			game.time.events.remove(check);
		}
	}, this);
	this.stopMoving = false;
}*/