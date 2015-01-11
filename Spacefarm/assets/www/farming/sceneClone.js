/**
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
    this.w = SETTINGS.createWindow();
    this.o = SETTINGS.createOverlay();
    this.title = new lime.Label('Clone').setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);

    this.windowLayer
        .appendChild(this.o)
        .appendChild(this.w)
        .appendChild(this.title)
        .appendChild(this.closeButton);
    this.slider = new farming.Slider().setSize(700,320).setPosition(400,230).setBubblesHidden(true);
    this.windowLayer.appendChild(this.slider);
    this.closeButton.setAction(this.closeClone, this);

    // Draw the crops
    this.drawItems();

}
goog.inherits(farming.SceneClone, lime.Layer);

farming.SceneClone.prototype.game = null;

farming.SceneClone.prototype.closeClone = function(scene) {
    scene.game.close();
}

//Draw a crop with the icon, clone button and details button
farming.SceneClone.prototype.drawItems = function() {
    var nItems = this.getTotalItems();
    this.slider.clear();

    var items = [];
    for(var i in CROPS) {
        items.push(CROPS[i]);
    }
    for(var i in LIVESTOCK) {
        items.push(LIVESTOCK[i]);
    }
    items.sort(function(a,b){
        return a.required_level > b.required_level
    })
    var position = null;
    var slide = null;
    for(var i in items) {
        if(i % 6 == 0) {
            slide = this.slider.addBlankSlide();
        }
        var position = new goog.math.Coordinate((i % 3)*200-200,Math.floor((i%6) / 3)*160-80);
        this.drawItem(slide, items[i], position);
    }

    this.title.setText('Clone');
}

farming.SceneClone.prototype.drawItem = function(slide, item, position) {
    var isCrop = typeof item.food == 'undefined';
    var icon = new farming.Sprite(isCrop ? 'images/crops/'+item.key+'_ripe.png' : 'images/livestock/'+item.key+'1.png')
        .setSize(200*0.6, 169*0.6).setPosition(position.x, position.y-15);
    var bg = new farming.Button(' ').setSize(180,140).setPosition(position);
    var label = new farming.Label(item.name).setPosition(position.x, position.y + 45)
        .setFontSize(SETTINGS.font.subtitle.size).setFontWeight(SETTINGS.font.subtitle.weight);


    // Add crop with button to the w-layer
    slide.appendChild(bg).appendChild(icon).appendChild(label);
    if(farming.Body.prototype.getBodyLevel(this.game.player.body) < item.required_level) {
        label.setText('Level '+item.required_level)
        bg.setFill('#bfbfbf').setStroke('#6e7d79');
        var icon = new farming.Sprite('images/lock.png').setSize(60*0.5, 85*0.5).setPosition(position.x + 80, position.y - 55);
        slide.appendChild(icon)
    } else {
        var icon = new farming.Sprite('images/coin_bright.png').setSize(40, 40).setPosition(position.x + 75, position.y - 55);
        var coins = new lime.Label(item.cost).setSize(20, 20).setPosition(position.x + 75, position.y - 56).setFontSize(20)
        slide.appendChild(icon).appendChild(coins);
        if(!isCrop) this.drawFood(slide, item.food, position);
        bg.setColor('clone').setAction(this.showItemDetails, {'properties': item,'game': this.game} );
    }
}

/*farming.SceneClone.prototype.drawLivestock = function(slide, livestock, position) {
    var livestockIcon = new farming.Sprite('images/livestock/'+livestock.key+livestock.appearances+'.png').setSize(125, 90).setPosition(position);

    var livestockLabel = new farming.Label(livestock.name).setPosition(position.x, position.y + 52)
        .setFontSize(SETTINGS.font.subtitle.size).setFontWeight(SETTINGS.font.subtitle.weight);

    // Create button to clone the icon
    var cloneButton = new farming.Button('Clone').setColor(SETTINGS.color.button_primary)
        .setPosition(new goog.math.Coordinate(position.x-(SETTINGS.size.button_small.width/2),position.y+80))
        .setSize(SETTINGS.size.button_small);

    // Create button to get details about the icon
    var cloneDetails = new farming.Button('Details').setColor(SETTINGS.color.button)
        .setPosition(new goog.math.Coordinate(position.x+(SETTINGS.size.button_small.width/2),position.y+80))
        .setSize(SETTINGS.size.button_small)
        .setAction(this.showLivestockDetails, {'properties' : livestock, 'game' : this.game});

    // Add livestock with button to the w-layer
    slide.appendChild(livestockIcon).appendChild(livestockLabel);
    if(!this.drawLock(livestock.required_level, position)) {
        this.drawCost(livestock.cost, position);
        this.drawFood(livestock.food, position);
        livestockIcon.setAction(this.startClone, {'properties': livestock,'game': this.game} );
        livestockLabel.setAction(this.startClone, {'properties': livestock,'game': this.game} );
        cloneButton.setAction(this.startClone, {'properties': livestock,'game': this.game} );
        slide.appendChild(cloneButton).appendChild(cloneDetails);
    }
}*/

farming.SceneClone.prototype.drawFood = function(slide, type, position) {
    var icon = new farming.Sprite('images/items/'+type+'.png').setSize(54, 54).setPosition(position.x - 75, position.y - 62);
    slide.appendChild(icon);
}

// Function to show the details of the crop
farming.SceneClone.prototype.getTotalItems = function() {
    var nCrops = goog.object.getCount(CROPS);
    var nLivestock = goog.object.getCount(LIVESTOCK);
    return nCrops + nLivestock;
}

// Function to show the details of the crop
farming.SceneClone.prototype.showItemDetails = function(object) {
    object.game.showItemDetails(object.properties);
}

// Function to clone a product
farming.SceneClone.prototype.startClone = function(object) {
    object.game.startCloning(object.properties);
}
