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
    this.w = SETTINGS.createWindow();
    this.o = SETTINGS.createOverlay();
    this.title = SETTINGS.createTitle('BODY');
    this.description = new lime.Label('Bionic Outer Dimension Yeosuit')
        .setPosition(SETTINGS.position.title.x, SETTINGS.position.title.y+20).setMultiline(true).setFontSize(15);

    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeBody, this);

    this.statsButton = new farming.Button('Statistics').setColor('#999999')
        .setPosition(SETTINGS.position.right_button)
        .setSize(SETTINGS.size.button);
    this.statsButton.setAction(this.showStats, this);

    this.windowLayer
        .appendChild(this.o)
        .appendChild(this.w)
        .appendChild(SETTINGS.createTitleImage('body'))
        .appendChild(this.description)
        .appendChild(this.statsButton)
        .appendChild(this.closeButton);
    this.body = new farming.Body(1.25, this.game);
    this.windowLayer.appendChild(this.body);
}
goog.inherits(farming.SceneBody, farming.Scene);

farming.SceneBody.prototype.game = null;

farming.SceneBody.prototype.closeBody = function(scene) {
    scene.game.close();
}
farming.SceneBody.prototype.showStats = function(scene) {
    scene.game.showStats();
    scene.game.source.dispatchEvent(scene.game.EventType.SHOW_BODYSTATS);
}

farming.SceneBody.prototype.redraw = function(body) {
    if (this.body)
        this.body.redraw(body, new goog.math.Coordinate(this.game.getCenterPosition().x, this.game.getCenterPosition().y+5));
}
