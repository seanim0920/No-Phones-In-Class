TeacherPreload = function(game) {
	// preload images
	game.load.audio('speech', 'assets/audio/gibberish.mp3');
	game.load.audio('badend', 'assets/audio/badend.mp3');
	game.load.audio('caught', 'assets/audio/caught2.mp3');
	game.load.audio('warn', 'assets/audio/warning.mp3');
	game.load.video('warning', 'assets/video/warning.webm');
	game.load.video('goleft', 'assets/video/goleft.webm');
	game.load.video('goleft', 'assets/video/goleft.webm');
	game.load.video('goright', 'assets/video/goright.webm');
	game.load.video('goback', 'assets/video/goback.webm');
	game.load.video('turnleft', 'assets/video/turnleft.webm');
	game.load.video('turnright', 'assets/video/turnright.webm');
	game.load.video('draw', 'assets/video/drawing.webm');
}

//constructor for teacher
var Teacher = function(game, x, y) {
	this.WAIT_UNTIL_START = 10;

	this.startDelay = 8;
	this.endDelay = 15;
	this.safe_zone = -75;
	//refer to the constructor for the sprite object in Phaser
	this.warnsound = game.add.audio('warn');
	this.warnvid = game.add.video('warning');
	this.leftpeek = game.add.video('turnleft');
	this.rightpeek = game.add.video('turnright');
	this.goright = game.add.video('goright');
	this.goleft = game.add.video('goleft');
	this.goback = game.add.video('goback');
	this.music = game.add.audio('speech');
	this.teacherAnim = game.add.video('draw');
	this.music.play('', 0, 1, true);
	Phaser.Sprite.call(this, game, x, y);	
	this.anchor.setTo(0.5,1);
	this.scale.setTo(1.2);
	this.caught = false;
	this.warned = false;
	this.loadTexture(this.teacherAnim);
	this.teacherAnim.play(true);

	game.time.events.add(Phaser.Timer.SECOND * (this.WAIT_UNTIL_START), this.turn, this, true);
};

//set snow's prototype to that from the phaser sprite object
Teacher.prototype = Object.create(Phaser.Sprite.prototype);
//set the constructor for the prototype
Teacher.prototype.constructor = Teacher;

Teacher.prototype.move = function(goRight) {
	//mutate first to fit the format of the other clips
	this.scale.setTo(0.9);
	this.y += 90;
	if (goRight) {
		this.scale.x *= -1;
	}

	var turnAnim = this.goleft;
	this.music.pause();
	this.loadTexture(turnAnim);
	turnAnim.play();
	turnAnim.onComplete.addOnce(function() {
		this.music.resume();
		var speed = game.rnd.realInRange(1, 15);
		if (!goRight) {
			speed *= -1;
		}
		var check = game.time.events.loop(0, function () {
			console.log("predicted position is " + this.x + speed);
			if (this.x + speed < 400 || this.x + speed > game.world.width - 400) {
				game.time.events.remove(check);
				game.time.events.remove(stop);
				this.goback.play();
				this.loadTexture(this.goback);
			}
			this.x += speed;
		}, this);
		var stop = game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 3)), function() {
			game.time.events.remove(check);
			game.time.events.remove(stop);
			this.goback.play();
			this.loadTexture(this.goback);
		}, this);
	}, this);

	this.goback.onComplete.addOnce(function() {
		this.neutralStance();
	}, this);
};

Teacher.prototype.turnBoth = function(peekRight) {
	var turnAnim = this.leftpeek;
	var peekStart = 0.65;
	var peekDuration = 1;
	if (peekRight) {
		turnAnim = this.rightpeek;
		peekStart = 0.7;
		peekDuration = 0.9;
	}
	this.music.pause();
	this.loadTexture(turnAnim);
	turnAnim.play();
	turnAnim.onComplete.addOnce(this.turn, this, !peekRight);
	game.time.events.add(Phaser.Timer.SECOND * (peekStart), 
		function () {
			var check = game.time.events.loop(0, () => {
				if (this.peek(peekRight)) {
					game.time.events.remove(check);
					if (!this.warned) {
						turnAnim.onComplete.removeAll(this);
						phone.alpha = 0;
						minigame.alpha = 0;
						this.warned = true;
						this.warnvid.play();
						this.loadTexture(this.warnvid);
						this.warnsound.play();
						this.warnvid.onComplete.addOnce(this.neutralStance, this);
					} else {
						this.caught = true;
					}
				}
			}, this, peekRight);
			game.time.events.add(Phaser.Timer.SECOND * (peekDuration), function() {game.time.events.remove(check)}, this);
		},
	this);
}

Teacher.prototype.turn = function(peekRight) {
	var turnAnim = this.leftpeek;
	var peekStart = 0.65;
	var peekDuration = 1;
	if (peekRight) {
		turnAnim = this.rightpeek;
		peekStart = 0.7;
		peekDuration = 0.9;
	}
	this.music.pause();
	this.loadTexture(turnAnim);
	turnAnim.play();
	turnAnim.onComplete.addOnce(this.checkIfYouLost, this);
	game.time.events.add(Phaser.Timer.SECOND * (peekStart), 
		function () {
			var check = game.time.events.loop(0, () => {
				if (this.peek(peekRight)) {
					game.time.events.remove(check);
					if (!this.warned) {
						turnAnim.onComplete.removeAll(this);
						phone.alpha = 0;
						minigame.alpha = 0;
						this.warned = true;
						this.warnvid.play();
						this.loadTexture(this.warnvid);
						this.warnsound.play();
						this.warnvid.onComplete.addOnce(this.neutralStance, this);
					} else {
						this.caught = true;
					}
				}
			}, this, peekRight);
			game.time.events.add(Phaser.Timer.SECOND * (peekDuration), function() {game.time.events.remove(check)}, this);
		},
	this);
};

Teacher.prototype.peek = function(peekRight) {
	//console.log('peeking direction? ' + peekRight);
	if ((peekRight && game.input.x > this.x + this.safe_zone) || !peekRight && game.input.x < this.x - this.safe_zone) {
		return true;
	}
};

Teacher.prototype.checkIfYouLost = function() {
	console.log('did you lose?');
	if (this.caught) {
		console.log('yeah');
		game.state.start('End', true, false, {finalscore: this.score});
	} else {
		console.log('nah');
		this.neutralStance();
	}
};

Teacher.prototype.neutralStance = function() {
	if (this.startDelay > 3) {
		this.startDelay -= Math.random()/3;
	}
	if (this.endDelay > 7) {
		this.endDelay -= Math.random()/3;
	}
	phone.alpha = 1;
	minigame.alpha = 1;
	this.y = game.world.height + 150;
	this.scale.setTo(1.2);
	this.music.resume();
	this.loadTexture(this.teacherAnim);
	this.teacherAnim.play(true);
	var delay = game.rnd.realInRange(this.startDelay, this.endDelay);
	var right = 0;
	var left = 1;
	var move = game.rnd.integerInRange(0, 4);
	if (move < 4) {
		var direction = game.rnd.integerInRange(right, left);
		var both = game.rnd.integerInRange(0, 3);
		if (this.warned && both == 0) {
			game.time.events.add(Phaser.Timer.SECOND * (delay), this.turnBoth, this, direction == right);
		} else {
			game.time.events.add(Phaser.Timer.SECOND * (delay), this.turn, this, direction == right);
		}
	} else {
		var direction = right;
		if (this.x >= game.world.centerX) {
			direction = left;
		}
		game.time.events.add(Phaser.Timer.SECOND * (delay), this.move, this, direction == right);
	}
};