//constructor for teacher
var TextMessage = function(game, x, y, velocityX, velocityY) {
	//refer to the constructor for the sprite object in Phaser
	Phaser.Group.call(this, game);	
	this.velocityX = velocityX;
	this.velocityY = velocityY;
	graphics = game.add.graphics(0, 0);
	graphics.beginFill(0x005aff);
	
	console.log("creating message at " + x + ", " + y);
	messageRect = graphics.drawRoundedRect(x - 69, y, 138, 40, 20);
	messageRect.alpha = 0.9;
	graphics.endFill();
	
	this.style = {
		font: '15px Helvetica Bold',
		fill: '#FFF',
		align: 'center'
	};

	textMessage = game.add.text(x, y, "LOL",this.style);
	this.add(messageRect);
	this.add(textMessage);
};

//set snow's prototype to that from the phaser sprite object
TextMessage.prototype = Object.create(Phaser.Group.prototype);
//set the constructor for the prototype
TextMessage.prototype.constructor = TextMessage;

TextMessage.prototype.update = function() {
	this.x += this.velocityX;
	this.y -= this.velocityY;
	if (this.y > game.world.height)
		this.destroy();
};