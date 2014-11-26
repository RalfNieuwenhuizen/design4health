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
        currentCrop: 0
    }

    this.director = new lime.Director(document.body,this.screen.width,this.screen.height);
    this.director.makeMobileWebAppCapable()
    this.director.setDisplayFPS(false);
    this.sceneMap = new farming.SceneMap(this);
    this.sceneHarvest = new farming.SceneHarvest(this);
    this.director.replaceScene(this.sceneMap);
    var game = this;
    lime.scheduleManager.scheduleWithDelay(function() {
        var scene = game.director.getCurrentScene();
        if(scene) scene.timePassed();
    }, this, 1000*1);
}

farming.Game.prototype.showHarvest = function(tile){
    this.sceneHarvest.showExercise(tile);
    this.director.pushScene(this.sceneHarvest, lime.transitions.MoveInDown);
}
farming.Game.prototype.hideHarvest = function(){
    this.director.popScene();
}

farming.Game.prototype.addCoins = function(amount) {
    this.player.coins += amount;
    this.sceneMap.updateControls();
}
farming.Game.prototype.removeCoins = function(amount) {
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

