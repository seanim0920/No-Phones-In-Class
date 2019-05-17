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
	game.load.image('come', 'assets/img/coming.png');
}

//constructor for teacher
var Teacher = function(game, x, y) {
	this.WAIT_UNTIL_START = 10;

	this.startDelay = 10;
	this.endDelay = 15;
	this.safe_zone = -75;
	//refer to the constructor for the sprite object in Phaser
	this.creepy = game.add.audio('music');
	this.warnsound = game.add.audio('warn');
	this.warnvid = game.add.video('warning');
	this.leftpeek = game.add.video('turnleft');
	this.rightpeek = game.add.video('turnright');
	this.goright = game.add.video('goright');
	this.goleft = game.add.video('goleft');
	this.goback = game.add.video('goback');
	this.music = game.add.audio('speech');
	this.goback = game.add.video('goback');
	this.teacherAnim = game.add.video('draw');
	this.music.play('', 0, 1, true);
	Phaser.Sprite.call(this, game, x, y);	
	this.anchor.setTo(0.5,1);
	this.scale.setTo(1.2);
	this.caught = false;
	this.caughtCallback = function(){};
	this.loadTexture(this.teacherAnim);
	this.teacherAnim.play(true);
	this.see = true;
	this.speed = 1;
	this.distance = 100;
	this.lost = false;

	game.time.events.add(Phaser.Timer.SECOND * (this.WAIT_UNTIL_START), this.turn, this, true);
};

//set snow's prototype to that from the phaser sprite object
Teacher.prototype = Object.create(Phaser.Sprite.prototype);
//set the constructor for the prototype
Teacher.prototype.constructor = Teacher;

Teacher.prototype.canSeeCursor = function(visible) {
	this.see = visible;
};

//trigger when mouse covers teacher for too long
Teacher.prototype.come = function() {
	// this.stopMoving = true;
	// //mutate first to fit the format of the other clips
	// //this.scale.setTo(1);
	// this.y -= 80;
	// this.scale.setTo(0.9);

	// this.music.pause();
	// this.loadTexture('come');
	// var check = game.time.events.loop(0, function () {
	// 	if (this.distance <= 0) {
	// 		game.time.events.remove(check);
	// 		if (Math.abs(game.input.x - this.x) <= 40)
	// 			game.state.start('End', true, false, {finalscore: this.score});
	// 	}
	// 	this.y += 12;
	// 	this.distance -= 1;
	// 	this.scale.setTo(0.9 + (100-this.distance)/40);
	// 	if (this.x < game.input.x) {
	// 		this.x += 1;
	// 	} else {
	// 		this.x -= 1;
	// 	}
	// }, this);
	// this.stopMoving = false;
};

//have teacher hide behind one of the students
//students come in from the sides. sometimes the teacher will leave from the sides and hide behind one of them. scare them and the teacher will come out.
Teacher.prototype.pop = function() {
	if (!this.stopMoving) {
	console.log("TEACHER COMING FOR YOU");
	this.stopMoving = true;

	//mutate first to fit the format of the other clips
	//this.scale.setTo(1);
	this.y -= 80;
	this.scale.setTo(0.9);

	this.music.pause();
	//game.add.tween(this.spawner).to( { x: '-850' }, 2000, Phaser.Easing.Circular.Out, true)
	tween = game.add.tween(this).to( { y: 1500 }, 600, Phaser.Easing.Circular.Out, true);
	tween.onComplete.add(function () {
		this.loadTexture('come');
		this.scale.setTo(2);
		this.creepy.play();
		this.y = 2200;
		this.x = game.rnd.realInRange(500, game.world.width - 500);
		game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 6)), function() {
			this.creepy.stop();				
			tween2 = game.add.tween(this).to( { y: game.world.height + 550 }, 450, Phaser.Easing.Circular.Out, true);
			tween2.onComplete.add(function () {
				if (Math.abs(game.input.x - this.x) >= 200) {
					console.log("you failed, he was at" + this.x + "with a distance of " +Math.abs(game.input.x - this.x) + "with a height of " + this.y );
					game.state.start('End', true, false, {finalscore: 0});
				} else {
					tween3 = game.add.tween(this).to( { y: 2200 }, 700, Phaser.Easing.Circular.Out, true);
					tween3.onComplete.add(function () {
						this.scale.setTo(1.2);
						this.loadTexture(this.teacherAnim);
						this.teacherAnim.play(true);
						tween4 = game.add.tween(this).to( { y: game.world.height + 150 }, 300, Phaser.Easing.Circular.Out, true);
						tween4.onComplete.add(function () {			
							this.neutralStance();
						}, this);
					}, this);
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
			//console.log("predicted position is " + this.x + speed);
			if ((this.x + speed < 400 || this.x + speed > game.world.width - 400)) {
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
}
};

Teacher.prototype.turn = function(peekRight) {
	console.log("going to move!");
	if (!this.stopMoving) {
	this.stopMoving = true;
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
	game.time.events.add(Phaser.Timer.SECOND * (peekStart), 
		function () {
			var check = game.time.events.loop(0, () => {
				if (this.peek(peekRight)) {
					game.time.events.remove(check);
					this.caught = true;
				}
			}, this, peekRight);
			game.time.events.add(Phaser.Timer.SECOND * (peekDuration), function() {game.time.events.remove(check)}, this);
		},
	this);
	turnAnim.onComplete.addOnce(this.checkIfYouLost, this);
	}
};

Teacher.prototype.peek = function(peekRight) {
	//console.log('peeking direction? ' + peekRight);
	if (this.see == true && ((peekRight && game.input.x > this.x + this.safe_zone) || (!peekRight && game.input.x < this.x - this.safe_zone))) {
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
	this.stopMoving = false;
	this.caught = false;
	if (this.startDelay > 3) {
		this.startDelay -= Math.random()/6;
	}
	if (this.endDelay > 7) {
		this.endDelay -= Math.random()/6;
	}
	this.y = game.world.height + 150;
	phone.alpha = 1;
	minigame.alpha = 1;
	this.scale.setTo(1.2);
	this.music.resume();
	this.loadTexture(this.teacherAnim);
	this.teacherAnim.play(true);
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
		/*
		if (game.input.x > this.x) {
			this.turn(true);
		}
		else {
			this.turn(false);
		}*/
		this.pop();
	}
};