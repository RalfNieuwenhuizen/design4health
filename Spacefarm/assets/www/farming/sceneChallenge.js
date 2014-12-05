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
    var w = new lime.Sprite().setFill('#f0f0f0').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.5);
    this.title.setText('Challenges');

    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(center.x + game.getFullSize(0.325).width, center.y - game.getFullSize(0.31).height)
        .setSize(30,30);
    this.closeButton.setAction(this.closeChallenge, this);

    this.windowLayer
        .appendChild(w).appendChild(this.title)
        .appendChild(this.closeButton);

    for (var i in this.game.player.challenges) {
        var prop = CHALLENGES[this.game.player.challenges[i]];
        if (prop)
            this.drawChallenge(prop, new goog.math.Coordinate((i % 3) * 150 + 250, Math.floor(i / 3) * 100 + 175))
    }
}
goog.inherits(farming.SceneChallenge, farming.Scene);

farming.SceneChallenge.prototype.game = null;

farming.SceneChallenge.prototype.drawChallenge = function(challengeProps, position) {
    var challengeIcon = new farming.Sprite('images/challenges/'+challengeProps.key+'.png')
        .setSize(100, 60).setPosition(position).setAction(this.showChallengeDetails, {'challenge': challengeProps,'scene': this});
    var challengeTitle = new lime.Label().setPosition(position.x, position.y + 33).setText(challengeProps.name);

    // Create button to get details about the icon
    this.detailsButton = new farming.Button('Details').setColor('#999999').setPosition(new goog.math.Coordinate(position.x,position.y + 50)).setSize(60,20);
    this.detailsButton.setAction(this.showChallengeDetails, {'challenge': challengeProps,'scene': this} );

    this.windowLayer.appendChild(challengeIcon).appendChild(challengeTitle).appendChild(this.detailsButton);
}

farming.SceneChallenge.prototype.showChallengeDetails = function(input) {
    input.scene.game.showChallengeDetails(input.challenge);
}
farming.SceneChallenge.prototype.closeChallenge = function(scene) {
    scene.game.closeChallenge();
}