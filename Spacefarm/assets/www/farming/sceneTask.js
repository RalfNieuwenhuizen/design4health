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

	this.center = game.getCenterPosition();
	this.w = new lime.Sprite().setFill('#FFFFFF').setSize(game.getFullSize(0.85));//.setPosition(this.center.x, this.center.y-10);
	this.text = new lime.Label().setFontSize(18).setMultiline(true);//.setPosition(this.center.x, this.center.y-15);

	// Global variables to check for progression
	this.tasks = [false, false, false];

    // run the task startup function right at the start (to bind the listeners even if you dont open the bubble)
    this.startupTask();
}

goog.inherits(farming.SceneTask, farming.Scene);

farming.SceneTask.prototype.tasks = [];
farming.SceneTask.prototype.game = null;
farming.SceneTask.prototype.visible = false;

// The task function has been called by pressing the farm
farming.SceneTask.prototype.task = function(){
	// The task# function is used according to the current phase
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
farming.SceneTask.prototype.show = function(){
    this.visible = true;
    this.taskLayer.setHidden(false);
    if (this['show'+this.taskPhase]){
        this['show'+this.taskPhase]();
    }
}
// Task1: Todo screen: show todo-list
farming.SceneTask.prototype.show1 = function(){
    this.taskLayer.removeAllChildren();
	var middle = this.game.sceneMap.calculate('middleTile');
	var middleCor = this.game.sceneMap.twoDToScreen(middle.x,middle.y);

	var textbox = new lime.Sprite().setFill('#FFFFFF').setSize(this.game.getFullSize(0.8));
	var text = new lime.Label().setFontSize(18).setMultiline(true);

	var checkbox_1 = new farming.Sprite('images/checkbox_'+this.tasks[0]+'.png').setSize(20, 20).setPosition(-50,-22).setOpacity(0.8);
	var checkbox_2 = new farming.Sprite('images/checkbox_'+this.tasks[1]+'.png').setSize(20, 20).setPosition(-50, 18).setOpacity(0.8);
	var checkbox_3 = new farming.Sprite('images/checkbox_'+this.tasks[2]+'.png').setSize(20, 20).setPosition(-50, 58).setOpacity(0.8);

	text.setFontWeight('bold').setPosition(200,0).setAlign('left').setText(
		"Todo:\n\n "
		+ "Clone a crop\n\n"
		+ "Harvest a crop\n\n"
		+ "Do a challenge");
	textbox.setFill('images/textbox/left_arrow.png').setSize(this.game.getFullSize(0.6).width, this.game.getFullSize(0.5).height)
		.setPosition(middleCor.x+270, middleCor.y-200).setOpacity(1);
	textbox.appendChild(text).appendChild(checkbox_1).appendChild(checkbox_2).appendChild(checkbox_3);
	this.taskLayer.appendChild(textbox);

	/*var wait = new lime.animation.FadeTo(1).setDuration(5);
	var fade = new lime.animation.FadeTo(0).setDuration(0.5);
	textbox.runAction(wait);
	goog.events.listen(wait,lime.animation.Event.STOP,function(){
		textbox.runAction(fade);
	});

	goog.events.listen(fade,lime.animation.Event.STOP,function(){
		for(var i in this.targets) {
			var target = this.targets[i];
			target.parent_.removeChild(target);
		}
	});*/
}
farming.SceneTask.prototype.start1 = function(){
    var scene = this;
    goog.events.listen(this.game.source,this.game.EventType.WINDOW_OPENED,function(){
        scene.hide();
    },false,this.game.sceneTask);
	// Listen to a crop to be cloned
	goog.events.listenOnce(this.game.source,this.game.EventType.CROP_CLONED,function(){
        scene.tasks[0] = true;
	},false,this.game.sceneTask);

	// Listen to a crop to be harvested
	goog.events.listenOnce(this.game.source,this.game.EventType.CROP_HARVESTED,function(){
        scene.tasks[1] = true;
	},false,this.game.sceneTask);

	// Listen to a challenge to be completed
	goog.events.listenOnce(this.game.source,this.game.EventType.COMPLETE_CHALLENGE,function(){
        scene.tasks[2] = true;
	},false,this.game.sceneTask);

}

// Wait function, awaits an event to be fired before it continues
farming.SceneTask.prototype.waiter = function(scene){

	// Wait for a challenge to be completed
	goog.events.listenOnce(scene.game.source,scene.game.EventType.COMPLETE_CHALLENGE,scene.intro12,false,scene);
}
