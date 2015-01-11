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
    this.w = SETTINGS.createWindow();

    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.title.setText('Crop Details');
    this.cropIcon = new lime.Sprite();
    this.cropDetails = new lime.Label().setFontSize(18).setSize(350,200).setAlign('left')
        .setPosition(center.x + 100, center.y).setMultiline(true);

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
        .appendChild(this.w)
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
    object.game.startCloning(object.cropProps);
}

farming.SceneCropDetails.prototype.backDetails = function(scene) {
    scene.game.backCropDetails();
}
farming.SceneCropDetails.prototype.closeDetails = function(scene) {
    scene.game.close();
}

farming.SceneCropDetails.prototype.showDetails = function(crop) {
    this.title.setText('Details '+ crop.name);
    var text = 'Cost: '+crop.cost + '\n\n';
    text += 'Growing time: '+crop.time_to_ripe/60 + ' min \n\n';
    if(crop.harvests > 1) {
        text += 'Revenue per harvest: ' + crop.revenue + '\n\n';
        text += 'Number of harvests: ' + crop.harvests + '\n\n';
    } else {
        text += 'Revenue: '+crop.revenue + '\n\n';
    }
    text += 'Exercise: '+EXERCISES[crop.exercise].title + "\n"+ EXERCISES[crop.exercise].points + ' ' + EXERCISES[crop.exercise].type + (EXERCISES[crop.exercise].points > 1 ? ' points' : ' point') + '\n\n';
    this.cropDetails.setText(text);

    var game = this.game;
    var center = game.getCenterPosition();
    this.cropIcon.setFill('images/crops/'+crop.key+'_ripe.png').setSize(200*1.4, 169*1.4).setPosition(180, 210);
    this.cloneButton.setAction(this.startClone, {'cropProps': crop,'game': this.game} );
    this.crop = crop;
}
