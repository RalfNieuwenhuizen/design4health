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
    this.w = SETTINGS.createWindow();
    this.o = SETTINGS.createOverlay();
    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.title.setText('Inventory');

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeFarm, this);

    this.windowLayer
        .appendChild(this.o)
        .appendChild(this.w).appendChild(SETTINGS.createTitleImage('items'))
        .appendChild(this.closeButton);

    this.redraw(this.game.player.inventory);
}
goog.inherits(farming.SceneFarm, farming.Scene);

farming.SceneFarm.prototype.game = null;

farming.SceneFarm.prototype.closeFarm = function(scene) {
	scene.game.close();
}
// redraw the inventory
farming.SceneFarm.prototype.redraw = function (inventory) {
    if(this.drawLayer)
        this.windowLayer.removeChild(this.drawLayer);
    this.drawLayer = new lime.Layer();
    this.windowLayer.appendChild(this.drawLayer);
    var center = this.game.getCenterPosition();
    var items = 0;
    var shelf1 = new lime.Sprite().setFill('images/shelf.png').setSize(722*0.9,80*0.9).setPosition(400,160);
    var shelf2 = new lime.Sprite().setFill('images/shelf.png').setSize(722*0.9,80*0.9).setPosition(400,320);
    this.drawLayer.appendChild(shelf1).appendChild(shelf2);
    for(var i in Object.keys(inventory)) {
        var type = Object.keys(inventory)[i];
        if(!inventory[type]) continue;
        var position = new goog.math.Coordinate((items % 5)*125+140,Math.floor((items%10) / 5)*160+105);
        this.drawItem(type, inventory[type], position);
        items++;
    }

    if (items == 0) {
        var noItems = new lime.Label('You have not collected any items yet, go harvesting!').setFontSize(14).setPosition(center.x, center.y * 0.7);
        this.drawLayer.appendChild(noItems);
    }
}
farming.SceneFarm.prototype.drawItem = function (item, number, position) {
    var itemIcon = new lime.Sprite().setFill('images/items/'+item+'.png').setSize(100, 100).setPosition(position);
    var itemLabel = new lime.Label().setText(number).setSize(20, 20).setPosition(position.x+35, position.y+30).setFontSize(18).setFontWeight(600).setFontColor('#365905');
    var itemCircle = new lime.Circle().setSize(35,35).setFill('#b0d887').setStroke(new lime.fill.Stroke(3,'#365905'))
        .setPosition(position.x+35,position.y+30)
    this.drawLayer.appendChild(itemIcon).appendChild(itemCircle).appendChild(itemLabel);
}