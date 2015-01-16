/**
 *
 */
goog.provide('farming.SceneChallengeDetails');

goog.require('lime.Sprite');
goog.require('farming.Exercise');
goog.require('farming.Challenge');
goog.require('farming.Item');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Scene');

/**
 * Scene elements
 *
 */
farming.SceneChallengeDetails = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    this.w = SETTINGS.createWindow();
    this.o = SETTINGS.createOverlay();
    this.title = SETTINGS.createTitle('Challenge');
    this.description = new lime.Label().setPosition(center.x, center.y * 0.46).setMultiline(true)
        .setFontSize(16);
    this.insufficient = new lime.Label().setSize(220,70).setPosition(630,360).setMultiline(true)
        .setFontSize(19).setFontWeight(600).setFontColor('#877b72').setText('Required items missing,\n harvest them first!').setHidden(true);
    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.backButton = new farming.Button('Back').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.left_button)
        .setSize(SETTINGS.size.button);
    this.giveUpButton = new farming.Button('Give up').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.left_button)
        .setSize(SETTINGS.size.button).setHidden(true);
    this.startNextButton = new farming.Button('Start').setColor(SETTINGS.color.button_primary)
        .setPosition(SETTINGS.position.right_button)
        .setSize(SETTINGS.size.button).setHidden(true);
    this.selectButton = new farming.Button('Accept').setColor(SETTINGS.color.button_primary)
        .setPosition(SETTINGS.position.right_button)
        .setSize(SETTINGS.size.button).setHidden(true);

    this.windowLayer
        .appendChild(this.o)
        .appendChild(this.w).appendChild(this.title).appendChild(this.description)
        .appendChild(this.insufficient)
        .appendChild(this.selectButton)
        .appendChild(this.closeButton)
        .appendChild(this.giveUpButton)
        .appendChild(this.startNextButton)
        .appendChild(this.backButton);

    this.closeButton.setAction(this.closeChallengeDetails, this);
    this.backButton.setAction(this.backChallengeDetails, this);
    this.giveUpButton.setAction(this.giveUpChallenge, this);
    this.startNextButton.setAction(this.startNextExercise, this);
}
goog.inherits(farming.SceneChallengeDetails, farming.Scene);

farming.SceneChallengeDetails.prototype.game = null;

farming.SceneChallengeDetails.prototype.closeChallengeDetails = function (scene) {
    scene.game.close();
}
farming.SceneChallengeDetails.prototype.backChallengeDetails = function (scene) {
    scene.game.backChallengeDetails();
}
farming.SceneChallengeDetails.prototype.giveUpChallenge = function (scene) {
    scene.game.giveUpChallenge();
}
farming.SceneChallengeDetails.prototype.completeChallenge = function (scene) {
    scene.game.completeChallenge();
    scene.game.source.dispatchEvent(scene.game.EventType.COMPLETE_CHALLENGE);
}
farming.SceneChallengeDetails.prototype.selectChallenge = function (input) {
    input.scene.game.selectChallenge(input.challenge);
    input.scene.game.source.dispatchEvent(input.scene.game.EventType.DO_CHALLENGE);
}

farming.SceneChallengeDetails.prototype.startNextExercise = function (scene) {
    scene.game.showExercise(scene.getNextExercise());
    scene.game.source.dispatchEvent(scene.game.EventType.PRESSED_DO);
}
// update the screen -- set opt_active true iff there is an active challenge
farming.SceneChallengeDetails.prototype.setChallenge = function (challenge, opt_active) {
    if(this.drawLayer)
        this.windowLayer.removeChild(this.drawLayer);
    this.drawLayer = new lime.Layer();
    this.windowLayer.appendChild(this.drawLayer);

    this.challenge = challenge;
    var title = opt_active ? 'Current challenge: '+challenge.name : challenge.name;
    this.title.setText(title);
    this.description.setText(challenge.description);

    this.selectButton.setHidden(true);
    this.backButton.setHidden(false);
    this.giveUpButton.setHidden(true);
    this.startNextButton.setHidden(true);
    this.insufficient.setHidden(true);
    if(opt_active) {
        this.o.setHidden(false);
        this.backButton.setHidden(true);
        this.giveUpButton.setHidden(false);
        this.startNextButton.setHidden(false);
        if (this.challengeDone()) {
            this.giveUpButton.setHidden(true);
            this.startNextButton.setHidden(true);
            this.completeChallenge(this);
            this.game.sceneFeedback.closeFeedback();
        } else {
            this.startNextButton.setText(this.challengeStarted() ? 'Start next\nexercise': 'Start');
        	if(this.game.sceneMap.activeButton == 'challenge'){
                var underLayer = SETTINGS.createWindow().setOpacity(0.6);
                this.game.sceneFeedback.windowLayer.appendChild(underLayer);
            	goog.events.listen(underLayer, ['mousedown', 'touchstart'], function (e) {
            		this.game.sceneFeedback.closeFeedback();
            	 },false,this);
        	}
    	}
    } else if (this.sufficientItems(challenge)) {
        this.o.setHidden(true);
        this.selectButton.setAction(this.selectChallenge, {
            'challenge': challenge,
            'scene': this
        }).setHidden(false);
        this.insufficient.setHidden(true);
    } else {
        this.insufficient.setHidden(false);
    }

    var center = this.game.getCenterPosition();
    var items = 0;
    var rewards = 0;
    var exercises = 0;
    for(var i in challenge.requirements) {
        var requirement = challenge.requirements[i];
        if(requirement.type === 'item' && !opt_active) {
            this.drawItem(requirement, new goog.math.Coordinate(items * 100 + center.x*0.5, center.y * 0.73+7), opt_active);
            items++;
        } else if(requirement.type === 'exercise') {
            this.drawExercise(requirement, exercises, opt_active);
            exercises++;
        }
    }
    for(var i in challenge.rewards) {
        var reward = challenge.rewards[i];
        if((reward.type === 'item' || reward.type === 'coins') && !opt_active) {
            this.drawReward(reward, new goog.math.Coordinate(rewards * 100 + center.x*1.55, center.y * 0.72+7));
            rewards++;
        }
    }
    if(items){
        var itemsLabel = new lime.Label('Item cost').setPosition(126, center.y * 0.70+7)
            .setFontWeight(SETTINGS.font.subtitle.weight).setFontSize(SETTINGS.font.subtitle.size).setAlign('left').setSize(100,10);
        this.drawLayer.appendChild(itemsLabel);
    }
    if(rewards){
        var rewardsLabel = new lime.Label('Rewards').setPosition(550, center.y * 0.70+7)
            .setFontWeight(SETTINGS.font.subtitle.weight).setFontSize(SETTINGS.font.subtitle.size).setAlign('left').setSize(100,10);
        this.drawLayer.appendChild(rewardsLabel);
    }
    if(exercises) {
        var exercisesLabel = new lime.Label('Exercises').setPosition(120, 200)
            .setFontWeight(SETTINGS.font.subtitle.weight).setFontSize(SETTINGS.font.subtitle.size).setAlign('left').setSize(100,10);
        this.drawLayer.appendChild(exercisesLabel);
    }
};

farming.SceneChallengeDetails.prototype.drawItem = function (item, position, opt_active) {
    var currentNumber = this.game.getInventory(item.key);
    var itemIcon = new lime.Sprite().setFill('images/items/'+item.key+'.png').setSize(60, 60).setPosition(position);
    var itemNeeded = new lime.Label().setText(item.number).setText(item.number).setAlign('left')
        .setFontSize(SETTINGS.font.subtitle.size).setSize(30, 20).setPosition(position.x + 40, position.y - 15).setFontSize(22).setFontWeight(600);
    var itemStock = new lime.Label().setText(item.number).setText(currentNumber + '/').setAlign('right').setFontColor('#ffffff')
        .setFontSize(SETTINGS.font.subtitle.size).setSize(30, 20).setPosition(position.x + 8, position.y - 11).setFontSize(17);
    var itemCircle = new lime.Circle().setSize(40,40).setPosition(position.x+23, position.y - 13);
    itemCircle.setFill(currentNumber >= item.number ? '#7cc437' : '#de5959');
    this.drawLayer.appendChild(itemIcon).appendChild(itemCircle).appendChild(itemStock).appendChild(itemNeeded);

}
farming.SceneChallengeDetails.prototype.drawReward = function (reward, position) {
    var image = reward.type === 'coins' ? 'images/coin_small/0.png' : 'images/items/'+reward.key+'.png'
    var itemIcon = new lime.Sprite().setFill(image).setSize(60, 60).setPosition(position);
    var itemLabel = new lime.Label().setText(reward.number).setFontSize(26).setSize(30, 30).setPosition(position);

    this.drawLayer.appendChild(itemIcon).appendChild(itemLabel);
}
farming.SceneChallengeDetails.prototype.drawExercise = function (exercise, index, opt_active) {
    var props = EXERCISES[exercise.key];
    var position = new goog.math.Coordinate(460, 207+index*30);
    var exerciseName = new lime.Label().setText(exercise.name + ' - ' + props.points + ' ' + props.type + (props.points > 1 ? ' points' : ' point'))
        .setAlign('left').setSize(500, 10).setPosition(position.x, position.y - 5).setFontSize(SETTINGS.font.text);
    var check = new farming.Sprite('images/checkbox_false.png').setSize(30,30).setPosition(190, position.y);
    /*var doButton = new farming.Button('Do!').setColor(SETTINGS.color.button_primary)
        .setPosition(position.x - 115, position.y)
        .setSize(SETTINGS.size.button_small).setHidden(true);*/
    /*var doneLabel = new farming.Label('\nDone!').setFontWeight(SETTINGS.font.subtitle.weight)
        .setPosition(position.x - 115, position.y)
        .setSize(SETTINGS.size.button_small).setMultiline(true).setHidden(true);*/

    // there is an active challenge
    if(opt_active && this.game.player.currentChallenge) {
        if (!this.game.player.currentChallenge.exercisesDone)
            this.game.player.currentChallenge.exercisesDone = [];
        if (this.exerciseDone(exercise.key)) {
            check.setFill('images/checkbox_true.png');
        }
    }

    this.drawLayer.appendChild(exerciseName).appendChild(check);

}

// return true iff all items required for this challenge are available
farming.SceneChallengeDetails.prototype.sufficientItems = function (challenge) {
    for(var i in challenge.requirements) {
        var requirement = challenge.requirements[i];
        if(requirement.type === 'item') {
            if(!this.game.hasItem(requirement.key, requirement.number))
                return false;
        }
    }
    return true;
}

// return true iff exercise is done
farming.SceneChallengeDetails.prototype.exerciseDone = function (exercise) {
    return this.game.player.currentChallenge.exercisesDone.indexOf(exercise) > -1;
}

// return true iff exercise is not yet done and prerequisite are fullfilled.
farming.SceneChallengeDetails.prototype.exerciseDoable = function (exercise) {
    for(var i in this.challenge.requirements) {
        var requirement = this.challenge.requirements[i];
        if(requirement.type === 'exercise') {
            if(requirement.key != exercise && !this.exerciseDone(requirement.key))
                return false;
            else
                return !this.exerciseDone(exercise);
        }
    }
    return true;
}
// return true iff exercise is not yet done and prerequisite are fullfilled.
farming.SceneChallengeDetails.prototype.getNextExercise = function () {
    for(var i in this.challenge.requirements) {
        var requirement = this.challenge.requirements[i];
        if(requirement.type === 'exercise' && !this.exerciseDone(requirement.key)) {
            return requirement.key;
        }
    }
    return null;
}
farming.SceneChallengeDetails.prototype.challengeDone = function () {
    for(var i in this.challenge.requirements) {
        var requirement = this.challenge.requirements[i];
        if(requirement.type === 'exercise') {
            if(!this.exerciseDone(requirement.key))
                return false;
        }
    }
    return true;
}
farming.SceneChallengeDetails.prototype.challengeStarted = function () {
    for(var i in this.challenge.requirements) {
        var requirement = this.challenge.requirements[i];
        if(requirement.type === 'exercise') {
            if(this.exerciseDone(requirement.key))
                return true;
        }
    }
    return false;
}