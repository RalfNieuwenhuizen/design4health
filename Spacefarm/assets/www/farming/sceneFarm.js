/**
 *
 */
goog.provide('farming.SceneFarm');

goog.require('lime.Sprite');
goog.require('farming.Item');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Scene');

/**
 * Scene elements
 *
 */
farming.SceneFarm = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    var w = new lime.Sprite().setFill('#f0f0f0').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.5);
    this.title.setText('Inventory');

    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(center.x + game.getFullSize(0.325).width, center.y - game.getFullSize(0.31).height)
        .setSize(30,30);
    this.closeButton.setAction(this.closeFarm, this);

    this.windowLayer
        .appendChild(w).appendChild(this.title)
        .appendChild(this.closeButton);

    this.redraw(this.game.player.inventory);
}
goog.inherits(farming.SceneFarm, farming.Scene);

farming.SceneFarm.prototype.game = null;

farming.SceneFarm.prototype.closeFarm = function(scene) {
    scene.game.closeFarm();
}
// redraw the inventory
farming.SceneFarm.prototype.redraw = function (inventory) {
    var center = this.game.getCenterPosition();
    var items = 0;
    var obj = Object.keys(inventory);
    for (var item in obj) {
        if (obj.hasOwnProperty(item)) {
            // or if (Object.prototype.hasOwnProperty.call(obj,prop)) for safety...
            console.log("item: " + obj[item] + " value: " + inventory[obj[item]]);
            if (inventory[obj[item]]) {
                this.drawItem(obj[item], inventory[obj[item]], new goog.math.Coordinate(items * 60 + center.x * 0.4, center.y * 0.65));
                items++;
            }
        }
    }
}
farming.SceneFarm.prototype.drawItem = function (item, number, position) {
    var prop = ITEMS[item];
    var itemIcon = new lime.Sprite().setFill('images/items/'+item+'.png').setSize(50, 50).setPosition(position);
    var itemLabel = new lime.Label().setText(number).setSize(10, 10).setPosition(position.x + 20, position.y - 20);
    //TODO sell button and stuff
    this.windowLayer.appendChild(itemIcon).appendChild(itemLabel);
}