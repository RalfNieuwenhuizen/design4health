/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.SceneHarvest');

goog.require('lime.Sprite');
goog.require('lime.Layer');
goog.require('farming.Crop');
goog.require('farming.Scene');

/**
 * Scene elements
 *
 */
farming.SceneHarvest = function (game) {
    goog.base(this);
    this.game = game;
    var windowLayer = new lime.Layer();
    this.appendChild(windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    var w = new lime.Sprite().setFill('#f0f0f0').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.5);
    this.description = new lime.Label().setFontSize(11).setPosition(center.x, center.y);
    this.cancelButton = new farming.Button('Back').setColor('#999999').setPosition(center.x * 0.5, center.y * 1.5).setSize(100,40);
    this.startButton = new farming.Button('Start').setColor('#00ff00').setPosition(center.x, center.y * 1.5).setSize(100,40);
    this.finishButton = new farming.Button('Fake finish').setColor('#999999').setPosition(center.x*1.5, center.y * 1.5).setSize(100,40);
    windowLayer
        .appendChild(w).appendChild(this.title)
        .appendChild(this.description).appendChild(this.startButton)
        .appendChild(this.cancelButton).appendChild(this.finishButton);

    this.startButton.setAction(this.startHarvesting, this);
    this.cancelButton.setAction(this.cancelHarvesting, this);
    this.finishButton.setAction(this.finishHarvesting, this);


}
goog.inherits(farming.SceneHarvest, farming.Scene);

farming.SceneHarvest.prototype.game = null;
farming.SceneHarvest.prototype.exercise = null;

farming.SceneHarvest.prototype.showExercise = function(tile) {
    this.title.setText('Harvesting '+tile.crop.prop.name+': '+tile.crop.prop.exercise.title);
    this.description.setText(tile.crop.prop.exercise.description);
    this.tile = tile;
    this.finishButton.setHidden(true);
}

farming.SceneHarvest.prototype.startHarvesting = function(scene) {
    if(scene.exercise) return;
    console.log('Starting harvest');
    scene.finishButton.setHidden(false);
    scene.exercise = new farming.Exercise(scene.tile.crop.prop.exercise.callback, scene,  scene.finishHarvesting, scene.cancelHarvesting);
    
}

     

farming.SceneHarvest.prototype.cancelHarvesting = function(scene) {
    scene.game.hideHarvest();

}
farming.SceneHarvest.prototype.finishHarvesting = function(scene) {
    if(!scene.exercise) return;
    scene.exercise = null;
    scene.game.addCoins(scene.tile.crop.prop.revenue);
    if(scene.tile.crop.harvest()) {
        scene.tile.removeCrop();
    }
    scene.game.hideHarvest();
}

