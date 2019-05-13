//constructor for minigame
var Minigame = function(game) {
	//refer to the constructor for the group object in Phaser
	Phaser.Group.call(this, game);

	var graphTemp = this.game.add.graphics(0,0);
	graphTemp.beginFill(0xffffff);
	var tempRect = graphTemp.drawRect(-100, -100, 1000,1000);
	graphTemp.endFill();
	
	
	//make any game you want here
	
	//have a variable for the score
	this.score = 0;
	
	// add audio
	this.wow = game.add.audio('grunt');
	this.music = game.add.audio('music');
	this.pop = game.add.audio('yay');
	//play music and let it loop
	//this.music.play('', 0, 1, true);

	// Create text at the corner to print the score
	//scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	var graphics = game.add.graphics(10, 10);
	graphics.beginFill(0xdddddd);
	var rect1 = graphics.drawRoundedRect(27, 18, 280, 90, 20);
	rect1.alpha = 0.5;
	graphics.endFill();

	var WebFontConfig = {
		google: {
			families: ['Poppins']
		}
	};
	//  Load the Google WebFont Loader script
    game.load.script('font.poppins', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

 	var style = {
      font: '15px Poppins',
      fill: '#000',
      align: 'left'
    };
    var randText = Math.random();
    text1 = game.add.text(rect1.x+110,rect1.y+40, "New Message - Mom", style);
    text1.anchor.setTo(0.5);
    text1.fontWeight = 'bold';
    if(randText > 2/3){
    	text2 = game.add.text(rect1.x+160,rect1.y+80, "Where are you? Your sister's jazz flute\nrecital started 2 hours ago.",	style);
    	text2.anchor.setTo(0.5);
	}
	else if (randText>1/3){
    	text2 = game.add.text(rect1.x+150,rect1.y+80, "You never leave home without your\nYugioh deck, what's going on?",	style);
    	text2.anchor.setTo(0.5);
	}
	else{
    	text2 = game.add.text(rect1.x+165,rect1.y+80, "Honey, there's a stranger in your room.\nAnd he's singing 'Sweet Home Alabama'", style);
    	text2.anchor.setTo(0.5);
	}
    
    theWord = "hello world"
    this.fakeInput = game.add.inputField(27, 180, {
		font: '18px Helvetica',
		fill: '#000000',
		width: 280,
		padding: 8,
		borderWidth: 1,
		borderColor: '#666666',
		borderRadius: 15,
		placeHolder: theWord,
	});

	this.input = game.add.inputField(27, 180, {
		font: '18px Helvetica',
		fill: '#000000',
		fillAlpha: 0,
		width: 280,
		padding: 8,
		borderWidth: 1,
		borderColor: '#000',
		borderRadius: 6,
		placeHolder: '',
		forceCase: PhaserInput.ForceCase.lower 
	});
	this.input.startFocus();

	words = [
		"oijajwoijetrsjoi",
		"mzochwernnakfenmz",
		"what day is it",
		"what's the weather today",
		"what time is it",
		"ghghghgghhghghghghhg",
		"ppppppppppppppppppp",
		"hello world",
		"how to cheat on a test",
		"how to get out of class",
		"my teacher is trying to kill me",
		"SOS"
	];

	enter = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	enter.onDown.add(function() {
		if (this.input.value == theWord) {
			this.pop.play();
			this.fakeInput.placeHolder = "you win";
			this.input.setText("");
			theWord = words[Math.floor(Math.random()*words.length)];
		}
	}, this, 0, true);

 // key1 = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
 // key1.onDown.add(function(){

 // if(temp == "why do my balls itch?"){
 // 	console.log("you win");
 // }

 // }, this);


};
//set snow's prototype to that from the phaser sprite object
Minigame.prototype = Object.create(Phaser.Group.prototype);
//set the constructor for the prototype
Minigame.prototype.constructor = Minigame;
//override the update method
Minigame.prototype.update = function() {
};