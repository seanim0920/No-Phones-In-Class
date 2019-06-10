MinigamePreload = function(game) {
	// preload images
    game.load.audio('tock', 'assets/audio/tock.wav');
    game.load.audio('correct', 'assets/audio/shake.wav');
    game.load.audio('wrong', 'assets/audio/vibrate.mp3');
    game.load.audio('text_receive', 'assets/audio/text_receive.ogg');
    game.load.audio('text_send', 'assets/audio/text_send.ogg');
    game.load.audio('incoming_call','assets/audio/incoming.ogg');
    game.load.audio('notification','assets/audio/notification.ogg');
    game.load.image('logo', 'assets/img/logo.png');
    game.load.image('keyboard','assets/img/phone_keyboard.png');
    game.load.image('keypad','assets/img/phone_keypad.png');
    game.load.image('spacebar','assets/img/phone_keypad_space.png');
    game.load.image('backspace','assets/img/phone_keypad_delete.png');
    game.load.image('incoming','assets/img/incoming_call.png');
}

//constructor for minigame
var Minigame = function(game, optionalTheWord) {
	//refer to the constructor for the group object in Phaser
	Phaser.Group.call(this, game);
	this.tock = game.add.audio('tock');
    this.text_send = game.add.audio('text_send', 0.5);
    this.notification = game.add.audio('notification',0.5);
    this.text_receive = game.add.audio('text_receive', 0.5);
    this.phonecall = game.add.audio('incoming_call', 0.5);
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
    var logo = game.add.sprite(100, 190, 'logo');
    logo.scale.setTo(0.2);

    this.keyboard = game.add.sprite(16,572,'keyboard');
    //this.keyboard.tint = 0x005aff;
    this.keyboard.anchor.setTo(0,1.0);
    this.keypad = [];
    this.key_value = 'qwertyuiopasdfghjklzxcvbnm '; //keys entered
    this.key_value2 = 'QWERTYUIOPASDFGHJKLZXCVBNM '; //keyboard letter display
    this.init_keyboard();
	// Create text at the corner to print the score
	//scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	this.messages = game.add.graphics(10, -210);
    this.messages.alpha = 0.75;
    this.messages.beginFill(0xdddddd);
    this.messages.drawRoundedRect(27, 18, 280, 90, 20);
    this.messages.endFill();
    this.messages.beginFill(0x005aff);
    this.messages.drawRoundedRect(27, 115, 138, 40, 20); //27+(138/2)
    this.messages.drawRoundedRect(170, 115, 138, 40, 20);
    this.messages.endFill();

	var WebFontConfig = {
		google: {
			families: ['Poppins']
		}
	};
	//  Load the Google WebFont Loader script
    game.load.script('font.poppins', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

 	this.style = {
      font: '15px Helvetica',
      fill: '#000',
      align: 'left'
    };
    this.responseStyle = {
      font: '15px Helvetica',
      fontWeight: 'bold',
      fill: '#000',
      align: 'left'
    };

    this.momText = [
    ["Where are you? Your sister's jazz flute\nrecital started 2 hours ago", "coming", "who?", 1],
    ["Look at this cute picture of your\nfather from 100 years ago. [IMG]", "be there soon", "not interested", 2],
    ["You never leave home without your\nYugioh deck, what's going on?", "i forgot", "i cant", 1],
    ["Honey, theres a stranger in your room.\nAnd he's singing 'Sweet Home Alabama'","im very sick", "get him out", 2],
    ["Did you put the chicken in the oven?\nIt was still alive.", "it was?", "i dont care", 1],
    ["Don't come home.", "which?", "why?", 2],
    ["Did you do the dishes like I asked?\nThe dishwasher is missing.","where is it?","coming", 1],
    ["I got a call from doctor Spindrift,\nyour results came back positive.","im thirsty", "which results?", 2],
    ["Why won't you come out of your\nroom? Unlock the door.","im not home","im not alive", 1],
    ["Your report card came in the mail today.", "im comatose", "is it bad?", 2],
    ["I JUST bought a new bottle of ranch\ndressing yesterday, why is it empty?","i was thirsty","im outside", 1],
    ["Hurry up! Your funeral starts in\n10 minutes.", "whos mobius?", "who died?", 2],
    ["All the bottles in the medicine \ncabinet are empty, what did you do?", "wasnt me", "one minute", 1],
    ["Come home quick and try Taco Bell's\nlimited time Habanero Quesaritos.", "cant sleep", "im not hungry", 2],
    ["I ate all your halloween candy. Also\n the dog.","ill miss him", "my reesees!", 1],
    ["I think my phones broken, its not \nsending texts","immense pain","works fine", 2],
    ["Honey, you're on the news! college\nstudent missing for 3 weeks!","im right here","just call him",1],
    ["I called the school, but they say \nyou're not on their records??","shoot him", "but im here", 2],
    ["He is inevitable", "who is?", "let me go", 1],
    ["Your white shirt got mixed with the \ncolors, now its covered in blood.","i dont exist", "thats ok", 2],
    ["I think your sister is very sick. I'm\nputting her in the basement.","call a doctor", "theyre after me", 1],
    ["Have you been skipping class to \ncommit murder?", "eat me", "no way", 2],
    ["My book club is meeting at the house\n today, DO NOT disturb us","okay","dead walrus",1],
    ["I found what you hid under your bed.\nCare to explain?","aaaaaaaa","not mine!",2],
    ["Get off your phone and pay attention.\nHe's watching, you know","who is?","balsamic reduction", 1],
    ["...18, 19, 20. Ready or not, here I come","i am mobius", "i didnt hide", 2],
    ];

    this.momTextCopy = this.momText;

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
    this.newMessageString = game.add.text(this.messages.x+110,-50, "New Message - Mom", this.style);
    this.newMessageString.anchor.setTo(0.5);
    this.newMessageString.fontWeight = 'bold';

    this.textMessage = game.add.text(this.messages.x + (this.momText[this.nextText][0].length)*2.4, -30, this.momText[this.nextText][0],this.style);
    this.textMessage.anchor.setTo(0.5);
    //response prompts
    this.response1 = game.add.text(0, -30, this.momText[this.nextText][1],this.responseStyle);
    this.response2 = game.add.text(0, -30, this.momText[this.nextText][2],this.responseStyle);
    this.responseDisplay1 = game.add.text(0, -30, "",this.responseStyle);
    this.responseDisplay2 = game.add.text(0, -30, "",this.responseStyle);
    this.responseDisplay1.fill = '#ffffff';
    this.responseDisplay2.fill = '#ffffff';

    this.response1.alpha = 0.5;
    this.response2.alpha = 0.5;
    
    if (typeof optionalTheWord != "undefined") {
        this.theWord = optionalTheWord;
    } else {
         this.theWord = [
            "how to kill time in class",
            "how to enroll online university",
            "passing grade for cmps 120",
            "whats the number for 911",
            "cant move my left arm",
            "pictures jason shwartzman",
            "movies out now",
            "how to know if in a coma",
            "thanos nude",
            "clear history google",
            "head hurts why",            
            "brain tumor symptoms",
            "cost brain tumor surgery",
            "early onset alzheimers",
            "is healthy to eat eggs everyday",
            "i think someone is controlling me",
            "difference between who and whom",
            "think my teacher trying to kill me",
            "buy smart pills online",
            "when can i escape?",
            "are there people who look like me?",
            "why isnt pluto a planet",
            "painful throbbing in brain",
            "how to raise credit score",
            "early onset alzhiemers",
            "my watch is moving backwards",
            "whats the state soil of california",
            "why does god allow suffring",
            "how do i get our of here",
            "survival rate brain tumor",
            "best free moblle games 2019",
            "body paralysed except hands webmd",
            "funny animals pics",
            "average age brain tumor",
            "dogs with eyebrows",
            "early onset alzeihmers",
            "why isnt 11 pronounced onety one",
            "tesla 3 used cheap",
            "early onset alsheimers",
            "how to wake up from a dream",
            "how to wake up from a nightmare",
            "ok google, self destruct",
           
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
    this.responseFake = game.add.inputField(62, 134, {
        font: '15px Helvetica',
        fontWeight: 'bold',
        fill: '#ffffff',
        fillAlpha: 0,
        width: 280,
        padding: 0,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        forceCase: PhaserInput.ForceCase.lower,
        focusOutOnEnter: false,
        blockInput: false,
    }
    );
    this.responseFake.focusOutOnEnter = false;
    this.responseFake.blockInput = false;
    this.randResponse = this.response1._text;

     this.responseFake2 = game.add.inputField(204, 134, {
        font: '15px Helvetica',
        fontWeight: 'bold',
        fill: '#ffffff',
        fillAlpha: 0,
        width: 280,
        padding: 0,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        forceCase: PhaserInput.ForceCase.lower,
        focusOutOnEnter: false,
        blockInput: false,
    }
    );
     this.responseFake.alpha = 0;
     this.responseFake2.alpha = 0;
    this.responseFake2.focusOutOnEnter = false;
    this.responseFake2.blockInput = false;
    this.randResponse2 = this.response2._text;

    this.justTextin = false;
    this.newMessage = true;
    this.incoming_response = false;
    this.time = 0;
    this.textPosition = 0;
    if (typeof optionalTheWord == "undefined") {
        this.finishText();
    }
    //incoming call screen
    this.incoming = game.add.sprite(8,-20,'incoming');
    this.incoming.anchor.setTo(0.0,0.0);
    this.incoming.alpha = 0;
    this.incoming.scale.setTo(340/this.incoming.width,340/this.incoming.width);
    this.leftonRead = 0;
    /*
    this.messageGroup = game.add.group();
    this.messageGroup.add(this.messages);
    this.messageGroup.add(this.textMessage);
    */
    this.messageGroup = game.add.group();
    this.messageGroup.add(this.response1);
    this.messageGroup.add(this.response2);
    this.messageGroup.add(this.responseDisplay1);
    this.messageGroup.add(this.responseDisplay2);
    //center text message prompts
    this.response1.x = this.center_text(this.response1,37+(138/2));
    this.response2.x = this.center_text(this.response2,180+(138/2));
    this.responseDisplay1.x = this.response1.x;
    this.responseDisplay1.y = this.response1.y;
    this.responseDisplay2.x = this.response2.x;
    this.responseDisplay2.y = this.response2.y;
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

Minigame.prototype.center_text = function(_text,_pos)
{
    return _pos-(_text.width/2);
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
                    this.wrongCallback(50);
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
        this.nextWord ++;
        this.input.setText("");
        this.fakeInput.setText(this.theWord[this.nextWord]);
        this.callback();
    }
}

Minigame.prototype.setCorrectTextInputCallback = function(callback) {
    this.callback = callback;
}

Minigame.prototype.setWrongTextInputCallback = function(callback) {
    this.wrongCallback = callback;
}

Minigame.prototype.setAcceptTextInputCallback = function(callback) {
    this.acceptCallback = callback;
}

Minigame.prototype.checkResponseText = function(){
//check if its a letter in a textmessage response
    if(this.input.value[this.input.value.length-1] == this.randResponse[this.responseFake.value.length] && this.input.value[this.input.value.length-1] != 'ENTER'){//if last typed charater is next correct character in textresponse string
        this.responseFake.setText(this.responseFake.value + this.input.value[this.input.value.length-1]); //set textresponseFake text to = itself plus last typed character
        this.responseDisplay1.setText(this.responseFake.value);
        this.justTextin = true;
        var correctResponseInt = this.momText[this.nextText][3];

        if(this.responseFake.value == this.randResponse && (this.responseFake.value == this.momText[this.nextText][correctResponseInt]||this.incoming_response)){//if completed text
            console.log(this.momText[this.nextText][correctResponseInt]);
            this.responseFake.setText("");
            this.responseFake2.setText("");
            this.responseDisplay1.setText("");
            this.responseDisplay2.setText("");
            this.time = Phaser.Timer.SECOND*game.rnd.integerInRange(5,10); //mom response time
            this.text_send.play();
            this.finishText();
        }
    } else {this.justTextin = false;}

    if(this.input.value[this.input.value.length-1] == this.randResponse2[this.responseFake2.value.length] && this.input.value[this.input.value.length-1] != 'ENTER'){//if last typed charater is next correct character in textresponse string
        this.responseFake2.setText(this.responseFake2.value + this.input.value[this.input.value.length-1]); //set textresponseFake text to = itself plus last typed character
        this.responseDisplay2.setText(this.responseFake2.value);
        this.justTextin = true;
        var correctResponseInt = this.momText[this.nextText][3];
        if (this.responseFake2.value == "accept") {
            this.acceptCallback();
        }
        if(this.responseFake2.value == this.randResponse2 && (this.incoming_response||this.responseFake2.value == this.momText[this.nextText][correctResponseInt])){//if completed text
            console.log(this.momText[this.nextText][correctResponseInt]);
            this.responseFake2.setText("");
            this.responseFake.setText("");
            this.responseDisplay1.setText("");
            this.responseDisplay2.setText("");
            this.time = Phaser.Timer.SECOND*game.rnd.integerInRange(5,10); //mom response time
            this.text_send.play();
            this.finishText();
        }
    }
}

Minigame.prototype.finishText = function() {
        //scroll down animation
        this.responseFake.setText('');
        this.responseFake2.setText('');
        this.responseDisplay1.setText("");
        this.responseDisplay2.setText("");
        if (this.time != 0) //not called by constructor
        {
            //replied to mom
            this.incoming_response = false;
            this.newMessage = false;
            this.incoming.alpha = 0;
            this.response1.alpha = 0.5;
            this.response2.alpha = 0.5;
            this.response2.y = 137;
            this.response1.y = 137;
            this.response1.fill = '#000';
            this.response2.fill = '#000';
            this.response1.fontSize = '15px';
            this.response2.fontSize = '15px';
            this.responseDisplay1.fontSize = '15px';
            this.responseDisplay2.fontSize = '15px';

            this.textTimer.loop(1, this.scrollUp, this);
            this.leftonRead.stop();
            this.wrong.stop();
            this.phonecall.stop();
            this.textTimer.start();
        }
        game.time.events.add(this.time,
        function()
        {
            this.notification.play();
            this.newMessage = true;
            this.leftonRead = game.time.create(false);
            //scroll down animation
            this.leftonRead.add(Phaser.Timer.SECOND*12, function()
            { 
                this.incoming_response = true;
                this.wrong.play();
                this.phonecall.play();
                this.wrongCallback(500);
                this.responseFake.setText("");
                this.responseFake2.setText("");
                this.responseDisplay1.setText("");
                this.responseDisplay2.setText("");
                this.responseDisplay1.y = 465;
                this.responseDisplay2.y = 465;
                this.response2.y = 465;
                this.response1.y = 465;
                this.randResponse2 = 'accept';
                this.randResponse = 'decline';
                this.response1.fill = '#000000';
                this.response2.fill = '#000000';
                this.response1.fontSize = '16px';
                this.response2.fontSize = '16px';
                this.responseDisplay1.fontSize = '16px';
                this.responseDisplay2.fontSize = '16px';
                this.response1.alpha = 1;
                this.response2.alpha = 1;
                this.response1.text = this.randResponse;
                this.response2.text = this.randResponse2;

                this.response1.x = this.center_text(this.response1,94);
                this.response2.x = this.center_text(this.response2,262);
                this.responseDisplay1.x = this.response1.x;
                this.responseDisplay2.x = this.response2.x;

                this.incoming.alpha = 1;
                this.leftonRead.loop(Phaser.Timer.SECOND*4,function() {this.phonecall.play();},this);
                this.leftonRead.loop(Phaser.Timer.SECOND*2,
                function(){
                    this.wrong.play();
                    this.wrongCallback(25);
                },this);
            }, this);
            this.leftonRead.start();
            this.textTimer = game.time.create(false);
            this.textTimer.loop(1, this.scrollDown, this);
            this.textTimer.start();
        },this);
}

Minigame.prototype.textMove = function() {
    this.textMessage.y = this.textPosition;//move text down
    this.newMessageString.y = this.textPosition - 40;
    this.messages.y = this.textPosition - 80;
    this.responseDisplay1.y = this.textPosition + 47;
    this.responseDisplay2.y = this.textPosition + 47;
    this.response1.y = this.textPosition + 47;
    this.response2.y = this.textPosition + 47;
}

Minigame.prototype.goToNextText = function(){

    var allUsed = true;
    for(var i = 0; i < this.momText.length - 1; i++){//check if all texts have been sent
        if(this.momText[i][3] != 3){//check each texts 'used' value
            console.log("new text recieved");
            allUsed = false;//if found an unused one, allused is false
        }//otherwise its true
    }
    if(allUsed == true){//if so, reset all texts 'used' values to original
        console.log("all texts have been used. Resetting texts.")
        for(var j = 0; j < this.momText.length -1; j++){
            this.momText[j][3] = this.momTextCopy[j][3];
        }
    }

    if (this.momText.length > 0) {
        //delete last text from list
        this.momText[this.nextText][3] = -1;//set current text to null after correctly responded to
        this.nextText = game.rnd.integerInRange(0, this.momText.length-1);//set new text to a random one

        if(this.momText[this.nextText][3] == -1){//if its a repeat text, go to the next one
            this.momText[this.nextText][3] = game.rnd.integerInRange(0,1);
            this.goToNextText();
        }

        if(this.momText[this.nextText][3] != -1){//prevent previous recursions from changing values
            this.textMessage.setText(this.momText[this.nextText][0]);//set the text to new string
            //randomized order
            this.randResponse = this.momText[this.nextText][1];
            this.randResponse2 = this.momText[this.nextText][2];
            this.response1.setText(this.randResponse);
            this.response2.setText(this.randResponse2);
        }
        this.response1.x = this.center_text(this.response1,37+(138/2));
        this.response2.x = this.center_text(this.response2,180+(138/2));
        this.responseDisplay1.x = this.response1.x;
        this.responseDisplay2.x = this.response2.x;
    }
}

Minigame.prototype.scrollUp = function() {
 if(this.textPosition > (-200)){//if text isnt in final position
        this.responseFake.setText('');
        this.responseFake2.setText('');
        this.responseDisplay1.setText("");
        this.responseDisplay2.setText("");
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