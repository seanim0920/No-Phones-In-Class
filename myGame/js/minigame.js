MinigamePreload = function(game) {
	// preload images
    game.load.audio('tock', 'assets/audio/tock.wav');
    game.load.audio('correct', 'assets/audio/shake.wav');
}

//constructor for minigame
var Minigame = function(game) {
	//refer to the constructor for the group object in Phaser
	Phaser.Group.call(this, game);
	this.tock = game.add.audio('tock');
	this.correct = game.add.audio('correct');

	// creates object for cursor input
	cursors = game.input.keyboard.createCursorKeys();
	// run game loop

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
    "is healthy to eat eggs everyday",
    "difference between who and whom",
    "buy smart pills online",
    "why isnt pluto a planet",
    "make money without working",
    "how to raise credit score",
    "does your vote really matter",
    "whats the state soil of california",
    "rick and morty watch free",
    "why does god allow suffering",
    "best free mobile games 2019",
    "funny animals pics",
    "dogs with eyebrows",
    "birds with arms",
    "fairly odd parents fairy guy name",
    "cosmo nude",
    "why isnt 11 pronounced onety one",
    "elon musk net worth",
    "tesla 3 price",
    "tesla 3 used cheap",
    "elon musk nude",
    "how to hold breath long time",
    "when is next election",
    "what is my iq",
    "qwertyuioplkjhgfdsazxcvbnm"
    ];

    this.nextWord = 0;
    this.lettersTyped = 0;

    this.fakeInput = game.add.inputField(27, 180, {
    font: '18px Helvetica',
    fill: 'rgba(0, 0, 0, 0.65)',
    width: 280,
    padding: 8,
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 15,
});
    this.fakeInput.setText(this.theWord[0]);

 this.input = game.add.inputField(27, 180, {
    font: '18px Helvetica',
    fill: '#000000',
    fillAlpha: 0,
    width: 280,
    padding: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    forceCase: PhaserInput.ForceCase.lower,
    focusOutOnEnter: false
});
this.input.startFocus();

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

	//check if user typed a new letter
	if(this.lettersTyped < this.input.value.length){
		//chech if last char typed is incorrect
		if(this.input.value[this.input.value.length-1] != (this.theWord[this.nextWord])[this.lettersTyped]){
			console.log("wrong");
			this.input.setText(this.input.value.substring(0,this.input.value.length - 1)); //set input text to = itself minus one character
			if((this.theWord[this.nextWord])[this.lettersTyped] == " "){//if wrong and correct letter was a space
				//go to next letter
				this.input.setText(this.input.value + " ");
                this.lettersTyped++;
			}
			this.input.startFocus();
		}

		else{ //correct input
				console.log("correct");
				this.tock.play();
				this.lettersTyped ++;
			} 
		}
	//check if sentence correctly typed and enter key is pressed
	var temp = this.input.value;
	if(temp == this.theWord[this.nextWord] /*&& game.input.keyboard.isDown(Phaser.Keyboard.ENTER)*/){
        this.correct.play();
        this.value++;
        this.score.setText("Score: " + this.value);
		temp = "";
		this.nextWord ++;
		this.input.setText("");
		this.fakeInput.setText(this.theWord[this.nextWord]);
		this.lettersTyped = 0;
		this.input.startFocus();
	}
}