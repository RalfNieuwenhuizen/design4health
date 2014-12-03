/**
 * 
 */
goog.provide('farming.SceneCloneOnMap');

goog.require('lime.Sprite');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Tile');
goog.require('farming.Crop');
goog.require('farming.Scene');
goog.require('farming.SceneClone');
//goog.require('farming.SceneMap');

farming.SceneCloneOnMap = function (game) {
    goog.base(this);
    this.game = game;
    this.currentCrop;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    this.w = new lime.Sprite().setFill('#A9A9A9').setSize(game.getFullSize(0.3).width, game.getFullSize(0.1).height).setPosition(center.x, center.y-200);
    this.title = new lime.Label().setFontSize(18).setText('Clone').setPosition(20,-10);
    this.picture = new lime.Sprite().setSize(80, 40).setPosition(-75,0);
    this.cropCost = new lime.Label().setFontSize(18).setText('Crop').setPosition(20, 10);

    this.closeButton = new farming.Button('X').setColor('#999999')
    		.setPosition(107,-12).setSize(20,20);
    this.closeButton.setAction(this.closeCloning, this); 
    
    this.w.appendChild(this.title).appendChild(this.cropCost).appendChild(this.closeButton).appendChild(this.picture);
    this.windowLayer.appendChild(this.w);
}

goog.inherits(farming.SceneCloneOnMap, farming.Scene);

farming.SceneCloneOnMap.prototype.game = null;

farming.SceneCloneOnMap.prototype.startCloning = function(crop) {
    this.title.setText('Clone '+ crop.name);
    this.cropCost.setText('Cost: '+crop.cost);
    this.picture.setFill('images/'+crop.key+'_ripe.png');
}

farming.SceneCloneOnMap.prototype.closeCloning = function(scene) {
    scene.game.closeCloning();
}
