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
	// Enable the Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	// add audio
	this.wow = game.add.audio('grunt');
	this.music = game.add.audio('music');
	this.pop = game.add.audio('yay');
	//play music and let it loop
	//this.music.play('', 0, 1, true);

	// Create a platforms group for collision
	platforms = game.add.group();
	platforms.enableBody = true; // Enable physics for this group

	// Create the ground
	var ground = platforms.create(0, 500, 'ground');
	// Scale it to fit the width of the game
	ground.scale.setTo(2, 7);

	// This stops the ground from falling away when you jump on it
	ground.body.immovable = true;
	
	// Create the player and their starting position
	player = game.add.sprite(32, game.world.height - 500, 'maincharacter');

	// Enable physics on the player
	game.physics.arcade.enable(player);

	// Player physics properties
	player.body.gravity.y = 300; //fall speed

	//  Our two animations, walking left and right.
	player.animations.add('left', [0, 1, 2, 3], 12, true);
	player.animations.add('right', [5, 6, 7, 8], 12, true);

	// Create group of enemies
	baddies = game.add.group();
	baddies.enableBody = true; //enable physics for this group
	// Create two enemies

	var baddie = baddies.create(70, 100, 'enemy'); //define starting position and sprite
	baddie.body.gravity.y = 200; //fall speed

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
    
    theWord = "aaaaaaaaaaaaaa?"
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

	var temp = this.input.value;

	if(temp == theWord && game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
		console.log("you win!");
		temp = "";
	}

	// creates object for cursor input
cursors = game.input.keyboard.createCursorKeys();
	// run game loop
	
	// Collide the player and the stars with the platforms
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(baddies, platforms);
	game.physics.arcade.overlap(player, baddies, Minigame.hitBaddie, null, this);
	
	//  Reset the players velocity (movement)
	player.body.velocity.x = 0;
	
	if (cursors.left.isDown)
	{
		//  Move to the left
		player.body.velocity.x = -200;

		if (hitPlatform)
			//  play the walking animation if player is moving on the ground
			player.animations.play('left');
		else
			//  freeze the player's animation when mid-air
			player.frame = 1;
	}
	else if (cursors.right.isDown)
	{
		//  Move to the right
		player.body.velocity.x = 200;

		if (hitPlatform)
			//  play the walking animation if player is moving on the ground
			player.animations.play('right');
		else
			//  freeze the player's animation when mid-air
			player.frame = 8;
	}
	else
	{
		//  If the player isn't holding any buttons down, make them face the camera
		player.animations.stop();
		player.frame = 4;
	}

	//  Allow the player to jump if they are touching the ground.
	if (cursors.up.isDown && player.body.touching.down && hitPlatform)
	{
		player.body.velocity.y = -500;
	}
};

Minigame.hitBaddie = function(player, baddie) {
	// Removes the baddie from the screen and stops the music
	this.music.stop();
	baddie.kill();

	//  Add and update the score
	this.score -= 25;
	// go to the end screen and pass the final score
	game.state.start('End', true, false, {finalscore: this.score});
};