goog.provide('farming.Exercise');

/**
 * Land elements
 *
 * @param {} gameObj
 */
farming.Exercise = function (callbackName, target, onExerciseSuccess, onExerciseCancel) {
    var callback = this[callbackName];
    this.target = target;
    this.onExerciseSuccess = onExerciseSuccess;
    this.onExerciseCancel = onExerciseCancel;
    var exercise = this;
    var options = { frequency: 500 };
    if (typeof navigator.accelerometer == 'undefined') {
        exercise.fakeWebWatchID = setInterval(function () {
            callback({x: 100, y: 100, z: 100, timestamp: 0}, exercise)
        }, 500);
        return;
    }
    this.watchID = navigator.accelerometer.watchAcceleration(function (acceleration) {
        callback(acceleration, exercise)
    }, this.onError, options);

}

//farming.Exercise.prototype.getCurrentAcc = function(){
//	navigator.accelerometer.getCurrentAcceleration(this.callback, this.onAccError);
//}

farming.Exercise.prototype.fakeWebWatchID = null;
farming.Exercise.prototype.watchID = null;

farming.Exercise.prototype.onError = function () {
    alert('error');
}
farming.Exercise.prototype.getAnimation = function (key, delay) {
    var exercise = EXERCISES[key];
    var animation = new lime.animation.KeyframeAnimation().setDelay(delay);
    for(var i = 0; i < exercise.example_frames; i++) {
        animation.addFrame('images/exercises/'+key+'/'+i+'.png');
    }
    return animation;
}
farming.Exercise.prototype.harvestAppleTree = function (acceleration, exercise) {
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Harvesting apples callback:' + "\n" + 'Acceleration X: ' + acceleration.x + "\n" +
        'Acceleration Y: ' + acceleration.y + "\n" +
        'Acceleration Z: ' + acceleration.z + "\n" +
        'Timestamp: ' + acceleration.timestamp + "\n");
    if (acceleration.y > 10) {
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }
}
farming.Exercise.prototype.harvestWheat = function (acceleration, exercise) {
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Harvesting wheat callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);
    if (acceleration.y > 5) {
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }
}

farming.Exercise.prototype.stopWatch = function () {
    if (this.watchID) {
        navigator.accelerometer.clearWatch(this.watchID);
        this.watchID = null;
    }
    if (this.fakeWebWatchID) {
        clearInterval(this.fakeWebWatchID);
        this.fakeWebWatchID = null;
    }
}
var EXERCISES = {
    apple_picking: {
        title : '\"Apple Picking\"',
        description : 'Start from standing up straight.' +
        '\n\n Raise one arm (with the phone in hand) as high as you can, while you raise your opposite ' +
        'knee until you have a 90 degrees angle both between legs and core and between upper ' +
        'and lower leg.' +
        '\n\n Finally, try to keep this stance while standing on your toes.' +
        '\n\n Repeat on the other side (switch the phone hand!).',
        example_frames: 7, // number of image there are in 'images/exercises/{key}/[0-9].png'
        type: 'arms', //full_body, arms, legs, back, abs
        points: 1 //points awarded to 'type' region
    },
    arm_circles: {
        title : 'Arm circles',
        description : 'Stand up and extend your arms straight out by the sides. The arms should be parallel to ' +
        'the floor and perpendicular to your torso.' +
        '\n\n Slowly start to make circles of about 1 foot in diameter with each outstretched arm ' +
        'Breathe normally as you perform the movement.' +
        '\n\n Continue the circular motion of the outstretched arms for about ten seconds.' +
        '\n\n Then reverse the movement, going the opposite direction.',
        example_frames: 20,
        type: 'back',
        points: 1
    },
    rocket_jumps: {
        title : '\"Rocket Jumps\"',
        description : 'Keep your phone in two hands.' +
        '\n Begin in a relaxed stance with your feet shoulder width apart and hold your arms close to the body.' +
        '\n To initiate the move, squat down halfway and jump back up as high as possible.' +
        '\n Fully extend your entire body, reaching overhead as far as possible.' +
        '\n As you land, absorb your impact through the legs.' +
        '\n Good for general fitness and legs specifically.',
        example_frames: 10,
        repetitions: 10, // 10 times
        type: 'legs',
        points: 6
    },
    wait_pie: {
        title : 'Stretching on the floor for 2 minutes',
        description : 'Good for souplesse and specifically for hips and back.',
        example_frames: 20,
        duration: 120, // in seconds
        type: 'back',
        points: 3
    }
}