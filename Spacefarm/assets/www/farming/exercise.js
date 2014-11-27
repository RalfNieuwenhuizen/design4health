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