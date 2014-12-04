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
    
    var center = game.getCenterPosition();
    this.w = new lime.Sprite().setFill('#FFFFFF').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());
    
    
    // WORK FROM HERE, REPLACE WINDOWLAYER FOR INTROLAYER
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.5);
    this.title.setText('Introduction');

    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(center.x + game.getFullSize(0.325).width, center.y - game.getFullSize(0.31).height)
        .setSize(30,30);
    
    this.windowLayer.appendChild(this.w)
    	.appendChild(this.title).appendChild(this.closeButton);
    
    this.closeButton.setAction(this.closeScreen, this);
    
}
goog.inherits(farming.SceneClone, farming.Scene);

farming.SceneClone.prototype.game = null;

farming.Introduction.prototype.closeScreen = function(scene) {
	scene.game.hideIntro();
}
