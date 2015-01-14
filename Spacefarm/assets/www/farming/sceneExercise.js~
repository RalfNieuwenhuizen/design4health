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
    var w = new farming.Sprite(SETTINGS.color.background_layer).preventClickThrough()
        .setSize(SETTINGS.size.background_layer).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.description = new lime.Label().setFontSize(12).setPosition(center.x*0.75, center.y).setSize(game.getFullSize(0.4)).setAlign('left').setMultiline(true);
    this.animation = new lime.Sprite().setSize(SETTINGS.size.background_layer.height*0.75, SETTINGS.size.background_layer.height).setPosition(center.x*1.5, center.y);
    this.pointsLabel = new lime.Label().setPosition(SETTINGS.position.left_button).setFontWeight(SETTINGS.font.subtitle.weight).setFontSize(SETTINGS.font.subtitle.size).setMultiline(true).setHidden(true);
    this.numberIcon = new lime.Sprite().setSize(30, 30).setPosition(center.x + 180, center.y * 1.5);
    this.numberLabel = new lime.Label().setSize(30, 30).setPosition(center.x + 230, center.y * 1.5).setFontSize(36);
    this.heartRate = new lime.Label().setPosition(center.x, center.y).setFontSize(30);
    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.startButton = new farming.Button('Start').setColor(SETTINGS.color.button_primary).setPosition(SETTINGS.position.center_button).setSize(SETTINGS.size.button);
    this.finishButton = new farming.Button('Fake finish').setColor(SETTINGS.color.button).setPosition(SETTINGS.position.right_button).setSize(SETTINGS.size.button);
    this.waitMessage = new farming.Label().setPosition(SETTINGS.position.center_button)
        .setFontColor(SETTINGS.color.red).setFontWeight(600).setFontSize(15).setMultiline(true).setHidden(true);
    this.windowLayer
        .appendChild(w)
        .appendChild(this.title)
        .appendChild(this.heartRate)
        .appendChild(this.description)
        .appendChild(this.animation)
        .appendChild(this.pointsLabel)
        .appendChild(this.numberIcon)
        .appendChild(this.numberLabel)
        .appendChild(this.startButton)
        .appendChild(this.closeButton)
        .appendChild(this.waitMessage)
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
    if(this.animation.stop) {
        this.animation.stop();
        this.animation.setFill('');
    }
    var animation = farming.Exercise.prototype.getAnimation(key, 0.3);
    if(animation)
        this.animation.runAction(animation);
    this.animation.stop = function() { animation.stop(); };
    this.finishButton.setHidden(true);
    this.startButton.setHidden(false);
    this.waitMessage.setHidden(true);
    this.heartRate.setHidden(true);
    this.exercise = null;
    this.countdown = null;

    var center = this.game.getCenterPosition();
    if(exercise.points) {
        if( Object.prototype.toString.call( exercise.type ) === '[object Array]' ) {
            var text = '';
            for(var i = 0; i < exercise.type.length; i++) {
                text += exercise.points + ' ' + exercise.type[i] + (exercise.points > 1 ? ' points' : ' point') + '\n';
            }
            this.pointsLabel.setText(text).setHidden(false);
        } else {
            this.pointsLabel.setText(exercise.points + ' ' + exercise.type + (exercise.points > 1 ? ' points' : ' point')).setHidden(false);
        }
    } else {
        this.pointsLabel.setText('').setHidden(true);
    }

    if(exercise.repetitions) {
        this.numberIcon.setFill('images/repetitions.png');
        this.numberLabel.setText(exercise.repetitions);
        this.waitMessage.setText('Do the exercise until you \n feel the phone buzz');
    } else if (exercise.duration) {
        this.numberIcon.setFill('images/duration.png');
        this.numberLabel.setText(exercise.duration + '\"');
        this.waitMessage.setText('Do the exercise until \n the timer stops');
        this.countdown = exercise.duration;
    } else {
        this.numberIcon.setFill('');
        this.numberLabel.setText('');
    }
}

farming.SceneExercise.prototype.startExercise = function(scene) {
    if(scene.exercise) return;
    //TODO remove the fake finish button
    scene.finishButton.setHidden(false);
    scene.startButton.setHidden(true);
    scene.waitMessage.setHidden(false);
    if(scene.countdown) {
        lime.scheduleManager.scheduleWithDelay(function () {
            if(scene.countdown)
                scene.numberLabel.setText((scene.countdown--) + '\"');
            else
                scene.startHeartRate(scene);

        }, this, 1000);
    }
    scene.exercise = new farming.Exercise(scene.exerciseKey, scene,  scene.finishExercise, scene.closeExercise);
}

farming.SceneExercise.prototype.closeExercise = function(scene) {
    scene.game.hideExercise();

    scene.startButton.setHidden(false);
    scene.finishButton.setHidden(true);
    scene.waitMessage.setHidden(true);
    scene.exercise = null;
    scene.countdown = null;

}
farming.SceneExercise.prototype.startHeartRate = function(scene) {
    scene.numberIcon.setHidden(true);
    scene.numberLabel.setHidden(true);
    scene.waitMessage.setText('Place your finger on the camera to measure your heart rate.');
    lime.scheduleManager.scheduleWithDelay(function () {
        lime.scheduleManager.scheduleWithDelay(function () {
            scene.updateHeartRate(scene);
        }, this, 800, 20);
        lime.scheduleManager.scheduleWithDelay(function () {
            scene.finishExercise(scene);
        }, this, 5000);
    }, this, 1000);
}
farming.SceneExercise.prototype.updateHeartRate = function(scene) {
    scene.heartRate.setText('Heart rate: '+(Math.round(Math.random()*50+70))).setHidden(false);
}

farming.SceneExercise.prototype.finishExercise = function(scene) {
    if(!scene.exercise) return;

    scene.heartRate.setHidden(true);
    scene.game.putStatistics(scene.exerciseKey);

    var exercise = EXERCISES[scene.exerciseKey];
    if(exercise && exercise.type && exercise.points) {
        if( Object.prototype.toString.call( exercise.type ) === '[object Array]' ) {
            for(var i = 0; i < exercise.type.length; i++) {
                scene.game.addPoints(exercise.type[i], exercise.points);
            }
        } else {
            scene.game.addPoints(exercise.type, exercise.points);
        }
    }

    if (scene.game.player.currentChallenge) {
        if (!scene.game.player.currentChallenge.exercisesDone) {
            scene.game.player.currentChallenge.exercisesDone = [];
        }
        scene.game.player.currentChallenge.exercisesDone.push(scene.exerciseKey);
    }

    scene.exercise = null;
    scene.countdown = null;
    scene.game.hideExercise();

    scene.startButton.setHidden(false);
    scene.waitMessage.setHidden(true);
    if (scene.game.player.currentChallenge)
        scene.game.sceneChallengeDetails.setChallenge(scene.game.player.currentChallenge, true);
    
    // Fire that exercise is done
    scene.game.source.dispatchEvent(scene.game.EventType.EXERCISE_DONE);
}

