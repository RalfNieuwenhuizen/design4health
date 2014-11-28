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
goog.require('farming.SceneClone');

/**
 * Scene elements
 *
 */
farming.SceneCropDetails = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    var w = new lime.Sprite().setFill('#A9A9A9').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());

    //var crop = CROPS.apple_tree;
    
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.5);
    this.title.setText('Crop Details');
    this.cropIcon = new lime.Sprite();
    this.cropName = new lime.Label().setFontSize(11).setPosition(center.x, center.y - 60);
    this.cropCost = new lime.Label().setFontSize(11).setPosition(center.x, center.y - 40);
    this.cropRevenue = new lime.Label().setFontSize(11).setPosition(center.x, center.y - 20);
    this.cropRipeTime = new lime.Label().setFontSize(11).setPosition(center.x, center.y);
    this.cropDeathTime = new lime.Label().setFontSize(11).setPosition(center.x, center.y + 20); 
    this.cropHarvests = new lime.Label().setFontSize(11).setPosition(center.x, center.y + 40);
    this.cropExercises = new lime.Label().setFontSize(11).setPosition(center.x, center.y + 60);
    
//    exercise: {
  //      title : 'Arm stretching',
  //      description : 'Alternate arms, reaching as high as you can and as low as you can.',
  //      callback : 'harvestAppleTree' 
    
    this.closeButton = new farming.Button('X').setColor('#999999')
    		.setPosition(center.x + game.getFullSize(0.33).width, center.y - game.getFullSize(0.32).height)
    		.setSize(20,20);
    this.closeButton.setAction(this.closeDetails, this); 
    // show text crop.cost, crop.revenue, etc.
    
    this.windowLayer
    .appendChild(w).appendChild(this.title).appendChild(this.closeButton).appendChild(this.cropIcon).appendChild(this.cropName).appendChild(this.cropCost)
    .appendChild(this.cropRevenue).appendChild(this.cropRipeTime).appendChild(this.cropDeathTime).appendChild(this.cropHarvests).appendChild(this.cropExercises);
}

goog.inherits(farming.SceneCropDetails, farming.Scene);

farming.SceneCropDetails.prototype.game = null;

farming.SceneCropDetails.prototype.closeDetails = function(scene) {
    scene.game.hideDetails();
}

farming.SceneCropDetails.prototype.showDetails = function(crop) {
    this.title.setText('Details '+ crop.name);
    this.cropName.setText('Name: '+crop.name);
    this.cropCost.setText('Cost: '+crop.cost);
    this.cropRevenue.setText('Revenue: '+crop.revenue);
    this.cropRipeTime.setText('Time to ripe: '+crop.time_to_ripe);
    this.cropDeathTime.setText('Time to death: '+crop.time_to_death);
    this.cropHarvests.setText('Number of harvests: '+crop.harvests);
    this.cropExercises.setText('Exercises: '+crop.exercise.title);
    
    var game = this.game;
    var center = game.getCenterPosition();
    this.cropIcon.setFill('images/'+crop.key+'_ripe.png').setSize(120, 120).setPosition(center.x + 25 - game.getFullSize(0.3).width, center.y);
    
    this.crop = crop;
}
