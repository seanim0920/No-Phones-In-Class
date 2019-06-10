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
	game.load.image('exclamation','assets/img/exclamation.png');
	game.load.video('idleGlitch', 'assets/video/idleglitch.webm');
	game.load.video('idleGlitchier', 'assets/video/idleglitchier.webm');
	game.load.video('idleGlitchy', 'assets/video/idleglitchy.webm');
}

//constructor for teacher
var Teacher = function(game, frontlayer, backlayer, phonelayer) {
	//adjust this when debugging
	this.WAIT_UNTIL_START = 1;
	
	this.originalY = game.world.height - 100;
	this.originalX = game.world.centerX;
	this.startDelay = 1.5;
	this.endDelay = 15;
	this.safe_zone = -75;
	this.suspicion = 300;
	this.suspicionMax = 1000;
	this.coming = false; //teacher is currently hunting you
	this.cooldown = true; //alert cooldown phase
	//refer to the constructor for the sprite object in Phaser
	this.max_vid_speed = 16;
	this.creepy = game.add.audio('music');
	this.breathing = game.add.audio('breathing');
	this.alert = game.add.audio('alert');
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
	this.drop = game.add.video('drop');
	this.returnleft.volume = 0;
	this.peekleft = game.add.video('peekleft');
	this.peekleft.volume = 0;
	this.peekright = game.add.video('peekright');
	this.peekright.volume = 0;
	this.stretching = game.add.video('stretching');
	this.stretching2 = game.add.video('stretching2');
	this.idleGlitch = game.add.video('idleGlitch');
	this.idleGlitchy = game.add.video('idleGlitchy');
	this.idleGlitchier = game.add.video('idleGlitchier');
	this.check = game.add.video('check');
	this.check.volume = 0;
	this.music = game.add.audio('speech');
	this.appear = game.add.video('appear');
	this.idleAnim = game.add.video('draw');
	this.idleAnimOverlap = game.add.video('drawOverlap');
	this.disappear = game.add.audio('bell');
	this.music.play('', 0, 1, true);
	Phaser.Sprite.call(this, game, this.originalX, this.originalY, "", 1, 1);
	this.caughtCallback = function(){};

	this.durationTimer = this.game.time.create(false);
	this.durationTimer.loop(1000, this.dummyIncTime, this);
	this.durationTimer.start();
	this.duration = 0;

	this.deathCallback = function() {};
	this.canSeePlayer = true;
	this.speed = 1;
	this.distance = 100;
	this.frontlayer = frontlayer;
	this.backlayer = backlayer;
	this.phonelayer = phonelayer;
	this.timeEvents = game.time.create(false); //this controls all the non-attack timer functions

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

	this.x = 0;
	this.alertMeter = game.time.create(false);
	this.scale.setTo(0.4);
	this.anchor.setTo(0.5, 1);

	this.goIn();
};

//set snow's prototype to that from the phaser sprite object
Teacher.prototype = Object.create(Phaser.Sprite.prototype);
//set the constructor for the prototype
Teacher.prototype.constructor = Teacher;

Teacher.prototype.setPlayerVisibility = function(visible) {
	this.canSeePlayer = visible;
};

Teacher.prototype.setDeathCallback = function(callback) {
	this.deathCallback = callback;
};

//At start of game, teacher walks towards board
Teacher.prototype.goIn = function() {
	this.timeEvents.start();
	this.walkright.play(true);
	this.loadTexture(this.walkright);
	this.returnright.onComplete.addOnce(function()
	{
		this.stopMoving = false;
		this.neutralStance();
	},this);
	var check = this.timeEvents.loop(0, function () {
		//console.log("predicted position is " + this.x + speed);
		if (this.x > game.width/2) {
			this.timeEvents.remove(check);
			this.returnright.play();
			this.loadTexture(this.returnright);
			//this.walkright.stop();
		}
		this.x += 5;
	}, this);
};

//have teacher hide behind one of the students
//students come in from the sides. sometimes the teacher will leave from the sides and hide behind one of them. scare them and the teacher will come out.
Teacher.prototype.init_vignette = function(vignette, frame)
{
	this.vignette = vignette;
	this.vignetteFrame = frame;
};

//Teacher is going to hunt you down
Teacher.prototype.attack = function() {
	if (!this.coming) {
		//stop all current animations
		this.stopAnim();
		this.timeEvents.stop();
		this.timeEvents.removeAll();
		//Teacher is pissed
		this.suspicion = this.suspicionMax;
		this.cooldown = false;
		this.coming = true;
		this.alertMeter.stop();
		this.alert.play();
		this.stopMoving = true;
		var diff_speed;
		this.music.pause();
		
		this.y = this.y - 100;
		this.loadTexture(this.drop);
		this.drop.play();
		game.add.existing(new Exclamation(game,this.x-80,this.y-350,120));
		this.drop.onComplete.addOnce(function(){
			this.creepy.play();
			this.alpha = 0;
			var move = game.rnd.integerInRange(0, 8);
			// a normal pop-up attack
			if (move < 5) {
				this.frontlayer.add(this);
				this.x = game.rnd.realInRange(500, game.world.width - 500);
				game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 6)), function() {
					this.scale.setTo(0.5);
					this.y = game.world.height;
					this.loadTexture(this.appear);	
					this.alpha = 1;
					this.appear.play(false, Math.min(this.max_vid_speed,0.5+this.duration));	
					this.creepy.stop();
					this.appear.onComplete.addOnce(function() {
						if (Math.abs(game.input.x - this.x) <= 400) {
							this.deathCallback();
						} else {
							game.camera.flash(0x000000, 800);
							this.attackFinished();
						}
					}, this);
				}, this);
			} else if (move == 5) { //a movement-based attack. Player should stay still
				this.x = game.world.centerX;
				game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 6)), function() {
					this.breathing.play();
					firstx = game.input.x;
					firsty = game.input.y;
					this.y = 0;
					game.time.events.add(Phaser.Timer.SECOND * 1.2, function() {
						game.world.add(this);
						this.breathing.stop();
						this.scale.setTo(1);
						this.angle = 180;
						this.loadTexture(this.appear);
						this.creepy.stop();
	
						var dx = game.input.x - firstx;
						var dy = game.input.y - firsty;
	
						this.alpha = 1;
						if (Math.sqrt(dx * dx + dy * dy) >= 250) {
							this.appear.play(false, Math.min(this.max_vid_speed,0.5+this.duration));	
							this.appear.onComplete.addOnce(function() {
								this.deathCallback();
							}, this);
						}
						else {
							this.angle = 0;
							game.camera.flash(0x000000, 800);
							this.attackFinished();
						}
					}, this);
				}, this);
			} 
			else { //An in-phone attack. Player should move their phone away
				this.phonelayer.add(this);
				game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 6)), function() {
					this.y = 600;
					this.x = 200;
					this.scale.setTo(0.7);
					this.loadTexture(this.appear);
					this.alpha = 1;
					this.appear.play(false, Math.min(this.max_vid_speed,0.5+this.duration));	
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
							this.deathCallback();
						} else {
							game.camera.flash(0x000000, 800);
							this.attackFinished();
						}
					}, this);
				}, this);
			}
		}, this);
	}
};

//stop all current animations and their onComplete events
Teacher.prototype.stopAnim = function(){
	//stop all animations
	this.turnright.stop();
	this.turnleft.stop();
	this.walkright.stop();
	this.walkleft.stop();
	this.returnright.stop();
	this.returnleft.stop();
	this.drop.stop();
	this.peekleft.stop();
	this.peekright.stop();
	this.stretching.stop();
	this.stretching2.stop();
	this.idleGlitch.stop();
	this.idleGlitchy.stop();
	this.idleGlitchier.stop();
	this.check.stop();
	this.appear.stop();
	this.idleAnim.stop();
	this.idleAnimOverlap.stop();
}

//Spook the player with a disappointing glare, when player picks up phonecall
Teacher.prototype.sideEye = function() {
	if (!this.coming)
	{
		this.stopAnim();
		this.timeEvents.stop();
		this.timeEvents.removeAll();
		this.coming = false;
		this.stopMoving = true;
		this.loadTexture(this.idleAnim);
		this.y = this.originalY;
		this.idleAnim.play();
		tween = game.add.tween(this).to( { y: 1400 }, 500, Phaser.Easing.Circular.Out, true);
		tween.onComplete.addOnce(function () {
			this.idleAnim.stop();
			game.world.add(this);
			this.y = game.world.height;
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
}

//return to normal
Teacher.prototype.attackFinished = function() {
	console.log("attacked is finished, teacher is at " + this.x + ", " + this.y);
	this.suspicion = 0;
	this.cooldown = true;
	this.coming = false;
	this.backlayer.add(this);
	this.x = game.rnd.realInRange(500, game.world.width - 500);
	this.neutralStance();
}

//walk around
Teacher.prototype.move = function(goRight) {
	if (!this.stopMoving && !this.coming) {
	this.stopAnim();
	this.timeEvents.stop();
	this.timeEvents.removeAll();
	this.timeEvents.start();
	this.stopMoving = true;

	var turnAnim = this.turnleft;
	this.returnAnim = this.returnleft;
	//if at edge of movement path, go the other way
	if (this.x+50 > game.world.width - 450)
			goRight = false;
		else if (this.x - 50 < 450)
			goRight = true;
	if (goRight)
	{
		turnAnim = this.turnright;
		this.returnAnim = this.returnright
	}
	//start turning
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
		//loop check
		var check = this.timeEvents.loop(0, function () {
			this.checkIfVisible(goRight,17); //suspicion raises if player is within peripheral
			//Stop walking if reached end of movement boundary
			if ((this.x - 50 < 450 && !goRight) || (this.x + 50 > game.world.width - 450 && goRight)) {
				this.timeEvents.remove(check);
				this.timeEvents.remove(stop);
				this.returnAnim.play();
				this.loadTexture(this.returnAnim);
				//walkAnim.stop();
			}
			this.x += speed;
		}, this);
		//stop walking after a set amount of seconds
		var stop = this.timeEvents.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 3)), function() {
			this.timeEvents.remove(check);
			this.timeEvents.remove(stop);
			this.returnAnim.play();
			this.loadTexture(this.returnAnim);
			//walkAnim.stop();
		}, this);
	}, this);
	//return to normal stance
	this.returnAnim.onComplete.addOnce(function() {
		this.neutralStance();
	}, this);
}
};

//Fade vignette, which indicates suspicion meter
Teacher.prototype.vignette_setTo = function(_alpha) {
	this.vignetteFrame.alpha = _alpha;
	this.vignette.alpha = _alpha;
}

Teacher.prototype.update = function()
{
	//vignette will never be fully opaque
	this.vignette_setTo(this.suspicion/(this.suspicionMax + 177));
	if (this.cooldown) //cooldown suspicion meter
	{
		if (this.suspicion > 0)
			this.suspicion -= 5;
		else
			this.suspicion = 0;
	}
}

//raiser teacher suspicion by amount
Teacher.prototype.raiseAlert = function(amount) {
	this.suspicion += amount;
	this.cooldown = false; //stop lowering suspicion
	this.alertMeter.stop();
	if (!this.coming) //not already after the player
	{
		//3 second delay before suspicion cools down
		this.alertMeter.add(Phaser.Timer.SECOND*3,function() {this.cooldown = true;},this);
		this.alertMeter.start();
	}
	//teacher has had enough
	if (this.suspicion >= this.suspicionMax)
	{
		this.suspicion = this.suspicionMax;
		if (!this.coming) {
			this.attack(); //hunt the player
		}
	}
};

//turn to check on player
Teacher.prototype.turn = function(peekRight) {
  if (!this.stopMoving) {
    this.stopMoving = true;
	var peekAnim = this.peekleft;
	if (peekRight) {
		peekAnim = this.peekright;
	}
    var peekStart = 1; //time before he sees you
    var peekDuration = 2; //time before he goes back to board
    this.music.pause();
    this.loadTexture(peekAnim);
    peekAnim.play();
    this.timeEvents.add(Phaser.Timer.SECOND * (peekStart), 
      function () {
        var check = this.timeEvents.loop(0, () => {
          this.checkIfVisible(peekRight,25); //suspicion raises if phone is in sight
        }, this);
        this.timeEvents.add(Phaser.Timer.SECOND * (peekDuration), function() {this.timeEvents.remove(check)}, this);
      },
	this);
  }
};

//check if player is in front of teacher direction
Teacher.prototype.checkIfVisible = function(peekRight,amount) {
	if ((peekRight && game.input.x > this.x + 100) || (!peekRight && game.input.x < this.x - 100)) {
		this.raiseAlert(amount);
	}
};

//callbacks
Teacher.prototype.setCallbackWhenCaught = function(callback) {
	this.caughtCallback = callback;
};

//increment difficulty speed
Teacher.prototype.dummyIncTime = function() {
	this.duration += 0.01;
	if (this.duration*3 > 400)
		this.durationTimer.stop();
};

//idle drawing animation
Teacher.prototype.neutralStance = function() {
	this.stopAnim();
	//stop all other animations
	this.timeEvents.stop();
	this.timeEvents.removeAll();
	this.timeEvents.start();
	this.stopMoving = false;
	this.anchor.setTo(0.5,1);
	this.scale.setTo(0.4);
	this.y = this.originalY;
	this.music.resume();
	this.idleAnim.stop();
	this.loadTexture(this.idleAnim);
	this.idleAnim.play(true);

	//randomly perform an action
	var delay = game.rnd.realInRange(this.startDelay, Math.min(3.5,this.endDelay-(3*this.duration)));
	var move = game.rnd.integerInRange(0, 6);
	var checkIfOpen = this.timeEvents.add(Phaser.Timer.SECOND * (delay), function () {
		if (!this.stopMoving) {
			var right = 0;
			var left = 1;
			var direction = game.rnd.integerInRange(right, left);
			this.idleAnim.paused = true;
			this.timeEvents.remove(checkIfOpen);
			//turn and look at player
			if (move < 4) {
				this.turn(direction == right);
			}
			else if (move != 4) //walk around
			{
				var direction = right;
				if (this.x >= game.world.centerX) {
					direction = left;
				}
				this.move(direction == right);
			}
			else //alternative idle animation
				this.chooseRandomIdle();
		}
	}, this);
};

Teacher.prototype.chooseRandomIdle = function() {	
		let num = game.rnd.integerInRange(0,8);

		this.idleAnim.stop();
		var anim;
		if (num < 5) //stretch
			anim = this.stretching;
		else if (num < 8)
			anim = this.stretching2;
		else if (num == 8) //teacher is paranormal
			anim = this.idleGlitchier;
		else if (num < 12)
			anim = this.idleGlitchy;
		else
			anim = this.idleGlitch;

		this.loadTexture(anim);
		anim.play();
		anim.onComplete.addOnce(function(){this.neutralStance();},this);
	};

//Teacher spotted player
function Exclamation (game,x,y,size) {
	Phaser.Sprite.call(this, game, x, y, 'exclamation', 0);
	this.alpha = 1;
	this.anchor.setTo(0.5,1);
	this.scale.y = 0;
	tween = game.add.tween(this.scale).to( { y: 1 }, 200, Phaser.Easing.Circular.Out, true);
	tween.onComplete.addOnce(function(){game.time.events.add(Phaser.Timer.SECOND/2,function(){this.fade = true;},this);},this);
}

Exclamation.prototype = Object.create(Phaser.Sprite.prototype);
Exclamation.prototype.constructor = Exclamation;
Exclamation.prototype.create = function(){
	this.icon.x = 0;
}
Exclamation.prototype.update = function() {
	if (this.fade)
	{
		if (this.alpha >= 0)
			this.alpha -= 0.05;
		if (this.alpha <= 0)
		{
			this.destroy();
		}
	}
}