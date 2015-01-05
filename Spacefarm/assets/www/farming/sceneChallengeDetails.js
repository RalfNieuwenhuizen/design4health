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
    var w = new farming.Sprite(SETTINGS.color.background_layer).preventClickThrough()
        .setSize(SETTINGS.size.background_layer).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.description = new lime.Label().setPosition(center.x, center.y * 0.45).setMultiline(true);

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.backButton = new farming.Button('Back').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.left_button)
        .setSize(SETTINGS.size.button);
    this.giveUpButton = new farming.Button('Give up').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.left_button)
        .setSize(SETTINGS.size.button).setHidden(true);
    this.selectButton = new farming.Button('Start').setColor(SETTINGS.color.button_primary)
        .setPosition(SETTINGS.position.right_button)
        .setSize(SETTINGS.size.button).setHidden(true);
    this.completeButton = new farming.Button('Complete!').setColor(SETTINGS.color.button_primary)
        .setPosition(SETTINGS.position.center_button)
        .setSize(SETTINGS.size.button).setHidden(true);

    this.windowLayer
        .appendChild(w).appendChild(this.title).appendChild(this.description)
        .appendChild(this.selectButton)
        .appendChild(this.closeButton)
        .appendChild(this.giveUpButton)
        .appendChild(this.completeButton)
        .appendChild(this.backButton);

    this.closeButton.setAction(this.closeChallengeDetails, this);
    this.backButton.setAction(this.backChallengeDetails, this);
    this.giveUpButton.setAction(this.giveUpChallenge, this);
    this.completeButton.setAction(this.completeChallenge, this);
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
farming.SceneChallengeDetails.prototype.showExercise = function (input) {
    input.scene.game.showExercise(input.exercise);
    input.scene.game.source.dispatchEvent(input.scene.game.EventType.PRESSED_DO);
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
    this.description.setText(challenge.description + "\n" + farming.Challenge.prototype.bodypart(challenge.type));
    if(opt_active) {
        this.backButton.setHidden(true);
        this.giveUpButton.setHidden(false);
        this.selectButton.setHidden(true);
        if (this.challengeDone()) {
            lime.scheduleManager.callAfter(function() {
                this.completeChallenge(this);
            }, this, 1000);
        }
    } else if (this.sufficientItems()) {
        this.selectButton.setAction(this.selectChallenge, {
            'challenge': challenge,
            'scene': this
        }).setHidden(false);
    }

    var center = this.game.getCenterPosition();
    var items = 0;
    var rewards = 0;
    var exercises = 0;
    for(var i in challenge.requirements) {
        var requirement = challenge.requirements[i];
        if(requirement.type === 'item' && !opt_active) {
            this.drawItem(requirement, new goog.math.Coordinate(items * 50 + center.x*0.5, center.y * 0.73), opt_active);
            items++;
        } else if(requirement.type === 'exercise') {
            this.drawExercise(requirement, new goog.math.Coordinate(center.x*0.55, center.y * (1 - (opt_active * 0.17)) + exercises * (opt_active ? 40 : 20)), opt_active);
            exercises++;
        }
    }
    for(var i in challenge.rewards) {
        var reward = challenge.rewards[i];
        if((reward.type === 'item' || reward.type === 'coins') && !opt_active) {
            this.drawReward(reward, new goog.math.Coordinate(rewards * 50 + center.x*1.5, center.y * 0.73));
            rewards++;
        }
    }
    if(items){
        var itemsLabel = new lime.Label('Items required').setPosition(120, center.y * 0.68)
            .setFontWeight(800).setFontSize(13).setAlign('left').setSize(100,10);
        this.drawLayer.appendChild(itemsLabel);
    }
    if(rewards){
        var rewardsLabel = new lime.Label('Rewards').setPosition(550, center.y * 0.68)
            .setFontWeight(800).setFontSize(13).setAlign('left').setSize(100,10);
        this.drawLayer.appendChild(rewardsLabel);
    }
    if(exercises) {
        var exercisesLabel = new lime.Label('Exercises').setPosition(120, center.y * (opt_active ? 0.63 :0.92))
            .setFontWeight(800).setFontSize(13).setAlign('left').setSize(100,10);
        this.drawLayer.appendChild(exercisesLabel);
    }
};

farming.SceneChallengeDetails.prototype.drawItem = function (item, position, opt_active) {
    var itemIcon = new lime.Sprite().setFill('images/items/'+item.key+'.png').setSize(30, 30).setPosition(position);
    var itemLabel = new lime.Label().setText(item.number).setSize(10, 10).setPosition(position.x + 18, position.y - 15);

    if(!opt_active) {
        var currentNumber = this.game.getInventory(item.key);
        var color = currentNumber >= item.number ? SETTINGS.color.green : SETTINGS.color.red;
        itemLabel.setText(currentNumber + '/' + item.number).setFontColor(color);
    }

    this.drawLayer.appendChild(itemIcon).appendChild(itemLabel);
}
farming.SceneChallengeDetails.prototype.drawReward = function (reward, position) {
    var image = reward.type === 'coins' ? 'images/coin_small/0.png' : 'images/items/'+reward.key+'.png'
    var itemIcon = new lime.Sprite().setFill(image).setSize(30, 30).setPosition(position);
    var itemLabel = new lime.Label().setText(reward.number).setSize(10, 10).setPosition(position.x + 18, position.y - 15);

    this.drawLayer.appendChild(itemIcon).appendChild(itemLabel);
}
farming.SceneChallengeDetails.prototype.drawExercise = function (exercise, position, opt_active) {
    var props = EXERCISES[exercise.key];
    var exerciseName = new lime.Label().setText('- ' + exercise.name + ' - ' + props.points + ' ' + props.type + (props.points > 1 ? ' points' : ' point'))
        .setAlign('left').setSize(300, 10).setPosition(position.x + 80, position.y);
    var doButton = new farming.Button('Do!').setColor(SETTINGS.color.button_primary)
        .setPosition(position.x - 115, position.y)
        .setSize(SETTINGS.size.button_small).setHidden(true);
    var doneLabel = new farming.Label('\nDone!').setFontWeight(SETTINGS.font.subtitle.weight)
        .setPosition(position.x - 115, position.y)
        .setSize(SETTINGS.size.button_small).setMultiline(true).setHidden(true);

    // there is an active challenge
    if(opt_active) {
        if (!this.game.player.currentChallenge.exercisesDone)
            this.game.player.currentChallenge.exercisesDone = [];
        if (this.exerciseDone(exercise.key)) {
            doneLabel.setHidden(false);
        } else if (this.exerciseDoable(exercise.key)) {
            doButton.setAction(this.showExercise, {
                'exercise': exercise.key,
                'scene': this
            }).setHidden(false);
        }
    }

    this.drawLayer.appendChild(exerciseName).appendChild(doButton).appendChild(doneLabel);

}

// return true iff all items required for this challenge are available
farming.SceneChallengeDetails.prototype.sufficientItems = function () {
    for(var i in this.challenge.requirements) {
        var requirement = this.challenge.requirements[i];
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