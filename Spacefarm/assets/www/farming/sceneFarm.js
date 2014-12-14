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
    var w = new lime.Sprite().setFill(SETTINGS.color.background_layer).setSize(SETTINGS.size.background_layer).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.title.setText('Inventory');

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeFarm, this);

    this.windowLayer
        .appendChild(w).appendChild(this.title)
        .appendChild(this.closeButton);

    this.redraw(this.game.player.inventory);
}
goog.inherits(farming.SceneFarm, farming.Scene);

farming.SceneFarm.prototype.game = null;

farming.SceneFarm.prototype.closeFarm = function(scene) {
    console.log('closeFarm is executed');
	scene.game.closeFarm();
}
// redraw the inventory
farming.SceneFarm.prototype.redraw = function (inventory) {
    if(this.drawLayer)
        this.windowLayer.removeChild(this.drawLayer);
    this.drawLayer = new lime.Layer();
    this.windowLayer.appendChild(this.drawLayer);
    var center = this.game.getCenterPosition();
    var items = 0;
    var obj = Object.keys(inventory);
    for (var item in obj) {
        if (obj.hasOwnProperty(item)) {
            if (inventory[obj[item]]) {
                this.drawItem(obj[item], inventory[obj[item]], new goog.math.Coordinate(items * 100 + center.x * 0.3, center.y * 0.65));
                items++;
            }
        }
    }
    if (items == 0) {
        var noItems = new lime.Label('You have not collected any items yet, go harvesting!').setFontSize(14).setPosition(center.x, center.y * 0.7);
        this.drawLayer.appendChild(noItems);
    }
}
farming.SceneFarm.prototype.drawItem = function (item, number, position) {
    var prop = ITEMS[item];
    var itemIcon = new lime.Sprite().setFill('images/items/'+item+'.png').setSize(60, 60).setPosition(position);
    var itemLabel = new lime.Label().setText(number).setSize(10, 10).setPosition(position.x + 27, position.y - 27);
    //TODO sell button and stuff
    this.drawLayer.appendChild(itemIcon).appendChild(itemLabel);
}