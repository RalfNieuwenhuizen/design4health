/**
 * 
 */
goog.provide('farming.SceneClone');

goog.require('lime.Sprite');
goog.require('farming.Exercise');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Tile');
goog.require('farming.Crop');
goog.require('farming.Scene');
goog.require('farming.SceneCropDetails');

/**
 * Scene elements
 *
 */
farming.SceneClone = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    var w = new lime.Sprite().setFill('#f0f0f0').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.5);
    this.title.setText('Clone');
    
    this.closeButton = new farming.Button('X').setColor('#999999')
    		.setPosition(center.x + game.getFullSize(0.3).width, center.y - game.getFullSize(0.3).height)
    		.setSize(20,20);

    this.windowLayer
        .appendChild(w).appendChild(this.title)
        .appendChild(this.closeButton);

    this.closeButton.setAction(this.closeClone, this);
    for(var i in game.player.currentCrops) {
    	var prop = CROPS[game.player.currentCrops[i]];
    	this.drawCrop(prop, new goog.math.Coordinate( (i%3)*150+250, Math.floor(i/3)*100 + 175))
    }
}
goog.inherits(farming.SceneClone, farming.Scene);

farming.SceneClone.prototype.game = null;

farming.SceneClone.prototype.closeClone = function(scene) {
    scene.game.hideClone();
}

farming.SceneClone.prototype.drawCrop = function(cropProps, position) {
	var cropIcon = new lime.Sprite().setFill('images/'+cropProps.key+'_ripe.png').setSize(100, 60).setPosition(position);
	
	// Create button to clone the icon
	this.cloneButton = new farming.Button('Clone').setColor('#0000FF').setPosition(new goog.math.Coordinate(position.x-32,position.y+45)).setSize(60,20);
	this.cloneButton.setAction(this.startClone, {'cropProps': cropProps,'game': this} );
	
	// Create button to get details about the icon
	this.cloneDetails = new farming.Button('Details').setColor('#0000FF').setPosition(new goog.math.Coordinate(position.x+32,position.y+45)).setSize(60,20);
	this.cloneDetails.setAction(this.game.showCropDetails, {'cropProps': cropProps,'game': this.game} );
	
	this.windowLayer.appendChild(cropIcon).appendChild(this.cloneButton).appendChild(this.cloneDetails);
}

//Defines action for Clone button, receives properties of the crop and scene
//farming.SceneCropDetails.prototype.startClone = function(input) {
//	input.cropProps;
//	input.screen;
//}

//Defines action for Clone Details button, receives properties of the crop array[0] and scene array[1]
//farming.SceneCropDetails.prototype.cloneDetails = function(input){
//	input.cropProps;
//	input.screen;
//}