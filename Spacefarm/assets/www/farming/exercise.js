goog.provide('farming.Exercise');

/**
 * Exercise accelerometer object
 * Function name callbackName should exist in this class
 *
 * @param {} gameObj
 */



//
//var appleFirst= 0;
//var appleLast=0;
//var appleAcc=[];
// var appleRep=0;
//variables to count acceleration for wheat exercise
//var wheatFirst= 0;
//var wheatLast=0;
//var wheatAcc=[];
//var wheatRep=0;

// variables to measure acceleration

var first= 0;
var last=0;
var acc=[];
var rep=0;
farming.Exercise = function (callbackName, target, onExerciseSuccess, onExerciseCancel) {
    var callback = this[callbackName];
    this.target = target;
    this.onExerciseSuccess = onExerciseSuccess;
    this.onExerciseCancel = onExerciseCancel;
    var exercise = this;
    //var options = { frequency: 500 };
    var options = { frequency: 1000};
    if (typeof navigator.accelerometer == 'undefined') {
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
    if(!exercise.example_frames) return new lime.animation.FadeTo(1);
    var animation = new lime.animation.KeyframeAnimation().setDelay(delay);
    for(var i = 0; i < exercise.example_frames; i++) {
        animation.addFrame('images/exercises/'+key+'/'+i+'.png');
    }
    return animation;
}
farming.Exercise.prototype.apple_picking = function (acceleration, exercise) {
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Apple picking callback:' + "\n" + 'Acceleration X: ' + acceleration.x + "\n" +
    'Acceleration Y: ' + acceleration.y + "\n" +
    'Acceleration Z: ' + acceleration.z + "\n" +
    'Timestamp: ' + acceleration.timestamp + "\n");


    acc.push(acceleration.y);
    first= acc[0];
    //var listLimit = 15;
    //if (accvalues.length > listLimit) {
    //accvalues.splice(0, 1); }

    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

    //if (acceleration.y > 10) {
    //if(last>5){
    if(Math.abs(last-first)> 3)
    {
        rep= rep+1;
        console.log('repetitions for apple are:' +rep);
    }

    if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) {
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }

}
farming.Exercise.prototype.arm_circles = function (acceleration, exercise) {
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Arm circles callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
    'Acceleration Z: ' + acceleration.z + " " +
    'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.x);
    first= acc[0];
    //var listLimit = 15;
    //if (accvalues.length > listLimit) {
    //accvalues.splice(0, 1); }

    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

    //if (acceleration.y > 10) {
    //if(last>5){
    if(Math.abs(last-first)> 3)
    {
        rep= rep+1;
        console.log('repetitions for wheat are:' +rep);
    }

    if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) {
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }

}
farming.Exercise.prototype.situps = function (acceleration, exercise) {
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Situps callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
    'Acceleration Z: ' + acceleration.z + " " +
    'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.x);
    first= acc[0];

    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

    if(Math.abs(last-first)> 3)
    {
        rep= rep+1;
        console.log('repetitions for carrots are:' +rep);
    }

    if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) {
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }
}
farming.Exercise.prototype.rocket_jumps = function (acceleration, exercise) {
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Rocket jumps callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
    'Acceleration Z: ' + acceleration.z + " " +
    'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.y);
    first= acc[0];
    //var listLimit = 15;
    //if (accvalues.length > listLimit) {
    //accvalues.splice(0, 1); }

    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

    //if (acceleration.y > 10) {
    //if(last>5){
    if(Math.abs(last-first)> 5)
    {
        rep= rep+1;
        console.log('repetitions for rocket_jumps are:' +rep);
    }

    if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) {
        rep=0;
        acc=[];
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
farming.Exercise.prototype.getRepetitions = function (exerciseObject) {
    if(exerciseObject && exerciseObject.target && exerciseObject.target.exerciseKey) {
        if(EXERCISES && EXERCISES[exerciseObject.target.exerciseKey] && EXERCISES[exerciseObject.target.exerciseKey]['repetitions']) {
            return EXERCISES[exerciseObject.target.exerciseKey]['repetitions'];
        }
    }
    return 1;
}
var EXERCISES = {
    apple_picking: {
        title : '\"Apple Picking\"',
        description : '1. Keep you phone in one hand, like in the picture' +
        '\n\n 2. Start from standing up straight.' +
        '\n\n 3. Raise one arm (with the phone in hand) and the opposite ' +
        'knee until to a 90 degrees angle.' +
        '\n\n 4. Finally, try to stretch even more by standing on your toes.' +
        '\n\n 5. Repeat on the other side (switch the phone!).',
        example_frames: 7, // number of image there are in 'images/exercises/{key}/[0-9].png'
        repetitions: 10,
        type: 'arms', //full_body, arms, legs, back, abs
        points: 1 //points awarded to 'type' region
    },
    arm_circles: {
        title : '\"Arm circles\"',
        description : '1. Keep your phone in one hand, like in the picture.' +
        '\n\n 2. Stand up and extend your arms straight ahead.' +
        '\n\n 3. Now move your arms as far to the left as possible.' +
        '\n\n 4. When you rebounce, push one more time to the left.' +
        '\n\n 5. Repeat the exercise, moving your arms to the right.',
        example_frames: 20,
        repetitions: 10,
        type: 'back',
        points: 1
    },
    situps: {
        title : '\"Sit-ups\"',
        description : '1. Keep your phone in one hand, like in the picture.' +
        '\n\n 2. ',
        example_frames: 10,
        repetitions: 20,
        type: 'abs',
        points: 1
    },
    rocket_jumps: {
        title : '\"Rocket Jumps\"',
        description : '1. Keep your phone in two hands, like in the picture.' +
        '\n\n 2. Begin in a relaxed stance with your feet shoulder width apart and hold your arms close to the body.' +
        '\n\n 3. To initiate the move, squat down halfway and jump back up as high as possible.' +
        '\n\n 4. Fully extend your entire body, reaching overhead as far as possible.' +
        '\n\n 5. As you land, absorb your impact through the legs.' +
        '\n\n 6. Good for general fitness and legs specifically.',
        example_frames: 10,
        repetitions: 10, // 10 times
        type: 'legs',
        points: 6
    },
    wait_pie: {
        title : 'Stretching on the floor for 2 minutes',
        description : 'Good for souplesse and specifically for hips and back.',
        example_frames: 0,
        duration: 120, // in seconds
        type: 'back',
        points: 3
    },
    ground_cycling: {
        title : 'Ground cycling',
        description : '1. begin by lying flat on your back with your hands behind your head.' +
        '\n\n 2. Lift your legs and bend your knees so they are at a 90-degree angle.' +
        '\n\n 3. then begin rotating your legs in a manner similar to riding a bicycle.' +
        '\n\n 4. Lean up and turn to touch your right elbow to your left knee, then lay back down.' +
        '\n\n 5. Repeat this with the left elbow, touching it to the right knee.',
        example_frames: 0,
        duration: 60, // in seconds
        type: 'abs',
        points: 3
    },
    burpees: {
        title : 'Burpees',
        description : '1. Begin in a standing position.' +
        '\n\n 2. Drop into a squat position with your hands on the ground.' +
        '\n\n 3. Kick your feet back, while keeping your arms extended.' +
        '\n\n 4. Immediately return your feet to the squat position.' +
        '\n\n 5. Jump up from the squat position.',
        example_frames: 0,
        duration: 60, // in seconds
        type: ['arms', 'chest', 'legs'],
        points: 2
    }
}