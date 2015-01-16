/**
 * Created on 11/23/14.
 */
goog.provide('farming.SceneHarvest');

goog.require('lime.Sprite');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.Layer');
goog.require('farming.Crop');
goog.require('farming.Exercise');
goog.require('farming.SceneExercise');

/**
 * Scene harvest
 * This is a subclass of the exercise scene, and calls upon its parent class functions
 *
 */
farming.SceneHarvest = function (game) {
    goog.base(this, game);
}
goog.inherits(farming.SceneHarvest, farming.SceneExercise);

farming.SceneHarvest.prototype.game = null;
farming.SceneHarvest.prototype.exercise = null;
farming.SceneHarvest.prototype.tile = null;

farming.SceneHarvest.prototype.showExercise = function(tile) {
    this.tile = tile;
    goog.base(this, 'showExercise', tile.getExercise());
    // update title for harvest screen only
}

farming.SceneHarvest.prototype.startExercise = function(scene) {
    farming.SceneExercise.prototype.startExercise(scene);
}

farming.SceneHarvest.prototype.closeExercise = function(scene) {
    scene.hideHarvest(scene);
}

farming.SceneHarvest.prototype.finishExercise = function(scene) {
    if(!scene.exercise) return;

    // handle item actions
    var item = scene.tile.getItem().prop;
    scene.game.addCoins(item.revenue);
    if(item.revenue_item)
        scene.game.addItem(item.revenue_item, 1, scene.tile.getPosition());
    if(scene.tile.getItem().harvest()) {
        scene.tile.removeItem();
    }

    // handle exercise actions
    farming.SceneExercise.prototype.finishExercise(scene);

    scene.hideHarvest(scene);
    // Let the event fire
    scene.game.source.dispatchEvent(scene.game.EventType.CROP_HARVESTED);
}

farming.SceneHarvest.prototype.hideHarvest = function(scene) {
    scene.game.hideHarvest();
}
