/**
 * 
 */
goog.provide('farming.SceneCropDetails');

goog.require('lime.Sprite');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Tile');
goog.require('farming.Crop');
goog.require('farming.Scene');
goog.require('farming.Exercise');

farming.SceneCropDetails = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    var w = new lime.Sprite().setFill(SETTINGS.color.background_layer).setSize(SETTINGS.size.background_layer).setPosition(game.getCenterPosition());
    
    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.title.setText('Crop Details');
    this.cropIcon = new lime.Sprite();
    this.cropDetails = new lime.Label().setFontSize(18).setPosition(center.x + 50, center.y).setMultiline(true);

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
        .appendChild(this.cropIcon)
        .appendChild(this.cropDetails);
}

goog.inherits(farming.SceneCropDetails, farming.Scene);

farming.SceneCropDetails.prototype.game = null;

// Function to clone a product
farming.SceneCropDetails.prototype.startClone = function(object) {
    object.game.sceneMap.startCloning(object.cropProps);
}

farming.SceneCropDetails.prototype.backDetails = function(scene) {
    scene.game.backCropDetails();
}
farming.SceneCropDetails.prototype.closeDetails = function(scene) {
    scene.game.closeCropDetails();
}

farming.SceneCropDetails.prototype.showDetails = function(crop) {
    this.title.setText('Details '+ crop.name);
    var text = 'Cost: '+crop.cost + '\n\n';
    text += 'Revenue: '+crop.revenue + '\n\n';
    text += 'Time to ripe: '+crop.time_to_ripe + '\n\n';
    text += 'Number of harvests: '+crop.harvests + '\n\n';
    text += 'Exercise: '+EXERCISES[crop.exercise.key].title + '\n\n';
    this.cropDetails.setText(text);
    
    var game = this.game;
    var center = game.getCenterPosition();
    this.cropIcon.setFill('images/'+crop.key+'_ripe.png').setSize(300, 300).setPosition(center.x + 25 - game.getFullSize(0.3).width, center.y);
    this.cloneButton.setAction(this.startClone, {'cropProps': crop,'game': this.game} );
    this.crop = crop;
}
