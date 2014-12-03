/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.SceneExercise');

goog.require('lime.Sprite');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.Layer');
goog.require('farming.Exercise');
goog.require('farming.Scene');

/**
 * Scene elements
 *
 */
farming.SceneExercise = function (game) {
    goog.base(this);
    this.game = game;
    var windowLayer = new lime.Layer();
    this.appendChild(windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    var w = new lime.Sprite().setFill('#f0f0f0').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.5);
    this.description = new lime.Label().setFontSize(12).setPosition(center.x*0.75, center.y).setSize(game.getFullSize(0.4)).setAlign('left').setMultiline(true);
    this.animation = new lime.Sprite().setSize(game.getFullSize(0.5).height*0.75, game.getFullSize(0.5).height).setPosition(center.x*1.4, center.y);
    this.cancelButton = new farming.Button('Back').setColor('#999999').setPosition(center.x * 0.5, center.y * 1.5).setSize(100,40);
    this.startButton = new farming.Button('Start').setColor('#00ff00').setPosition(center.x, center.y * 1.5).setSize(100,40);
    this.finishButton = new farming.Button('Fake finish').setColor('#999999').setPosition(center.x*1.5, center.y * 1.5).setSize(100,40);
    windowLayer
        .appendChild(w).appendChild(this.title)
        .appendChild(this.description)
        .appendChild(this.animation)
        .appendChild(this.startButton)
        .appendChild(this.cancelButton)
        .appendChild(this.finishButton);

    this.startButton.setAction(this.startExercise, this);
    this.cancelButton.setAction(this.cancelExercise, this);
    this.finishButton.setAction(this.finishExercise, this);


}
goog.inherits(farming.SceneExercise, farming.Scene);

farming.SceneExercise.prototype.game = null;
farming.SceneExercise.prototype.exercise = null;
farming.SceneExercise.prototype.exerciseKey = null;

farming.SceneExercise.prototype.showExercise = function(key) {
    this.exerciseKey = key;
    var exercise = EXERCISES[key];
    this.title.setText('Exercise: ' + exercise.title);
    this.description.setText(exercise.description);
    var animation = farming.Exercise.prototype.getAnimation(key, 0.3);
    this.animation.runAction(animation);
    this.finishButton.setHidden(true);
}

farming.SceneExercise.prototype.startExercise = function(scene) {
    if(scene.exercise) return;
    //TODO remove the fake finish button
    scene.finishButton.setHidden(false);

    scene.exercise = new farming.Exercise(scene.exerciseKey, scene,  scene.finishExercise, scene.cancelExercise);
}

farming.SceneExercise.prototype.cancelExercise = function(scene) {
    scene.game.hideExercise(scene.game);

}
farming.SceneExercise.prototype.finishExercise = function(scene) {
    if(!scene.exercise) return;

    var exercise = EXERCISES[scene.exerciseKey];
    if(exercise && exercise.type && exercise.points)
        scene.game.addPoints(exercise.type, exercise.points);

    if (scene.game.player.currentChallenge) {
        if (!scene.game.player.currentChallenge['exercisesDone']) {
            scene.game.player.currentChallenge.exercisesDone = [];
        }
        scene.game.player.currentChallenge.exercisesDone.push(scene.exerciseKey);
    }

    scene.exercise = null;
    scene.game.hideExercise(scene.game);
    if (scene.game.director.getCurrentScene() == scene.game.sceneChallengeDetails && scene.game.player.currentChallenge)
        scene.game.sceneChallengeDetails.setChallenge(scene.game.player.currentChallenge, true);
}

