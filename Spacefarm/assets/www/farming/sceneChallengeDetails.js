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
    var w = new lime.Sprite().setFill('#f0f0f0').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.38);
    this.description = new lime.Label().setPosition(center.x, center.y * 0.5).setMultiline(true);

    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(center.x + game.getFullSize(0.325).width, center.y - game.getFullSize(0.31).height)
        .setSize(30,30);
    this.backButton = new farming.Button('Back').setColor('#999999')
        .setPosition(center.x - game.getFullSize(0.31).width, center.y + game.getFullSize(0.31).height)
        .setSize(50,30);
    this.giveUpButton = new farming.Button('Give up').setColor('#999999')
        .setPosition(center.x + 5 - game.getFullSize(0.31).width, center.y + game.getFullSize(0.31).height)
        .setSize(60,30).setHidden(true);
    this.selectButton = new farming.Button('Select').setColor('#2222CC')
        .setPosition(center.x + game.getFullSize(0.31).width, center.y + game.getFullSize(0.31).height)
        .setSize(50,30).setHidden(true);
    this.completeButton = new farming.Button('Complete!').setColor('#22CC22')
        .setPosition(center.x, center.y + game.getFullSize(0.31).height)
        .setSize(80,30).setHidden(true);

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
    scene.game.closeChallengeDetails();
}
farming.SceneChallengeDetails.prototype.backChallengeDetails = function (scene) {
    scene.game.backChallengeDetails();
}
farming.SceneChallengeDetails.prototype.giveUpChallenge = function (scene) {
    scene.game.giveUpChallenge();
}
farming.SceneChallengeDetails.prototype.completeChallenge = function (scene) {
    scene.game.completeChallenge();
}
farming.SceneChallengeDetails.prototype.selectChallenge = function (input) {
    input.scene.game.selectChallenge(input.challenge);
}
farming.SceneChallengeDetails.prototype.showExercise = function (input) {
    input.scene.game.showExercise(input.exercise);
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
    } else {
        this.selectButton.setAction(this.selectChallenge, {
            'challenge': challenge,
            'scene': this
        }).setHidden(false);
    }

    var center = this.game.getCenterPosition();
    var items = 0;
    var exercises = 0;
    for(var i in challenge.requirements) {
        var requirement = challenge.requirements[i];
        if(requirement.type === 'item') {
            this.drawItem(requirement, new goog.math.Coordinate(items * 40 + center.x*0.4, center.y * 0.65), opt_active)
            items++;
        } else if(requirement.type === 'exercise') {
            this.drawExercise(requirement, new goog.math.Coordinate(exercises * 300 + center.x*0.7, center.y * 1.1), opt_active)
            exercises++;
        }
    }
};

farming.SceneChallengeDetails.prototype.drawItem = function (item, position, opt_active) {
    var itemIcon = new lime.Sprite().setFill('images/items/'+item.key+'.png').setSize(30, 30).setPosition(position);
    var itemLabel = new lime.Label().setText(item.number).setSize(10, 10).setPosition(position.x + 13, position.y - 13);

    // there is an active challenge
    if(opt_active) {
        var currentNumber = this.game.getInventory(item.key);
        var color = currentNumber >= item.number ? '#22CC22' : '#CC2222';
        itemLabel.setText(currentNumber + '/' + item.number).setFontColor(color);
    }
    this.drawLayer.appendChild(itemIcon).appendChild(itemLabel);
}
farming.SceneChallengeDetails.prototype.drawExercise = function (exercise, position, opt_active) {
    var props = EXERCISES[exercise.key];
    var exerciseName = new lime.Label().setText(exercise.name).setSize(190, 10).setPosition(position.x, position.y - 90);
    var exerciseDescription = new lime.Label()
        .setText(props.description + '\n\n' + props.points + ' ' + props.type + ' points.')
        .setFontSize(10).setSize(190, 150).setPosition(position.x + 10, position.y).setMultiline(true).setAlign('left');
    var exerciseIcon = new lime.Sprite().setSize(150, 200).setPosition(position.x - 125, position.y);
    var animation = farming.Exercise.prototype.getAnimation(exercise.key, 0.3);
    exerciseIcon.runAction(animation);
    var doButton = new farming.Button('Do!').setColor('#999999')
        .setPosition(position.x + 70, position.y + 90)
        .setSize(50,30).setHidden(true);

    var numberIcon = new lime.Sprite().setSize(10, 10).setPosition(position.x - 130, position.y * 1.35);
    var numberLabel = new lime.Label().setSize(10, 10).setPosition(position.x - 110, position.y * 1.35);
    if(props.repetitions) {
        numberIcon.setFill('images/repetitions.png');
        numberLabel.setText(props.repetitions);
    } else if (props.duration) {
        numberIcon.setFill('images/duration.png');
        numberLabel.setText(props.duration + '\"');
    }

    // there is an active challenge
    if(opt_active) {
        doButton.setHidden(false);
        if (!this.game.player.currentChallenge.exercisesDone)
            this.game.player.currentChallenge.exercisesDone = [];
        if (this.exerciseDone(exercise.key)) {
            doButton.setColor('#22CC22');
        } else if (this.sufficientItems() && this.exerciseDoable(exercise.key)) {
            doButton.setAction(this.showExercise, {
                'exercise': exercise.key,
                'scene': this
            }).setColor('#2222CC');
        }

        if (this.challengeDone()) {
            //TODO woohoo
            this.giveUpButton.setHidden(true);
            this.completeButton.setHidden(false);
        }
    }

    this.drawLayer.appendChild(exerciseIcon).appendChild(exerciseName).appendChild(exerciseDescription)
        .appendChild(numberIcon).appendChild(numberLabel).appendChild(doButton);

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
        if(requirement.type === 'item') {
            if(!this.game.hasItem(requirement.key, requirement.number))
                return false;
        } else if(requirement.type === 'exercise') {
            if(!this.exerciseDone(requirement.key))
                return false;
        }
    }
    return true;
}