/**
 * 	
 *  
 */
goog.provide('farming.Introduction');

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
farming.Introduction = function (game) {
    goog.base(this);
    this.game = game;
    
    // This layer is on top of all screens and does not scroll with it
    this.introLayer = new lime.Layer();
    game.sceneMap.appendChild(this.introLayer);
    
    // This layer is attached to the landscape and scrolls with it
    this.introScrollLayer = new lime.Layer();
    game.sceneMap.landLayer.appendChild(this.introScrollLayer);
    
    // This layer is used to push and pop in game and therefore is appended as a child to introduction. 
    // It is also used as a layer to append to other children
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    
    this.introPhase = 1;
    
    this.center = game.getCenterPosition();
    this.w = new lime.Sprite().setFill('#FFFFFF').setSize(game.getFullSize(0.85));//.setPosition(this.center.x, this.center.y-10);
    this.text = new lime.Label().setFontSize(18).setMultiline(true);//.setPosition(this.center.x, this.center.y-15);
    this.button = new farming.Button('').setColor(SETTINGS.color.button).setAction(this.buttonAction, this);
	this.phil = new farming.Sprite('images/phil_speaking1.png');
	var talkingPhil = new lime.animation.KeyframeAnimation().setDelay(0.5);
	for(var i = 1; i < 3; i++) {
		talkingPhil.addFrame('images/phil_speaking'+i+'.png');
	}
	this.phil.runAction(talkingPhil);

}

goog.inherits(farming.Introduction, farming.Scene);

farming.Introduction.prototype.game = null;

// The intro function has been called from sceneMap
farming.Introduction.prototype.intro = function(){
	
	// The intro# function is used according to the current phase
	if (this['intro'+this.introPhase])
		this['intro'+this.introPhase]()
		
	else
		console.log('next intro does not exist');
}

// The button is used: introPhase goes one step further and removes the current screen
farming.Introduction.prototype.buttonAction = function(scene) {
	// If current scene is intro: close screen
	if (scene.game.director.getCurrentScene() == scene){
		scene.game.closeIntroduction();
	}
	
	scene.game.introduction.windowLayer.removeAllChildren();
	scene.game.introduction.introLayer.removeAllChildren();
	scene.game.introduction.introScrollLayer.removeAllChildren();
	scene.game.introduction.introPhase++;
	
	console.log('introPhase: '+ scene.game.introduction.introPhase);
	// Call for the next introduction screen
	scene.intro();
}

// First introduction screen: general story
farming.Introduction.prototype.intro1 = function(){
	this.text.setFontWeight('bold').setText("2542 AD \n \n"
					+ "Your uncle was one of the first people \n"
					+ "to buy land in an unknown planet and decided to \n"
					+ "turn it into a farm to facilitate the earth\'s \n"
					+ "growing needs of foods. As years went by the farm \n "
					+ "became very profitable and produced the most \n"
					+ "sought out products. \n\n"
					+ "You were very surprised when you received a mail \n"
					+ "saying that your uncle had left you the farm \n"
					+ "years ago but you only heard of it now. \n \n "
					+ "After so many years, the fields on planet Yeo are \n"
					+ "unused and empty. Will you be able to salvage the \n"
					+ "farm?");
	this.w.setPosition(this.center.x, this.center.y);
	this.text.setPosition(this.center.x, this.center.y);
	this.button.setPosition(this.center.x, this.center.y + this.game.getFullSize(0.37).height).setSize(SETTINGS.size.button).setText('Start');
	//this.game.sceneMap.introLayer.setOpacity(1);
	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(this.button);
	
	this.game.showIntroduction();
}

// Second screen: meet the uncle
farming.Introduction.prototype.intro2 = function(){
	this.text.setFontWeight('bold').setPosition(this.center.x+58, this.center.y-15).setText(
			"Hello, welcome to Spaceville. My name \n "
			+ "is Phil, I am your uncle. \n"
			+ "I will help you getting through \n"
			+ "this first period. \n \n"
			+ "We can make your farm succesful \n"
			+ "together. If you spend your money \n"
			+ "wisely you unlock new challenges \n"
			+ "and possibilities. \n \n"
			+ "Let's have a look at your farm.");
	
	this.phil.setSize(150, 200).setPosition(this.center.x-165, this.center.y + 56);
	
	this.w.setSize(this.game.getFullSize(0.65));
	this.button.setPosition(this.center.x, this.center.y + 120)
		.setSize(SETTINGS.size.button).setText('Let\'s go!');
	
	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(this.button).appendChild(this.phil);
	
	this.game.showIntroduction();
}

// Third screen: go to the inventory
farming.Introduction.prototype.intro3 = function(){
	var middle = this.game.sceneMap.calculate('middleTile');
	var middleCor = this.game.sceneMap.twoDToScreen(middle.x,middle.y);
	
	this.text.setFontWeight('bold').setPosition(middleCor.x-162,middleCor.y-20).setText(
			"This is your new farm, \n click on it to see \n your inventory");
	
	this.phil.setSize(100, 133).setPosition(middleCor.x-296,middleCor.y-14);
	this.w.setFill('images/textbox/right_arrow.png').setSize(this.game.getFullSize(0.52).width, this.game.getFullSize(0.3).height)
		.setPosition(middleCor.x-147, middleCor.y-20).setOpacity(0.85);	
	this.introScrollLayer.setOpacity(0.85);
	this.introScrollLayer.appendChild(this.w).appendChild(this.text).appendChild(this.phil);
	
	// Listen to the show_farm event
	goog.events.listenOnce(this.game.source,this.game.EventType.SHOW_FARM,goog.partial(this.buttonAction,this.game.introduction));
}

// Fourth screen: show the inventory
farming.Introduction.prototype.intro4 = function(){
	var position = {x: this.center.x-180,y: this.center.y + this.game.getFullSize(0.25).height};

	var textbox = new lime.Sprite().setFill('images/textbox/no_arrow.png')
			.setSize(this.game.getFullSize(0.4).width, this.game.getFullSize(0.3).height).setPosition(450,150);
	var text = new lime.Label().setFontSize(18).setMultiline(true);
	text.setFontWeight('bold').setPosition(450,150).setText(
			"This is your inventory, notice \n that you have " + this.game.player.inventory.space_wheat+ 
			" wheat \n and " + this.game.player.inventory.space_apple + " apples now.");
	
	this.text.setFontWeight('bold').setPosition(position.x, position.y - 35).setText(
			 "Let's clone some more apples! \n Click on Clone.");
	this.w.setFill('images/textbox/down_arrow.png').setSize(this.game.getFullSize(0.4).width, this.game.getFullSize(0.4).height)
		.setPosition(position.x, position.y).setOpacity(1);	
	
	this.introLayer.setOpacity(1);
	this.introLayer.appendChild(this.w).appendChild(this.text);

	this.windowLayer.appendChild(textbox).appendChild(text);
	this.game.sceneFarm.windowLayer.appendChild(this.windowLayer);
	
	// Listen to the Clone
	goog.events.listenOnce(this.game.source,this.game.EventType.GO_CLONE,goog.partial(this.buttonAction,this.game.introduction));
}

// Fifth screen: click on details in clone screen
farming.Introduction.prototype.intro5 = function(){
	var position = {x: this.center.x-95,y: this.center.y + this.game.getFullSize(0.20).height};

	var textbox = new lime.Sprite().setFill('images/textbox/no_arrow.png')
			.setSize(this.game.getFullSize(0.40).width, this.game.getFullSize(0.3).height).setPosition(500,160);
	var text = new lime.Label().setFontSize(18).setMultiline(true);
	text.setFontWeight('bold').setPosition(500,160).setText(
			"Here you see \n all the available \n products that \n can be cloned.");

	this.text.setFontWeight('bold').setPosition(position.x, position.y + 30).setText(
			"Click on Details to see more \n details about the Space \n Apple tree");
	this.w.setFill('images/textbox/top_arrow.png').setSize(this.game.getFullSize(0.4).width, this.game.getFullSize(0.40).height)
		.setPosition(position.x, position.y-5).setOpacity(1);	
	
	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(textbox).appendChild(text);
	this.game.sceneClone.windowLayer.appendChild(this.windowLayer);
	
	// Listen to the Clone
	goog.events.listenOnce(this.game.source,this.game.EventType.CLONE_DETAILS,goog.partial(this.buttonAction,this.game.introduction));
}

// Sixt screen: start cloning from clone details screen
farming.Introduction.prototype.intro6 = function(){
	var position = {x: this.center.x-200,y: this.center.y + this.game.getFullSize(0.30).height};

	this.text.setFontWeight('bold').setPosition(position.x - 40, position.y-10).setText(
			"Click on Clone to \n clone and plant \n a new crop");
	this.w.setFill('images/textbox/right_low_arrow.png').setSize(this.game.getFullSize(0.40).width, this.game.getFullSize(0.25).height)
		.setPosition(position.x, position.y -15 ).setOpacity(1);	
	
	this.windowLayer.appendChild(this.w).appendChild(this.text);
	this.game.sceneCropDetails.windowLayer.appendChild(this.windowLayer);
	
	// Listen to the Clone
	goog.events.listenOnce(this.game.source,this.game.EventType.CLONE_CROP,goog.partial(this.buttonAction,this.game.introduction));
}

// Seventh screen: clone a crop on a tile
farming.Introduction.prototype.intro7 = function(){
	var position = {x: this.center.x-400,y: this.center.y + 0};
	this.text.setFontWeight('bold').setPosition(position.x + 0, position.y-10).setText(
			"Click on empty \n tiles to clone \n the crop. \n\n Shut down the \n screen above to \n stop cloning.");
	this.w.setFill('images/textbox/no_arrow.png').setSize(this.game.getFullSize(0.20).width, this.game.getFullSize(0.4).height)
		.setPosition(position.x, position.y -15 ).setOpacity(0.8);		
	this.windowLayer.appendChild(this.w).appendChild(this.text);
	this.game.sceneMap.cloningScreen.appendChild(this.windowLayer);
	
	// Listen to stop cloning
	goog.events.listenOnce(this.game.source,this.game.EventType.CLOSE_CLONE,goog.partial(this.endIntro7,this.game.introduction));
}

farming.Introduction.prototype.endIntro7 = function(scene){
	// remove windowLayer from cloningScreen again
	scene.game.sceneMap.cloningScreen.removeChild(scene.windowLayer);
	scene.buttonAction(scene);
}


// Eight screen: open challenge screen
farming.Introduction.prototype.intro8 = function(){
	
	var position = {x: this.center.x-80,y: this.center.y + 170};
	this.text.setFontWeight('bold').setPosition(position.x + 0, position.y-35).setText(
			"Now let's use our crops to do some \n challenges. Click the Challenges \n button to open them");
	this.w.setFill('images/textbox/down_arrow.png').setSize(this.game.getFullSize(0.40).width, this.game.getFullSize(0.3).height)
		.setPosition(position.x, position.y -15 ).setOpacity(0.8);		
	
	this.introLayer.appendChild(this.w).appendChild(this.text);
	// Listen to stop cloning
	goog.events.listenOnce(this.game.source,this.game.EventType.OPEN_CHALLENGES,goog.partial(this.buttonAction,this.game.introduction));
}

// 9th screen: open details of challenge
farming.Introduction.prototype.intro9 = function(){
	
	var position = {x: this.center.x-160,y: this.center.y + this.game.getFullSize(0.15).height};

	var textbox = new lime.Sprite().setFill('images/textbox/no_arrow.png')
			.setSize(this.game.getFullSize(0.30).width, this.game.getFullSize(0.25).height).setPosition(500,160);
	var text = new lime.Label().setFontSize(18).setMultiline(true);
	text.setFontWeight('bold').setPosition(500,160).setText(
			"Here you see all the \n available challenges that \n you can do.");

	this.text.setFontWeight('bold').setPosition(position.x, position.y + 20).setText(
			"Click on Details to see more \n details about the Challenge");
	this.w.setFill('images/textbox/top_arrow.png').setSize(this.game.getFullSize(0.4).width, this.game.getFullSize(0.30).height)
		.setPosition(position.x, position.y-5).setOpacity(1);	
	
	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(textbox).appendChild(text);
	this.game.sceneChallenge.windowLayer.appendChild(this.windowLayer);
	// Listen to stop cloning
	goog.events.listenOnce(this.game.source,this.game.EventType.CHALLENGE_DETAILS,goog.partial(this.endIntro9,this.game.introduction));
}

farming.Introduction.prototype.endIntro9 = function(scene){
	// remove windowLayer from sceneChallenge.windowLayer again
	scene.game.sceneChallenge.windowLayer.removeChild(scene.windowLayer);
	scene.buttonAction(scene);
}

// 10th screen: click the start challenge button
farming.Introduction.prototype.intro10 = function(){
	
	var position = {x: this.center.x + 120, y: this.center.y + this.game.getFullSize(0.15).height};

	var textbox = new lime.Sprite().setFill('images/textbox/no_arrow.png')
			.setSize(this.game.getFullSize(0.35).width, this.game.getFullSize(0.35).height).setPosition(position.x - 340,position.y+30);
	var text = new lime.Label().setFontSize(18).setMultiline(true);
	text.setFontWeight('bold').setPosition(position.x - 340,position.y + 30).setText(
			"Here you see all the \n details of the challenge. \n \n Starting the challenge removes \n the required items from \n your inventory. ");
	
	this.text.setFontWeight('bold').setPosition(position.x - 35, position.y + 10).setText(
			"Press Start to begin \n the exercise.");
	this.w.setFill('images/textbox/top_arrow.png').setSize(this.game.getFullSize(0.3).width, this.game.getFullSize(0.4).height)
		.setPosition(position.x - 35, position.y - 20).setOpacity(1);	
	
	// These layers will be deleted, since the sceneChallengeDetails object is recreated every time
	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(textbox).appendChild(text);
	this.game.sceneChallengeDetails.windowLayer.appendChild(this.windowLayer);	
	
	// Listen to the Clone
	goog.events.listenOnce(this.game.source,this.game.EventType.DO_CHALLENGE,goog.partial(this.buttonAction,this.game.introduction));
}

// 11th screen: 
farming.Introduction.prototype.intro11 = function(){
	
	var position = {x: this.center.x - 170, y: this.center.y + this.game.getFullSize(0.15).height};
	var requirements = CHALLENGES[this.game.sceneChallengeDetails.challenge.key].requirements;
	if (requirements.type == 'exercise')
		console.log(requirements.key);
	var exercise = CHALLENGES[this.game.sceneChallengeDetails.challenge.key].requirements[2].key;
	EXERCISES[exercise].type
	this.text.setFontWeight('bold').setPosition(position.x - 35, position.y + 10).setText(
			"Press Do to start the \n exercise and earn \n"+ EXERCISES[exercise].points + " "+ EXERCISES[exercise].type +" points.");
	this.w.setFill('images/textbox/top_arrow.png').setSize(this.game.getFullSize(0.3).width, this.game.getFullSize(0.3).height)
		.setPosition(position.x - 35, position.y - 20).setOpacity(1);	
	
	// These layers will be deleted, since the sceneChallengeDetails object is recreated every time
	this.windowLayer.appendChild(this.w).appendChild(this.text);
	this.game.sceneChallengeDetails.windowLayer.appendChild(this.windowLayer);	
	
	// Listen to the Clone
	goog.events.listenOnce(this.game.source,this.game.EventType.PRESSED_DO,goog.partial(this.waiter,this.game.introduction));
}

// 12th screen: open body screen
farming.Introduction.prototype.intro12 = function(){
	
	var position = {x: this.center.x+20,y: this.center.y + 150};
	this.text.setFontWeight('bold').setPosition(position.x + 0, position.y-45).setText(
			"Congratulations! You finished \n your first exercise. \n \n Check out your progress \n in the BODY screen");
	this.w.setFill('images/textbox/down_arrow.png').setSize(this.game.getFullSize(0.40).width, this.game.getFullSize(0.4).height)
		.setPosition(position.x, position.y -15 ).setOpacity(0.8);		
	
	this.introLayer.appendChild(this.w).appendChild(this.text);
	// Listen to stop cloning
	goog.events.listenOnce(this.game.source,this.game.EventType.OPEN_BODY,goog.partial(this.buttonAction,this.game.introduction));
}

// 13th screen: Click the statistics button
farming.Introduction.prototype.intro13 = function(){
	
	var position = {x: this.center.x + 100, y: this.center.y + this.game.getFullSize(0.1).height};

	var textbox = new lime.Sprite().setFill('images/textbox/no_arrow.png')
			.setSize(this.game.getFullSize(0.4).width, this.game.getFullSize(0.45).height).setPosition(position.x - 300,position.y-40);
	var text = new lime.Label().setFontSize(18).setMultiline(true);
	text.setFontWeight('bold').setPosition(position.x - 300,position.y-40).setText(
			"Here you see your \n Bionic Outer Dimension Yeosuit. \n This is your exoskeloton that helps \n you doing your job. \n "
			+ "\n You can upgrade your BODY \n by doing exercises. \n Upgrading your BODY also unlocks \n new features.");
	
	this.text.setFontWeight('bold').setPosition(position.x + 130, position.y - 40).setText(
			"Press Statistics \n to see the exercise \n you did in the past.");
	this.w.setFill('images/textbox/down_right_arrow.png').setSize(this.game.getFullSize(0.3).width, this.game.getFullSize(0.4).height)
		.setPosition(position.x + 130, position.y - 10).setOpacity(1);	
	
	// These layers will be deleted, since the sceneChallengeDetails object is recreated every time
	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(textbox).appendChild(text);
	this.game.sceneBody.windowLayer.appendChild(this.windowLayer);	
	
	// Listen to the Clone
	//goog.events.listenOnce(this.game.source,this.game.EventType.DO_CHALLENGE,goog.partial(this.buttonAction,this.game.introduction));
}

// Wait function, awaits an event to be fired before it continues
farming.Introduction.prototype.waiter = function(scene){
	// Wait for an exercise to be completed, then go to buttonAction
	goog.events.listenOnce(scene.game.source,scene.game.EventType.EXERCISE_DONE,goog.partial(scene.buttonAction,scene));
}

farming.Introduction.prototype.write = function(text){
	console.log('test text is: '+text);
}
