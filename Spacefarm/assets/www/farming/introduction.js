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

/**
 * Scene elements
 *
 */
farming.Introduction = function (game) {
    goog.base(this);
    this.game = game;
    this.introLayer = new lime.Layer();
    this.appendChild(this.introLayer);
    this.introPhase = 0;
    
    game.sceneMap.appendChild(this.introLayer);
    this.center = game.getCenterPosition();
    this.w = new lime.Sprite().setFill('#FFFFFF').setSize(game.getFullSize(0.85)).setPosition(this.center.x, this.center.y-10);
    
    this.text = new lime.Label().setFontSize(18).setPosition(this.center.x, this.center.y-15).setMultiline(true);

    this.button = new farming.Button('').setColor('#999999').setAction(this.buttonAction, this);
        //.setPosition(center.x + game.getFullSize(0.325).width, center.y - game.getFullSize(0.31).height).setSize(30,30).setText('Start');;
}

goog.inherits(farming.Introduction, farming.Scene);

farming.Introduction.prototype.game = null;

// The intro function has been called from sceneMap
farming.Introduction.prototype.intro = function(){
	// The intro# function is used according to the current phase
	// console.log('introphase: ' + this.introPhase);
	this['intro'+this.introPhase]();
	
}

// First introduction screen: general story
farming.Introduction.prototype.intro0 = function(){
	this.text.setFontWeight('bold').setText("2542 AD \n \n"
					+ "Your uncle was one of the first people \n"
					+ "to buy land in an unknown planet and decided to \n"
					+ "turn it into a farm to facilitate the earth’s \n"
					+ "growing needs of foods. As years went by the farm \n "
					+ "became very profitable and produced the most \n"
					+ "sought out products. \n\n"
					+ "You were very surprised when you received a mail \n"
					+ "saying that your uncle had left you the farm \n"
					+ "years ago but you only heard of it now. \n \n "
					+ "After so many years, the fields on planet Yeo are \n"
					+ "unused and empty. Will you be able to salvage the \n"
					+ "farm? Spend your money wisely to grow the company \n"
					+ "and unlock new possibilities by doing the exercises.");
	
	this.button.setPosition(this.center.x, this.center.y + this.game.getFullSize(0.365).height)
    .setSize(60,30).setText('Start');
	this.introLayer.setOpacity(0.85);
	this.introLayer.appendChild(this.w)
	.appendChild(this.text).appendChild(this.button);
}

// The button is used: introPhase goes one step further and removes the current screen
farming.Introduction.prototype.buttonAction = function(scene) {
	scene.game.introduction.introLayer.removeAllChildren();
	scene.game.introduction.introPhase++;
}
