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
    this.o = SETTINGS.createOverlay()
        .setPosition(400,240-30)
        .setSize(SETTINGS.size.background_layer.width-10,SETTINGS.size.background_layer.height-10);

    this.title = SETTINGS.createTitle('');
    this.title.setText('Livestock Details');

    this.cropIcon = new lime.Sprite().setSize(200*1.0, 169*1.0).setPosition(145, 150);

    this.exerciseIcon = new lime.Sprite();
    this.foodIcon = new lime.Sprite().setSize(40,40).setPosition(443, 127);
    //this.cropDetails = new lime.Label().setFontSize(18).setSize(350,200).setAlign('left')
    //    .setPosition(center.x + 100, center.y).setMultiline(true);
    this.descriptionLayer = new lime.Layer().setPosition(10,0);
    this.livestockDetails = new lime.Label().setFontSize(19).setSize(170,400).setFontColor('#666666')
        .setAlign('right').setMultiline(true).setLineHeight(2.3).setFontWeight(600).setPosition(325,282);
    this.costCoin = new lime.Layer().setPosition(440, 93);

    this.revenueCoins = new lime.Layer().setPosition(443, 93+42*3);
    this.revenueItem = new lime.Layer().setPosition(480,88+42*3);
    this.timeLabel = new lime.Label().setFontSize(20).setFontWeight(600).setSize(250,20)
        .setAlign('left').setPosition(550,135+42);
    this.exercisePoints = new lime.Layer().setPosition(426,180+42*2);
    this.exerciseLabel = new lime.Label().setFontSize(18).setFontWeight(600).setSize(150,20)
        .setAlign('left').setPosition(640,181+42*2).setFontColor('#000000');

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
        .appendChild(this.livestockDetails)
        .appendChild(this.timeLabel)
        .appendChild(this.exercisePoints)
        .appendChild(this.exerciseLabel)
        .appendChild(this.revenueCoins)
        .appendChild(this.revenueItem)
        .appendChild(this.foodIcon)
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
    /*this.title.setText('Details '+ livestock.name);
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
    this.livestock = livestock;*/

    this.title.setText('Clone '+ livestock.name);
    this.livestockDetails.setText('Cost\nFood\nReady for harvest\nHarvest\nExercise');
    SETTINGS.drawCoin(this.revenueCoins, 0.65, livestock.revenue);
    SETTINGS.drawCoin(this.costCoin, 0.5, livestock.cost);
    SETTINGS.drawItemRevenue(this.revenueItem, livestock.revenue_item);
    SETTINGS.drawBodyPoints(this.exercisePoints, EXERCISES[livestock.exercise].type);
    //SETTINGS.drawBodyPoints(this.cropIcon);
    this.timeLabel.setText(Math.round(livestock.time_between_harvests/60) + ' min after feeding');
    this.exerciseLabel.setText(EXERCISES[livestock.exercise].title);
    //EXERCISES[crop.exercise].title + "\n"+ EXERCISES[crop.exercise].points + ' ' + EXERCISES[crop.exercise].type + (EXERCISES[crop.exercise].points > 1 ? ' points' : ' point')
    this.cropIcon.setFill('images/livestock/'+livestock.key+livestock.appearances+'_harvestable.png');
    this.foodIcon.setFill('images/items/'+livestock.food+'.png');
    this.exerciseIcon.setFill('images/exercises/'+livestock.exercise+'/4.png')
        .setSize(EXERCISES[livestock.exercise].horizontal ? new goog.math.Size(795*0.25,420*0.25) : new goog.math.Size(315*0.4,420*0.4))
        .setPosition(115, EXERCISES[livestock.exercise].horizontal ? 260 : 220);

    this.cloneButton.setAction(this.startClone, {'properties': livestock,'game': this.game} );
    this.livestock = livestock;
}
