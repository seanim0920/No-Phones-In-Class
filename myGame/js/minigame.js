MinigamePreload = function(game) {
	// preload images
    game.load.audio('tock', 'assets/audio/tock.wav');
    game.load.audio('correct', 'assets/audio/shake.wav');
    game.load.audio('wrong', 'assets/audio/vibrate.mp3');
    game.load.image('logo', 'assets/img/logo.png');
    game.load.image('keyboard','assets/img/phone_keyboard.png');
    game.load.image('keypad','assets/img/phone_keypad.png');
    game.load.image('spacebar','assets/img/phone_keypad_space.png');
    game.load.image('backspace','assets/img/phone_keypad_delete.png');
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

    let titlestyle = { font: "bold 32px Futura", fill: "#000", boundsAlignH: "center", boundsAlignV: "top"};
    this.score = game.add.text(175, 300, 'Score: 0', titlestyle);
    this.score.setTextBounds(0);
    this.value = 0;

    this.keyboard = game.add.sprite(16,572,'keyboard');
    //this.keyboard.tint = 0x005aff;
    this.keyboard.anchor.setTo(0,1.0);
    this.keypad = [];
    this.key_value = 'qwertyuiopasdfghjklzxcvbnm '; //keys entered
    this.key_value2 = 'QWERTYUIOPASDFGHJKLZXCVBNM '; //keyboard letter display

 	var style = {
      font: '15px Poppins',
      fill: '#000',
      align: 'left'
    };
    
    var logo = game.add.sprite(100, 190, 'logo');
    logo.scale.setTo(0.2);

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
            "whats the state sol of california",
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
            "early onset alsheimirz",
            "elon musk nude",
            "how to hold breath lung time",
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

    enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	enterKey.onDown.add(this.checkIfInputIsCorrect, this, 0, true);

    this.init_keyboard();
};
//set snow's prototype to that from the phaser sprite object
Minigame.prototype = Object.create(Phaser.Group.prototype);
//set the constructor for the prototype
Minigame.prototype.constructor = Minigame;
//override the update method
Minigame.prototype.update = function() {
    this.checkText();
    this.input.update();
    // if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    //     this.movedown();
}
Minigame.prototype.init_keyboard = function()
{
    var key_row = 395; //top row of keyboard
    var key_col = 31.9; //keypad horizontal distance

    for (var i = 0; i < 10; i++) //draw qwertyuiop
    {

        temp = game.add.sprite(19+(i*key_col),key_row,'keypad');
        this.keypad.push(temp); //add keyboard button sprite to list
        //add keyboard letter
        game.add.text(24+(i*key_col),key_row+5,this.key_value2[i],{ font: "20px Helvetica", fill: "#000", boundsAlignH: "center", boundsAlignV: "top"});
    }
    key_row += 46; //go to next row
    for (var i = 0; i < 9; i++) //draw asdfghjkl
    {
        temp = game.add.sprite(35+(i*key_col),key_row,'keypad');
        this.keypad.push(temp);
        game.add.text(39+(i*key_col),key_row+5,this.key_value2[i+10],{ font: "20px Helvetica", fill: "#000", boundsAlignH: "center", boundsAlignV: "top"});
    }
    key_row += 46;
    for (var i = 1; i < 8; i++) //draw zxcvbnm
    {
        temp = game.add.sprite(35+(i*key_col),key_row,'keypad');
        this.keypad.push(temp);
        game.add.text(39+(i*key_col),key_row+5,this.key_value2[i+18],{ font: "20px Helvetica", fill: "#000", boundsAlignH: "center", boundsAlignV: "top"});
    }
    temp = game.add.sprite(35+(3*key_col),key_row+46,'spacebar'); //draw spacebar
    this.keypad.push(temp);

    temp = game.add.sprite(297,key_row,'backspace'); //draw backspace
    this.keypad.push(temp);
}

Minigame.prototype.movedown = function() {
    this.keyboard.y += 1;
    console.log(this.keyboard.y);
        // let grayColor = this.fakeInput.fill;
        // this.fakeInput.fill = '#999999';
        // // let colorBlend = { step: 0 };
        // // let colorTween = this.game.add.tween(colorBlend).to({ step: 100 }, 1000);
        // // colorTween.onUpdateCallback(() => {
        // //     this.fakeInput.fill = Phaser.Color.interpolateColor(0x990000, grayColor, 100, colorBlend.step);
        // // });        
        // // //this.fakeInput.fill = grayColor;
        // // colorTween.start();
        //this.input.startFocus();
}

Minigame.prototype.checkText = function() {
        
        if(this.lettersTyped < this.input.value.length) //user typed something
        {
            //check if last char typed is incorrect
            var index = this.key_value.indexOf(this.input.value[this.lettersTyped]);
            var tint = 0x80a0ff;//0xc0c0c0
            var release_time = 10;
            if (this.input.value[this.input.value.length-1] != (this.theWord[this.nextWord])[this.lettersTyped])
            {
                tint = 0xff8080;
                release_time = 8;
                this.input.setText(this.input.value.substring(0,this.input.value.length - 1)); //set input text to = itself minus one character
                //if wrong and correct letter was a space
                if((this.theWord[this.nextWord])[this.lettersTyped] == " ")
                {
                    //go to next letter
                    this.input.setText(this.input.value + " ");
                    this.lettersTyped++;
                }
                if (!this.wrong.isPlaying) //play one sound at a time
                    this.wrong.play();
                this.wrongCallback();
            }
            else //correct input
            {
            
                this.lettersTyped++;
                this.tock.play();
            }

            if (index >= 0 && index < 27) //within range
            {
             this.keypad[index].tint = tint;
             game.time.events.add(Phaser.Timer.SECOND/release_time, function() { this.keypad[index].tint = 0xffffff; },this);
            }
            this.input.setText(this.theWord[this.nextWord].substring(0,this.lettersTyped)); //update one char at a time
            this.checkIfInputIsCorrect(); //is input done?
            this.input.startFocus();
        }
        //deleting text
        else if (this.lettersTyped > this.input.value.length)
        {
            this.tock.play();
            this.lettersTyped = this.input.value.length;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE))
            this.keypad[27].tint = 0x80a0ff;
        else
            this.keypad[27].tint = 0xffffff;
}

Minigame.prototype.checkIfInputIsCorrect = function() {
    if (this.input.value == this.theWord[this.nextWord])
    {
        this.lettersTyped = 0;
        this.correct.play();
        this.value++;
        this.score.setText("Score: " + this.value);
        this.nextWord ++;
        this.input.setText("");
        this.fakeInput.setText(this.theWord[this.nextWord]);
        this.callback();
    }
        // let grayColor = this.fakeInput.fill;
        // this.fakeInput.fill = '#999999';
        // // let colorBlend = { step: 0 };
        // // let colorTween = this.game.add.tween(colorBlend).to({ step: 100 }, 1000);
        // // colorTween.onUpdateCallback(() => {
        // //     this.fakeInput.fill = Phaser.Color.interpolateColor(0x990000, grayColor, 100, colorBlend.step);
        // // });        
        // // //this.fakeInput.fill = grayColor;
        // // colorTween.start();
        //this.input.startFocus();
}

Minigame.prototype.setCorrectTextInputCallback = function(callback) {
    this.callback = callback;
}

Minigame.prototype.setWrongTextInputCallback = function(callback) {
    this.wrongCallback = callback;
}