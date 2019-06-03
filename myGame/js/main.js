// Loading state
var Loading = function(game) {};
Loading.prototype = {
	preload: function() {
		// preload images
		game.load.audio('music', 'assets/audio/spookymusic.wav');
		game.load.audio('jumpscare', 'assets/audio/jumpscare.ogg');
		game.load.audio('pop', 'assets/audio/pop.ogg');
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
		phone.anchor.setTo(0.5);
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
	this.PHONE_HEIGHT = 600;
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
		minigame = new Minigame(game, ["no phones in class"]);
		game.world.moveAll(minigame, true);
		game.world.add(room);
		//game.world.add(this.legs);
		game.world.add(minigame);
		
		// print instructions and title to screen
		let style = { font: "bold 32px Futura", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle"};
		this.instructions = game.add.text(game.world.centerX, game.world.centerY, "Move your mouse away from where the teacher is looking.\nIf the teacher comes after you, cover them with your phone.", style);
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
		
		left = game.input.keyboard.addKey(Phaser.Keyboard.BACKWARD_SLASH);
		left.onDown.add(function() {game.state.start('Play')});
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
		this.jumpscare = game.add.audio('jumpscare');
		this.jumpscare.play();
		death = game.add.video('end');
		death.play();
		death.addToWorld(game.world.centerX,0,0.5,0,1,1.1);
		death.onComplete.addOnce(function () {
			music.stop();
			game.state.start('Menu', true, false, {finalscore: this.score});
		}, this);
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
// Play state
var Play = function(game) {
	this.PHONE_WIDTH = 350;
	this.PHONE_HEIGHT = 600;
	this.CURSOR_OFFSET_X = 250;
	this.CURSOR_OFFSET_Y = 340;

	//DONT TOUCH
	this.MINIGAME_OFFSET_X = 90;
	this.MINIGAME_OFFSET_Y = 80;

	this.bottom = false;
};
Play.prototype = {
	create: function() {
		room = new Phaser.Group(game);
		//this.legs = new Phaser.Group(game);

		//move everything currently in the game world to a group
		minigame = new Minigame(game);
		minigame.setWrongTextInputCallback(function() {
			teacher.hearNoise();
		});
		game.world.moveAll(minigame, true);
		game.world.add(room);
		game.world.add(minigame);
		
		//make everything in the group invisible except for a small section, which will be the size of the phone
		var screen = game.add.graphics(0,0);
		screen.beginFill(0xffffff, 1);
		screen.drawRect(0, 0, this.PHONE_WIDTH, this.PHONE_HEIGHT);
		screen.endFill(0xffffff, 1);
		minigame.add(screen);
		minigame.mask = screen;

		//room.create(0, 0, 'legs');
		bg = room.create(0,0, 'legs');
		bg.scale.setTo(3);
		

		phone = game.add.sprite(0, 0, 'phone');
		phone.x = game.input.x - this.CURSOR_OFFSET_X; //update phone position
		phone.y = game.input.y - this.CURSOR_OFFSET_Y;

		this.erase = game.add.audio('erase');

		this.erase = game.add.audio('erase');

		teacher = new Teacher(game, game.world.centerX, game.world.height + 150);
		// teacher.setCallbackWhenCaught(() => {
		// 	teacher.pop();
		// 	// if (chances > 1) {
		// 	// 	chances--;
		// 	// 	var lives = "Chances:  ";
		// 	// 	for(i=0;i<chances;i++) {
		// 	// 		lives = lives + "| "
		// 	// 	}
		// 	// 	this.livesText.setText(lives);
		// 	// 	this.erase.play();
		// 	// } else {
		// 	// 	game.sound.stopAll();
		// 	// 	game.state.start('End', true, false, {finalscore: this.score});
		// 	// }
		// });
		room.add(teacher);

		exit = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
		exit.onDown.add(function() {game.state.start('Menu', true, false, {finalscore: this.score});}, this, 0, true);
		this.leftBound = 0;
		this.rightBound = game.width;
	},

	setPhone: function() {
		//horizontal movement
		var phoneSnap = game.input.x //get cursor position

		if (phoneSnap > this.rightBound) //cursor is out of right bound
			phoneSnap = this.rightBound;
		else if (phoneSnap < this.leftBound) //cursor out of left bound
			phoneSnap = this.leftBound;

		phone.x = phoneSnap - this.CURSOR_OFFSET_X; //update phone position
		phone.y = game.input.y - this.CURSOR_OFFSET_Y;
	},
	scrollView: function() {
		//scroll up
		if (game.input.y < 200 && bg.y <= -50) {
			//go down
			bg.y += 50;
			teacher.y += 50;
			this.leftBound -= 22; //expand bounds
			this.rightBound += 22;

		}
		//scroll down
		else if (game.input.y > 600 && bg.y - 800 >= -bg.height/1.2) {
			//go up
			bg.y -= 50;
			teacher.y -= 50;
			this.leftBound += 22; //shrink bounds
			this.rightBound -= 22;
		}
		if (this.leftBound > this.rightBound) //bounds are overlapping
		{
			this.leftBound = game.width/2; //set to center
			this.rightBound = this.leftBound;
		}
		else if(this.leftBound < 0) //bounds are out of screen
		{
			this.leftBound = 0; //reset to default
			this.rightBound = game.width;
		}
	},
	update: function() {
		game.canvas.style.cursor = "none";
		this.scrollView();
		this.setPhone();
		minigame.x = phone.x -phone.offsetX + this.MINIGAME_OFFSET_X;
		minigame.y = phone.y -phone.offsetY + this.MINIGAME_OFFSET_Y;
	}
};

// global variables
var game = new Phaser.Game(1800, 1000, Phaser.AUTO, 'phaser', null, false, false);
// states for the game
game.state.add('Boot', Loading);
game.state.add('Menu', Menu);
game.state.add('Play', Play);
game.state.add('End', End);
game.state.start('Boot');