// Menu state
var Menu = function(game) {};
Menu.prototype = {
	preload: function() {
		// preload images
		game.load.audio('yay', 'assets/audio/yay.mp3');
		game.load.audio('badend', 'assets/audio/badend.mp3');
		game.load.audio('grunt', 'assets/audio/grunt.mp3');
		game.load.audio('caught', 'assets/audio/caught.mp3');
		game.load.image('phone', 'assets/img/phone.png');
		game.load.image('legs', 'assets/img/classroom.jpg');
		game.load.image('room', 'assets/img/legpanorama.jpg');
		game.load.video('end', 'assets/video/gameend.webm');
		TeacherPreload(game);
		game.add.plugin(PhaserInput.Plugin);
	},
	create: function() {
		// print instructions and title to screen
		let titlestyle = { font: "bold 56px Futura", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "top"};
		this.title = game.add.text(game.world.centerX-10, 40, 'No phones in class', titlestyle);
		this.title.setTextBounds(0);
		let style = { font: "bold 32px Futura", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle"};
		this.instructions = game.add.text(game.world.centerX, game.world.centerY, "The teacher will peek left and right.\nMove your mouse in the opposite direction to avoid getting caught.\nDon't let them see your phone!\n\nCLICK HERE to continue", style);
		this.instructions.setTextBounds(0);
		game.stage.backgroundColor="#150000";
	},
	update: function() {
		// go to the play state if the up key is pressed down
		if (game.input.activePointer.leftButton.isDown)
		{
			game.state.start('Play');
		}
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
		this.caught = game.add.audio('caught');
		this.caught.play();
		death = game.add.video('end');
		death.play();
		death.addToWorld(game.world.centerX,0,0.5,0,1,1.1);
		death.onComplete.addOnce(function () {
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
	this.CURSOR_OFFSET_Y = 270;

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
		bg = room.create(50, 50, 'legs');
		bg.scale.setTo(3);

		phone = game.add.sprite(0, 0, 'phone');
		this.phoneSnap = 0;

		teacher = new Teacher(game, game.world.centerX, game.world.height + 150);
		room.add(teacher);

		exit = game.input.keyboard.addKey(Phaser.Keyboard.R);
		exit.onDown.add(function() {game.state.start('Menu', true, false, {finalscore: this.score});}, this, 0, true);
	},

	update: function() {
		phone.x = game.input.x - this.CURSOR_OFFSET_X;
		phone.y = game.input.y - this.CURSOR_OFFSET_Y;
		minigame.x = phone.x + this.MINIGAME_OFFSET_X;
		minigame.y = phone.y + this.MINIGAME_OFFSET_Y;
	}
};

// global variables
var game = new Phaser.Game(1800, 800, Phaser.AUTO, 'phaser', null, false, false);
// states for the game
game.state.add('Menu', Menu);
game.state.add('Play', Play);
game.state.add('End', End);
game.state.start('Menu');