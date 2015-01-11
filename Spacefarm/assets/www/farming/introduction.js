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
	if (this['intro'+this.introPhase]){
		if (this.introPhase == 12)
			this.waiter(this);
		else
			this['intro'+this.introPhase]()
	}	
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
	
	// Call for the next introduction screen
	scene.intro();
}

// First introduction screen: general story
farming.Introduction.prototype.intro1 = function(){
	this.text.setFontWeight('bold').setText("2542 AD \n \n"
					+ "Your uncle was one of the first people to buy \n"
					+ "land in an unknown planet and decided to turn \n"
					+ "it into a farm to facilitate the earth\'s growing \n"
					+ "needs of food. Your uncle made the farm very \n "
					+ "profitable and he produced the best products \n"
					+ "available on earth.  \n\n"
					+ "You received a mail telling you that your uncle \n"
					+ "had left you the farm already years ago. The \n"
					+ "fields on planet Yeo are unused and empty. Are \n"
					+ "you able to make the farm succesful again?\n");
	this.w.setPosition(this.center.x, this.center.y);
	this.text.setPosition(this.center.x, this.center.y-30);
	this.button.setPosition(this.center.x, this.center.y + this.game.getFullSize(0.37).height).setSize(SETTINGS.size.button).setText('Start');
	//this.game.sceneMap.introLayer.setOpacity(1);
	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(this.button);
	
	this.game.showIntroduction();
}

// Second screen: meet the uncle
farming.Introduction.prototype.intro2 = function(){
	this.text.setFontWeight('bold').setPosition(this.center.x+58, this.center.y-30).setText(
			"Hello, welcome to Spaceville! My \n"
			+ "name is Phil, your great-uncle. I \n"
			+ "will help you through the start. \n\n"
			+ "You have to work hard on this farm, \n"
			+ "therefore you have to do real \n"
			+ "exercises regularly yourself! I hope \n "
			+ "you are ready for this challenge! \n \n"
			+ "Ready? Then let's have a look \n at your farm.");
	
	this.phil.setSize(150, 200).setPosition(this.center.x-165, this.center.y + 56);
	
	this.w.setSize(this.game.getFullSize(0.65)).setPosition(this.center.x, this.center.y);
	this.button.setPosition(this.center.x+58, this.center.y + 120)
		.setSize(SETTINGS.size.button).setText('Let\'s go!');
	
	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(this.button).appendChild(this.phil);
	
	this.game.showIntroduction();
}

//Second screen: meet the uncle
farming.Introduction.prototype.intro3 = function(){
	this.text.setFontWeight('bold').setPosition(this.center.x-80, this.center.y+60).setText(
			"Oh, one more thing before \n"
			+ "we go to the farm. \n\n"
			+ "Please click on BODY \n"
			+ "and I will explain.");
	
	this.w.setSize(this.game.getFullSize(0.4).width, this.game.getFullSize(0.5).height).setPosition(this.center.x-120, this.center.y+100).setFill('images/textbox/down_right_arrow.png');
	this.phil.setSize(90,120).setPosition(this.center.x-230, this.center.y+75)
    this.button.setColor('#999999').setPosition(350, SETTINGS.screen.height - SETTINGS.size.controls.height / 2)
            .setSize(100,SETTINGS.size.controls.height).setAction(this.game.sceneMap.showBody, this.game.sceneMap).setText("BODY");

	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(this.button).appendChild(this.phil);
	// Listen to open BODY
	goog.events.listenOnce(this.game.source,this.game.EventType.OPEN_BODY,goog.partial(this.buttonAction,this.game.introduction));
	this.game.showIntroduction();
}

// Fourth screen: Explain the body screen
farming.Introduction.prototype.intro4 = function(){
	
	var position = {x: this.center.x + 100, y: this.center.y + this.game.getFullSize(0.1).height};

	this.w.setFill('images/textbox/no_arrow.png')
			.setSize(this.game.getFullSize(0.28).width, this.game.getFullSize(0.7).height).setPosition(position.x - 335,position.y-30);
	this.text.setFontSize(16).setMultiline(true).setFontWeight('bold').setPosition(position.x - 335,position.y - 30).setText(
			"This game will help you\n"
			+ "gain a healthy lifestyle\n"
			+ "by letting you exercise\n"
			+ "regularly in a fun way.\n\n"
			+ "The progress of your own\n"
			+ "body is represented in\n"
			+ "the BODY shown on the\n"
			+ "right.\n\n"
			+ "If you gain the required\n"
			+ "points for all body parts,\n"
			+ "the BODY levels up. This\n"
			+ "also unlocks new products \n"
			+ "and challenges!")	
	
	this.windowLayer.appendChild(this.w).appendChild(this.text);
	this.game.sceneBody.windowLayer.appendChild(this.windowLayer);	
	
	// Listen to the action
	goog.events.listenOnce(this.game.source,this.game.EventType.CLOSE_SCENE,goog.partial(this.buttonAction,this.game.introduction));
}

//Fifth screen: Introduce todo screen
farming.Introduction.prototype.intro5 = function(){
	/*var middle = this.game.sceneMap.calculate('middleTile');
	var middleCor = this.game.sceneMap.twoDToScreen(middle.x,middle.y);
	middleCor.x = middleCor.x + 20;
	middleCor.y = middleCor.y - 30;
    var textbox = new lime.Sprite().setFill('#FFFFFF').setSize(this.game.getFullSize(0.85));
    var text = new lime.Label().setFontSize(18).setMultiline(true);
    
	text.setFontWeight('bold').setPosition(middleCor.x-162,middleCor.y-20).setText(
			"Now it\'s up to you \n to explore your farm. \n\n"
			+ "Click on the farm to \n see some tasks to help \n you with the start. \n\n"
			+ "Good Luck!");
	
	this.phil.setSize(100, 133).setPosition(middleCor.x-296,middleCor.y+10);
	textbox.setFill('images/textbox/left_arrow.png').setSize(this.game.getFullSize(0.52).width, this.game.getFullSize(0.4).height)
		.setPosition(middleCor.x+147, middleCor.y-220).setOpacity(0.85);
	this.introScrollLayer.setOpacity(0.85);
	this.introScrollLayer.appendChild(textbox).appendChild(text).appendChild(this.phil);
	
	// Listen to the show_farm event

     */

	//goog.events.listenOnce(this.game.source,this.game.EventType.FARM_CLICK,goog.partial(this.buttonAction,this.game.introduction));
	
	this.introPhase += 1;
	//this.intro6();

    this.game.sceneTask.task();
}

// TODO: Maybe check for cloning to start to provide explanation


/*
// Third screen: go to the inventory
farming.Introduction.prototype.intro3Old = function(){
	var middle = this.game.sceneMap.calculate('middleTile');
	var middleCor = this.game.sceneMap.twoDToScreen(middle.x,middle.y);
	middleCor.x = middleCor.x + 20;
	middleCor.y = middleCor.y - 30;
	this.text.setFontWeight('bold').setPosition(middleCor.x-162,middleCor.y-20).setText(
			"This is your farm, \n it's hard working here");
	
	this.phil.setSize(100, 133).setPosition(middleCor.x-296,middleCor.y-14);
	this.w.setFill('images/textbox/right_arrow.png').setSize(this.game.getFullSize(0.52).width, this.game.getFullSize(0.3).height)
		.setPosition(middleCor.x-147, middleCor.y-20).setOpacity(0.85);	
	this.introScrollLayer.setOpacity(0.85);
	this.introScrollLayer.appendChild(this.w).appendChild(this.text).appendChild(this.phil);
	
	// Listen to the show_farm event
	goog.events.listenOnce(this.game.source,this.game.EventType.SHOW_FARM,goog.partial(this.buttonAction,this.game.introduction));
}

// Fourth screen: show the inventory
farming.Introduction.prototype.intro4Old = function(){
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
farming.Introduction.prototype.intro5Old = function(){
	var position = {x: this.center.x-95,y: this.center.y + this.game.getFullSize(0.20).height};

	//var textbox = new lime.Sprite().setFill('images/textbox/no_arrow.png')
	//		.setSize(this.game.getFullSize(0.45).width, this.game.getFullSize(0.35).height).setPosition(500,160);
	//var text = new lime.Label().setFontSize(18).setMultiline(true);
	//text.setFontWeight('bold').setPosition(500,160).setText(
	//		"Here you see \n all the available \n products that \n can be cloned.");

	this.text.setFontWeight('bold').setPosition(position.x, position.y + 15).setText(
			"Click on Details to see more \n details about the product");
	this.w.setFill('images/textbox/top_arrow.png').setSize(this.game.getFullSize(0.4).width, this.game.getFullSize(0.40).height)
		.setPosition(position.x, position.y-15).setOpacity(1);	
	
	this.windowLayer.appendChild(this.w).appendChild(this.text);//.appendChild(textbox).appendChild(text);
	this.game.sceneClone.windowLayer.appendChild(this.windowLayer);
	
	// Listen to the Clone
	goog.events.listenOnce(this.game.source,this.game.EventType.CLONE_DETAILS,goog.partial(this.buttonAction,this.game.introduction));
}

// Sixt screen: start cloning from clone details screen
farming.Introduction.prototype.intro6 = function(){
	var position = {x: this.center.x-200,y: this.center.y + this.game.getFullSize(0.30).height};

	this.text.setFontWeight('bold').setPosition(position.x - 40, position.y-10).setText(
			"Click on Clone to \n clone a new crop");
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
			"Click on empty \n tiles to plant \n the cloned crop. \n\n Shut down the \n screen above to \n stop cloning.");
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
			.setSize(this.game.getFullSize(0.40).width, this.game.getFullSize(0.3).height).setPosition(475,135);
	var text = new lime.Label().setFontSize(18).setMultiline(true);
	text.setFontWeight('bold').setPosition(475,135).setText(
			"Here you see all the \n available challenges that \n you can do.");

	this.text.setFontWeight('bold').setPosition(position.x + 25, position.y - 5).setText(
			"Click on Details to see more \n details about the Challenge");
	this.w.setFill('images/textbox/top_arrow.png').setSize(this.game.getFullSize(0.35).width, this.game.getFullSize(0.30).height)
		.setPosition(position.x + 25, position.y-30).setOpacity(1);	
	
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
			.setSize(this.game.getFullSize(0.35).width, this.game.getFullSize(0.3).height).setPosition(position.x - 340,position.y+45);
	var text = new lime.Label().setFontSize(18).setMultiline(true);
	text.setFontWeight('bold').setPosition(position.x - 340,position.y + 45).setText(
			"Here you see all the \n details of the challenge. \n \n Beware: starting the challenge \n removes the required items \n from your inventory. ");
	
	this.text.setFontWeight('bold').setPosition(position.x + 120, position.y - 40).setText(
			"Press Start to begin \n the exercise.");
	this.w.setFill('images/textbox/down_right_arrow.png').setSize(this.game.getFullSize(0.3).width, this.game.getFullSize(0.35).height)
		.setPosition(position.x + 120, position.y - 10).setOpacity(1);	
	
	// These layers will be deleted, since the sceneChallengeDetails object is recreated every time
	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(textbox).appendChild(text);
	this.game.sceneChallengeDetails.windowLayer.appendChild(this.windowLayer);	
	
	// Listen to the Clone
	goog.events.listenOnce(this.game.source,this.game.EventType.DO_CHALLENGE,goog.partial(this.buttonAction,this.game.introduction));
}

// 11th screen: 
farming.Introduction.prototype.intro11 = function(){
	
	var position = {x: this.center.x - 210, y: this.center.y + this.game.getFullSize(0.15).height};
	this.text.setFontWeight('bold').setPosition(position.x - 35, position.y + 10).setText(
			"Press Do to start the \n exercise and earn \n 6 legs points.");
	this.w.setFill('images/textbox/top_arrow.png').setSize(this.game.getFullSize(0.3).width, this.game.getFullSize(0.3).height)
		.setPosition(position.x - 35, position.y - 20).setOpacity(1);	
	
	// These layers will be deleted, since the sceneChallengeDetails object is recreated every time
	this.windowLayer.appendChild(this.w).appendChild(this.text);
	this.game.sceneChallengeDetails.windowLayer.appendChild(this.windowLayer);	
	
	// Listen to the Clone
	goog.events.listenOnce(this.game.source,this.game.EventType.PRESSED_DO,goog.partial(this.buttonAction,this.game.introduction));
}

// 12th screen: open body screen
farming.Introduction.prototype.intro12 = function(){
	
	var position = {x: this.center.x+20,y: this.center.y + 150};
	this.text.setFontWeight('bold').setPosition(position.x + 0, position.y-45).setText(
			"Congratulations! You completed \n your first challenge. \n \n Check out your progress \n in the BODY screen");
	this.w.setFill('images/textbox/down_arrow.png').setSize(this.game.getFullSize(0.40).width, this.game.getFullSize(0.4).height)
		.setPosition(position.x, position.y -15 ).setOpacity(0.8);		
	
	this.introLayer.appendChild(this.w).appendChild(this.text);
	// Listen to open BODY
	goog.events.listenOnce(this.game.source,this.game.EventType.OPEN_BODY,goog.partial(this.buttonAction,this.game.introduction));
}

// 13th screen: Click the statistics button
farming.Introduction.prototype.intro13 = function(){
	
	var position = {x: this.center.x + 75, y: this.center.y + this.game.getFullSize(0.1).height};

	var textbox = new lime.Sprite().setFill('images/textbox/no_arrow.png')
			.setSize(this.game.getFullSize(0.33).width, this.game.getFullSize(0.7).height).setPosition(position.x - 335,position.y-30);
	var text = new lime.Label().setFontSize(16).setMultiline(true);
	text.setFontWeight('bold').setPosition(position.x - 335,position.y - 30).setText(
			"This is the BODY: your \n Bionic Outer Dimension Yeosuit. \n" +
		    "It represents you and is based \n on the exercises you have done \n in this game. \n\n" +
		    " When you click on a bodypart \n you can see" +
		    " how much \n you have trained that part \n of your own body. \n\n" +
		    " As you level up your BODY, \n more challenges and clones \n will become available!")	
	
	this.text.setFontWeight('bold').setPosition(position.x + 195, position.y - 0).setText(
			"Press Statistics \n to see the exercise \n you did in the past.");
	this.w.setFill('images/textbox/down_right_arrow.png').setSize(this.game.getFullSize(0.25).width, this.game.getFullSize(0.3).height)
		.setPosition(position.x + 195, position.y + 30).setOpacity(1);	
	
	// These layers will be deleted, since the sceneChallengeDetails object is recreated every time
	this.windowLayer.appendChild(this.w).appendChild(this.text).appendChild(textbox).appendChild(text);
	this.game.sceneBody.windowLayer.appendChild(this.windowLayer);	
	
	// Listen to the action
	goog.events.listenOnce(this.game.source,this.game.EventType.SHOW_BODYSTATS,goog.partial(this.buttonAction,this.game.introduction));
}

*/

// Wait function, awaits an event to be fired before it continues
farming.Introduction.prototype.waiter = function(scene){
	
	// Wait for a challenge to be completed, then go to intro12, pass "this" as fifth element
	goog.events.listenOnce(scene.game.source,scene.game.EventType.COMPLETE_CHALLENGE,scene.intro12,false,scene);
}
