MinigamePreload = function(game) {
	// preload images
    game.load.audio('tock', 'assets/audio/tock.wav');
    game.load.audio('correct', 'assets/audio/shake.wav');
    game.load.audio('wrong', 'assets/audio/vibrate.mp3');
    game.load.audio('text_receive', 'assets/audio/text_receive.ogg');
    game.load.audio('text_send', 'assets/audio/text_send.ogg');
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
    this.text_send = game.add.audio('text_send', 0.5);
    this.text_receive = game.add.audio('text_receive', 0.5);
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
    graphics.endFill();
    graphics.beginFill(0x005aff);
    this.responseRect = graphics.drawRoundedRect(27, 115, 138, 40, 20);
    this.responseRect.alpha = 0.75;
    this.responseRect2 = graphics.drawRoundedRect(170, 115, 138, 40, 20);
    this.responseRect2.alpha = 0.75;
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

    this.keyboard = game.add.sprite(16,572,'keyboard');
    //this.keyboard.tint = 0x005aff;
    this.keyboard.anchor.setTo(0,1.0);
    this.keypad = [];
    this.key_value = 'qwertyuiopasdfghjklzxcvbnm '; //keys entered
    this.key_value2 = 'QWERTYUIOPASDFGHJKLZXCVBNM '; //keyboard letter display

 	this.style = {
      font: '15px Helvetica',
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
    //response prompts
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

    this.init_keyboard();

    ///////////////////////////////////////////////
    this.responseInput = game.add.inputField(62, 134, {
        font: '15px Helvetica',
        fill: '#ffffff',
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
    this.randResponse = this.response1._text;

     this.responseInput2 = game.add.inputField(204, 134, {
        font: '15px Helvetica',
        fill: '#ffffff',
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
    this.randResponse2 = this.response2._text;

    this.justTextin = false;
    this.newMessage = true;
    this.time = 0;
    this.textPosition = 0;
    this.finishText();
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
    var misaligned;
    for (var i = 0; i < 10; i++) //draw qwertyuiop
    {

        temp = game.add.sprite(19+(i*key_col),key_row,'keypad');
        this.keypad.push(temp); //add keyboard button sprite to list
        //add keyboard letter
        var offset = 0;
        misaligned = 'qwertyuiop';
        if (misaligned.includes(this.key_value[i]))
        {
            switch (this.key_value[i])
            {
                case 'w':
                    offset = -1;
                    break;
                case 'i':
                case 'r':
                case 't':
                    offset = 5;
                    break;
                case 'u':
                case 'q':
                    offset = 1;
                    break;
                default:
                    offset = 2;
                    break;
            }
        }
        game.add.text(24+(i*key_col)+offset,key_row+4,this.key_value[i],{ font: "24px Helvetica", fill: "#000", boundsAlignH: "center", boundsAlignV: "top"});
    }
    key_row += 46; //go to next row
    for (var i = 0; i < 9; i++) //draw asdfghjkl
    {
        temp = game.add.sprite(35+(i*key_col),key_row,'keypad');
        this.keypad.push(temp);
        var offset = 0;
        misaligned = 'asdfjkl';
        switch (this.key_value[i+10])
        {
            case 'f':
            case 'j':
            case 'l':
                offset = 6;
                break;
            default:
                offset = 3;
                break;
        }
        game.add.text(39+(i*key_col)+offset,key_row+4,this.key_value[i+10],{ font: "24px Helvetica", fill: "#000", boundsAlignH: "center", boundsAlignV: "top"});
    }
    key_row += 46;
    for (var i = 1; i < 8; i++) //draw zxcvbnm
    {
        temp = game.add.sprite(35+(i*key_col),key_row,'keypad');
        this.keypad.push(temp);
        var offset = 0;

        switch(this.key_value[i+18])
        {
            case 'm':
                offset = -1;
                break;
            case 'n':
                offset = 2;
                break;
            default:
                offset = 3;
                break;
        }

        game.add.text(39+(i*key_col)+offset,key_row+4,this.key_value[i+18],{ font: "24px Helvetica", fill: "#000", boundsAlignH: "center", boundsAlignV: "top"});
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
            if (this.newMessage) //don't check response text unless there is new message
                this.checkResponseText();
            var index = this.key_value.indexOf(this.input.value[this.lettersTyped]);
            var tint = 0x80a0ff;//0xc0c0c0
            var release_time = 10;
            if (this.input.value[this.input.value.length-1] != (this.theWord[this.nextWord])[this.lettersTyped]) //input is wrong
            {
                if (!this.justTextin) //text message response is wrong as well
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
                else //correct text message response input
                    this.tock.play();
            }
            else //correct input
            {
                this.lettersTyped++;
                this.tock.play();
            }

            if (index >= 0 && index < 27) //within alphabet range, including space
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
        if (!this.correct.isPlaying)
            this.correct.play();
        this.value++;
        this.score.setText("Score: " + this.value);
        this.nextWord ++;
        this.input.setText("");
        this.fakeInput.setText(this.theWord[this.nextWord]);
        this.callback();
    }
}

Minigame.prototype.ejectSearchBar = function() {
    return game.add.inputField(27, 250, {
        font: '18px Helvetica',
        fill: 'rgba(0, 0, 0, 0.65)',
        width: 280,
        padding: 8,
        borderWidth: 1,
        borderColor: '#666666',
        borderRadius: 15,
    })
}

Minigame.prototype.setCorrectTextInputCallback = function(callback) {
    this.callback = callback;
}

Minigame.prototype.setWrongTextInputCallback = function(callback) {
    this.wrongCallback = callback;
}

Minigame.prototype.checkResponseText = function(){
//check if its a letter in a textmessage response
    if(this.input.value[this.input.value.length-1] == this.randResponse[this.responseInput.value.length] && this.input.value[this.input.value.length-1] != 'ENTER'){//if last typed charater is next correct character in textresponse string
        this.responseInput.setText(this.responseInput.value + this.input.value[this.input.value.length-1]); //set textresponseinput text to = itself plus last typed character
        this.justTextin = true;
        if(this.responseInput.value == this.randResponse){//if completed text
            this.responseInput.setText("");
            this.responseInput2.setText("");
            this.time = Phaser.Timer.SECOND*game.rnd.integerInRange(5,10); //mom response time
            this.text_send.play();
            this.finishText();
        }
    } else {this.justTextin = false;}

    if(this.input.value[this.input.value.length-1] == this.randResponse2[this.responseInput2.value.length] && this.input.value[this.input.value.length-1] != 'ENTER'){//if last typed charater is next correct character in textresponse string
        this.responseInput2.setText(this.responseInput2.value + this.input.value[this.input.value.length-1]); //set textresponseinput text to = itself plus last typed character
        this.justTextin = true;
        if(this.responseInput2.value == this.randResponse2){//if completed text
            this.responseInput2.setText("");
            this.responseInput.setText("");
            this.time = Phaser.Timer.SECOND*game.rnd.integerInRange(5,10); //mom response time
            this.text_send.play();
            this.finishText();
        }
    }
}

Minigame.prototype.finishText = function() {
        //scroll down animation
        this.responseInput.setText('');
        this.responseInput2.setText('');
        if (this.time != 0) //not called by constructor
        {
            this.newMessage = false; 
            this.textTimer = game.time.create(false);
            this.textTimer.loop(1, this.scrollUp, this);
            this.textTimer.start();
        }
        game.time.events.add(this.time,
        function()
        {
            this.text_receive.play();
            this.newMessage = true;

            //scroll down animation
            this.textTimer = game.time.create(false);
            this.textTimer.loop(1, this.scrollDown, this);
            this.textTimer.start();
        },this);
}

Minigame.prototype.textMove = function() {
    this.textMessage.y = this.textPosition;//move text down
    this.newMessageString.y = this.textPosition - 40;
    this.messageRect.y = this.textPosition - 80;
    this.responseInput.y = this.textPosition + 39;
    this.responseInput2.y = this.textPosition + 39;
    this.response1.y = this.textPosition + 47;
    this.response2.y = this.textPosition + 47;
}

Minigame.prototype.goToNextText = function(){
    if (this.nextText < this.momText.length)
        this.nextText++;
    else
        this.nextText = 0;

    this.textMessage.setText(this.momText[this.nextText]);//set the text to new string
    this.randResponse = this.responseText[game.rnd.integerInRange(0,this.responseText.length-1)];
    this.randResponse2 = this.responseText[game.rnd.integerInRange(0,this.responseText.length-1)];
    this.response1.setText(this.randResponse);
    this.response2.setText(this.randResponse2);
}

Minigame.prototype.setRoom = function(room) {
    this.room = room;
}
   

Minigame.prototype.scrollUp = function() {
 if(this.textPosition > (-200)){//if text isnt in final position
        this.textPosition-=10;//increment position by 5
        this.textMove();
    }
    else
    {
        this.justTextin = false;
        //change text prompts after it is out of view
        this.goToNextText();
        this.textTimer.stop();
    }//reached final position. stop moving
}

Minigame.prototype.scrollDown = function() {
 if(this.textPosition < (90)){//if text isnt in final position
        this.textPosition+=10;//increment position by 5
        this.textMove();
    }
    else{this.textTimer.stop();}//reached final position. stop moving
}