TeacherPreload = function(game) {
	// preload images
	game.load.audio('speech', 'assets/audio/gibberish.mp3');
	game.load.audio('badend', 'assets/audio/badend.mp3');
	game.load.audio('caught', 'assets/audio/caught2.mp3');
	game.load.audio('alert', 'assets/audio/exclamation.wav');
	game.load.audio('whoosh', 'assets/audio/whoosh.mp3');
	game.load.video('turnleft', 'assets/video/turnleft.webm');
	game.load.video('turnright', 'assets/video/turnright.webm');
	game.load.video('walkleft', 'assets/video/walkleft.webm');
	game.load.video('walkright', 'assets/video/walkright.webm');
	game.load.video('returnleft', 'assets/video/returnleft.webm');
	game.load.video('returnright', 'assets/video/returnright.webm');
	game.load.video('peek', 'assets/video/peek.webm');
	game.load.video('draw', 'assets/video/drawing.webm');
	game.load.video('drawOverlap', 'assets/video/drawing.webm');
	game.load.video('appear', 'assets/video/pop.webm');
	game.load.image('come', 'assets/img/coming.png');
}

//constructor for teacher
var Teacher = function(game, frontlayer, backlayer) {
	//adjust this when debugging
	this.WAIT_UNTIL_START = 1;
	
	this.originalY = game.world.height - 100;
	this.originalX = game.world.centerX;
	this.startDelay = 10;
	this.endDelay = 15;
	this.safe_zone = -75;
	this.suspicion = 0;
	this.suspicionMax = 1000;
	this.coming = false; //teacher is currently hunting you
	this.cooldown = true; //alert cooldown phase
	//refer to the constructor for the sprite object in Phaser
	this.creepy = game.add.audio('music');
	this.warnsound = game.add.audio('warn');
	this.alert = game.add.audio('alert');
	this.warnvid = game.add.video('warning');
	this.peek = game.add.video('peek');
	this.turnright = game.add.video('turnright');
	this.turnright.volume = 0;
	this.turnleft = game.add.video('turnleft');
	this.turnleft.volume = 0;
	this.walkright = game.add.video('walkright');
	this.walkright.volume = 0;
	this.walkleft = game.add.video('walkleft');
	this.walkleft.volume = 0;
	this.returnright = game.add.video('returnright');
	this.returnright.volume = 0;
	this.returnleft = game.add.video('returnleft');
	this.returnleft.volume = 0;
	this.music = game.add.audio('speech');
	this.appear = game.add.video('appear');
	this.idleAnim = game.add.video('draw');
	this.idleAnimOverlap = game.add.video('drawOverlap');
	this.disappear = game.add.audio('whoosh');
	this.music.play('', 0, 1, true);
	Phaser.Sprite.call(this, game, this.originalX, this.originalY, "", 1, 1);	
	this.anchor.setTo(0.5,1);
	this.scale.setTo(0.4);
	this.caught = false;
	this.caughtCallback = function(){};
	this.canSeePlayer = true;
	this.speed = 1;
	this.distance = 100;
	this.frontlayer = frontlayer;
	this.backlayer = backlayer;
	
	this.alertMeter = game.time.create(false);

	this.neutralStance();
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
	if (!this.coming) {
		this.cooldown = false;
		this.coming = true;
		this.suspicion = this.suspicionMax;
		this.alertMeter.stop();
		this.disappear.play();
		this.stopMoving = true;

		this.music.pause();
		//game.add.tween(this.spawner).to( { x: '-850' }, 2000, Phaser.Easing.Circular.Out, true)
		tween = game.add.tween(this).to( { y: 2400 }, 600, Phaser.Easing.Circular.Out, true);
		tween.onComplete.add(function () {
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
						this.suspicion = 0;
						this.cooldown = true;
						this.coming = false;
						this.backlayer.add(this);
						this.neutralStance();
						game.camera.flash(0x000000, 600);
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

Teacher.prototype.vignette_setTo = function(_alpha) {
	this.vignetteFrame.alpha = _alpha;
	this.vignette.alpha = _alpha;
}

Teacher.prototype.update = function()
{
	//console.log(this.suspicion);
	this.vignette_setTo(this.suspicion/(this.suspicionMax + 177));
	if (this.cooldown)
	{
		if (this.suspicion > 0)
			this.suspicion-= 3;
	}
}

Teacher.prototype.raiseAlert = function(amount) {
	this.suspicion += amount;
	this.cooldown = false;
	this.alertMeter.stop();
	if (!this.coming)
	{
		this.alertMeter.add(Phaser.Timer.SECOND*3,function() {this.cooldown = true;},this);
		this.alertMeter.start();
	}
	if (this.suspicion >= this.suspicionMax)
	{
		this.suspicion = this.suspicionMax;
		if (!this.coming) {
			this.pop();
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
  }
};

Teacher.prototype.checkIfVisible = function() {
	//console.log('peeking direction? ' + peekRight);
	if (this.canSeePlayer == true) {
		return true;
	}
};

Teacher.prototype.checkIfPlayerIsCaught = function() {
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

	this.idleAnim.play();
	this.idleAnim.onComplete.add(
		function() {
			this.loadTexture(this.idleAnimOverlap);
			this.idleAnimOverlap.play();
			this.idleAnim.play();
			game.time.events.add(0, function() {
			 	this.idleAnim.stop();
			}, this);
		}, this
	);
	this.idleAnimOverlap.onComplete.add(
		function() {
			this.loadTexture(this.idleAnim);
			this.idleAnim.play();
			this.idleAnimOverlap.play();
			game.time.events.add(0, function() {
			 	this.idleAnimOverlap.stop();
			}, this);
		}, this
	);
	this.loadTexture(this.idleAnim);

	var delay = game.rnd.realInRange(this.startDelay, this.endDelay);
	var right = 0;
	var left = 1;
	var move = game.rnd.integerInRange(0, 4);
	var direction = game.rnd.integerInRange(right, left);
	var checkIfOpen = game.time.events.loop(Phaser.Timer.SECOND * (delay), function () {
		if (!this.stopMoving) {
			game.time.events.remove(checkIfOpen);
			this.idleAnim.stop();
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

//trigger if hidden under seat for too long
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