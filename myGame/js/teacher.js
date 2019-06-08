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
	this.cooldown_amount = 3;
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
	this.returnAnim = game.add.video('returnleft');
	this.returnleft.volume = 0;
	this.music = game.add.audio('speech');
	this.appear = game.add.video('appear');
	this.idleAnim = game.add.video('draw');
	this.idleAnimOverlap = game.add.video('drawOverlap');
	this.disappear = game.add.audio('bell');
	this.music.play('', 0, 1, true);
	Phaser.Sprite.call(this, game, this.originalX, this.originalY, "", 1, 1);	
	this.anchor.setTo(0.5,1);
	this.scale.setTo(0.4);
	this.caught = false;
	this.stopMoving = true;
	this.caughtCallback = function(){};
	this.canSeePlayer = true;
	this.speed = 1;
	this.distance = 100;
	this.frontlayer = frontlayer;
	this.backlayer = backlayer;
	this.x = 0;
	this.alertMeter = game.time.create(false);

	this.start();
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
			this.x += 5;
		}, this);
};


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
			this.backlayer.remove(this);
			this.backlayer.add(this);
			this.creepy.play();
			this.scale.setTo(0.45);
			this.x = game.rnd.realInRange(500, game.world.width - 500);
			game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 6)), function() {
				this.y = this.originalY;
				this.loadTexture(this.appear);	
				this.appear.play();	
				this.creepy.stop();
				this.appear.onComplete.addOnce(function() {
					if (Math.abs(game.input.x - this.x) <= 400) {
						this.music.stop();
						console.log("you failed, he was at" + this.x + "with a distance of " +Math.abs(game.input.x - this.x) + "with a height of " + this.y );
						game.state.start('End', true, false, 0);
					} else {

						game.camera.flash(0x000000, 600);
						this.cooldown_amount = 10;
						this.cooldown = true;
						this.backlayer.remove(this);
						this.backlayer.addAt(this,0);
						this.scale.setTo(0.4);
						this.neutralStance();
						var grace_period = game.time.events.add(Phaser.Timer.SECOND*1.7,function()
						{
							this.coming = false;
							this.cooldown_amount = 3;
							game.time.events.remove(grace_period);
						},this);
						this.caught = false;
					}
				}, this);
			}, this);
		}, this);
	}
};

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
		if (!this.coming && !this.stopMoving) {
			this.pop();
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
	turnAnim.onComplete.addOnce(this.checkIfPlayerIsCaught,this);
    game.time.events.add(Phaser.Timer.SECOND * (peekStart), 
      function () {
        var check = game.time.events.loop(0, () => {
          if (this.checkIfVisible(peekRight)) {
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

Teacher.prototype.checkIfVisible = function(peekRight) {
	//console.log('peeking direction? ' + peekRight);
	if ((peekRight && game.input.x > this.x + this.safe_zone) || (!peekRight && game.input.x < this.x - this.safe_zone)) {
		return true;
	}
};

Teacher.prototype.checkIfPlayerIsCaught = function() {
	console.log('did you lose?');
	this.scale.x = 0.4;
	this.anchor.x = 0.5;
	this.stopMoving = false;
	if (this.caught) {
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
	this.stopMoving = false;
	this.y = this.originalY;
	this.music.resume();

	this.loadTexture(this.idleAnim);
	this.idleAnim.play(true);

	var delay = game.rnd.realInRange(this.startDelay, this.endDelay);
	var right = 0;
	var left = 1;
	var move = game.rnd.integerInRange(0, 4);
	var direction = game.rnd.integerInRange(right, left);
	var checkIfOpen = game.time.events.add(Phaser.Timer.SECOND * (delay), function (condition) {
		if (!this.stopMoving) {
			game.time.events.remove(checkIfOpen);
			this.idleAnim.stop();
			if (move < 4) {
				this.turn(condition);
			}
			else {
				var direction = right;
				if (this.x >= game.world.centerX) {
					direction = left;
				}
				this.move(condition);
			}
		}
	}, this,direction == right);
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