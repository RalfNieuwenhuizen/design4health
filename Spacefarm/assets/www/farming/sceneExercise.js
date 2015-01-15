/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.SceneExercise');

goog.require('lime.Sprite');
goog.require('lime.animation.KeyframeAnimation');
goog.require('lime.Layer');
goog.require('farming.Exercise');
goog.require('farming.Scene');
goog.require('farming.Settings');

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
        .setSize(SETTINGS.size.background_layer_full).setPosition(game.getCenterPosition(false));
    this.during = new lime.Layer();
    this.dw = new farming.Sprite(SETTINGS.color.background_layer).preventClickThrough()
        .setSize(SETTINGS.size.background_layer_full).setPosition(game.getCenterPosition(false))
        .setFill('#efeada');
    this.bar = new lime.Sprite(SETTINGS.color.background_layer)
        .setSize(0,0).setPosition(800,240).setAnchorPoint(1,0.5);
    this.barMask = new lime.Sprite(SETTINGS.color.background_layer)
        .setSize(0,0).setPosition(800,240).setAnchorPoint(1,0.5);
    this.title = SETTINGS.createTitle('');
    this.description = new farming.Slider().setPosition(center.x*0.75, center.y).setSize(game.getFullSize(0.4));
    this.animation = new lime.Sprite();
    this.pointsLabel = new farming.Label().setSize(300,0).setPosition(440,430).setVerticalAlign(true).setAlign('right')
        .setFontWeight(SETTINGS.font.subtitle.weight).setFontSize(SETTINGS.font.subtitle.size).setMultiline(true).setHidden(true);
    this.numberIcon = new lime.Sprite().setSize(30, 30).setPosition(110,430);
    this.numberLabel = new lime.Label().setSize(100, 30).setPosition(185,425).setFontSize(36).setAlign('left');
    this.numberLabelDuring1 = new lime.Label().setSize(350, 150).setPosition(400,240).setFontWeight(600)
        .setRotation(90).setOpacity(0.8);
    this.numberLabelDuring2 = new lime.Label().setSize(350, 150).setPosition(400,240).setFontWeight(600)
        .setRotation(90).setFontColor('#efeada').setMask(this.barMask).setOpacity(0.8);
    this.heartRate = new lime.Label().setPosition(center.x, center.y).setFontSize(30).setHidden(true);
    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button_full)
        .setSize(SETTINGS.size.close_button);
    this.closeButton2 = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(40,40)
        .setSize(SETTINGS.size.close_button);
    this.startButton = new farming.Button('Start').setColor(SETTINGS.color.button_primary).setSize(SETTINGS.size.button).setPosition(700,430);
    this.finishButton = new farming.Button('Fake finish').setColor(SETTINGS.color.button).setSize(SETTINGS.size.button).setPosition(50,380).setRotation(90);
    //this.waitMessage = new farming.Label().setPosition(SETTINGS.position.center_button)
    //    .setFontColor(SETTINGS.color.red).setFontWeight(600).setFontSize(15).setMultiline(true).setHidden(true);
    this.windowLayer
        .appendChild(w)
        .appendChild(this.title)
        .appendChild(this.description)
        .appendChild(this.animation)
        .appendChild(this.pointsLabel)
        .appendChild(this.numberIcon)
        .appendChild(this.numberLabel)
        .appendChild(this.startButton)
        .appendChild(this.closeButton);

    this.during.appendChild(this.dw)
        .appendChild(this.numberLabelDuring1)
        .appendChild(this.bar)
        .appendChild(this.barMask)
        .appendChild(this.numberLabelDuring2)
        .appendChild(this.finishButton)
        .appendChild(this.heartRate)
        .appendChild(this.closeButton2);

    this.startButton.setAction(this.startExercise, this);
    this.closeButton.setAction(this.closeExercise, this);
    this.closeButton2.setAction(this.closeExercise, this);
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
    if(this.animation.stop) {
        this.animation.stop();
        this.animation.setFill('');
    }
    if(this.stopWatch && this.stopWatch.stop) {
        this.stopWatch.stop();
    }
    if(exercise.horizontal) {
        this.description.setSize(700,160).setPosition(400,135);
        this.animation.setSize(795*0.55,420*0.55).setPosition(400,300);
    } else {
        this.description.setSize(490,250).setPosition(515,240);
        this.animation.setSize(315*0.9,420*0.9).setPosition(130,220);

    }


    this.description.clear();
    for(var i in exercise.description) {
        this.description.addTextSlide(exercise.description[i], 20);
    }

    var animation = farming.Exercise.prototype.getAnimation(key, 0.3);
    if(animation) 
        this.animation.runAction(animation);
    this.animation.stop = function() { if(animation) animation.stop(); };

    this.windowLayer.removeChild(this.during);
    this.exercise = null;
    this.countdown = null;

    var center = this.game.getCenterPosition();
    if(exercise.points) {
        if( Object.prototype.toString.call( exercise.type ) === '[object Array]' ) {
            var text = [];
            for(var i = 0; i < exercise.type.length; i++) {
                text.push(exercise.points + ' ' + exercise.type[i] + (exercise.points > 1 ? ' points' : ' point'));
            }
            text = text.join('\n');
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
        //this.waitMessage.setText('Do the exercise until you \n feel the phone buzz');
    } else if (exercise.duration) {
        this.numberIcon.setFill('images/duration.png');
        this.numberLabel.setText(exercise.duration + ' s');
        //this.waitMessage.setText('Do the exercise until \n the timer stops');
        this.countdown = exercise.duration;
    } else {
        this.numberIcon.setFill('');
        this.numberLabel.setText('');
    }
}

farming.SceneExercise.prototype.startExercise = function(scene) {
    if(scene.exercise) return;
    scene.finishButton.setHidden(!SETTINGS.TESTING);
    scene.windowLayer.appendChild(scene.during);
    scene.stopWatch = {};
    scene.updateProgress(0);
    if(scene.countdown) {
        var step = 0.2;
        var progress = 0;
        scene.updateProgress(0);
        scene.numberLabelDuring1.setText('Get ready!').setFontSize(80);
        lime.scheduleManager.callAfter(function(){
            scene.updateProgress(0);
            scene.game.playMusic('ex_walking2.ogg');
            var schedule = function () {
                progress += step;
                scene.countdown -= step;
                if(scene.countdown <= 0)
                    scene.startHeartRate(scene);
                scene.updateProgress(progress)
            };
            lime.scheduleManager.scheduleWithDelay(schedule, scene, 1000*step, scene.countdown/step);
            scene.stopWatch.stop = function() {
                lime.scheduleManager.unschedule(schedule, scene);
            }
        }, scene, 3000)


    }
    scene.exercise = new farming.Exercise(scene.exerciseKey, scene,  scene.finishExercise, scene.closeExercise);
}

farming.SceneExercise.prototype.updateProgress = function(num) {
    if(!this.exerciseKey) return;
    var exercise = EXERCISES[this.exerciseKey];
    if(exercise.repetitions) {
        var total = exercise.repetitions;
        this.numberLabelDuring1.setText(Math.round(total-num)).setFontSize(200);
        this.numberLabelDuring2.setText(Math.round(total-num)).setFontSize(200);
    } else {
        var total = exercise.duration;
        this.numberLabelDuring1.setText(Math.round(total-num)+' s').setFontSize(130);
        this.numberLabelDuring2.setText(Math.round(total-num)+' s').setFontSize(130);
    }

    var progress = num / total;
    var color = 'rgb('+Math.round((progress)*109*0.6+4)+','+Math.round((progress)*72*0.6+102)+','+Math.round((1-progress)*157*0.6+7)+')';
    this.bar.setFill(color).setSize(800*progress, 480);
    this.barMask.setSize(800*progress, 480);
    this.numberLabelDuring1.setFontColor(color);
}
farming.SceneExercise.prototype.closeExercise = function(scene) {
    scene.game.hideExercise();
    scene.game.playMusic();
    scene.windowLayer.removeChild(this.during);
    scene.exercise = null;
    scene.countdown = null;
    scene.heartRate.setHidden(true);

}
farming.SceneExercise.prototype.startHeartRate = function(scene) {
    //scene.waitMessage.setText('Place your finger on the camera to measure your heart rate.');
    lime.scheduleManager.callAfter(function () {
        lime.scheduleManager.scheduleWithDelay(function () {
            scene.updateHeartRate(scene);
        }, this, 800, 10);
        lime.scheduleManager.callAfter(function () {
            scene.finishExercise(scene);
        }, this, 8000);
    }, this, 1000);
}
farming.SceneExercise.prototype.updateHeartRate = function(scene) {
    scene.heartRate.setText('Heart rate: '+(Math.round(Math.random()*50+70))).setHidden(false);
}

farming.SceneExercise.prototype.finishExercise = function(scene) {
    if(!scene.exercise) return;

    scene.heartRate.setHidden(true);
    scene.game.playMusic();
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
    scene.heartRate.setHidden(true);

    scene.windowLayer.removeChild(scene.during);
    if (scene.game.player.currentChallenge)
        scene.game.sceneChallengeDetails.setChallenge(scene.game.player.currentChallenge, true);
    
    scene.game.showFeedback(exercise);
    
    // Fire that exercise is done
    scene.game.source.dispatchEvent(scene.game.EventType.EXERCISE_DONE);
}

