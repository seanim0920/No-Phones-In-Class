PhonePreload = function(game) {
	// preload images
	game.load.image('phone', 'assets/img/phone.png');
}

//constructor for teacher
var Phone = function(game, x, y) {
	this.PHONE_WIDTH = 350;
	this.PHONE_HEIGHT = 700;
	this.CURSOR_OFFSET_X = 250;
	this.CURSOR_OFFSET_Y = 270;
	this.MINIGAME_OFFSET_X = 90;
	this.MINIGAME_OFFSET_Y = 80;

	//move everything currently in the game world to a group
	// minigame = new Minigame(game);
	// game.world.moveAll(minigame, true);
	// game.world.add(minigame);

	//make everything in the group invisible except for a small section, which will be the size of the phone
	// var screen = game.add.graphics(0,0);
	// screen.beginFill(0xffffff, 1);
	// screen.drawRect(0, 0, this.PHONE_WIDTH, this.PHONE_HEIGHT);
	// screen.endFill(0xffffff, 1);
	// minigame.add(screen);
	// minigame.mask = screen;

	Phaser.Sprite.call(this, game, x, y, 'phone');
	
	this.anchor.setTo(0,0);
};

//set snow's prototype to that from the phaser sprite object
Phone.prototype = Object.create(Phaser.Sprite.prototype);
//set the constructor for the prototype
Phone.prototype.constructor = Phone;

Phone.prototype.update = function() {
	console.log('phone position is ' + this.x);
	phone.x = game.input.x - this.CURSOR_OFFSET_X;
	phone.y = game.input.y - this.CURSOR_OFFSET_Y;
	minigame.x = phone.x + this.MINIGAME_OFFSET_X;
	minigame.y = phone.y + this.MINIGAME_OFFSET_Y;
};