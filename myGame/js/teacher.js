TeacherPreload = function(game) {
	// preload images
	game.load.audio('speech', 'assets/audio/gibberish.mp3');
	game.load.audio('badend', 'assets/audio/badend.mp3');
	game.load.audio('caught', 'assets/audio/caught2.mp3');
	game.load.video('goleft', 'assets/video/goleft.webm');
	game.load.video('goright', 'assets/video/goright.webm');
	game.load.video('goback', 'assets/video/goback.webm');
	game.load.video('turnleft', 'assets/video/turnleft.webm');
	game.load.video('turnright', 'assets/video/turnright.webm');
	game.load.video('draw', 'assets/video/drawing.webm');
}

//constructor for teacher
var Teacher = function(game, x, y) {
	this.startDelay = 3;
	this.endDelay = 7;
	this.safe_zone = -100;
	//refer to the constructor for the sprite object in Phaser
	this.leftpeek = game.add.video('turnleft');
	this.rightpeek = game.add.video('turnright');
	this.goright = game.add.video('goright');
	this.goleft = game.add.video('goleft');
	this.goback = game.add.video('goback');
	this.music = game.add.audio('speech');
	this.music.play('', 0, 1, true);
	Phaser.Sprite.call(this, game, x, y);	
	this.anchor.setTo(0.5,1);
	this.scale.setTo(1.2);
	this.caught = false;
	this.neutralStance();
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
	teacher.loadTexture(turnAnim);
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
				teacher.loadTexture(this.goback);
			}
			this.x += speed;
		}, this);
		var stop = game.time.events.add(Phaser.Timer.SECOND * (game.rnd.realInRange(1, 3)), function() {
			game.time.events.remove(check);
			game.time.events.remove(stop);
			this.goback.play();
			teacher.loadTexture(this.goback);
		}, this);
	}, this);

	this.goback.onComplete.addOnce(function() {
		this.neutralStance();
	}, this);
};

Teacher.prototype.turn = function(peekRight) {
	var turnAnim = this.leftpeek;
	var peekStart = 0.5;
	var peekDuration = 1;
	if (peekRight) {
		turnAnim = this.rightpeek;
		peekStart = 0.7;
		peekDuration = 0.9;
	}
	this.music.pause();
	teacher.loadTexture(turnAnim);
	turnAnim.play();
	game.time.events.add(Phaser.Timer.SECOND * (peekStart), 
		function () {
			var check = game.time.events.loop(0, this.peek, this, peekRight);
			game.time.events.add(Phaser.Timer.SECOND * (peekDuration), function() {game.time.events.remove(check)}, this);
		},
	this);
	turnAnim.onComplete.addOnce(this.checkIfYouLost, this);
};

Teacher.prototype.peek = function(peekRight) {
	if (!this.caught) {
		console.log('peeking direction? ' + peekRight);
		if ((peekRight && game.input.x > this.x + this.safe_zone) || !peekRight && game.input.x < this.x - this.safe_zone) {
			this.caught = true;
			//console.log('YOU GOT CAUGHT');
		}
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
	this.y = game.world.height + 150;
	this.scale.setTo(1.2);
	this.music.resume();
	var teacherAnim = game.add.video('draw');
	this.loadTexture(teacherAnim);
	teacherAnim.play(true);
	var delay = game.rnd.realInRange(this.startDelay, this.endDelay);
	var right = 0;
	var left = 1;
	var move = game.rnd.integerInRange(0, 4);
	if (move < 4) {
		var direction = game.rnd.integerInRange(right, left);
		game.time.events.add(Phaser.Timer.SECOND * (delay), this.turn, this, direction == right);
	} else {
		var direction = right;
		if (this.x >= game.world.centerX) {
			direction = left;
		}
		game.time.events.add(Phaser.Timer.SECOND * (delay), this.move, this, direction == right);
	}
};