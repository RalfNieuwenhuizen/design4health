/**
 * Created by david on 11/23/14.
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
    goog.base(this, 'showExercise', tile.crop.prop.exercise.key);
    // update title for harvest screen only
    this.title.setText(this.title.getText() + ' (Harvesting ' + this.tile.crop.prop.name + ')')
}

farming.SceneHarvest.prototype.startExercise = function(scene) {
    goog.base(scene, 'startExercise', scene, scene.tile.crop.prop.exercise.callback);
}

farming.SceneHarvest.prototype.cancelExercise = function(scene) {
    goog.base(scene, 'cancelExercise', scene)
}

farming.SceneHarvest.prototype.finishExercise = function(scene) {
    if(!scene.exercise) return;

    // handle crop actions
    var crop = scene.tile.crop.prop;
    scene.game.addCoins(crop.revenue);
    if(crop.revenue_item)
        scene.game.addItem(crop.revenue_item, 1);
    if(scene.tile.crop.harvest()) {
        scene.tile.removeCrop();
    }

    // handle exercise actions
    goog.base(scene, 'finishExercise', scene);

    scene.game.hideHarvest(scene.game);
}

