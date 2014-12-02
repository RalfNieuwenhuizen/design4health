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
        .setPosition(center.x + game.getFullSize(0.3).width, center.y - game.getFullSize(0.3).height)
        .setSize(20,20);
    this.backButton = new farming.Button('Back').setColor('#999999')
        .setPosition(center.x + 10 - game.getFullSize(0.3).width, center.y + game.getFullSize(0.3).height)
        .setSize(80,20);
    this.cancelButton = new farming.Button('Give up').setColor('#999999')
        .setPosition(center.x + 10 - game.getFullSize(0.3).width, center.y + game.getFullSize(0.3).height)
        .setSize(80,20).setHidden(true);
    this.selectButton = new farming.Button('Select').setColor('#2222CC')
        .setPosition(center.x - 10 + game.getFullSize(0.3).width, center.y + game.getFullSize(0.3).height)
        .setSize(80,20).setHidden(true);

    this.windowLayer
        .appendChild(w).appendChild(this.title).appendChild(this.description)
        .appendChild(this.selectButton)
        .appendChild(this.closeButton)
        .appendChild(this.cancelButton)
        .appendChild(this.backButton);

    this.closeButton.setAction(this.game.closeChallengeDetails, this.game);
    this.backButton.setAction(this.game.backChallengeDetails, this.game);
    this.cancelButton.setAction(this.game.cancelChallenge, {'challenge': this.game.currentChallenge, 'game': this.game});
}
goog.inherits(farming.SceneChallengeDetails, farming.Scene);

farming.SceneChallengeDetails.prototype.game = null;
farming.SceneChallengeDetails.prototype.challenge = null;
farming.SceneChallengeDetails.prototype.exercisesDone = null;

farming.SceneChallengeDetails.prototype.setChallenge = function (challenge, opt_active) {
    this.challenge = challenge;
    var title = opt_active ? 'Current challenge: '+challenge.name : challenge.name;
    this.title.setText(title);
    this.description.setText(challenge.description + "\n" + farming.Challenge.prototype.bodypart(challenge.type));
    if(opt_active) {
        this.backButton.setHidden(true);
        this.cancelButton.setHidden(false);
        this.exercisesDone = challenge.exercisesDone;
    } else {
        this.selectButton.setAction(this.game.selectChallenge, {
            'challenge': challenge,
            'game': this.game
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

    if(opt_active) {
        var currentNumber = this.game.getInventory(item.key);
        var color = currentNumber >= item.number ? '#22CC22' : '#CC2222';
        itemLabel.setText(currentNumber + '/' + item.number).setFontColor(color);
    }
    this.windowLayer.appendChild(itemIcon).appendChild(itemLabel);
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
        .setPosition(position.x + 50, position.y + 95)
        .setSize(80,20).setHidden(true);

    var numberIcon = new lime.Sprite().setSize(10, 10).setPosition(position.x - 130, position.y * 1.35);
    var numberLabel = new lime.Label().setSize(10, 10).setPosition(position.x - 110, position.y * 1.35);
    if(props.repetitions) {
        numberIcon.setFill('images/repetitions.png');
        numberLabel.setText(props.repetitions);
    } else if (props.duration) {
        numberIcon.setFill('images/duration.png');
        numberLabel.setText(props.duration + '\"');
    }

    if(opt_active) {
        doButton.setHidden(false);
        if (this.exercisesDone && this.exercisesDone[exercise]) {
            doButton.setColor('#22CC22');
        } else if (this.sufficientItems()) {
            doButton.setAction(this.game.doExercise, {
                'exercise': exercise,
                'game': this.game
            }).setColor('#2222CC');
        }
    }

    this.windowLayer.appendChild(exerciseIcon).appendChild(exerciseName).appendChild(exerciseDescription)
        .appendChild(numberIcon).appendChild(numberLabel).appendChild(doButton);

}

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