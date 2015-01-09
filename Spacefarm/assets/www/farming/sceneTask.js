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
	this.taskLayer = new lime.Layer();
	game.sceneMap.landLayer.appendChild(this.taskLayer);

	this.taskPhase = 1;

	this.center = game.getCenterPosition();
	this.w = new lime.Sprite().setFill('#FFFFFF').setSize(game.getFullSize(0.85));//.setPosition(this.center.x, this.center.y-10);
	this.text = new lime.Label().setFontSize(18).setMultiline(true);//.setPosition(this.center.x, this.center.y-15);

	// Global variables to check for progression
	this.tasks = [false, false, false];
}

goog.inherits(farming.SceneTask, farming.Scene);

farming.SceneTask.prototype.tasks = [];
farming.SceneTask.prototype.game = null;

// The task function has been called by pressing the farm
farming.SceneTask.prototype.task = function(){
	// The task# function is used according to the current phase
	if (this['task'+this.taskPhase]){
		this['task'+this.taskPhase]()
	}
	else
		console.log('next task does not exist');
}

// Task1: Todo screen: show todo-list
farming.SceneTask.prototype.task1 = function(){
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
	textbox.setFill('images/textbox/left_arrow.png').setSize(this.game.getFullSize(0.4).width, this.game.getFullSize(0.4).height)
		.setPosition(middleCor.x+280, middleCor.y-50).setOpacity(1);
	textbox.appendChild(text).appendChild(checkbox_1).appendChild(checkbox_2).appendChild(checkbox_3);
	this.taskLayer.appendChild(textbox);

	var wait = new lime.animation.FadeTo(1).setDuration(2);
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
	});

	// Listen to a crop to be cloned
	goog.events.listenOnce(this.game.source,this.game.EventType.CROP_CLONED,function(){
		this.tasks[0] = true;
	},false,this.game.sceneTask);

	// Listen to a crop to be harvested
	goog.events.listenOnce(this.game.source,this.game.EventType.CROP_HARVESTED,function(){
		this.tasks[1] = true;
	},false,this.game.sceneTask);

	// Listen to a challenge to be completed
	goog.events.listenOnce(this.game.source,this.game.EventType.COMPLETE_CHALLENGE,function(){
		this.tasks[2] = true;
	},false,this.game.sceneTask);

}

// Wait function, awaits an event to be fired before it continues
farming.SceneTask.prototype.waiter = function(scene){

	// Wait for a challenge to be completed
	goog.events.listenOnce(scene.game.source,scene.game.EventType.COMPLETE_CHALLENGE,scene.intro12,false,scene);
}
