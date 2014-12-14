/**
 * 	
 *  
 */
goog.provide('farming.Introduction');

goog.require('lime.Sprite');
goog.require('farming.Exercise');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Tile');
goog.require('farming.Crop');
goog.require('farming.Scene');
goog.require('goog.events');

/**
 * Scene elements
 *
 */
farming.Introduction = function (game) {
    goog.base(this);
    this.game = game;
    
    // This layer is on top of all screens
    this.introLayer = new lime.Layer();
    game.sceneMap.appendChild(this.introLayer);
    // This layer is attached to the landscape
    this.introScrollLayer = new lime.Layer();
    game.sceneMap.landLayer.appendChild(this.introScrollLayer);
    
    this.introPhase = 1;
    
    this.center = game.getCenterPosition();
    this.w = new lime.Sprite().setFill('#FFFFFF').setSize(game.getFullSize(0.85)).setPosition(this.center.x, this.center.y-10);
    this.text = new lime.Label().setFontSize(18).setPosition(this.center.x, this.center.y-15).setMultiline(true);
    this.button = new farming.Button('').setColor('#999999').setAction(this.buttonAction, this);
    
    this.appendChild(this.introLayer);
}

goog.inherits(farming.Introduction, farming.Scene);

farming.Introduction.prototype.game = null;

// The intro function has been called from sceneMap
farming.Introduction.prototype.intro = function(){
	
	// The intro# function is used according to the current phase
	if (this['intro'+this.introPhase])
		this['intro'+this.introPhase]()
		
	else
		console.log('next intro does not exist');
}

// The button is used: introPhase goes one step further and removes the current screen
farming.Introduction.prototype.buttonAction = function(scene) {
	console.log('action button used');
	
	// If current scene is intro: close screen
	if (scene.game.director.getCurrentScene() == scene){
		console.log('intro is the current scene')
		scene.game.closeIntroduction();
	}
	
	scene.game.introduction.introLayer.removeAllChildren();
	scene.game.introduction.introScrollLayer.removeAllChildren();
	scene.game.introduction.introPhase++;
	console.log('intro phase is: '+scene.game.introduction.introPhase);
	
	// Call for the next introduction screen
	scene.intro();
}

// First introduction screen: general story
farming.Introduction.prototype.intro1 = function(){
	this.text.setFontWeight('bold').setText("2542 AD \n \n"
					+ "Your uncle was one of the first people \n"
					+ "to buy land in an unknown planet and decided to \n"
					+ "turn it into a farm to facilitate the earth\'s \n"
					+ "growing needs of foods. As years went by the farm \n "
					+ "became very profitable and produced the most \n"
					+ "sought out products. \n\n"
					+ "You were very surprised when you received a mail \n"
					+ "saying that your uncle had left you the farm \n"
					+ "years ago but you only heard of it now. \n \n "
					+ "After so many years, the fields on planet Yeo are \n"
					+ "unused and empty. Will you be able to salvage the \n"
					+ "farm?");
	this.w.setPosition(this.center.x, this.center.y);
	this.text.setPosition(this.center.x, this.center.y);
	this.button.setPosition(this.center.x, this.center.y + this.game.getFullSize(0.37).height).setSize(60,30).setText('Start');
	this.introLayer.setOpacity(1);
	this.introLayer.appendChild(this.w).appendChild(this.text).appendChild(this.button);
	
	this.game.showIntroduction();
}

// Second screen: meet the uncle
farming.Introduction.prototype.intro2 = function(){
	this.text.setFontWeight('bold').setPosition(this.center.x+58, this.center.y-15).setText(
			"Hello, welcome to Spaceville. My name \n "
			+ "is Phil, I am your uncle. \n"
			+ "I will help you getting through \n"
			+ "this first period. \n \n"
			+ "We can make your farm succesful \n"
			+ "together. If you spend your money \n"
			+ "wisely you unlock new challenges \n"
			+ "and possibilities. \n \n"
			+ "Let's have a look at your farm.");
	
	icon = new farming.Sprite('images/Farmer.png').setSize(150, 200).setPosition(this.center.x-165, this.center.y);
	
	this.w.setSize(this.game.getFullSize(0.65));
	this.button.setPosition(this.center.x, this.center.y + 120)
		.setSize(80,30).setText('Let\'s go!');
	this.introLayer.setOpacity(0.85);
	this.introLayer.appendChild(this.w)
	.appendChild(this.text).appendChild(this.button).appendChild(icon);
	
	this.game.showIntroduction();
}

// Third screen: go to the inventory
farming.Introduction.prototype.intro3 = function(){
	var middle = this.game.sceneMap.calculate('middleTile');
	var middleCor = this.game.sceneMap.twoDToScreen(middle.x,middle.y);
	
	this.text.setFontWeight('bold').setPosition(middleCor.x-142,middleCor.y).setText(
			"This is your new farm, \n click on it to see \n your inventory");
	
	icon = new farming.Sprite('images/Farmer.png').setSize(100, 100).setPosition(middleCor.x-276,middleCor.y);
	this.w.setFill('images/textbox/right_arrow.png').setSize(this.game.getFullSize(0.52).width, this.game.getFullSize(0.3).height)
		.setPosition(middleCor.x-127, middleCor.y).setOpacity(0.85);	
	this.introScrollLayer.setOpacity(0.85);
	this.introScrollLayer.appendChild(this.w).appendChild(this.text).appendChild(icon);
	
	// Listen to the show_farm event
	goog.events.listenOnce(this.game.source,this.game.EventType.SHOW_FARM,goog.partial(this.buttonAction,this.game.introduction));
}

// Fourth screen: show the inventory
farming.Introduction.prototype.intro4 = function(){
	var middle = this.game.sceneMap.calculate('middleTile');
	var middleCor = this.game.sceneMap.twoDToScreen(middle.x,middle.y);
	
	this.text.setFontWeight('bold').setPosition(middleCor.x,middleCor.y).setText(
			"This is your new farm, \n click on it to see \n your inventory");
	
	icon = new farming.Sprite('images/Farmer.png').setSize(100, 100).setPosition(middleCor.x,middleCor.y);
	this.w.setFill('images/textbox/right_arrow.png').setSize(this.game.getFullSize(0.52).width, this.game.getFullSize(0.3).height)
		.setPosition(middleCor.x, middleCor.y).setOpacity(0.85);	
	this.introLayer.setOpacity(0.85);
	this.introLayer.appendChild(this.w).appendChild(this.text).appendChild(icon);
	
	// Listen to the show_farm event
	goog.events.listenOnce(this.game.source,this.game.EventType.SHOW_FARM,goog.partial(this.buttonAction,this.game.introduction));
}


farming.Introduction.prototype.write = function(text){
	console.log('test text is: '+text);
}
