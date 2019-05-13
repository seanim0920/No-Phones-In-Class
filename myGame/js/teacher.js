TeacherPreload = function(game) {
	// preload images
	game.load.audio('speech', 'assets/audio/gibberish.mp3');
	game.load.audio('badend', 'assets/audio/badend.mp3');
	game.load.audio('caught', 'assets/audio/caught2.mp3');
	game.load.video('turnleft', 'assets/video/turnleft.webm');
	game.load.video('turnright', 'assets/video/turnright.webm');
	game.load.video('draw', 'assets/video/drawing.webm');
}

//constructor for teacher
var Teacher = function(game, x, y) {
	this.safe_zone = -200;
	//refer to the constructor for the sprite object in Phaser
	this.leftpeek = game.add.video('turnleft');
	this.rightpeek = game.add.video('turnright');
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

Teacher.prototype.turn = function(peekRight) {
	var turnAnim = this.leftpeek;
	var peekStart = 0.45;
	var peekDuration = 1.05;
	if (peekRight) {
		turnAnim = this.rightpeek;
		peekStart = 0.65;
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
	this.music.resume();
	var teacherAnim = game.add.video('draw');
	this.loadTexture(teacherAnim);
	teacherAnim.play(true);
	var delay = game.rnd.realInRange(3, 8);
	var right = 0;
	var left = 1;
	var peekDirection = game.rnd.integerInRange(right, left);
	game.time.events.add(Phaser.Timer.SECOND * (delay), this.turn, this, peekDirection == right);
};