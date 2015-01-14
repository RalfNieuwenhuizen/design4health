/**
 *
 *
 */
goog.provide('farming.SceneTask');

goog.require('lime.Sprite');
goog.require('farming.Exercise');
goog.require('farming.Button');
goog.require('lime.Layer');
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
	this.newDay = true;
	
	this.center = game.getCenterPosition();
	this.w = new lime.Sprite().setFill('images/textbox/left_arrow.png').setSize(350,100);
	this.text = new lime.Label().setFontSize(18).setMultiline(true);//.setPosition(this.center.x, this.center.y-15);    
    
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
farming.SceneTask.prototype.task = function(){
    if(this.visible){
        this.hide();
    } else {
        this.show();
    }
}
 
farming.SceneTask.prototype.startupTask = function(){
    if (this['start'+this.taskPhase]){
        this['start'+this.taskPhase]();
    }
}

farming.SceneTask.prototype.hide = function(){
    this.visible = false;
    this.taskLayer.setHidden(true);
}

// Show next task
farming.SceneTask.prototype.show = function(){
    this.visible = true;
    this.taskLayer.setHidden(false);

    if (this['show'+this.taskPhase] && this.newDay){
    	this.taskLayer.removeAllChildren();
    	this['show'+this.taskPhase]();
    }    
    else if(!this.newDay){
    	this.wait();
    }
}

// Wait for next day
farming.SceneTask.prototype.wait = function(){
	this.visible = true;
	this.taskLayer.setHidden(false);
 
	// Check for a new day
	goog.events.listenOnce(this.game.source,this.game.EventType.NEW_DAY,function(){
		this.newDay = true;
		this.show();
	},false,this);
	
	if (this['show'+this.taskPhase] && this.newDay){
		this.show();
	}    
	else{
		var middle = this.game.sceneMap.calculate('middleTile');
		var middleCor = this.game.sceneMap.twoDToScreen(middle.x,middle.y);
		this.text.setText("If you login tomorrow you \n will receive a new task.").setPosition(40,0);
		this.w.setPosition(middleCor.x+260, middleCor.y-200).appendChild(this.text);
		this.taskLayer.appendChild(this.w);
	}
}

// Task1: Todo screen: show todo-list
farming.SceneTask.prototype.show1 = function(){
    this.taskLayer.removeAllChildren();
	var middle = this.game.sceneMap.calculate('middleTile');
	var middleCor = this.game.sceneMap.twoDToScreen(middle.x,middle.y);

	var textbox = new lime.Sprite().setFill('#FFFFFF');
    var text1 = new lime.Label().setFontSize(18).setMultiline(true).setSize(500,100);
    var text2 = new lime.Label().setFontSize(18).setMultiline(true).setSize(500,100);
	var button = new farming.Button('Get Reward').setColor(SETTINGS.color.button).setAction(this.getReward, this).setPosition(50,50).setSize(SETTINGS.size.button);
	
    textbox.setFill('images/textbox/left_arrow.png')
        .setPosition(middleCor.x+260, middleCor.y-200).setOpacity(1).setSize(520,200);
    var checkbox_1 = new farming.Sprite('images/checkbox_'+this.tasks[0]+'.png').setSize(30, 30).setPosition(-77,-02).setOpacity(0.8);
	var checkbox_2 = new farming.Sprite('images/checkbox_'+this.tasks[1]+'.png').setSize(30, 30).setPosition(-77, 38).setOpacity(0.8);
	var checkbox_3 = new farming.Sprite('images/checkbox_'+this.tasks[2]+'.png').setSize(30, 30).setPosition(-77, 78).setOpacity(0.8);

    text1.setFontWeight('bold').setPosition(150,-40).setAlign('left');

    text2.setFontWeight('bold').setPosition(200,38).setAlign('left').setText(
        "Clone a crop\n\n"
            + "   Do a challenge\n\n"
            + "   Harvest a crop\n\n");
    var text = '';
    //var button;
    
    if(this.tasks[0] && this.tasks[1] && this.tasks[2]) {
    	text = "Perfect! You are learning fast. \n Finally I can go take a nap, \n take care of everything! \n\n Let me reward you for this:";
        checkbox_1.setHidden(true);
        checkbox_2.setHidden(true);
        checkbox_3.setHidden(true);
        text2.setHidden(true);
        textbox.setSize(400,200);
        text1.setPosition(50,-40).setAlign('center');
        button.setHidden(false);
    	textbox.appendChild(button);
    } else if(this.tasks[0] || this.tasks[1] || this.tasks[2]) {
        text = "Good job! You'll make a great farmer.\n Now continue with the others!";
    } else {
        text = "Now it\'s up to you to explore your farm. \n For a start, try out these three things.\n Good luck!\n\n";
    }
    text1.setText(text);
    textbox.appendChild(text1).appendChild(text2).appendChild(checkbox_1).appendChild(checkbox_2).appendChild(checkbox_3);
    this.taskLayer.appendChild(textbox);
}

// Start1 is executed at the start of the game to bind the listeners
farming.SceneTask.prototype.start1 = function(){
    var scene = this;
    goog.events.listen(this.game.source,this.game.EventType.WINDOW_OPENED,function(){
        scene.hide();
    },false,this.game.sceneTask);
	
    // Listen to a crop to be cloned
	goog.events.listenOnce(this.game.source,this.game.EventType.CLOSE_CLONE,function(){
        if(!scene.tasks[0]) {
            scene.tasks[0] = true;
            scene.show();
        }
	},false,this.game.sceneTask);

	// Listen to a crop to be harvested
	goog.events.listenOnce(this.game.source,this.game.EventType.CROP_HARVESTED,function(){
        scene.tasks[2] = true;
        scene.show();
	},false,this.game.sceneTask);

	// Listen to a challenge to be completed
	goog.events.listenOnce(this.game.source,this.game.EventType.COMPLETE_CHALLENGE,function(){
        scene.tasks[1] = true;
        scene.show();
	},false,this.game.sceneTask);
}

// Day task 1
farming.SceneTask.prototype.show2 = function(){
	var middle = this.game.sceneMap.calculate('middleTile');
	var middleCor = this.game.sceneMap.twoDToScreen(middle.x,middle.y);
	this.text.setText("This is your task of the day: \n\n"
			+ "Take the stairs instead \n of the elevator").setPosition(50,0);
	this.w.setPosition(middleCor.x+260, middleCor.y-200).setSize(520,200).appendChild(this.text);
	this.taskLayer.appendChild(this.w);
}

// Get reward button
farming.SceneTask.prototype.getReward = function(scene){
	scene.newDay = false;
   	scene.game.addCoins(100);
	scene.tasks = [false, false, false];
	scene.taskPhase++;
	scene.taskLayer.removeAllChildren();
	scene.wait();
}
