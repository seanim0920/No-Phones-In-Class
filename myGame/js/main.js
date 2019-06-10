// Loading state
//Group 39: UCSC
//Andrew Vien
//Gideon Fox
//Sean Fronteras

var Loading = function(game) {};
Loading.prototype = {
	preload: function() {
		// preload images
		game.load.audio('music', 'assets/audio/spookymusic.wav');
		game.load.audio('intro', 'assets/audio/intro.wav');
		game.load.audio('bell', 'assets/audio/bell.ogg');
		game.load.audio('jumpscare', 'assets/audio/jumpscare.ogg');
		game.load.audio('slice', 'assets/audio/slice.wav');
        game.load.audio('scarymusic', 'assets/audio/scarymusic.mp3');
		game.load.audio('yay', 'assets/audio/yay.mp3');
		game.load.audio('grunt', 'assets/audio/grunt.mp3');
		game.load.audio('caught', 'assets/audio/caught.mp3');
		game.load.audio('erase', 'assets/audio/erase.mp3');
		game.load.image('phone', 'assets/img/phone.png');
		game.load.image('loading', 'assets/img/loading.png');
		game.load.image('vignette','assets/img/vignette.png');
		game.load.image('background', 'assets/img/background.png');
		game.load.video('end', 'assets/video/gameover.mp4');
		game.load.image('student', 'assets/img/student.png');
		game.load.image('safearea', 'assets/img/safe.png');
		game.load.image('watchSprite', 'assets/img/watch.png');
		game.load.image('foreground', 'assets/img/chairs.png');
		game.add.plugin(PhaserInput.Plugin);
	},
	create: function() {
		game.add.text(0, 0, "hack", {font:"1px Chiller", fill:"#AA"});
		game.add.text(0, 0, "hack", {font:"1px Penultimate", fill:"#AA"});
		game.add.text(0, 0, "hack", {font:"1px Crackhead", fill:"#AA"});
		this.loaded = false;
		this.loadIcon = game.add.sprite(game.width/2, game.height/2, 'loading');
		this.loadIcon.anchor.setTo(0.5,0.5);
		scaryMusic = game.add.audio('scarymusic');
        scaryMusic.play();
        scaryMusic.loop = true;
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
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;		
		var room = new Phaser.Group(game);
		game.add.audio('intro').play();
		//this.legs = new Phaser.Group(game);
		this.tutorials = ["Reply to Dad","Get ready for the call","Decline/Accept the Call","Type the text in the google search bar to play."];
		this.tip = 0;
		//move everything currently in the game world to a group
		minigame = new Minigame(game, ["no phones in class"],'Dad');
		game.world.moveAll(minigame, true);
		game.world.add(room);
		var text = game.add.text(0, 64, 'No Phones in Class', { align: 'center', font: '100px Crackhead', fill: '#ff0000' });
		text.x = (game.width/2)-(text.width/2);
		text = game.add.text(64, 250, '\nControls: Cursor and Keyboard',{ align: 'center',font: '32px Crackhead', fill: '#808080' });
		text = game.add.text(64,450,'Move your mouse away from the direction the teacher is looking.'
			+'\nDo NOT cover the teacher at all costs!'
			+'\nInteract with the phone by typing.'
			+'\nTypes as many prompts to pass time and escape class!',
			{ font: '36px Penultimate', fill: '#fff' });
		this.fuck = game.add.audio('alert');
		this.tutorialText = game.add.text(64,650, this.tutorials[this.tip], {font: '64px Penultimate', fill: '#ff0000'});
		minigame.finishText();
		
		minigame.setDeclineCallback(()=>{
			this.alert.play();
			if (this.tip < 3)
				this.tip++;
		});
		minigame.setMessageCallback(()=>{
			if (this.tip < 3)
				this.tip++;
		});
		
		//game.world.add(this.legs);
		game.world.add(minigame);
		
		// print instructions and title to screen


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
		this.tutorialText.text = this.tutorials[this.tip];
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
		this.score = config.score;
		this.winLose = config.winLose;
		console.log("score is " + this.score);
	},
	create: function() {
		game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;	
		this.caught = game.add.audio('caught');
		this.caught.play();
		this.jumpscare = game.add.audio('jumpscare');
		this.jumpscare.play();
		death = game.add.video('end');
		death.play();
		death.addToWorld(game.world.centerX,0,0.5,0,0.8,0.8);
		death.onComplete.addOnce(function () {
			game.state.start('Tally', true,false, {score: this.score, winLose: this.winLose});
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



var Tally = function(game) {};
Tally.prototype = {
    init: function(config) {
		this.score = config.score; // copy score parameter
		this.winLose = config.winLose;
    },
    create: function() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.increment = Math.floor(this.score / 120);
        if(this.winLose == false){ var displays = ['YOU ARE DEAD', '\nPercentage of class passed: ' + this.score.toFixed(2)*1.25 + '%', '\n\ngrade: F+'];}
        else{var displays = ['YOU ESCAPED CLASS', '\nPercentage of class passed: 100%', '\n\ngrade: A-'];}
        var pos;
        var style = {
            font: '64px Penultimate',
            fill: '#fff'
        };
        this.finalOutput = game.add.text(16, 200, '', style); // display final score
        this.finalOutput.alpha = 0;
        this.next = game.add.audio('slice');
        //display final output one by one
        for (var i = 0; i < displays.length; i++) {
            var string = displays[i];
            this.finalOutput.text = string;
            pos = (game.width / 2) - (this.finalOutput.width / 2);
            game.time.events.add((Phaser.Timer.SECOND / 2) * i, function(text, pos) {
                this.next.play();
                game.add.text(pos, 100*i, text, style);
            }, this, string, pos);
        }
        game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
            this.finalOutput.fontSize = '96px';
            this.finalOutput.text = '';
            pos = (game.width / 2) - (this.finalOutput.width / 2);
            this.bell = game.add.audio('bell');
            this.bell.play();
            this.finalOutput.text = '\n[SPACE] to retake the class';
            this.finalOutput.alpha = 1;
            this.finalOutput.x = pos - 500;
            this.finalOutput.y = 72 * 7;
            this.finalOutput.fill = '#ff0000';
        }, this);
    },
    update: function(){
    	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) { // restart if SPACE is pressed
			game.state.start('Boot');
			location.reload();
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
};
Play.prototype = {
	create: function() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		var room = new Phaser.Group(game);
		//this.legs = new Phaser.Group(game);

		//move everything currently in the game world to a group
		minigame = new Minigame(game,undefined,'Mom');
		//teacher callback functions
		minigame.setWrongTextInputCallback(function(amount) {
			teacher.raiseAlert(amount);
		});
		minigame.setAcceptTextInputCallback(function(amount) {
			teacher.sideEye();
		});
		game.world.moveAll(minigame, true);
		game.world.add(room);
		
		//room.create(0, 0, 'legs');
		bg = room.create(0,-300, 'background');
		bg.scale.setTo(1);
		
		backlayer = game.add.group();
		room.add(backlayer);
		
		//make everything in the group invisible except for a small section, which will be the size of the phone
		var screen = this.game.add.graphics(0,0);
		screen.beginFill(0xffffff, 1);
		screen.drawRect(0, 0, this.PHONE_WIDTH, this.PHONE_HEIGHT);
		screen.endFill(0xffffff, 1);
		minigame.add(screen);
		minigame.mask = screen;

	    minigame.setCorrectTextInputCallback(() => {
			this.counter += 6; //eaze
		});

		this.erase = game.add.audio('erase');

		frontlayer = game.add.group();
		fg = frontlayer.create(0,500, 'foreground');
		
		//progress timer
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

		teacher = new Teacher(game, frontlayer, backlayer, minigame);
		teacher.setDeathCallback(() => {
			game.state.start('End', true, false, {score: this.counter, winLose: false});
		});
		backlayer.add(teacher);

		exit = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
		exit.onDown.add(function() {game.state.start('Menu', true, false, {finalscore: this.score});}, this, 0, true);
		this.leftBound = 0;
		this.rightBound = game.width;

		//create a vignette
		vignette = game.add.sprite(600,500,'vignette');
		vignette.scale.setTo(2,2);
		vignette.alpha = 0;
		vignette.anchor.setTo(0.5,0.5);
		shadow = game.add.graphics(0, 0);
		shadow.alpha = 0;
		shadow.anchor.setTo(0.5,0.5);
   		shadow.beginFill(0x000);
    	shadow.drawRect(vignette.width/2, -vignette.height/2-300, game.width, vignette.height+500);
    	shadow.drawRect(-vignette.width/2,-vignette.height/2-300,-game.width,vignette.height+500);
    	shadow.drawRect(-(vignette.width/2), -vignette.height/2, vignette.width, -300);
    	shadow.drawRect(-(vignette.width/2), vignette.height/2, vignette.width, 200);

		teacher.init_vignette(vignette,shadow);

		messages = game.add.group();

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
			this.counter-=.007;//time moves backwards
		}
		//console.log("end angle "+ this.counter);
		this.bigBoyWatch.clear();
		this.bigBoyWatch.lineStyle(8, 0xFFFFFF);
		this.bigBoyWatch.beginFill(0xFFFFFF);
		this.bigBoyWatch.arc(0, 0, 30, this.game.math.degToRad(-90), this.game.math.degToRad(-90+(360/this.counterMax)*(this.counterMax-this.counter)), true);
		this.bigBoyWatch.endFill();
		if(this.counter >= 100){
			game.state.start('End', true, false, {score: this.counter, winLose: true});
		}
		
        
	},
	update: function() {
		game.canvas.style.cursor = "none";
		this.scrollView();
		this.setPhone();
		minigame.x = phone.x -phone.offsetX + this.MINIGAME_OFFSET_X;
		minigame.y = phone.y -phone.offsetY + this.MINIGAME_OFFSET_Y;
		//console.log(game.input.y + ", " + teacher.y);
		if (game.input.x - 100 < teacher.x && game.input.x + 100 > teacher.x && game.input.y - 100 < teacher.y - 300 && game.input.y + 100 > teacher.y - 300) {
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