/**
 * 
 */
goog.provide('farming.SceneLivestockDetails');

goog.require('lime.Sprite');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Tile');
goog.require('farming.Livestock');
goog.require('farming.Scene');
goog.require('farming.Exercise');
goog.require('farming.SceneClone');

farming.SceneLivestockDetails = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    this.w = SETTINGS.createWindow();
    this.o = SETTINGS.createOverlay().setSize(SETTINGS.size.background_layer.width-10,SETTINGS.size.background_layer.height-10);

    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.title.setText('Livestock Details');
    this.icon = new lime.Sprite();
    this.details = new lime.Label().setFontSize(18).setSize(350,200).setAlign('left')
        .setPosition(center.x + 100, center.y - 20).setMultiline(true);
    this.foodIcon = new lime.Sprite().setSize(40, 40).setPosition(center.x - 5, center.y + 75);
    this.foodLabel = new lime.Label().setFontSize(18).setPosition(center.x + 25, center.y + 95).setSize(200, 40).setAlign('left');
    this.revenueIcon = new lime.Sprite().setSize(40, 40).setPosition(center.x + 180, center.y - 75);
    this.revenueLabel = new lime.Label().setFontSize(18).setPosition(center.x + 210, center.y - 58).setSize(150, 40).setAlign('left');

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.backButton = new farming.Button('Back').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.left_button)
        .setSize(SETTINGS.size.button);
    this.cloneButton = new farming.Button('Clone').setColor(SETTINGS.color.button_primary)
        .setPosition(SETTINGS.position.right_button)
        .setSize(SETTINGS.size.button);

    this.backButton.setAction(this.backDetails, this);
    this.closeButton.setAction(this.closeDetails, this);

    this.windowLayer
        .appendChild(this.o)
        .appendChild(this.w)
        .appendChild(this.title)
        .appendChild(this.closeButton)
        .appendChild(this.cloneButton)
        .appendChild(this.backButton)
        .appendChild(this.icon)
        .appendChild(this.foodIcon)
        .appendChild(this.foodLabel)
        .appendChild(this.revenueIcon)
        .appendChild(this.revenueLabel)
        .appendChild(this.details);
}

goog.inherits(farming.SceneLivestockDetails, farming.Scene);

farming.SceneLivestockDetails.prototype.game = null;

// Function to clone a product
farming.SceneLivestockDetails.prototype.startClone = function(object) {
    object.game.startCloning(object.properties);
}

farming.SceneLivestockDetails.prototype.backDetails = function(scene) {
    scene.game.backLivestockDetails();
}
farming.SceneLivestockDetails.prototype.closeDetails = function(scene) {
    scene.game.close();
}

farming.SceneLivestockDetails.prototype.showDetails = function(livestock) {
    this.title.setText('Details '+ livestock.name);
    var text = 'Cost: '+livestock.cost + '\n\n';
    text += 'Revenue per harvest: '+livestock.revenue + '\n\n';
    text += 'Time between harvests: '+livestock.time_between_harvests/60 + ' min\n\n';
    text += 'Exercise: '+EXERCISES[livestock.exercise].title + '\n';
    text += EXERCISES[livestock.exercise].points + ' ' + EXERCISES[livestock.exercise].type + (EXERCISES[livestock.exercise].points > 1 ? ' points' : ' point') + '\n\n';
    this.details.setText(text);
    this.foodLabel.setText('Food:         '+ITEMS[livestock.food].name);
    this.foodIcon.setFill('images/items/'+livestock.food+'.png');
    this.revenueLabel.setText('+1         '+ITEMS[livestock.revenue_item].name);
    this.revenueIcon.setFill('images/items/'+livestock.revenue_item+'.png');

    this.icon.setFill('images/livestock/'+livestock.key+livestock.appearances+'.png')
        .setSize(200*1.4, 169*1.4).setPosition(180, 210);
    this.cloneButton.setAction(this.startClone, {'properties': livestock,'game': this.game} );
    this.livestock = livestock;
}
