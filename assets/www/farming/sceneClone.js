/**
 * 	TODO: Show number of pages and current page
 *
 *
 */
goog.provide('farming.SceneClone');

goog.require('lime.Sprite');
goog.require('farming.Sprite');
goog.require('farming.Exercise');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Tile');
goog.require('farming.Crop');
goog.require('farming.Livestock');

/**
 * Scene elements
 *
 */
farming.SceneClone = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    this.w = new lime.Sprite().setFill(SETTINGS.color.background_layer).setSize(SETTINGS.size.background_layer).setPosition(game.getCenterPosition());
    this.title = new lime.Label('Clone').setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);

    this.nextButton = new farming.Button('Next').setColor(SETTINGS.color.button)
        .setPosition(300, 160)
        .setSize(SETTINGS.size.button);

    this.prevButton = new farming.Button('Previous').setColor(SETTINGS.color.button)
        .setPosition(-300, 160)
        .setSize(SETTINGS.size.button);

    this.windowLayer
        .appendChild(this.w)
        .appendChild(this.title)
        .appendChild(this.closeButton);

    this.closeButton.setAction(this.closeClone, this);
    this.nextButton.setAction(this.nextClone, this);
    this.prevButton.setAction(this.prevClone, this);

    // Set the number of the page the clonescreen is showing to first
    this.page = 1;
    // Draw the crops
    this.drawItems();

}
goog.inherits(farming.SceneClone, lime.Layer);

farming.SceneClone.prototype.game = null;

farming.SceneClone.prototype.closeClone = function(scene) {
    scene.game.close();
}

// Set action for the next button
farming.SceneClone.prototype.nextClone = function(scene) {
    // If there are no more screens return: safety check
    if(scene.page >= Math.ceil(scene.getTotalItems()/6))
        return;

    scene.page += 1;
    scene.drawItems();
}

// Set action for the previous button
farming.SceneClone.prototype.prevClone = function(scene) {
    // If this is the first screen there is no previous: safety check
    if(scene.page == 1)
        return;

    scene.page -= 1;
    scene.drawItems();
}

//Draw a crop with the icon, clone button and details button
farming.SceneClone.prototype.drawItems = function() {
    this.w.removeAllChildren();
    // Total amount of items
    var nItems = this.getTotalItems();
    var nCrops = goog.object.getCount(this.game.player.currentCrops);

    // Print six crops to the screen (in layer w) according to the number of the page
    for(var i=6*(this.page-1); i < Math.min(nItems, this.page*6); i++) {
        var position = new goog.math.Coordinate( ((i%6)%3)*200 - 200, Math.floor((i%6)/3)*150 - 120);
        if (i < this.game.player.currentCrops.length) {
            this.drawCrop(CROPS[this.game.player.currentCrops[i]], position);
        } else if (i - nCrops < this.game.player.currentLivestock.length) {
            this.drawLivestock(LIVESTOCK[this.game.player.currentLivestock[i - nCrops]], position);
        }
    }

    this.title.setText('Clone ('+this.page+'/'+Math.ceil(nItems/6)+')');
    if(this.page > 1) {
        this.w.appendChild(this.prevButton);
    }
    if(nItems / this.page > 6) {
        this.w.appendChild(this.nextButton);
    }
}

farming.SceneClone.prototype.drawCrop = function(crop, position) {
    var cropIcon = new farming.Sprite('images/crops/'+crop.key+'_ripe.png').setSize(150, 90).setPosition(position)
        .setAction(this.startClone, {'properties': crop,'game': this.game} );

    var cropLabel = new farming.Label(crop.name).setPosition(position.x, position.y + 52)
        .setFontSize(SETTINGS.font.subtitle.size).setFontWeight(SETTINGS.font.subtitle.weight)
        .setAction(this.startClone, {'properties': crop,'game': this.game} );

    // Create button to clone the icon
    var cloneButton = new farming.Button('Clone').setColor(SETTINGS.color.button_primary)
        .setPosition(new goog.math.Coordinate(position.x-(SETTINGS.size.button_small.width/2),position.y+80))
        .setSize(SETTINGS.size.button_small)
        .setAction(this.startClone, {'properties': crop,'game': this.game} );

    // Create button to get details about the icon
    var cloneDetails = new farming.Button('Details').setColor(SETTINGS.color.button)
        .setPosition(new goog.math.Coordinate(position.x+(SETTINGS.size.button_small.width/2),position.y+80))
        .setSize(SETTINGS.size.button_small)
        .setAction(this.showCropDetails, {'properties' : crop, 'game' : this.game});

    // Add crop with button to the w-layer
    this.w.appendChild(cropIcon).appendChild(cropLabel).appendChild(cloneButton).appendChild(cloneDetails);
}

farming.SceneClone.prototype.drawLivestock = function(livestock, position) {
    var livestockIcon = new farming.Sprite('images/livestock/'+livestock.key+livestock.appearances+'.png').setSize(150, 90).setPosition(position)
        .setAction(this.startClone, {'properties': livestock,'game': this.game} );

    var livestockLabel = new farming.Label(livestock.name).setPosition(position.x, position.y + 52)
        .setFontSize(SETTINGS.font.subtitle.size).setFontWeight(SETTINGS.font.subtitle.weight)
        .setAction(this.startClone, {'properties': livestock,'game': this.game} );

    // Create button to clone the icon
    var cloneButton = new farming.Button('Clone').setColor(SETTINGS.color.button_primary)
        .setPosition(new goog.math.Coordinate(position.x-(SETTINGS.size.button_small.width/2),position.y+80))
        .setSize(SETTINGS.size.button_small)
        .setAction(this.startClone, {'properties': livestock,'game': this.game} );

    // Create button to get details about the icon
    var cloneDetails = new farming.Button('Details').setColor(SETTINGS.color.button)
        .setPosition(new goog.math.Coordinate(position.x+(SETTINGS.size.button_small.width/2),position.y+80))
        .setSize(SETTINGS.size.button_small)
        .setAction(this.showLivestockDetails, {'properties' : livestock, 'game' : this.game});

    // Add livestock with button to the w-layer
    this.w.appendChild(livestockIcon).appendChild(livestockLabel).appendChild(cloneButton).appendChild(cloneDetails);
}

// Function to show the details of the crop
farming.SceneClone.prototype.getTotalItems = function() {
    var nCrops = goog.object.getCount(this.game.player.currentCrops);
    var nLivestock = goog.object.getCount(this.game.player.currentLivestock);
    return nCrops + nLivestock;
}

// Function to show the details of the crop
farming.SceneClone.prototype.showCropDetails = function(object) {
    object.game.showCropDetails(object.properties);
}
// Function to show the details of the crop
farming.SceneClone.prototype.showLivestockDetails = function(object) {
    object.game.showLivestockDetails(object.properties);
}

// Function to clone a product
farming.SceneClone.prototype.startClone = function(object) {
    object.game.startCloning(object.properties);
}
