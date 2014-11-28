/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.Game');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.transitions.MoveInDown');
goog.require('farming.SceneMap');
goog.require('farming.SceneHarvest');
goog.require('farming.SceneClone');
goog.require('farming.SceneCropDetails');

/**
 * Land elements
 *
 */
farming.Game = function() {

    this.screen = {
        width: 800,
        height: 480
    }

    this.player = {
        coins: 100,
        currentCrops : ['apple_tree','wheat','wheat','wheat','wheat','wheat','wheat','wheat','wheat','wheat']
    }

    this.director = new lime.Director(document.body,this.screen.width,this.screen.height);
    this.director.makeMobileWebAppCapable()
    this.director.setDisplayFPS(false);
    this.sceneMap = new farming.SceneMap(this);
    this.sceneHarvest = new farming.SceneHarvest(this);
    this.sceneClone = new farming.SceneClone(this);
    this.sceneCropDetails = new farming.SceneCropDetails(this);
    this.director.replaceScene(this.sceneMap);
    var game = this;
    lime.scheduleManager.scheduleWithDelay(function() {
        for(var i in this.tickables) {
            if(this.tickables[i]) this.tickables[i].tick();
        }
    }, this, 1000*0.5);
}

farming.Game.prototype.tickables = [];

farming.Game.prototype.showHarvest = function(tile){
    this.sceneHarvest.showExercise(tile);
    this.director.pushScene(this.sceneHarvest, lime.transitions.MoveInDown);
}

farming.Game.prototype.hideHarvest = function(){
    console.log(this.director.getCurrentScene());
    if(this.director.getCurrentScene() != this.sceneHarvest) return;
    this.director.popScene();
}

farming.Game.prototype.showClone = function(game){
	game.director.pushScene(game.sceneClone);
}

farming.Game.prototype.hideClone = function(){
    if(this.director.getCurrentScene() != this.sceneClone) return;
    this.director.popScene();
}

// Show details of the crop
farming.Game.prototype.showCropDetails = function(crop){
	this.sceneCropDetails.showDetails(crop);
	this.director.pushScene(this.sceneCropDetails, lime.transitions.MoveInDown);
}

farming.Game.prototype.hideDetails = function(){
    if(this.director.getCurrentScene() != this.sceneCropDetails) return;
    this.director.popScene();
}

// Close details of the crop
// todo

farming.Game.prototype.addCoins = function(amount) {
    this.sceneMap.moneyAnimation(amount);
    this.player.coins += amount;
    this.sceneMap.updateControls();
}
farming.Game.prototype.removeCoins = function(amount) {
    this.sceneMap.moneyAnimation(amount);
    if(this.player.coins < amount) return false;
    this.player.coins -= amount;
    this.sceneMap.updateControls();
}
farming.Game.prototype.getCoins = function() {
    return this.player.coins;
}
farming.Game.prototype.hasCoins = function(amount) {
    return this.player.coins >= amount;
}

farming.Game.prototype.getFullSize = function(percent) {
    var ratio = typeof percent == 'undefined' ? 1 : percent;
    return new goog.math.Size(this.screen.width * ratio, this.screen.height * ratio);
}

farming.Game.prototype.getCenterPosition = function() {
    return new goog.math.Coordinate(this.screen.width / 2, this.screen.height / 2)
}

