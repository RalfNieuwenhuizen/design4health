/**
 *
 */
goog.provide('farming.SceneBody');

goog.require('lime.Sprite');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Scene');
goog.require('farming.Body');

/**
 * Scene elements
 *
 */
farming.SceneBody = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    var w = new lime.Sprite().setFill(SETTINGS.color.background_layer).setSize(SETTINGS.size.background_layer).setPosition(game.getCenterPosition());
    this.title = new farming.Label('BODY').setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.description = new lime.Label('This is the BODY, your Bionic Outer Dimension Yeosuit. \n' +
    ' It represents you, \n and the exercises you have done in this game. \n' +
    ' When you look at the levels of each bodypart, \n' +
    'you can see how much you have trained that part of your own body. \n' +
    ' As you level up your BODY, \n more challenges and clones will become available!')
        .setPosition(center.x - 140, center.y).setMultiline(true).setFontSize(15);

    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeBody, this);

    this.statsButton = new farming.Button('Statistics').setColor('#999999')
        .setPosition(SETTINGS.position.right_button)
        .setSize(SETTINGS.size.button);
    this.statsButton.setAction(this.showStats, this);

    this.windowLayer
        .appendChild(w)
        .appendChild(this.title)
        .appendChild(this.description)
        .appendChild(this.statsButton)
        .appendChild(this.closeButton);

    this.body = new farming.Body(1.3);
    this.windowLayer.appendChild(this.body);
}
goog.inherits(farming.SceneBody, farming.Scene);

farming.SceneBody.prototype.game = null;

farming.SceneBody.prototype.closeBody = function(scene) {
    scene.game.close();
}
farming.SceneBody.prototype.showStats = function(scene) {
    scene.game.showStats();
}

farming.SceneBody.prototype.redraw = function(body) {
    if (this.body)
        this.body.redraw(body, new goog.math.Coordinate(this.game.getCenterPosition().x + 150, this.game.getCenterPosition().y));
}
