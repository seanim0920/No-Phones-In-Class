//constructor for minigame
var Minigame = function(game) {
	//refer to the constructor for the group object in Phaser
	Phaser.Group.call(this, game);
	
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
	this.music.play('', 0, 1, true);

	// Adds "sky" sprite as the background
	game.add.sprite(0, 0, 'sky');

	// Create a platforms group for collision
	platforms = game.add.group();
	platforms.enableBody = true; // Enable physics for this group

	// Create the ground
	var ground = platforms.create(0, 500, 'ground');
	// Scale it to fit the width of the game
	ground.scale.setTo(2, 7);

	// This stops the ground from falling away when you jump on it
	ground.body.immovable = true;

	// Create five ledges
	var ledge = platforms.create(350, 450, 'ground');
	ledge.scale.setTo(0.01, 1);
	ledge.body.immovable = true;

	ledge = platforms.create(32, 200, 'ground');
	ledge.scale.setTo(0.65, 0.7);
	ledge.body.immovable = true;
	
	ledge = platforms.create(-210, 50, 'ground');
	ledge.scale.setTo(1, 0.1);
	ledge.body.immovable = true;
	
	ledge = platforms.create(260, 350, 'ground');
	ledge.scale.setTo(1, 0.1);
	ledge.body.immovable = true;

	ledge = platforms.create(505, 580, 'ground');
	ledge.scale.setTo(0.25, 2);
	ledge.body.immovable = true;
	
	// Create the player and their starting position
	player = game.add.sprite(32, game.world.height - 500, 'maincharacter');

	// Enable physics on the player
	game.physics.arcade.enable(player);

	// Player physics properties
	player.body.gravity.y = 300; //fall speed

	//  Our two animations, walking left and right.
	player.animations.add('left', [0, 1, 2, 3], 12, true);
	player.animations.add('right', [5, 6, 7, 8], 12, true);
	
	// Create group of collectibles
	stars = game.add.group();
	stars.enableBody = true; //enable physics for this group
	
	// Create group of enemies
	baddies = game.add.group();
	baddies.enableBody = true; //enable physics for this group
	
	// Create two enemies
	var baddie = baddies.create(70, 100, 'enemy'); //define starting position and sprite
	baddie.body.gravity.y = 200; //fall speed
	baddie.animations.add('left', [0, 1, 1], 12, true); //add default animation
	baddie.animations.play('left'); //play default animation
	// Create another enemy
	baddie = baddies.create(570, 500, 'enemy'); //define starting position and sprite
	baddie.body.gravity.y = 200; //fall speed
	baddie.animations.add('right', [3, 2, 2], 12, true); //add default animation
	baddie.animations.play('right'); //play default animation

	//  Here we'll create 9 stars evenly spaced apart
	for (var i = 0; i < 9; i++)
	{
		//  Create a star inside of the 'stars' group
		var star = stars.create(i * 70, 0, 'star');

		//  Let gravity do its thing
		star.body.gravity.y = 600;

		//  This just gives each star a slightly random bounce value
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}
	
	// Create diamond sprite
	diamond = game.add.sprite(Math.random() * 500, Math.random() * 500, 'diamond'); //at a random position
	game.physics.arcade.enable(diamond); //enable physics for this object
	
	// Create text at the corner to print the score
	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
};
//set snow's prototype to that from the phaser sprite object
Minigame.prototype = Object.create(Phaser.Group.prototype);
//set the constructor for the prototype
Minigame.prototype.constructor = Minigame;
//override the update method
Minigame.prototype.update = function() {
	// creates object for cursor input
	cursors = game.input.keyboard.createCursorKeys();
	// run game loop
	
	// Collide the player and the stars with the platforms
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.collide(baddies, platforms);
	game.physics.arcade.overlap(player, stars, Minigame.collectStar, null, this);
	game.physics.arcade.overlap(player, baddies, Minigame.hitBaddie, null, this);
	game.physics.arcade.overlap(player, diamond, Minigame.collectDiamond, null, this);
	
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
		player.body.velocity.y = -350;
	}
};

Minigame.collectStar = function(player, star) {
	// Removes the star from the screen
	star.kill();
	// plays a sound
	this.pop.play();

	//  Add and update the score
	this.score += 10;
	scoreText.text = 'Score: ' + this.score;
	console.log('total stars is: ' + stars.total)
	// check if this was the last star in the game
	if (stars.total <= 0)
	{
		//stop the music and go to the end screen
		this.music.stop();
		//pass the score to the end screen
		game.state.start('End', true, false, {finalscore: this.score});
	}
};

Minigame.collectDiamond = function(player, diamond) {
	// Removes the star from the screen
	diamond.kill();
	//plays a sound
	this.wow.play();
	//  Add and update the score
	this.score += 50;
	scoreText.text = 'Score: ' + this.score;
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