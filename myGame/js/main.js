// Loading state
var Loading = function(game) {};
Loading.prototype = {
	preload: function() {
		// preload images
		TeacherPreload(game);
		MinigamePreload(game);
		game.load.audio('music', 'assets/audio/spookymusic.wav');
		game.load.audio('jumpscare', 'assets/audio/jumpscare.ogg');
		game.load.audio('yay', 'assets/audio/yay.mp3');
		game.load.audio('grunt', 'assets/audio/grunt.mp3');
		game.load.audio('erase', 'assets/audio/erase.mp3');
		game.load.audio('intro', 'assets/audio/intro.wav');
		game.load.image('phone', 'assets/img/phone.png');
		game.load.image('loading', 'assets/img/loading.png');
		game.load.image('legs', 'assets/img/back.png');
		game.load.video('end', 'assets/video/gameover.mp4');
		game.load.image('student', 'assets/img/student.png');
		game.load.image('safearea', 'assets/img/safe.png');
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
		music = game.add.audio('intro');
		music.play();
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
		var screen = game.add.graphics(0,0);
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
		
		next = game.input.keyboard.addKey(Phaser.Keyboard.BACKWARD_SLASH);
		next.onDown.add(function() {game.state.start('Play')});
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
		death.addToWorld(game.world.centerX,0,0.5,0,1,1);
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
		minigame.setRoom(room);
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

		bg = room.create(0,0, 'legs');
		bg.scale.setTo(3);

		phone = game.add.sprite(0, 0, 'phone');
		phone.x = game.input.x - this.CURSOR_OFFSET_X; //update phone position
		phone.y = game.input.y - this.CURSOR_OFFSET_Y;

		this.erase = game.add.audio('erase');

		frontlayer = game.add.group();
		backlayer = game.add.group();
		teacher = new Teacher(game, game.world.centerX, game.world.height + 250, frontlayer, backlayer);
		
		backlayer.add(teacher);
		room.add(backlayer);

		messages = game.add.group();
		students = game.add.group();
		for (i = 0; i < 3; i++) {
			let student = game.add.sprite(200 + game.rnd.integerInRange(-100,100) + 700*i, game.world.height + game.rnd.integerInRange(-20,20), 'student');
			rscale = game.rnd.realInRange(-0.3,0.3);
			student.scale.setTo(0.5,0.5);
			student.anchor.setTo(0.5,1);
			
			students.add(student);
		}

		game.time.events.loop(Phaser.Timer.SECOND * game.rnd.realInRange(1.00,3.00), function() {
			var i = game.rnd.integerInRange(0,2); 			

			messages.add(new TextMessage(game, students.getChildAt(i).x, students.getChildAt(i).y-200, game.rnd.realInRange(-.7,.7),  game.rnd.realInRange(0,-5.9)));
		},this);

		room.add(messages);
		room.add(students);
		
		room.add(frontlayer);

		exit = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
		exit.onDown.add(function() {game.state.start('Menu', true, false, {finalscore: this.score});}, this, 0, true);
		this.leftBound = 0;
		this.rightBound = game.width;
	},

	setPhone: function() {
		//horizontal movement
		var phoneSnap = game.input.x //get cursor position

		phone.x = phoneSnap - this.CURSOR_OFFSET_X; //update phone position
		phone.y = game.input.y - this.CURSOR_OFFSET_Y;
	},
	scrollView: function() {
		//scroll up
		if (game.input.y < 200) {
			//go down
			this.bottom = false;
			teacher.setHidden(false);
		}
		//scroll down
		else if (game.input.y > 700) {
			this.bottom = true;
			teacher.setHidden(true);
		}
	},
	update: function() {
		game.canvas.style.cursor = "none";
		this.scrollView();
		this.setPhone();
		minigame.x = phone.x -phone.offsetX + this.MINIGAME_OFFSET_X;
		minigame.y = phone.y -phone.offsetY + this.MINIGAME_OFFSET_Y;
		if (this.bottom && room.y - 800 >= -room.height/1.2) {
			//go up
			room.y -= 150;
		}
		else if (!this.bottom && room.y <= -50) {
			room.y += 150;
		}
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