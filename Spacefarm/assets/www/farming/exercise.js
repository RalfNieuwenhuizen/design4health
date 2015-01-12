goog.provide('farming.Exercise');

/**
 * Exercise accelerometer object
 * Function name callbackName should exist in this class
 */

// initializing variables for pedometer
 var steps_prevVal = 1.0;
 var steps_prevprevVal = 1.0;
 var steps_peakLow = 0;
 var steps_peakHigh = 0;
 var steps_samplesSinceHighPeak = 0;
 var steps_samplesSinceLowPeak = 0;
 var steps = 0;

 var peakMinSamplesBetween = 15;
 var highLowPeakDiff = .2;
 var accelerometerZNeutral = -1.1;
 var accelerometerZNeutralLowOffset = -.04;
 var accelerometerZNeutralHighOffset = .06;
 var lastpeak = 1;// 1 is low 0 is high


// variables to measure acceleration

var first= 0;
var last=0;
var acc=[];
var rep=0;
var numOfSteps = 0;

var prevMagnitude = 9;  //  Initialize previous magnitude as 9.
var currMagnitude = 0;  //  Initialize current magnitude as 0.
farming.Exercise = function (callbackName, target, onExerciseSuccess, onExerciseCancel) {
    var callback = this[callbackName];
    this.target = target;
    this.onExerciseSuccess = onExerciseSuccess;
    this.onExerciseCancel = onExerciseCancel;
    var exercise = this;
    var options = typeof EXERCISES[callbackName].options == 'undefined' ? { frequency: 800 } : EXERCISES[callbackName].options;
    console.log(options);
    //var options = { frequency: 1000};
    if (typeof navigator.accelerometer == 'undefined') {
        return;
    }
    this.watchID = navigator.accelerometer.watchAcceleration(function (acceleration) {
        if(target.exercise == null) {
            exercise.stopWatch();
            return;
        }
        callback(acceleration, exercise)
    }, this.onError, options);

}

//farming.Exercise.prototype.getCurrentAcc = function(){
//  navigator.accelerometer.getCurrentAcceleration(this.callback, this.onAccError);
//}

farming.Exercise.prototype.fakeWebWatchID = null;
farming.Exercise.prototype.watchID = null;

farming.Exercise.prototype.onError = function () {
    alert('error');
}
farming.Exercise.prototype.getAnimation = function (key, delay) {
    var exercise = EXERCISES[key];
    if(!exercise.example_frames) return null;
    var animation = new lime.animation.KeyframeAnimation().setDelay(delay);
    for(var i = 0; i < exercise.example_frames; i++) {
        animation.addFrame('images/exercises/'+key+'/'+i+'.png');
    }
    return animation;
}
farming.Exercise.prototype.arm_stretches = function (acceleration, exercise) {


    //navigator.plugin.notification.local.add({ sound: null });

//      navigator.plugin.notification.local.add({
//     id:         1,  // A unique id of the notifiction
//        // This expects a date object
//     message:    Testing,  // The message that is displayed
//     title:      Test,  // The title of the message
//       // Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
//      // Displays number badge to notification
//     sound:      null,  // A sound to be played
//       // Data to be passed through the notification
//     autoCancel: true, // Setting this flag and the notification is automatically canceled when the user clicks it
//     ongoing:    false, // Prevent clearing of notification (Android only)
// });

// var now                  = new Date().getTime(),
//     _60_seconds_from_now = new Date(now + 60*1000);
//      navigator.plugin.notification.local.add({
//     id:      1,
//     title:   'Reminder',
//     message: 'Dont forget to buy some flowers.',
//     repeat:  'weekly',
//     date:    _60_seconds_from_now
// });
if(!exercise.watchID && !exercise.fakeWebWatchID) return;
console.log('Apple picking callback:' + "\n" + 'Acceleration X: ' + acceleration.x + "\n" +
    'Acceleration Y: ' + acceleration.y + "\n" +
    'Acceleration Z: ' + acceleration.z + "\n" +
    'Timestamp: ' + acceleration.timestamp + "\n");


acc.push(acceleration.y);
first= acc[0];
last= acc[acc.length-1];
console.log('first value of array' +first + 'last value of array' +last);
console.log('array length is:' +acc.length);

if(Math.abs(last-first)> 3)
{
    exercise.addRepetition();

}


if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) 
{
    rep=0;
    acc=[];
    navigator.notification.vibrate(2500);
    playEndSound();
    exercise.onExerciseSuccess(exercise.target);
    exercise.stopWatch();
    window.plugin.notification.local.add({ message: 'You picked an apple yay!' , sound: null });
}


}
farming.Exercise.prototype.back_circles = function (acceleration, exercise) 
{
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Arm circles callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.x);
    first= acc[0];

    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

    if(Math.abs(last-first)> 3)
    {
        exercise.addRepetition();
    }

    
        if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) {
        //navigator.notification.beep(3);
        navigator.notification.vibrate(2500);
        farming.Exercise.prototype.playEndSound();
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }

}
farming.Exercise.prototype.dynamic_chest = function (acceleration, exercise) 
{
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Arm circles callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.x);
    first= acc[0];


    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

    
    if(Math.abs(last-first)> 3)
    {
        exercise.addRepetition();
    }

    
    if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) {
        //navigator.notification.beep(3);
        navigator.notification.vibrate(2500);
        farming.Exercise.prototype.playEndSound();
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }

}
farming.Exercise.prototype.situps = function (acceleration, exercise) 
{
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Situps callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);



        var alpha = 0.8;
        // var gravity=[];

        //   gravity[0] = alpha * gravity[0] + (1 - alpha) * acceleration.x;
        //   gravity[1] = alpha * gravity[1] + (1 - alpha) * acceleration.y;
        //   gravity[2] = alpha * gravity[2] + (1 - alpha) * acceleration.z;

        //   linear_acceleration[0] = acceleration.x - gravity[0];
        //   linear_acceleration[1] = acceleration.y - gravity[1];
        //   linear_acceleration[2] = acceleration.z - gravity[2];
        //var gravity=9.81;
        var currMagnitude = Math.sqrt(Math.pow(acceleration.x,2) + Math.pow(acceleration.y,2) + Math.pow(acceleration.z,2));

    acc.push(acceleration.z);
    first= Math.abs( acc[0] - currMagnitude);

    last= Math.abs(acc[acc.length-1] - currMagnitude);
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

    if(Math.abs(last-first)> 10)
    {
        exercise.addRepetition();
    }

    if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) {
        farming.Exercise.prototype.playEndSound();
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }
}
farming.Exercise.prototype.rocket_jumps = function (acceleration, exercise) 
{
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Rocket jumps callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.y);
    first= acc[0];


    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

    if(Math.abs(last-first)> 5) {
        exercise.addRepetition();
    }


    if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) {
        //navigator.notification.beep(3);
        navigator.notification.vibrate(2500);
        farming.Exercise.prototype.playEndSound();
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }
}


farming.Exercise.prototype.high_knees = function (acceleration, exercise) 
{
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Rocket jumps callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.z);
    first= acc[0];


    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);


    if(Math.abs(last-first)> 3) {
        exercise.addRepetition();
    }


    if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) {
        //navigator.notification.beep(3);
        navigator.notification.vibrate(2500);
        farming.Exercise.prototype.playEndSound();
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }
}

farming.Exercise.prototype.bear_hug = function (acceleration, exercise) 
{
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Rocket jumps callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.z);
    first= acc[0];

    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);


    if(Math.abs(last-first)> 5)
    {
        exercise.addRepetition();
    }


    if (rep >= farming.Exercise.prototype.getRepetitions(exercise))
    {
        //navigator.notification.beep(3);
        navigator.notification.vibrate(2500);
        farming.Exercise.prototype.playEndSound();
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }
}

farming.Exercise.prototype.mason_twist = function (acceleration, exercise)
{
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Rocket jumps callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.x);
    first= acc[0];
   

    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

        if(Math.abs(last-first)> 3)
        {
            exercise.addRepetition();
        }

 
        if (rep >= farming.Exercise.prototype.getRepetitions(exercise))
        {
        //navigator.notification.beep(3);
        navigator.notification.vibrate(2500);
        farming.Exercise.prototype.playEndSound();
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
        }
}


farming.Exercise.prototype.wall_flapping = function (acceleration, exercise) 
{
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Rocket jumps callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.y);
    first= acc[0];

    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);


    if(Math.abs(last-first)> 3) 
    {
        exercise.addRepetition();
    }


    if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) 
    {
        //navigator.notification.beep(3);
        navigator.notification.vibrate(2500);
        farming.Exercise.prototype.playEndSound();
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }
}


farming.Exercise.prototype.wall_ears = function (acceleration, exercise) {
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Rocket jumps callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.y);
    first= acc[0];
    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

    if(Math.abs(last-first)> 3) 
    {
        exercise.addRepetition();
    }

    if (rep >= farming.Exercise.prototype.getRepetitions(exercise)) 
    {
        //navigator.notification.beep(3);
        navigator.notification.vibrate(2500);
        farming.Exercise.prototype.playEndSound();
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }
}

farming.Exercise.prototype.wall_arm_pulls = function (acceleration, exercise)
{
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('Rocket jumps callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);

    acc.push(acceleration.y);
    first= acc[0];


    last= acc[acc.length-1];
    console.log('first value of array' +first + 'last value of array' +last);
    console.log('array length is:' +acc.length);

    if(Math.abs(last-first)> 5) {
        exercise.addRepetition();
    }


    if (rep >= farming.Exercise.prototype.getRepetitions(exercise))
    {

        navigator.notification.vibrate(2500);
        farming.Exercise.prototype.playEndSound();
        rep=0;
        acc=[];
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
    }
}


farming.Exercise.prototype.wait_pie = function (acceleration, exercise) {
    if(!exercise.watchID && !exercise.fakeWebWatchID) return;
    console.log('wait_pie callback:' + " " + 'Acceleration X: ' + acceleration.x + ' Acceleration Y: ' + acceleration.y + " " +
        'Acceleration Z: ' + acceleration.z + " " +
        'Timestamp: ' + acceleration.timestamp);

    var strechsound = new Media('file:///android_asset/www/ex_strech.wav');
    strechsound.play();

    var currMagnitude = Math.sqrt(Math.pow(acceleration.x,2) + Math.pow(acceleration.y,2) + Math.pow(acceleration.z,2));

    //  Only if the previous magnitude is less than 9 Newtons and the current one is greater than 10 Newtons...
    if(prevMagnitude < 9 && currMagnitude > 10)
    {
        numOfSteps++;
        navigator.notification.beep(1);
        console.log("number of steps" +numOfSteps)      //  Increment number of steps   
    }
    if (numOfSteps>=2){


        strechsound.pause();

        numOfSteps=0;
        exercise.onExerciseSuccess(exercise.target);
        exercise.stopWatch();
        navigator.notification.vibrate(2500);
    }

    prevMagnitude=currMagnitude;


    /*var x = acceleration.x;
     var y = acceleration.y;
     var z = acceleration.z;
     var magnitude = z; //Math.sqrt(x * x + y * y + z * z);

     //AddTapMessageRow("val: " + magnitude);

     if (magnitude < steps_prevVal && steps_prevprevVal < steps_prevVal && steps_samplesSinceHighPeak > peakMinSamplesBetween && steps_prevVal > accelerometerZNeutral + accelerometerZNeutralHighOffset&& lastpeak == 1) {
     steps_peakHigh = steps_prevVal;
     steps_samplesSinceHighPeak = 0;
     //AddTapMessageRow("HighPeak: " + steps_peakHigh);
     if (Math.abs(steps_peakHigh - steps_peakLow) > highLowPeakDiff) {

     steps++;
     console.log("Steps: "+steps);
     navigator.notification.beep(1);
     }
     lastpeak = 0;
     }
     else
     steps_samplesSinceHighPeak++;
     if (magnitude > steps_prevVal && steps_prevprevVal > steps_prevVal && steps_samplesSinceLowPeak > peakMinSamplesBetween && steps_prevVal < accelerometerZNeutral + accelerometerZNeutralLowOffset && lastpeak == 0) {
     steps_peakLow = steps_prevVal;
     //AddTapMessageRow("LowPeak: " + steps_peakLow);
     steps_samplesSinceLowPeak = 0;
     lastpeak =1;
     }
     else
     steps_samplesSinceLowPeak++;
     if (magnitude != steps_prevVal) {
     steps_prevprevVal = steps_prevVal;
     steps_prevVal = magnitude;
     }


     if (steps>=5){
     steps=0;
     exercise.onExerciseSuccess(exercise.target);
     exercise.stopWatch();
     navigator.notification.vibrate(2500);

 }*/
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
farming.Exercise.prototype.addRepetition = function() {
    rep = rep + 1;
    console.log("Repetitions done: " + rep);
    if (this.target && this.target.numberLabel && this.target.numberLabel.getText() >= 0) {
        this.target.updateProgress(this.target.numberLabelDuring1.getText()-1)
    }

    if(this.target && this.target.game && this.target.game.player.settings.sound == true) {
        var exsound = new Media('file:///android_asset/www/exercise.mp3');
        exsound.play();
    }
}
farming.Exercise.prototype.playEndSound = function() {
    if(this.target && this.target.game && this.target.game.player.settings.sound == true) {
        var endsound = new Media('file:///android_asset/www/ex_end.wav');
        endsound.play();
    }
}

var EXERCISES = {
    arm_stretches : {
        title:'Arm stretches',
        description : ['Keep your phone in one hand, like in the picture',
            'Start from standing up straight.',
            'Raise one arm (with the phone in hand) and the opposite knee until to a 90 degrees angle.',
            'Finally, try to stretch even more by standing on your toes.',
            'Repeat on the other side (switch the phone!).'],
        example_frames: 7, // number of image there are in 'images/exercises/{key}/[0-9].png'-
        horizontal: false,
        repetitions: 10,
        type: 'arms', //full_body, arms, legs, back, abs
        points: 1 //points awarded to 'type' region
    },
    walking : {
        title:'Walking',
        description : ['Put your phone in your pocket','Walk! Walk! Walk! :)'],
        example_frames: 0, // number of image there are in 'images/exercises/{key}/[0-9].png'-
        horizontal: false,
        repetitions: 100,
        options: {frequency : 400},
        type: 'legs', //full_body, arms, legs, back, abs
        points: 2 //points awarded to 'type' region
    },
    back_circles : {
        title:'Back stretches',
        description : ['Keep your phone in one hand, like in the picture.',
        'Stand up and extend your arms straight ahead.',
        'Now move your arms as far to the left as possible.',
        'When you rebounce, push one more time to the left.',
        'Repeat the exercise, moving your arms to the right.'],
        example_frames: 20,
        horizontal: false,
        repetitions: 10,
        type: 'back',
        points: 1
    },
    situps : {
        title:'Sit-ups',
        description : ['Lie down on the floor and secure your feet. Your legs should be bent at the knees.',
        'Place your hands on your chest, with the phone in both hands. You will begin with your back on the ground. This will be your starting position.',
        'Flex your hips and spine to raise your torso toward your knees.',
        'At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going nearly level with the ground, without touching it.',
        'Repeat 10 times.'],
        example_frames: 10,
        horizontal: true,
        repetitions: 20,
        type: 'abs',
        points: 1
    },
    dynamic_chest : {
        title:'Dynamic chest stretches',
        description : ['Stand with your hands together, arms extended directly in front of you. This will be your starting position.',
        'Keeping your arms straight, quickly move your arms back as far as possible and back in again, similar to an exaggerated clapping motion. ',
        'Repeat 10 times, increasing speed as you do so.'],
        example_frames: 8,
        horizontal: false,
        repetitions: 15,
        type: 'chest',
        points: 1
    },
    rocket_jumps : {
        title:'Rocket jumps',
        description : ['Keep your phone in two hands, like in the picture.',
        'Begin in a relaxed stance with your feet shoulder width apart and hold your arms close to the body.',
        'To initiate the move, squat down halfway and jump back up as high as possible.',
        'Fully extend your entire body, reaching overhead as far as possible.',
        'As you land, absorb your impact through the legs.'],
        example_frames: 10,
        horizontal: false,
        repetitions: 10, // 10 times
        type: 'legs',
        points: 4
    },
    high_knees : {
        title:'High knee',
        description : ['Stand straight up with your phone in one hand.',
        'Start running at your place, while pulling your knees up high. Swing your arms properly!',
        'Repeat 15 times (one repetition is one completed movement with both legs)'],
        example_frames: 10,
        horizontal: false,
        repetitions: 15,
        type: ['arms', 'legs', 'abs'],
        points: 1
    },
    bear_hug : {
        title:'Bear hug crunch',
        description : ['Lay down on the floor with your legs stretched straigth up in the air and your arms stretched on the floor above your head. Hold the phone in one hand.',
        'Make a crunch movement and put your arms around your legs on knee hight until you can grab your fingers. Keep your legs in the same position.',
        'Now move back to starting position.',
        'Repeat 20 times.'],
        example_frames: 8,
        horizontal: true,
        repetitions: 20,
        type: ['abs', 'legs'],
        points: 3
    },
    mason_twist : {
        title:'Mason twist',
        description : ['Sit on the ground or an exercise mat, bend your elbows and hold the phone in your hands together in front of your chest.',
        'Contract your abs and lean your upper body back, about 45 degrees. Keep your back straight!',
        'Raise your feet up until your lower legs are parallel to the floor.',
        'Twist your torso to the right side and touch the floor with both hands. Move only your upper body and keep your abdominals engaged.',
        'Twist over to the left side and bring your hands toward the floor. Avoid using momentum - control the motion. Repeat 20 times.'],
        example_frames: 8,
        horizontal: true,
        duration: 60, // in seconds
        type: ['abs', 'legs'],
        points: 2
    },
    pushup_knees : {
        title:'Push up on knees',
        description : ['Take the starting position as in the picture, with your hands slightly wider than shoulder length. ',
        'Lower yourself downward until your chest almost touches the floor as you inhale.',
        'Breathe out and press your upper body back up to the starting position while squeezing your chest. Repeat until the timer goes out.'],
        example_frames: 6,
        horizontal: true,
        duration: 40, // in seconds
        type: 'chest',
        points: 2
    },
    pushups : {
        title:'Push up',
        description : ['Take the starting position as in the picture, with your hands slightly wider than shoulder length.',
        'Lower yourself downward until your chest almost touches the floor as you inhale.',
        'Breathe out and press your upper body back up to the starting position while squeezing your chest. Repeat until the timer goes out.'],
        example_frames: 6,
        horizontal: true,
        duration: 60, // in seconds
        type: ['chest'],
        points: 3
    },
    wall_flapping : {
        title:'Wall flying',
        description : ['Stand straight with your back to the wall, touching with your heels.',
        'Tuck in your chin and touch the wall also with the back of your neck.',
        'Stay in this position and stretch your arms parallel to the wall. Carefully move them up and down in a controlled motion. Repeat 10 times.'],
        example_frames: 10,
        horizontal: false,
        repetitions: 15,
        type: 'back',
        points: 1
    },
    wall_ears : {
        title:'Wall ear touches',
        description : ['Stand straight with your back to the wall, touching with your heels.',
        'Tuck in your chin and touch the wall also with the back of your neck.',
        'Stay in this position and stretch your arms parallel to the wall. Bring your arms up and cover your ears. Repeat 10 times.'],
        example_frames: 10,
        horizontal: false,
        repetitions: 15,
        type: 'back',
        points: 1
    },
    wall_arm_pulls : {
        title:'Wall arm pulling',
        description : ['Stand straight with your back to the wall, touching with your heels.',
        'Tuck in your chin and touch the wall also with the back of your neck.',
        'Put your right arm up, flex it and pull down, just as you would climb a rope ladderRepeat 10 times.'],
        example_frames: 8,
        horizontal: false,
        repetitions: 15,
        type: 'back',
        points: 1
    },
    sky_kicks : {
        title:'Sky kick',
        description : ['Sit down on the ground or exercise mat. ',
        'Lean back a bit and push yourself up with your arms, with the rest of the weight at your feet.',
        'Alternate kicking up your left and right leg, while holding the weight with your arms. Repeat until the timer goes out.'],
        example_frames: 6,
        horizontal: true,
        duration: 60, // in seconds
        type: ['arms', 'abs', 'legs'],
        points: 2
    },
    squats : {
        title:'Squat',
        description : ['Stand with your feet shoulder width apart. This will be your starting position.',
        'Begin the movement by flexing your knees and hips, sitting back with your hips.',
        'Continue until you have squatted a portion of the way down, but are above parallel,',
        'Quickly reverse the motion until you return to the starting position. Repeat 10 times.'],
        example_frames: 9,
        horizontal: false,
        duration: 60, // in seconds
        type: 'legs',
        points: 2
    }
}