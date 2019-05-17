// Loading state
var Loading = function(game) {};
Loading.prototype = {
	preload: function() {
		// preload images
		game.load.audio('music', 'assets/audio/spookymusic.wav');
		game.load.audio('yay', 'assets/audio/yay.mp3');
		game.load.audio('badend', 'assets/audio/badend.mp3');
		game.load.audio('grunt', 'assets/audio/grunt.mp3');
		game.load.audio('caught', 'assets/audio/caught.mp3');
		game.load.audio('erase', 'assets/audio/erase.mp3');
		game.load.image('phone', 'assets/img/phone.png');
		game.load.image('loading', 'assets/img/loading.png');
		game.load.image('legs', 'assets/img/classroom.jpg');
		game.load.video('end', 'assets/video/gameend.webm');
		game.load.image('student', 'assets/img/student.png');
		game.load.image('safearea', 'assets/img/safe.png');
		TeacherPreload(game);
		MinigamePreload(game);
		game.add.plugin(PhaserInput.Plugin);
		game.load.onLoadComplete.add(function() {
			game.state.start('Menu');
		}, this);
	},
	create: function() {
		phone = game.add.sprite(0, 0, 'phone');
		this.loadIcon = game.add.sprite(100, 100, 'loading');
		this.loadIcon.anchor.setTo(0.5);
		game.load.start();
	},
	update: function() {
		this.loadIcon.angle++;
	}
};

// Menu state
var Menu = function(game) {
	this.PHONE_WIDTH = 350;
	this.PHONE_HEIGHT = 700;
	this.CURSOR_OFFSET_X = 250;
	this.CURSOR_OFFSET_Y = 340;

	//DONT TOUCH
	this.MINIGAME_OFFSET_X = 90;
	this.MINIGAME_OFFSET_Y = 80;
};
Menu.prototype = {
	create: function() {		
		var room = new Phaser.Group(game);
		//this.legs = new Phaser.Group(game);

		//move everything currently in the game world to a group
		minigame = new Minigame(game, ["don't use your phone in class"]);
		game.world.moveAll(minigame, true);
		game.world.add(room);
		//game.world.add(this.legs);
		game.world.add(minigame);
		
		// print instructions and title to screen
		let style = { font: "bold 32px Futura", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle"};
		this.instructions = game.add.text(game.world.centerX, game.world.centerY, "The teacher will look left and right.\nMove your phone away from where the teacher is looking.\nIf the teacher comes after you, cover them with your phone.", style);
		this.instructions.setTextBounds(0);
		room.add(this.instructions);

		//make everything in the group invisible except for a small section, which will be the size of the phone
		var screen = this.game.add.graphics(0,0);
		screen.beginFill(0xffffff, 1);
		screen.drawRect(0, 0, this.PHONE_WIDTH, this.PHONE_HEIGHT);
		screen.endFill(0xffffff, 1);
		minigame.add(screen);
		minigame.mask = screen;

		phone = game.add.sprite(0, 0, 'phone');
		minigame.setCorrectTextInputCallback(
			function() {
				game.state.start('Play');
			}
		);


	},
	update: function() {
		game.canvas.style.cursor = "none";
		phone.x = game.input.x - this.CURSOR_OFFSET_X;
		phone.y = game.input.y - this.CURSOR_OFFSET_Y;
		minigame.x = phone.x + this.MINIGAME_OFFSET_X;
		minigame.y = phone.y + this.MINIGAME_OFFSET_Y;
		//console.log('phone is at '+phone.x);
	}
};

// Game Over state
var End = function(game) {};
End.prototype = {
	init: function(config) {
		// take in a score and save it
		this.finalscore = config.finalscore;
	},
	create: function() {
		music = game.add.audio('music');
		music.play('', 0, 0.5, true);
		this.caught = game.add.audio('caught');
		this.caught.play();
		death = game.add.video('end');
		death.play();
		death.addToWorld(game.world.centerX,0,0.5,0,1,1.1);
		death.onComplete.addOnce(function () {
			music.stop();
			game.state.start('Menu', true, false, {finalscore: this.score});
		}, this);
		// print this score to the screen and play a sound
		// this.end = game.add.audio('badend');
		// this.end.play();
		// let style = { font: "bold 56px Futura", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle"};
		// this.instructions = game.add.text(game.world.centerX, game.world.centerY, 'Game end.\nFinal score: ' + this.finalscore + '\nPress up to restart.', style);
		// this.instructions.setTextBounds(0);
	},
	update: function() {
		// restart the game when the up key is pressed
		cursors = game.input.keyboard.createCursorKeys();
		if (cursors.up.isDown)
		{
			game.state.start('Play');
		}
	}
};

// Game Over state
var Win = function(game) {};
Win.prototype = {
	init: function(config) {
		// take in a score and save it
		this.finalscore = config.finalscore;
	},
	create: function() {
		music = game.add.audio('music');
		music.play('', 0, 0.5, true);
		this.caught = game.add.audio('caught');
		this.caught.play();
		death = game.add.video('end');
		death.play();
		death.addToWorld(game.world.centerX,0,0.5,0,1,1.1);
		death.onComplete.addOnce(function () {
			music.stop();
			game.state.start('Menu', true, false, {finalscore: this.score});
		}, this);
		// print this score to the screen and play a sound
		// this.end = game.add.audio('badend');
		// this.end.play();
		// let style = { font: "bold 56px Futura", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle"};
		// this.instructions = game.add.text(game.world.centerX, game.world.centerY, 'Game end.\nFinal score: ' + this.finalscore + '\nPress up to restart.', style);
		// this.instructions.setTextBounds(0);
	},
	update: function() {
		// restart the game when the up key is pressed
		cursors = game.input.keyboard.createCursorKeys();
		if (cursors.up.isDown)
		{
			game.state.start('Play');
		}
	}
};




////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// Play state
var Play = function(game) {
	this.PHONE_WIDTH = 350;
	this.PHONE_HEIGHT = 700;
	this.CURSOR_OFFSET_X = 250;
	this.CURSOR_OFFSET_Y = 340;

	//DONT TOUCH
	this.MINIGAME_OFFSET_X = 90;
	this.MINIGAME_OFFSET_Y = 80;
};
Play.prototype = {
	create: function() {
		var room = new Phaser.Group(game);
		//this.legs = new Phaser.Group(game);

		//move everything currently in the game world to a group
		minigame = new Minigame(game);
		minigame.setWrongTextInputCallback(function() {
			teacher.hearNoise();
		});
		game.world.moveAll(minigame, true);
		game.world.add(room);
		//game.world.add(this.legs);
		game.world.add(minigame);
		
		//make everything in the group invisible except for a small section, which will be the size of the phone
		var screen = this.game.add.graphics(0,0);
		screen.beginFill(0xffffff, 1);
		screen.drawRect(0, 0, this.PHONE_WIDTH, this.PHONE_HEIGHT);
		screen.endFill(0xffffff, 1);
		minigame.add(screen);
		minigame.mask = screen;

		//room.create(0, 0, 'legs');
		bg = room.create(0,0, 'legs');
		bg.scale.setTo(3);
		
		// chances = 4;
		// let style = { font: "bold 32px Futura", fill: "#FFF", boundsAlignH: "left", boundsAlignV: "middle"};
		// var lives = "Chances:  ";
		// for(i=0;i<chances;i++) {
		// 	lives = lives + "| "
		// }
		//this.livesText = game.add.text(game.world.centerX, 200, lives, style);
		//this.livesText.setTextBounds(0);
		//room.add(this.livesText);

		phone = game.add.sprite(0, 0, 'phone');
		this.phoneSnap = 0;

		this.erase = game.add.audio('erase');

		teacher = new Teacher(game, game.world.centerX, game.world.height + 150);
		teacher.setCallbackWhenCaught(() => {
			teacher.pop();
			// if (chances > 1) {
			// 	chances--;
			// 	var lives = "Chances:  ";
			// 	for(i=0;i<chances;i++) {
			// 		lives = lives + "| "
			// 	}
			// 	this.livesText.setText(lives);
			// 	this.erase.play();
			// } else {
			// 	game.sound.stopAll();
			// 	game.state.start('End', true, false, {finalscore: this.score});
			// }
		});
		room.add(teacher);

		//safeAreas = [];
		/*
		var student = game.add.sprite(game.world.centerX + 500, game.world.height + 100, 'student');
		student.anchor.setTo(0.5, 1);
		student.scale.setTo(0.8);
		room.add(student);
		safearea = game.add.sprite(student.x - 10, student.y, 'safearea');
		safearea.anchor.setTo(0.5, 1);
		safearea.alpha = 0;
		safearea.scale.setTo(350,700);
		safearea.inputEnabled = true;
		safearea.events.onInputOver.add(function() {teacher.canSeeCursor(false);}, this);
		safearea.events.onInputOut.add(function() {teacher.canSeeCursor(true);}, this);
		room.add(safearea);
		//safeAreas.push(safearea);

		var student = game.add.sprite(game.world.centerX - 600, game.world.height + 100, 'student');
		student.anchor.setTo(0.5, 1);
		student.scale.setTo(0.8);
		room.add(student);
		safearea2 = game.add.sprite(student.x - 10, student.y, 'safearea');
		safearea2.anchor.setTo(0.5, 1);
		safearea2.alpha = 0;
		safearea2.scale.setTo(350,700);
		safearea2.inputEnabled = true;
		safearea2.events.onInputOver.add(function() {teacher.canSeeCursor(false);}, this);
		safearea2.events.onInputOut.add(function() {teacher.canSeeCursor(true);}, this);
		room.add(safearea);
		//safeAreas.push(safearea);	
		*/
		exit = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
		exit.onDown.add(function() {game.state.start('Menu', true, false, {finalscore: this.score});}, this, 0, true);
	},

	update: function() {
		game.canvas.style.cursor = "none";
		phone.x = game.input.x - this.CURSOR_OFFSET_X;
		phone.y = game.input.y - this.CURSOR_OFFSET_Y;
		minigame.x = phone.x + this.MINIGAME_OFFSET_X;
		minigame.y = phone.y + this.MINIGAME_OFFSET_Y;
	}
};

// global variables
var game = new Phaser.Game(1800, 800, Phaser.AUTO, 'phaser', null, false, false);
// states for the game
game.state.add('Boot', Loading);
game.state.add('Menu', Menu);
game.state.add('Play', Play);
game.state.add('End', End);
game.state.start('Boot');