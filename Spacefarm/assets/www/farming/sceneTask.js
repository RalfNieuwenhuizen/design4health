/**
 *
 *
 */
goog.provide('farming.SceneTask');

goog.require('lime.Sprite');
goog.require('farming.Exercise');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('lime.fill.Stroke');
goog.require('lime.RoundedRect');
goog.require('farming.Tile');
goog.require('farming.Crop');
goog.require('farming.Scene');
goog.require('goog.events');

/**
 * Scene elements
 *
 */
farming.SceneTask = function (game) {
    goog.base(this);
    this.game = game;

    // This layer is attached to the landscape and scrolls with it
    this.taskLayer = new lime.Layer().setHidden(true);
    game.sceneMap.landLayer.appendChild(this.taskLayer);

    this.taskPhase = 1;

    this.center = game.getCenterPosition();
    var middle = this.game.sceneMap.calculate('middleTile');
    var middleCor = this.game.sceneMap.twoDToScreen(middle.x, middle.y);
    this.w = new lime.RoundedRect().setFill('#ffffff').setRadius(10)
        .setPosition(middleCor.x - 260, middleCor.y - 200)
        .setStroke(new lime.fill.Stroke(2, 'rgba(0,0,0,0.3)')).setSize(400, 100);
    var talkIcon = new lime.Sprite().setFill('images/talk.png').setSize(18, 26).setPosition(207, -20);
    this.text = new farming.Label().setSize(360, 0).setFontSize(18).setMultiline(true).setVerticalAlign(true)
        .setPosition(0, 0);//.setPosition(this.center.x, this.center.y-15);

    this.wrapper = new lime.Layer().setPosition(-70, -5);
    this.w.appendChild(talkIcon).appendChild(this.text);

    // Global variables to check for progression
    this.tasks = [false, false, false];

    // Run the task startup function right at the start (to bind the listeners even if you dont open the bubble)
    this.startupTask();
}

goog.inherits(farming.SceneTask, farming.Scene);

farming.SceneTask.prototype.tasks = [];
farming.SceneTask.prototype.game = null;
farming.SceneTask.prototype.visible = false;

// The task function has been called by pressing the farm
farming.SceneTask.prototype.task = function () {
    if (this.visible) {
        this.hide();
    } else {
        this.show();
    }
}

farming.SceneTask.prototype.startupTask = function () {
    if (this['start' + this.taskPhase]) {
        this['start' + this.taskPhase]();
    }
}

farming.SceneTask.prototype.hide = function () {
    if (this.taskPhase == 1 && this.tasks[0] && this.tasks[1] && this.tasks[2]) return;
    this.visible = false;
    this.taskLayer.setHidden(true);
}

// Show next task
farming.SceneTask.prototype.show = function () {
    this.visible = true;
    console.trace();
    this.taskLayer.setHidden(false);
    if (this['show' + this.taskPhase]) {
        this.taskLayer.removeAllChildren();
        this['show' + this.taskPhase]();
    }
}

// Task1: Todo screen: show todo-list
farming.SceneTask.prototype.show1 = function () {
    this.wrapper.removeAllChildren();
    var middle = this.game.sceneMap.calculate('middleTile');
    var middleCor = this.game.sceneMap.twoDToScreen(middle.x, middle.y);

    var text1 = new lime.Label().setFontSize(18).setMultiline(true).setSize(340, 100);
    var text2 = new lime.Label().setFontSize(18).setMultiline(true).setSize(500, 100);
    var button = new farming.Button('Get Reward').setColor('green').setAction(this.getReward, this).setPosition(70, 65).setSize(SETTINGS.size.button);

    var checkbox_1 = new farming.Sprite('images/checkbox_' + this.tasks[0] + '.png').setSize(30, 30).setPosition(-87, -02).setOpacity(0.8);
    var checkbox_2 = new farming.Sprite('images/checkbox_' + this.tasks[1] + '.png').setSize(30, 30).setPosition(-87, 38).setOpacity(0.8);
    var checkbox_3 = new farming.Sprite('images/checkbox_' + this.tasks[2] + '.png').setSize(30, 30).setPosition(-87, 78).setOpacity(0.8);

    text1.setFontWeight('bold').setPosition(70, -40).setAlign('left');

    text2.setFontWeight('bold').setPosition(185, 38).setAlign('left').setText(
        "Clone a crop\n\n"
            + "   Do a challenge\n\n"
            + "   Harvest a crop\n\n");
    var text = '';
    //var button;

    if (this.tasks[0] && this.tasks[1] && this.tasks[2]) {
        text = "Perfect! You are learning fast. \n Finally I can go take a nap, \n take care of everything! \n\n Let me reward you for this:";
        button.setHidden(false);
        this.wrapper.appendChild(button);
        text1.setAlign('center');
        this.w.setSize(this.w.getSize().width, 240);
    } else if (this.tasks[0] || this.tasks[1] || this.tasks[2]) {
        text = "Good job! You'll make a great farmer.\n Now continue with the others!";
        this.w.setSize(this.w.getSize().width, 240)
        this.wrapper.appendChild(text2).appendChild(checkbox_1).appendChild(checkbox_2).appendChild(checkbox_3)
    } else {
        text = "Now it\'s up to you to explore your farm. \n For a start, try out these three things.\n Good luck!\n\n";
        this.w.setSize(this.w.getSize().width, 240);
        this.wrapper.appendChild(text2).appendChild(checkbox_1).appendChild(checkbox_2).appendChild(checkbox_3)
    }
    text1.setText(text);
    this.text.setHidden(true);
    this.wrapper.appendChild(text1);
    this.w.appendChild(this.wrapper);
    this.taskLayer.appendChild(this.w);
}

// Start1 is executed at the start of the game to bind the listeners
farming.SceneTask.prototype.start1 = function () {
    var scene = this;
    goog.events.listen(this.game.source, this.game.EventType.WINDOW_OPENED, function () {
        scene.hide();
    }, false, this.game.sceneTask);

    // Listen to a crop to be cloned
    goog.events.listenOnce(this.game.source, this.game.EventType.CLOSE_CLONE, function () {
        if (!scene.tasks[0]) {
            scene.tasks[0] = true;
            scene.show();
        }
    }, false, this.game.sceneTask);

    // Listen to a crop to be harvested
    goog.events.listenOnce(this.game.source, this.game.EventType.CROP_HARVESTED, function () {
        if (!scene.tasks[2]) {
            scene.tasks[2] = true;
            scene.show();
        }
    }, false, this.game.sceneTask);

    // Listen to a challenge to be completed
    goog.events.listenOnce(this.game.source, this.game.EventType.COMPLETE_CHALLENGE, function () {
        if (!scene.tasks[1]) {
            scene.tasks[1] = true;
            scene.show();
        }
    }, false, this.game.sceneTask);
}
// Day task 1
farming.SceneTask.prototype.showText = function (text, height) {
    this.text.setHidden(false).setText(text).setLineHeight(1.2);
    this.w.removeChild(this.wrapper).setHidden(false).setSize(this.w.getSize().width, height).appendChild(this.text);
    this.taskLayer.removeAllChildren();
    this.taskLayer.appendChild(this.w);
}
// Day task 1
farming.SceneTask.prototype.show2 = function () {
    this.showText("Daily tip:\nTake the stairs!\n Use the stairs instead of elevators and escalators whenever possible. \nCome back tomorrow and you will receive a new task!", 160);
}
// Day task 4
farming.SceneTask.prototype.show3 = function () {
    this.showText("Daily tip:\nChoose activities you like!\nDo you see yourself wearing attractive clothes and bicycling comfortably to work, or wearing workout gear at the gym?", 140);
}
// Day task 5
farming.SceneTask.prototype.show4 = function () {
    this.showText("Daily tip:\nExercise with a friend!\n Finding a workout partner can help keep you on track and motivate you to get out the door.", 140);
}
// Day task 1
farming.SceneTask.prototype.show5 = function () {
    this.showText("Daily tip:\nPlan exercise into your day. Set aside a specific time in your schedule to exercise and plant crops ahead!", 130);
}
// Day task 5
farming.SceneTask.prototype.show6 = function () {
    this.showText("Daily tip:\nTake lunch on the move!\n Don't spend all of your lunch time sitting. Hit the gym or go for a 20-minute walk with coworkers, and then have a meal when you are done.", 160);
}
// Day task 5
farming.SceneTask.prototype.show7 = function () {
    this.showText("Daily tip:\nTurn off this smart phone!\n. Cutting back on screen time is a great way to curb your \"sit time.\" Trade screen time for active time - visit the gym, or even just straighten up around the house.", 180);
}
// Day task 5
farming.SceneTask.prototype.show8 = function () {
    this.showText("Daily tip:\nWalk an extra stop!\n During your bus or subway commute, get off a stop or two earlier and walk the rest of the way.", 140);
}

// Get reward button
farming.SceneTask.prototype.getReward = function (scene) {
    scene.game.addCoins(100);
    scene.taskPhase++;
    scene.hide();
}
