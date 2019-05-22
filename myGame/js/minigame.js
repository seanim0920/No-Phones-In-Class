MinigamePreload = function(game) {
	// preload images
    game.load.audio('tock', 'assets/audio/tock.wav');
    game.load.audio('correct', 'assets/audio/shake.wav');
    game.load.audio('wrong', 'assets/audio/vibrate.mp3');
}

//constructor for minigame
var Minigame = function(game, optionalTheWord) {
	//refer to the constructor for the group object in Phaser
	Phaser.Group.call(this, game);
	this.tock = game.add.audio('tock');
	this.correct = game.add.audio('correct');
	this.wrong = game.add.audio('wrong');

	// creates object for cursor input
	cursors = game.input.keyboard.createCursorKeys();
    // run game loop
    
    this.callback = function() {};
    this.wrongCallback = function() {};

	var graphTemp = this.game.add.graphics(0,0);
	graphTemp.beginFill(0xffffff);
	var tempRect = graphTemp.drawRect(-100, -100, 1000,1000);
	graphTemp.endFill();

	// Create text at the corner to print the score
	//scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	var graphics = game.add.graphics(10, 10);
	graphics.beginFill(0xdddddd);
	this.messageRect = graphics.drawRoundedRect(27, 18, 280, 90, 20);
	this.messageRect.alpha = 0.5;
	this.responseRect = graphics.drawRoundedRect(27, 115, 138, 40, 20);
	this.responseRect.alpha = 0.5;
	this.responseRect2 = graphics.drawRoundedRect(170, 115, 138, 40, 20);
	this.responseRect2.alpha = 0.5;
	graphics.endFill();
	this.messageRect.y = -200;

	var WebFontConfig = {
		google: {
			families: ['Poppins']
		}
	};
	//  Load the Google WebFont Loader script
    game.load.script('font.poppins', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    let titlestyle = { font: "bold 32px Futura", fill: "#000", boundsAlignH: "center", boundsAlignV: "top"};
    this.score = game.add.text(175, 300, 'Score: 0', titlestyle);
    this.score.setTextBounds(0);
    this.value = 0;

 	var style = {
      font: '15px Poppins',
      fill: '#000',
      align: 'left'
    };
    this.responseStyle = {
      font: '15px Helvetica',
      fill: '#000',
      align: 'left'
    };

    var logo = game.add.sprite(100, 190, 'logo');
    logo.scale.setTo(0.2);

    this.momText = [
    "Where are you? Your sister's jazz flute\nrecital started 2 hours ago",
    "You never leave home without your\nYugioh deck, what's going on?",
    "Honey, there's a stranger in your room.\nAnd he's singing 'Sweet Home Alabama'",
    "Did you put the chicken in the oven?\nIt was still alive.",
    "Don't come home.",
    "Did you do the dishes like I asked?\nThe dishwasher is missing.",
    "I got a call from doctor Spindrift,\nyour results came back positive.",
    "Why won't you come out of your\nroom? Unlock the door.",
    "Look at this cute picture of \nyour father from 100 years ago. [IMG]",
    "Your report card came in the mail today.",
    "I JUST bought a new bottle of ranch\ndressing, why is it empty?",
    "You never leave home without your\nYugioh deck, what's going on?",
    "Honey, there's a stranger in your room.\nAnd he's singing 'Sweet Home Alabama'",
    "Did you put the chicken in the oven?\nIt was still alive.",
    "Don't come home.",
    "Did you do the dishes like I asked?\nThe dishwasher is missing.",
    "I got a call from doctor Spindrift,\nyour results came back positive.",
    "Why won't you come out of your\nroom? Unlock the door.",
    "Look at this cute picture of \nyour father from 100 years ago. [IMG]",
    "Your report card came in the mail today.",
    "I just bought a new bottle of ranch\ndressing, why is it empty?"
    ];

     this.responseText = [
     "sounds good",
     "i dont care",
     "hold on",
     "what?",
     "wow",
     "stop",
     "im in class",
     "ok",
     "thats odd",
     "why?"
    ];
            
    this.nextText = 0;
    this.newMessageString = game.add.text(this.messageRect.x+110,-50, "New Message - Mom", this.style);
    this.newMessageString.anchor.setTo(0.5);
    this.newMessageString.fontWeight = 'bold';

    this.textMessage = game.add.text(this.messageRect.x + (this.momText[this.nextText].length)*2.4, -50, this.momText[this.nextText],this.style);
    this.textMessage.anchor.setTo(0.5);
    this.response1 = game.add.text(this.messageRect.x + 60, -50, this.responseText[game.rnd.integerInRange(0,this.responseText.length-1)],this.responseStyle);
    this.response2 = game.add.text(this.messageRect.x + 202, -50, this.responseText[game.rnd.integerInRange(0,this.responseText.length-1)],this.responseStyle);
    this.response1.alpha = 0.5;
    this.response2.alpha = 0.5;

    if (typeof optionalTheWord != "undefined") {
        this.theWord = optionalTheWord;
        this.score.setText('');
    } else {
        this.theWord = [
            "how to kill time in class",
            "why my arm shake when i eat dirt",
            "how to enroll online university",
            "are there people who look like me",
            "pictures jason shwartzman",
            "movies out now",
            "endgame rotten tomatoes",
            "watch endgame free",
            "thanos",
            "thanos chin",
            "thanos nude",
            "clear history google",
            "does your voice change as u age",
            "painful throbbing in brain",
            "head hurts why",
            "brain tumor symptoms",
            "average age brain tumor",
            "survival rate brain tumor",
            "cost brain tumor surgery",
            "early onset alzheimers",
            "is hellthy to eat eggs evewyday",
            "difference between who and whom",
            "buy smart pills online",
            "why isnt pluto a planet",
            "make money without working",
            "how to raise credit score",
            "early onset alzhiemers",
            "does your vote really matter",
            "whats the state soil of california",
            "rick and morty watch free",
            "why does god allow suffring",
            "best free moblle games 2019",
            "funny animals pics",
            "dogs with eyebrows",
            "birds with arms",
            "early onset alzeihmers",
            "fairly odd parents fairy guy name",
            "cosmo nude",
            "why isnt 11 pronounced onety one",
            "elon musk net worth",
            "tesla 3 price",
            "tesla 3 used cheap",
            "early onset alsheimirs",
            "elon musk nude",
            "how to hold breath long time",
            "when is next election",
            "what is my iq",
            "qwertyuioplkjhgfdsazxcvbnm"
            ];
        }

    this.nextWord = 0;
    this.lettersTyped = 0;

    this.fakeInput = game.add.inputField(27, 250, {
        font: '18px Helvetica',
        fill: 'rgba(0, 0, 0, 0.65)',
        width: 280,
        padding: 8,
        borderWidth: 1,
        borderColor: '#666666',
        borderRadius: 15,
    }
    );
    this.fakeInput.setText(this.theWord[0]);

    this.input = game.add.inputField(27, 250, {
        font: '18px Helvetica',
        fill: '#000000',
        fillAlpha: 0,
        width: 280,
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        forceCase: PhaserInput.ForceCase.lower,
        focusOutOnEnter: false,
        blockInput: false,
    }
    );
    this.input.focusOutOnEnter = false;
    this.input.blockInput = false;
    this.input.startFocus();
 
 ///////////////////////////////////////////////
    this.responseInput = game.add.inputField(62, 134, {
        font: '15px Helvetica',
        fill: '#000000',
        fillAlpha: 0,
        width: 280,
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        forceCase: PhaserInput.ForceCase.lower,
        focusOutOnEnter: false,
        blockInput: false,
    }
    );
    this.responseInput.focusOutOnEnter = false;
    this.responseInput.blockInput = false;
    this.randResponse = "";

     this.responseInput2 = game.add.inputField(204, 134, {
        font: '15px Helvetica',
        fill: '#000000',
        fillAlpha: 0,
        width: 280,
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        forceCase: PhaserInput.ForceCase.lower,
        focusOutOnEnter: false,
        blockInput: false,
    }
    );
    this.responseInput2.focusOutOnEnter = false;
    this.responseInput2.blockInput = false;
    this.randResponse2 = "";

    this.justTextin = false;

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	enterKey.onDown.add(this.checkIfInputIsCorrect, this, 0, true);

    this.goToNextText();
};
//set snow's prototype to that from the phaser sprite object
Minigame.prototype = Object.create(Phaser.Group.prototype);
//set the constructor for the prototype
Minigame.prototype.constructor = Minigame;
//override the update method
Minigame.prototype.update = function() {
    this.checkText();
    this.input.update();
}

Minigame.prototype.checkText = function() {

	this.checkResponseText();
	
	//check if user typed a new letter
	if(this.lettersTyped != this.input.value.length){
		//check if last char typed is incorrect
		if(this.lettersTyped < this.input.value.length && this.input.value[this.input.value.length-1] != (this.theWord[this.nextWord])[this.lettersTyped]){
			console.log("wrong. last typed: "+this.input.value[this.input.value.length-1] +" next correct letter: "+ this.randResponse[this.responseInput.value.length]);
			this.input.setText(this.input.value.substring(0,this.input.value.length - 1)); //set input text to = itself minus one character
			if((this.theWord[this.nextWord])[this.lettersTyped] == " "){//if wrong AND correct letter was a space
				//go to next letter
				this.input.setText(this.input.value + " ");
				this.lettersTyped++;
			}
			this.input.startFocus();
			if(this.justTextin == false){//dont mark as a mistake if it was a text message character
			this.wrong.play();
			this.wrongCallback();
			}
		}
        this.lettersTyped = this.input.value.length;
        this.tock.play();
    }
}

Minigame.prototype.checkResponseText = function(){
//check if its a letter in a textmessage response
	if(this.input.value[this.input.value.length-1] == this.randResponse[this.responseInput.value.length] && this.input.value[this.input.value.length-1] != 'ENTER'){//if last typed charater is next correct character in textresponse string
		this.responseInput.setText(this.responseInput.value + this.input.value[this.input.value.length-1]); //set textresponseinput text to = itself plus last typed character
		this.justTextin = true;
		if(this.responseInput.value == this.randResponse){//if completed text
			this.responseInput.setText("");
			this.responseInput2.setText("");
			this.goToNextText();
		}
	} else {this.justTextin = false;}

	if(this.input.value[this.input.value.length-1] == this.randResponse2[this.responseInput2.value.length] && this.input.value[this.input.value.length-1] != 'ENTER'){//if last typed charater is next correct character in textresponse string
		this.responseInput2.setText(this.responseInput2.value + this.input.value[this.input.value.length-1]); //set textresponseinput text to = itself plus last typed character
		this.justTextin = true;
		if(this.responseInput2.value == this.randResponse2){//if completed text
			this.responseInput2.setText("");
			this.responseInput.setText("");
			this.goToNextText();
		}
	}
}

Minigame.prototype.checkIfInputIsCorrect = function() {
	var temp = this.input.value;
	if(temp == this.theWord[this.nextWord]){
        this.correct.play();
        this.value++;
        this.score.setText("Score: " + this.value);
		temp = "";
		this.nextWord ++;
		this.input.setText("");
		this.fakeInput.setText(this.theWord[this.nextWord]);
        this.callback();
	} else {        
        this.wrong.play();
		this.input.setText("");
        this.fakeInput.setText(this.theWord[this.nextWord]);
    }
    this.lettersTyped = 0;
    this.input.startFocus();
}

Minigame.prototype.setCorrectTextInputCallback = function(callback) {
    this.callback = callback;
}

Minigame.prototype.setWrongTextInputCallback = function(callback) {
    this.wrongCallback = callback;
}

Minigame.prototype.goToNextText = function() {
	    if(this.nextText < this.momText.length){
        this.textPosition = -50;
        this.correct.play();
        this.textTimer = game.time.create(false);
        this.textTimer.loop(1, this.moveText, this);
        this.textTimer.start();
        this.textMessage.setText(this.momText[this.nextText]);//set the text to new string
        this.randResponse = this.responseText[game.rnd.integerInRange(0,this.responseText.length-1)];
        this.randResponse2 = this.responseText[game.rnd.integerInRange(0,this.responseText.length-1)];
        this.response1.setText(this.randResponse);
        this.response2.setText(this.randResponse2);
        this.nextText++;//go to next string
    }
    else{this.newTextTimer.stop();}
}

Minigame.prototype.moveText = function() {
 if(this.textPosition < (100)){//if text isnt in final position
   		this.textMessage.y = this.textPosition;//move text down
   		this.newMessageString.y = this.textPosition - 40;
   		this.messageRect.y = this.textPosition - 80;
   		this.response1.y = this.textPosition + 47;
   		this.response2.y = this.textPosition + 47;
   		this.textPosition+=5;//increment position
   	}
   	else{this.textTimer.stop();}//reached final position. stop moving
}
