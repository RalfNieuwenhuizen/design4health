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
    this.description = new lime.Label('').setPosition(center.x - 200, center.y).setMultiline(true).setFontSize(20).setAlign('right');

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
    /* //Set descriptive text
    var obj = Object.keys(body);
    var text = "";
    for (var item in obj) {
        if (obj.hasOwnProperty(item)) {
            text += obj[item] + " level " + this.body.getLevel(body[obj[item]]) + ": " + body[obj[item]] + "/" + this.body.getTargetXP(body[obj[item]]) + " points" + "\n\n";
        }
    }
    this.description.setText(text);*/

    if (this.body)
        this.body.redraw(body, new goog.math.Coordinate(this.game.getCenterPosition().x, this.game.getCenterPosition().y));
}
