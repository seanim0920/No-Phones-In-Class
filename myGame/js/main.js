// Menu state
var Menu = function(game) {};
Menu.prototype = {
	preload: function() {
		// preload images
		game.load.image('sky', 'assets/img/sky.png');
		game.load.image('ground', 'assets/img/platform.png');
		game.load.image('star', 'assets/img/star.png');
		game.load.image('diamond', 'assets/img/diamond.png');
		game.load.spritesheet('maincharacter', 'assets/img/dude.png', 32, 48);
		game.load.spritesheet('enemy', 'assets/img/baddie.png', 32, 32);
		game.load.audio('yay', 'assets/audio/yay.mp3');
		game.load.audio('music', 'assets/audio/music.mp3');
		game.load.audio('badend', 'assets/audio/badend.mp3');
		game.load.audio('grunt', 'assets/audio/grunt.mp3');
		game.load.image('phone', 'assets/img/phone.png');
		game.load.image('room', 'assets/img/classroom.jpg');
		game.add.plugin(PhaserInput.Plugin);
	},
	create: function() {
		// print instructions and title to screen
		let titlestyle = { font: "bold 56px Futura", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "top"};
		this.title = game.add.text(game.world.centerX-10, 40, 'This is who I am', titlestyle);
		this.title.setTextBounds(0);
		let style = { font: "bold 20px Futura", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle"};
		this.instructions = game.add.text(game.world.centerX, game.world.centerY, 'Arrow keys to move.\nCollect all the stars and avoid the doggos!\nPress "R" to reverse snow direction.\nPress up to start.', style);
		this.instructions.setTextBounds(0);
		game.stage.backgroundColor="#000000";
	},
	update: function() {
		// go to the play state if the up key is pressed down
		cursors = game.input.keyboard.createCursorKeys();
		if (cursors.up.isDown)
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
		// print this score to the screen and play a sound
		this.end = game.add.audio('badend');
		this.end.play();
		let style = { font: "bold 56px Futura", fill: "#FFF", boundsAlignH: "center", boundsAlignV: "middle"};
		this.instructions = game.add.text(game.world.centerX, game.world.centerY, 'Game end.\nFinal score: ' + this.finalscore + '\nPress up to restart.', style);
		this.instructions.setTextBounds(0);
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

// Play state
var Play = function(game) {
	this.PHONE_WIDTH = 350;
	this.PHONE_HEIGHT = 650;
	this.MINIGAME_OFFSET_X = 90;
	this.MINIGAME_OFFSET_Y = 90;
};
Play.prototype = {
	create: function() {		
		
	
		//move everything currently in the game world to a group
		minigame = new Minigame(game);
		game.world.moveAll(minigame, true);
		game.world.add(minigame);
		
		//make everything in the group invisible except for a small section, which will be the size of the phone
		var screen = this.game.add.graphics(0,0);
		screen.beginFill(0xffffff, 1);
		screen.drawRect(0, 0, this.PHONE_WIDTH, this.PHONE_HEIGHT);
		screen.endFill(0xffffff, 1);
		minigame.add(screen);
		minigame.mask = screen;
		
		this.phone = game.add.sprite(0, 0, 'phone');
	},

	update: function() {
		this.phone.x = game.input.x-100;
		this.phone.y = game.input.y-200;
		minigame.x = this.phone.x + this.MINIGAME_OFFSET_X;
		minigame.y = this.phone.y + this.MINIGAME_OFFSET_Y;
	}
};

// global variables
var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'phaser');
// states for the game
game.state.add('Menu', Menu);
game.state.add('Play', Play);
game.state.add('End', End);
game.state.start('Menu');