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
    this.o = SETTINGS.createOverlay()
        .setPosition(400,240-30)
        .setSize(SETTINGS.size.background_layer.width-10,SETTINGS.size.background_layer.height-10);

    this.title = SETTINGS.createTitle('Crop');
    this.title.setText('Crop Details');
    this.cropIcon = new lime.Sprite().setSize(200*1.2, 169*1.2).setPosition(175, 170);

    this.exerciseIcon = new lime.Sprite();
    //this.cropDetails = new lime.Label().setFontSize(18).setSize(350,200).setAlign('left')
    //    .setPosition(center.x + 100, center.y).setMultiline(true);
    this.descriptionLayer = new lime.Layer().setPosition(10,20);
    this.cropDetails = new lime.Label().setFontSize(19).setSize(170,400).setFontColor('#666666')
        .setAlign('right').setMultiline(true).setLineHeight(2.3).setFontWeight(600).setPosition(325,282);
    this.costCoin = new lime.Layer().setPosition(440, 93);

    this.revenueCoins = new lime.Layer().setPosition(443, 93+42+42);
    this.revenueItem = new lime.Layer().setPosition(480,88+42+42);
    this.timeLabel = new lime.Label().setFontSize(20).setFontWeight(600).setSize(150,20)
        .setAlign('left').setPosition(500,135);
    this.exercisePoints = new lime.Layer().setPosition(426,180+42);
    this.exerciseLabel = new lime.Label().setFontSize(18).setFontWeight(600).setSize(150,20)
        .setAlign('left').setPosition(640,181+42).setFontColor('#000000');

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
        .appendChild(this.cropIcon)
        .appendChild(this.exerciseIcon)
    .appendChild(this.descriptionLayer);

    this.descriptionLayer
        .appendChild(this.costCoin)
        .appendChild(this.cropDetails)
        .appendChild(this.timeLabel)
        .appendChild(this.exercisePoints)
        .appendChild(this.exerciseLabel)
        .appendChild(this.revenueCoins)
        .appendChild(this.revenueItem)
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
    var game = this.game;

    this.title.setText('Clone '+ crop.name);
    this.cropDetails.setText('Cost\nTime to grow\n'+(crop.harvests > 1 ? crop.harvests+' Harvests' : 'Harvest')+'\nExercise');
    SETTINGS.drawCoin(this.revenueCoins, 0.65, crop.revenue);
    SETTINGS.drawCoin(this.costCoin, 0.5, crop.cost);
    SETTINGS.drawItemRevenue(this.revenueItem, crop.revenue_item);
    SETTINGS.drawBodyPoints(this.exercisePoints, EXERCISES[crop.exercise].type);
    //SETTINGS.drawBodyPoints(this.cropIcon);
    this.timeLabel.setText(Math.round(crop.time_to_ripe/60) + ' min');
    this.exerciseLabel.setText(EXERCISES[crop.exercise].title);
    //EXERCISES[crop.exercise].title + "\n"+ EXERCISES[crop.exercise].points + ' ' + EXERCISES[crop.exercise].type + (EXERCISES[crop.exercise].points > 1 ? ' points' : ' point')
    this.cropIcon.setFill('images/crops/'+crop.key+'_ripe.png');
    this.exerciseIcon.setFill('images/exercises/'+crop.exercise+'/4.png')
        .setSize(EXERCISES[crop.exercise].horizontal ? new goog.math.Size(795*0.25,420*0.25) : new goog.math.Size(315*0.4,420*0.4))
        .setPosition(115, EXERCISES[crop.exercise].horizontal ? 240 : 210);

    this.cloneButton.setAction(this.startClone, {'cropProps': crop,'game': this.game} );
    this.crop = crop;
}
