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
    var w = new lime.Sprite().setFill(SETTINGS.color.background_layer).setSize(SETTINGS.size.background_layer).setPosition(game.getCenterPosition());
    
    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.title.setText('Livestock Details');
    this.icon = new lime.Sprite().setSize(300, 300).setPosition(center.x + 25 - game.getFullSize(0.3).width, center.y);
    this.details = new lime.Label().setFontSize(18).setPosition(center.x + 50, center.y - 20).setMultiline(true);
    this.foodIcon = new lime.Sprite().setSize(40, 40).setPosition(center.x + 20, center.y + 85);
    this.foodLabel = new lime.Label().setFontSize(18).setPosition(center.x + 50, center.y + 85);

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.backButton = new farming.Button('Back').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.left_button)
        .setSize(SETTINGS.size.button);
    this.cloneButton = new farming.Button('Clone').setColor(SETTINGS.color.button_primary)
        .setPosition(SETTINGS.position.center_button)
        .setSize(SETTINGS.size.button);

    this.backButton.setAction(this.backDetails, this);
    this.closeButton.setAction(this.closeDetails, this);

    this.windowLayer
        .appendChild(w)
        .appendChild(this.title)
        .appendChild(this.closeButton)
        .appendChild(this.cloneButton)
        .appendChild(this.backButton)
        .appendChild(this.icon)
        .appendChild(this.foodIcon)
        .appendChild(this.foodLabel)
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
    text += 'Time between harvests: '+livestock.time_between_harvests + '\n\n';
    text += 'Exercise: '+EXERCISES[livestock.exercise.key].title + '\n\n';
    this.details.setText(text);
    this.foodLabel.setText('Food:         '+ITEMS[livestock.food].name);
    this.foodIcon.setFill('images/items/'+livestock.food+'.png');

    this.icon.setFill('images/livestock/'+livestock.key+livestock.appearances+'.png');
    this.cloneButton.setAction(this.startClone, {'properties': livestock,'game': this.game} );
    this.livestock = livestock;
}
