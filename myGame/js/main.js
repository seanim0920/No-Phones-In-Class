// Loading state
var Loading = function(game) {};
Loading.prototype = {
	preload: function() {
		// preload images
		game.load.audio('music', 'assets/audio/spookymusic.wav');
		game.load.audio('intro', 'assets/audio/intro.wav');
		game.load.audio('jumpscare', 'assets/audio/jumpscare.ogg');
		game.load.audio('bell', 'assets/audio/bell.ogg');
		game.load.audio('yay', 'assets/audio/yay.mp3');
		game.load.audio('grunt', 'assets/audio/grunt.mp3');
		game.load.audio('caught', 'assets/audio/caught.mp3');
		game.load.audio('erase', 'assets/audio/erase.mp3');
        game.load.audio('slice', 'assets/audio/slice.wav');
        game.load.audio('scarymusic', 'assets/audio/scarymusic.mp3');
		game.load.image('phone', 'assets/img/phone.png');
		game.load.image('loading', 'assets/img/loading.png');
		game.load.image('vignette','assets/img/vignette.png');
		game.load.image('background', 'assets/img/background.png');
		game.load.video('end', 'assets/video/gameover.mp4');
		game.load.image('student', 'assets/img/student.png');
		game.load.image('safearea', 'assets/img/safe.png');
		game.load.image('watchSprite', 'assets/img/watch.png');
		game.load.image('foreground', 'assets/img/chairs.png');
		TeacherPreload(game);
		MinigamePreload(game);
		game.add.plugin(PhaserInput.Plugin);
	},
	create: function() {
		this.loaded = false;
		this.loadIcon = game.add.sprite(game.width/2, game.height/2, 'loading');
		this.loadIcon.anchor.setTo(0.5,0.5);
	},
	update: function() {
		this.loadIcon.angle += 5;
		if (!this.loaded)
		{
			this.loaded = true;

			TeacherPreload(game);
			MinigamePreload(game);
			game.load.onLoadComplete.add(function() {
				game.state.start('Menu');
			}, this);
			game.load.start();
		}
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

		game.add.audio('intro').play();
		//move everything currently in the game world to a group
		minigame = new Minigame(game, ["no phones in class"]);
		game.world.moveAll(minigame, true);
		game.world.add(room);
		var text = game.add.text(0, 64, 'No Phones in Class', { align: 'center', font: '160px Chiller', fill: '#ff0000' });
		text.x = (game.width/2)-(text.width/2);
		text = game.add.text(32, 300, "Controls: Cursor + Keyboard\n\nMove your mouse away from where the teacher is looking.\nDon't let them see your phone!",{ align: 'center',font: '48px Penultimate', fill: '#ffff00' });
		text.x = (game.width/2)-(text.width/2);
		text = game.add.text(0,625, '[Type the prompt to begin]', {font: '48px Penultimate', fill: '#ffffff'});
		text.x = (game.width/2)-(text.width/2);
		//game.world.add(this.legs);
		game.world.add(minigame);

		//make everything in the group invisible except for a small section, which will be the size of the phone
		var screen = this.game.add.graphics(0,0);
		screen.beginFill(0xffffff, 1);
		screen.drawRect(0, 0, this.PHONE_WIDTH, this.PHONE_HEIGHT);
		screen.endFill(0xffffff, 1);
		minigame.add(screen);
		minigame.mask = screen;

		phone = game.add.sprite(0,0, 'phone');
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
	init: function(score) {
		// take in a score and save it
		this.finalscore = score;
	},
	create: function() {
		music = game.add.audio('music');
		music.play('', 0, 0.5, true);
		//this.caught = game.add.audio('caught');
		//this.caught.play();
		this.jumpscare = game.add.audio('jumpscare');
		this.jumpscare.play();
		death = game.add.video('end');
		death.play();
		death.addToWorld(game.world.centerX,0,0.5,0,0.7,0.7);
		death.onComplete.addOnce(function () {
			game.state.start('Tally', true,false, this.finalscore, /*time elapsed*/19, /*truth discovered*/99);
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
			game.state.start('GameOver', true,false, 64, /*time elapsed*/19, /*truth discovered*/99);
		}, this);
	},
};


var Tally = function(game) {};
Tally.prototype = {
    init: function(score, timeElapsed, truthPercent, record) {
        this.score = score; // copy score parameter
        this.timeElapsed = timeElapsed;
        this.truthPercent = truthPercent;
        this.record = record;
    },
    create: function() {
        scaryMusic = game.add.audio('scarymusic');
        scaryMusic.play();
        this.increment = Math.floor(this.score / 120);
        var displays = ['YOU ARE DEAD', '\nTime educated: ' + this.timeElapsed + ' hours', '\n\ntruth discovered: ' + this.truthPercent + '%']; // display final score]
        var pos;
        var style = {
            font: '64px Penultimate',
            fill: '#fff'
        };
        this.finalOutput = game.add.text(16, 200, '', style); // display final score
        this.finalOutput.alpha = 0;
        this.next = game.add.audio('slice');
        //display final output one by one
        for (var i = 0; i < 3; i++) {
            var string = displays[i];
            this.finalOutput.text = string;
            pos = (game.width / 2) - (this.finalOutput.width / 2);
            game.time.events.add((Phaser.Timer.SECOND / 2) * i, function(text, pos) {
                this.next.play();
                game.add.text(pos, 200, text, style);
            }, this, string, pos);
        }
        game.time.events.add(Phaser.Timer.SECOND * 2, function() {
            this.finalOutput.fontSize = '96px';
            this.finalOutput.text = '';
            pos = (game.width / 2) - (this.finalOutput.width / 2);
            this.bell = game.add.audio('bell');
            this.bell.play();
            this.finalOutput.text = '[SPACE] to retake the course';
            this.finalOutput.alpha = 1;
            this.finalOutput.x = pos - 500;
            this.finalOutput.y = 72 * 6;
            this.finalOutput.fill = '#ff0000';

            // game.time.events.add((Phaser.Timer.SECOND/2)*digits.length,function()
            // {
            // this.finalOutput.fontSize = '32px';
            // this.finalOutput.text = '\n\n\nPress [SPACE] to restart';
            // this.finalOutput.fill = '#ff0000';
            // pos = (game.width/2)-(this.finalOutput.width/2);
            // this.finalOutput.x = pos

            // this.next = game.add.audio('boom');
            // this.next.play();
            // },this);
        }, this);
    },
    update: function(){
    	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) // restart if SPACE is pressed
			location.reload();
			//game.state.start('Menu', true, false, {finalscore: this.score});
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
};
Play.prototype = {
	create: function() {
		var room = new Phaser.Group(game);
		//this.legs = new Phaser.Group(game);

		//move everything currently in the game world to a group
		minigame = new Minigame(game);
		minigame.setWrongTextInputCallback(function(amount) {
			teacher.raiseAlert(amount);
		});
		minigame.setAcceptTextInputCallback(function(amount) {
			teacher.sideEye();
		});
		game.world.moveAll(minigame, true);
		game.world.add(room);
		
		backlayer = game.add.group();
    	watchSprite = game.add.sprite(-230, 410, 'watchSprite'); //draw wrist watch
		watchSprite.scale.setTo(.7);
		this.bigBoyWatch = this.game.add.graphics(70,622);
	    this.watchTimer = this.game.time.create(false);
	    this.watchTimer.loop(20, this.updateWatch, this);
	    this.watchTimer.start();
	    this.counter = 10;
	    this.counterMax = 10;
	
	    googleTimer = this.game.time.create(false);
		googleTimer.start();
		game.world.add(minigame);
		
		//make everything in the group invisible except for a small section, which will be the size of the phone
		var screen = this.game.add.graphics(0,0);
		screen.beginFill(0xffffff, 1);
		screen.drawRect(0, 0, this.PHONE_WIDTH, this.PHONE_HEIGHT);
		screen.endFill(0xffffff, 1);
		minigame.add(screen);
		minigame.mask = screen;
		
		//room.create(0, 0, 'legs');
		bg = room.create(0,-300, 'background');
		bg.scale.setTo(1);

	    minigame.setCorrectTextInputCallback(() => {
			this.counter += 5;
		});

		this.erase = game.add.audio('erase');

		frontlayer = game.add.group();
		fg = frontlayer.create(0,500, 'foreground');
		
    	watchSprite = frontlayer.create(-230, 410, 'watchSprite'); //draw wrist watch
		watchSprite.scale.setTo(.7);
		this.bigBoyWatch = this.game.add.graphics(70,622);
		frontlayer.add(this.bigBoyWatch);
	    this.watchTimer = this.game.time.create(false);
	    this.watchTimer.loop(20, this.updateWatch, this);
	    this.watchTimer.start();
	    this.counter = 0;
	    this.counterMax = 100;
		
		frontlayer.add(minigame);
		phone = frontlayer.create(0, 0, 'phone');
		phone.x = game.input.x - this.CURSOR_OFFSET_X; //update phone position
		phone.y = game.input.y - this.CURSOR_OFFSET_Y;

		this.erase = game.add.audio('erase');

		frontlayer = game.add.group();
		teacher = new Teacher(game, frontlayer, backlayer, minigame);

		backlayer.add(teacher);
		room.add(backlayer);

		exit = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
		exit.onDown.add(function() {game.state.start('Menu', true, false, {finalscore: this.score});}, this, 0, true);
		this.leftBound = 0;
		this.rightBound = game.width;
		vignette = game.add.sprite(600,500,'vignette');
		vignette.scale.setTo(2,2);
		vignette.alpha = 0;
		vignette.anchor.setTo(0.5,0.5);
		shadow = game.add.graphics(0, 0);
		shadow.alpha = 0;
		shadow.anchor.setTo(0.5,0.5);
   		shadow.beginFill(0x000);
    	shadow.drawRect(vignette.width/2, -vignette.height/2-200, game.width, vignette.height+400);
    	shadow.drawRect(-vignette.width/2,-vignette.height/2-200,-game.width,vignette.height+400);
    	shadow.drawRect(-(vignette.width/2), -vignette.height/2, vignette.width, -200);
    	shadow.drawRect(-(vignette.width/2), vignette.height/2, vignette.width, 200);

		teacher.init_vignette(vignette,shadow);

		messages = game.add.group();
		/*
		students = game.add.group();
		for (i = 0; i < 3; i++) {
			let student = game.add.sprite(200 + game.rnd.integerInRange(-100,100) + 700*i, game.world.height, 'student');
			rscale = game.rnd.realInRange(-0.3,0.3);
			student.scale.setTo(0.5,0.5);
			student.anchor.setTo(0.5,1);

			students.add(student);
		}

		game.time.events.loop(Phaser.Timer.SECOND * game.rnd.realInRange(1.00,3.00), function() {
			var i = game.rnd.integerInRange(0,2); 			

			messages.add(new TextMessage(game, students.getChildAt(i).x, students.getChildAt(i).y-200, game.rnd.realInRange(-.7,.7),  game.rnd.realInRange(0,-5.9)));
		},this);*/

		//room.add(messages);
		//room.add(students);
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
		vignette.x = phone.x+261;
		vignette.y = phone.y+355; //x:339, y: 145
		shadow.x = vignette.x;
		shadow.y = vignette.y;
	},
	scrollView: function() {
		//scroll up
		if (game.input.y < 200 && bg.y <= -50) {
			//go down
			this.bottom = false;
			teacher.setPlayerVisibility(false);
		}
		//scroll down
		else if (game.input.y > 700) {
			this.bottom = true;
			teacher.setPlayerVisibility(true);
		}
	},
	updateWatch: function() {
		if(this.counter > 0){
			this.counter-=.01;//time moves backwards
			//console.log("foreward");
		}
		//console.log("end angle "+ this.counter);
		this.bigBoyWatch.clear();
		this.bigBoyWatch.lineStyle(8, 0xFFFFFF);
		this.bigBoyWatch.beginFill(0xFFFFFF);
		this.bigBoyWatch.arc(0, 0, 30, this.game.math.degToRad(-90), this.game.math.degToRad(-90+(360/this.counterMax)*(this.counterMax-this.counter)), true);
		this.bigBoyWatch.endFill();
        
	},
	update: function() {
		game.canvas.style.cursor = "none";
		//this.scrollView();
		this.setPhone();
		minigame.x = phone.x -phone.offsetX + this.MINIGAME_OFFSET_X;
		minigame.y = phone.y -phone.offsetY + this.MINIGAME_OFFSET_Y;
		if (game.input.x - 100 < teacher.x && game.input.x + 100 > teacher.x && game.input.y + 300 > teacher.y && game.input.y - 100 < teacher.y) {
			teacher.raiseAlert(10);
		}
	}
};

// global variables
var game = new Phaser.Game(1800, 800, Phaser.CANVAS, 'phaser', null, false, false);
// states for the game
game.state.add('Boot', Loading);
game.state.add('Menu', Menu);
game.state.add('Play', Play);
game.state.add('End', End);
game.state.add('Tally', Tally);
game.state.start('Boot');