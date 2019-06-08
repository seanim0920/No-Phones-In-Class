TeacherPreload = function(game) {
	// preload images
	game.load.audio('speech', 'assets/audio/gibberish.mp3');
	game.load.audio('badend', 'assets/audio/badend.mp3');
	game.load.audio('caught', 'assets/audio/caught2.mp3');
	game.load.audio('alert', 'assets/audio/exclamation.wav');
	game.load.audio('whoosh', 'assets/audio/whoosh.mp3');
	game.load.audio('breathing', 'assets/audio/heavybreathing.mp3');
	game.load.video('turnleft', 'assets/video/turnleft.webm');
	game.load.video('turnright', 'assets/video/turnright.webm');
	game.load.video('walkleft', 'assets/video/walkleft.webm');
	game.load.video('walkright', 'assets/video/walkright.webm');
	game.load.video('returnleft', 'assets/video/returnleft.webm');
	game.load.video('returnright', 'assets/video/returnright.webm');
	game.load.video('peekright', 'assets/video/peekright.webm');
	game.load.video('peekleft', 'assets/video/peekleft.webm');
	game.load.video('stretching', 'assets/video/stretching.webm');
	game.load.video('stretching2', 'assets/video/stretching2.webm');
	game.load.video('check', 'assets/video/check.webm');
	game.load.video('draw', 'assets/video/drawing.webm');
	game.load.video('drawOverlap', 'assets/video/drawing.webm');
	game.load.video('appear', 'assets/video/pop.webm');
	game.load.video('drop', 'assets/video/drop.webm');
	game.load.image('come', 'assets/img/coming.png');
}

//constructor for teacher
var Teacher = function(game, frontlayer, backlayer, phonelayer) {
	//adjust this when debugging
	this.WAIT_UNTIL_START = 1;
	
	this.stopMoving = true;
	this.originalY = game.world.height - 100;
	this.originalX = game.world.centerX;
	this.startDelay = 10;
	this.endDelay = 15;
	this.safe_zone = -75;
	this.suspicion = 0;
	this.suspicionMax = 1000;
	this.coming = false; //teacher is currently hunting you
	this.cooldown = true; //alert cooldown phase
	this.cooldown_amount = 3;
	//refer to the constructor for the sprite object in Phaser
	this.creepy = game.add.audio('music');
	this.breathing = game.add.audio('breathing');
	this.alert = game.add.audio('alert');
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
	this.drop = game.add.video('drop');
	this.peekleft = game.add.video('peekleft');
	this.peekleft.volume = 0;
	this.peekright = game.add.video('peekright');
	this.peekright.volume = 0;
	this.stretching = game.add.video('stretching');
	this.stretching2 = game.add.video('stretching2');
	this.check = game.add.video('check');
	this.music = game.add.audio('speech');
	this.appear = game.add.video('appear');
	this.idleAnim = game.add.video('draw');
	this.idleAnimOverlap = game.add.video('drawOverlap');
	this.disappear = game.add.audio('whoosh');
	this.music.play('', 0, 1, true);
	Phaser.Sprite.call(this, game, this.originalX, this.originalY, "", 1, 1);	
	this.caughtCallback = function(){};
	this.canSeePlayer = true;
	this.speed = 1;
	this.distance = 100;
	this.frontlayer = frontlayer;
	this.backlayer = backlayer;
	this.x = 0;
	this.alertMeter = game.time.create(false);
	this.scale.setTo(0.4);
	this.anchor.setTo(0.5, 1);

	this.start();
	this.phonelayer = phonelayer;

	this.peekleft.onComplete.add(function() {
		if (!this.coming) {
			this.stopMoving = false;
			this.neutralStance();
		}
	}, this);
	this.peekright.onComplete.add(function() {
		if (!this.coming) {
			this.stopMoving = false;
			this.neutralStance();
		}
	}, this);
	
	this.alertMeter = game.time.create(false);

	chooseRandomIdle = function() {	
		let num = game.rnd.integerInRange(0,8);
		if (num < 2) {
			this.idleAnim.stop();
			if (!this.stopMoving) {
				this.loadTexture(this.stretching);
			}
			this.stretching.play();
			this.stretching.onComplete.addOnce(function() {
				this.loadTexture(this.idleAnim);
				this.idleAnim.play();
			}, this);
		} else if (num == 3) {
			this.idleAnim.stop();
			if (!this.stopMoving) {
				this.loadTexture(this.stretching2);
			}
			this.stretching2.play();
			this.stretching2.onComplete.addOnce(function() {
				this.loadTexture(this.idleAnim);
				this.idleAnim.play();
			}, this);
		}
	}
	
	this.idleAnim.onComplete.add(
		chooseRandomIdle, this
	);
	
	// switchIdle = function(flag) {
	// 	if (flag) {
	// 		if (!this.stopMoving) {
	// 			this.loadTexture(this.idleAnimOverlap);
	// 		}
	// 		this.idleAnimOverlap.play();
	// 		this.idleAnim.currentTime = 1;
	// 	} else {
	// 		if (!this.stopMoving) {
	// 			this.loadTexture(this.idleAnim);
	// 		}
	// 		this.idleAnim.play();
	// 		this.idleAnimOverlap.currentTime = 1;
	// 	}
	// }
	
	// this.idleAnim.onComplete.add(
	// 	switchIdle, this, true
	// );
	// this.idleAnimOverlap.onComplete.add(
	// 	switchIdle, this, false
	// );
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

Teacher.prototype.start = function() {
	this.walkright.play(true);
	this.loadTexture(this.walkright);
	this.returnright.onComplete.addOnce(function()
	{
		this.stopMoving = false;
		this.neutralStance();
	},this);
	var check = game.time.events.loop(0, function () {
		//console.log("predicted position is " + this.x + speed);
		if (this.x > game.width/2) {
			game.time.events.remove(check);
			this.returnright.play();
			this.loadTexture(this.returnright);
			//this.walkright.stop();
		}
		this.x += 3;
	}, this);
};


Teacher.prototype.attack = function() {
	if (!this.coming) {
		this.suspicion = this.suspicionMax;
		this.cooldown = false;
		this.coming = true;
		this.alertMeter.stop();
		this.disappear.play();
		this.stopMoving = true;

		this.music.pause();
		
		this.y = this.y - 100;
		this.loadTexture(this.drop);
		this.drop.play();
		this.drop.onComplete.addOnce(function(){
			this.alpha = 0;
			this.creepy.play();
			var move = game.rnd.integerInRange(0, 6);
			if (move < 3) {
				this.frontlayer.add(this);
				this.x = game.rnd.realInRange(500, game.world.width - 500);
				game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 6)), function() {
					this.alpha = 1;
					this.scale.setTo(0.8);
					this.y = game.world.height;
					this.loadTexture(this.appear);	
					this.appear.play();	
					this.creepy.stop();
					this.appear.onComplete.addOnce(function() {
						if (Math.abs(game.input.x - this.x) <= 400) {
							console.log("you failed, he was at" + this.x + "with a distance of " +Math.abs(game.input.x - this.x) + "with a height of " + this.y );
							game.state.start('End', true, false, {finalscore: 0});
						} else {
							this.attackFinished();
						}
					}, this);
				}, this);
			} else if (move == 5) {
				this.x = game.world.centerX;
				game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 6)), function() {
					this.alpha = 1;
					this.breathing.play();
					firstx = game.input.x;
					firsty = game.input.y;
					game.time.events.add(Phaser.Timer.SECOND * 1.2, function() {
						game.world.add(this);
						this.breathing.stop();
						this.scale.setTo(1);
						this.y = 0;
						this.angle = 180;
						this.loadTexture(this.appear);
						this.creepy.stop();
	
						var dx = game.input.x - firstx;
						var dy = game.input.y - firsty;
	
						if (Math.sqrt(dx * dx + dy * dy) >= 200) {	
							this.appear.play();	
							this.appear.onComplete.addOnce(function() {
								game.state.start('End', true, false, {finalscore: 0});
							}, this);
						}
						else {
							this.angle = 0;
							this.attackFinished();
						}
					}, this);
				}, this);
			} 
			else {
				this.phonelayer.add(this);
				game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 6)), function() {
					this.alpha = 1;
					this.y = 600;
					this.x = 200;
					this.scale.setTo(0.7);
					this.loadTexture(this.appear);
					this.appear.play();	
					this.creepy.stop();		
					firstx = game.input.x;
					firsty = game.input.y;
					oldx = game.input.x;
					oldy = game.input.y;
					moveTeacher = function() {
						this.x += oldx - game.input.x;
						this.y += oldy - game.input.y;
						oldx = game.input.x;
						oldy = game.input.y;
					}
					var check = game.time.events.loop(0, moveTeacher, this);
					this.appear.onComplete.addOnce(function() {
						game.time.events.remove(check);
						if (Math.abs(game.input.x - firstx) <= 300) {
							console.log("you failed, he was at" + this.x + "with a distance of " +Math.abs(game.input.x - this.x) + "with a height of " + this.y );
							game.state.start('End', true, false, {finalscore: 0});
						} else {
							console.log("he was at" + this.x + "with a distance of " +Math.abs(game.input.x - this.x) + "with a height of " + this.y );
							this.attackFinished();
						}
					}, this);
				}, this);
			}
		}, this);
	}
};

Teacher.prototype.sideEye = function() {
	game.world.add(this);
	this.stopMoving = true;
	tween = game.add.tween(this).to( { y: 1800 }, 600, Phaser.Easing.Circular.Out, true);
	tween.onComplete.addOnce(function () {
		this.scale.setTo(0.9);
		this.x = 1400;
		this.frontlayer.add(this);
		this.loadTexture(this.check);
		this.check.play();		
		this.check.onComplete.addOnce(function() {
			this.attackFinished();
		}, this);
	}, this);
}

Teacher.prototype.attackFinished = function() {
	this.suspicion = 0;
	this.cooldown = true;
	this.coming = false;
	this.backlayer.add(this);
	this.neutralStance();
	game.camera.flash(0x000000, 800);
}

Teacher.prototype.move = function(goRight) {
	if (!this.stopMoving) {
	this.stopMoving = true;

	var turnAnim = this.turnleft;
	this.returnAnim = this.returnleft;
	if (this.x+50 > game.world.width - 450) //no more space at right
			goRight = false;
		else if (this.x - 50 < 450)
			goRight = true;
	if (goRight)
	{
		turnAnim = this.turnright;
		this.returnAnim = this.returnright
	}
	this.loadTexture(turnAnim);
	turnAnim.play();
	turnAnim.onComplete.addOnce(function() {
		turnAnim.stop();
		this.music.resume();
		var speed = 5;
		if (!goRight) {
			speed *= -1;
		}
		var walkAnim = this.walkleft;
			if (goRight) {
				walkAnim = this.walkright;
			}

		walkAnim.play(true);
		this.loadTexture(walkAnim);
		var check = game.time.events.loop(0, function () {
			//console.log("predicted position is " + this.x + speed);
			if ((this.x - 50 < 450 && !goRight) || (this.x + 50 > game.world.width - 450 && goRight)) {
				game.time.events.remove(check);
				game.time.events.remove(stop);
				this.returnAnim.play();
				this.loadTexture(this.returnAnim);
				//walkAnim.stop();
			}
			this.x += speed;
		}, this);
		var stop = game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 3)), function() {
			game.time.events.remove(check);
			game.time.events.remove(stop);
			this.returnAnim.play();
			this.loadTexture(this.returnAnim);
			//walkAnim.stop();
		}, this);
	}, this);
	console.log(this.returnAnim);
	this.returnAnim.onComplete.addOnce(function() {
		this.neutralStance();
	}, this);
}
};



Teacher.prototype.vignette_setTo = function(_alpha) {
	if (_alpha < 0)
		_alpha = 0;
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
			this.suspicion -= this.cooldown_amount;
	}
}

Teacher.prototype.raiseAlert = function(amount) {
	this.alertMeter.stop();
	if (!this.coming)
	{
		this.suspicion += amount;
		this.cooldown = false;
		this.alertMeter.add(Phaser.Timer.SECOND*3,function() {this.cooldown = true;},this);
		this.alertMeter.start();
	}
	if (this.suspicion >= this.suspicionMax)
	{
		this.suspicion = this.suspicionMax;
		if (!this.coming) {
			this.attack();
		}
	}
};

Teacher.prototype.turn = function(peekRight) {
  if (!this.stopMoving) {
    this.stopMoving = true;
    var turnAnim = this.peek;
    if (peekRight)
    {
    	this.scale.x = -0.4;
    	this.anchor.x = 0.4;
    }
    var peekStart = 1.5;
    var peekDuration = 1;
    this.music.pause();
    this.loadTexture(turnAnim);
    turnAnim.play();
	turnAnim.onComplete.addOnce(function() {if (!this.coming) this.neutralStance()},this);
    game.time.events.add(Phaser.Timer.SECOND * (peekStart), 
      function () {
        var check = game.time.events.loop(0, () => {
          if (this.checkIfVisible(peekRight)) {
            game.time.events.remove(check);
			this.alert.play();
			this.attack();
          }
        }, this);
        game.time.events.add(Phaser.Timer.SECOND * (peekDuration), function() {game.time.events.remove(check)}, this);
      },
	this);
  }
};

Teacher.prototype.checkIfVisible = function(peekRight) {
	//console.log('peeking direction? ' + peekRight);
	if ((peekRight && game.input.x > this.x + this.safe_zone) || (!peekRight && game.input.x < this.x - this.safe_zone)) {
		return true;
	}
};

Teacher.prototype.setCallbackWhenCaught = function(callback) {
	this.caughtCallback = callback;
};

Teacher.prototype.neutralStance = function() {	
	this.anchor.setTo(0.5,1);
	this.scale.setTo(0.4);
	this.y = this.originalY;
	this.music.resume();

	this.loadTexture(this.idleAnim);
	this.idleAnim.play(true);

	var delay = game.rnd.realInRange(this.startDelay, this.endDelay);
	var move = game.rnd.integerInRange(0, 4);
	var checkIfOpen = game.time.events.loop(Phaser.Timer.SECOND * (delay), function () {
		if (!this.stopMoving) {
			var right = 0;
			var left = 1;
			var direction = game.rnd.integerInRange(right, left);
			this.idleAnim.paused = true;
			//this.idleAnimOverlap.paused = true;
			game.time.events.remove(checkIfOpen);
			if (move < 4) {
				this.turn(direction);
			}
			else {
				var direction = right;
				if (this.x >= game.world.centerX) {
					direction = left;
				}
				this.move(direction);
			}
		}
	}, this);
};
