/**
 * 
 */
goog.provide('farming.SceneCropDetails');

goog.require('lime.Sprite');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Tile');
goog.require('farming.Crop');
goog.require('farming.Scene');
goog.require('farming.SceneClone');

/**
 * Scene elements
 *
 */
farming.SceneCropDetails = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    var w = new lime.Sprite().setFill('#A9A9A9').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());

    var crop = CROPS.apple_tree;
    
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.5);
    this.title.setText('Crop Details '+ crop.name);
    
    this.closeButton = new farming.Button('X').setColor('#999999')
    		.setPosition(center.x + game.getFullSize(0.3).width, center.y - game.getFullSize(0.3).height)
    		.setSize(20,20);
    this.closeButton.setAction(this.closeDetails, this); 
    // show text crop.cost, crop.revenue, etc.
    
    this.windowLayer
    .appendChild(w).appendChild(this.title).appendChild(this.closeButton);
}

goog.inherits(farming.SceneCropDetails, farming.Scene);

farming.SceneCropDetails.prototype.game = null;

farming.SceneCropDetails.prototype.closeDetails = function(scene) {
    scene.game.hideDetails();
}
