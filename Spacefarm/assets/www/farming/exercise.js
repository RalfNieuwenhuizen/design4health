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
    
    if (rep >=10) {
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
    if(Math.abs(last-first)> 10)
    {
    rep= rep+1;
    console.log('repetitions for wheat are:' +rep);
     }
    
    if (rep >=2) {
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
    
    if (rep >=10) {
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
        title : '\"Arm circles\"',
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