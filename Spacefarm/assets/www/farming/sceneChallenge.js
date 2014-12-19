/**
 *
 */
goog.provide('farming.SceneChallenge');

goog.require('lime.Sprite');
goog.require('farming.Challenge');
goog.require('farming.Exercise');
goog.require('farming.Button');
goog.require('farming.Sprite');
goog.require('lime.Layer');
goog.require('farming.Scene');

/**
 * Scene elements
 *
 */
farming.SceneChallenge = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    this.w = new farming.Sprite(SETTINGS.color.background_layer).preventClickThrough()
        .setSize(SETTINGS.size.background_layer).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.title.setText('Challenges');

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeChallenge, this);

    this.nextButton = new farming.Button('Next').setColor(SETTINGS.color.button)
        .setPosition(300, 160)
        .setSize(SETTINGS.size.button);

    this.prevButton = new farming.Button('Previous').setColor(SETTINGS.color.button)
        .setPosition(-300, 160)
        .setSize(SETTINGS.size.button);
    this.nextButton.setAction(this.nextPage, this);
    this.prevButton.setAction(this.prevPage, this);

    this.windowLayer
        .appendChild(this.w)
        .appendChild(this.title)
        .appendChild(this.closeButton);

    this.page = 1;
    this.redraw();
}
goog.inherits(farming.SceneChallenge, farming.Scene);

farming.SceneChallenge.prototype.game = null;
farming.SceneChallenge.prototype.page = null;

// Set action for the next button
farming.SceneChallenge.prototype.nextPage = function(scene) {
    // If there are no more screens return: safety check
    if(scene.page >= Math.ceil(Object.keys(CHALLENGES).length/6))
        return;

    scene.page += 1;
    scene.redraw();
}

// Set action for the previous button
farming.SceneChallenge.prototype.prevPage = function(scene) {
    // If this is the first screen there is no previous: safety check
    if(scene.page == 1)
        return;

    scene.page -= 1;
    scene.redraw();
}

farming.SceneChallenge.prototype.redraw = function() {
    this.w.removeAllChildren();
    var nItems = Object.keys(CHALLENGES).length;

    for(var i=6*(this.page-1); i < Math.min(nItems, this.page*6); i++) {
        var position = new goog.math.Coordinate( ((i%6)%3)*200 - 200, Math.floor((i%6)/3)*150 - 120);

        var challenge = CHALLENGES[Object.keys(CHALLENGES)[i]];
        if (challenge) {
            this.drawChallenge(challenge, position);
        }
    }

    this.title.setText('Challenges ('+this.page+'/'+Math.ceil(nItems/6)+')');
    if(this.page > 1) {
        this.w.appendChild(this.prevButton);
    }
    if(nItems / this.page > 6) {
        this.w.appendChild(this.nextButton);
    }
}

farming.SceneChallenge.prototype.drawChallenge = function(challenge, position) {
    var challengeIcon = new farming.Sprite('images/challenges/'+challenge.key+'.png')
        .setSize(100, 83).setPosition(position.x, position.y + 3).setAction(this.showChallengeDetails, {'challenge': challenge,'scene': this});
    var challengeTitle = new farming.Label(challenge.name)
        .setPosition(position.x, position.y + 44)
        .setFontSize(SETTINGS.font.subtitle.size).setFontWeight(SETTINGS.font.subtitle.weight);

    // Create button to get details about the icon
    this.detailsButton = new farming.Button('Details').setColor(SETTINGS.color.button).setPosition(position.x,position.y + 70).setSize(SETTINGS.size.button_small);
    this.detailsButton.setAction(this.showChallengeDetails, {'challenge': challenge,'scene': this} );

    this.w.appendChild(challengeIcon).appendChild(challengeTitle);
    if(!this.drawLock(challenge.required_level, position)) {
        this.w.appendChild(this.detailsButton);
    }
}

farming.SceneChallenge.prototype.drawLock = function(required_level, position) {
    if(farming.Body.prototype.getBodyLevel(this.game.player.body) < required_level) {
        var lock = new farming.Sprite('images/lock.png').setOpacity(.75).preventClickThrough()
            .setSize(165, 140).setPosition(position.x, position.y + 30);
        var label = new lime.Label('Level '+required_level).setFontSize(20)
            .setSize(165, 20).setPosition(position.x, position.y + 77);
        this.w.appendChild(lock).appendChild(label);
        return true;
    }
    return false;
}

farming.SceneChallenge.prototype.showChallengeDetails = function(input) {
    input.scene.game.showChallengeDetails(input.challenge);
}
farming.SceneChallenge.prototype.closeChallenge = function(scene) {
    scene.game.close();
}