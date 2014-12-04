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
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    var w = new lime.Sprite().setFill('#f0f0f0').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.5);
    this.description = new lime.Label().setFontSize(12).setPosition(center.x*0.75, center.y).setSize(game.getFullSize(0.4)).setAlign('left').setMultiline(true);
    this.animation = new lime.Sprite().setSize(game.getFullSize(0.7).height*0.75, game.getFullSize(0.7).height).setPosition(center.x*1.4, center.y);
    this.pointsLabel = new lime.Label().setPosition(center.x * 0.5, center.y * 1.55).setFontWeight(800).setFontSize(14).setHidden(true);
    this.numberIcon = new lime.Sprite().setSize(30, 30).setPosition(center.x + 140, center.y * 1.5);
    this.numberLabel = new lime.Label().setSize(30, 30).setPosition(center.x + 190, center.y * 1.5).setFontSize(36);
    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(center.x + game.getFullSize(0.325).width, center.y - game.getFullSize(0.31).height)
        .setSize(30,30);
    this.startButton = new farming.Button('Start').setColor('#00ff00').setPosition(center.x, center.y * 1.55).setSize(100,40);
    this.finishButton = new farming.Button('Fake finish').setColor('#999999').setPosition(center.x*1.55, center.y * 1.55).setSize(100,40);
    this.windowLayer
        .appendChild(w)
        .appendChild(this.title)
        .appendChild(this.description)
        .appendChild(this.animation)
        .appendChild(this.pointsLabel)
        .appendChild(this.numberIcon)
        .appendChild(this.numberLabel)
        .appendChild(this.startButton)
        .appendChild(this.closeButton)
        .appendChild(this.finishButton);

    this.startButton.setAction(this.startExercise, this);
    this.closeButton.setAction(this.closeExercise, this);
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

    var center = this.game.getCenterPosition();
    if(exercise.points) {
        this.pointsLabel.setText(exercise.points + ' ' + exercise.type + (exercise.points > 1 ? ' points' : ' point')).setHidden(false);
    } else {
        this.pointsLabel.setText('').setHidden(true);
    }

    if(exercise.repetitions) {
        this.numberIcon.setFill('images/repetitions.png');
        this.numberLabel.setText(exercise.repetitions);
    } else if (exercise.duration) {
        this.numberIcon.setFill('images/duration.png');
        this.numberLabel.setText(exercise.duration + '\"');
    } else {
        this.numberIcon.setFill('');
        this.numberLabel.setText('');
    }
}

farming.SceneExercise.prototype.startExercise = function(scene) {
    if(scene.exercise) return;
    //TODO remove the fake finish button
    scene.finishButton.setHidden(false);

    scene.exercise = new farming.Exercise(scene.exerciseKey, scene,  scene.finishExercise, scene.closeExercise);
}

farming.SceneExercise.prototype.closeExercise = function(scene) {
    scene.game.hideExercise();

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
    scene.game.hideExercise();
    if (scene.game.director.getCurrentScene() == scene.game.sceneChallengeDetails && scene.game.player.currentChallenge)
        scene.game.sceneChallengeDetails.setChallenge(scene.game.player.currentChallenge, true);
}

