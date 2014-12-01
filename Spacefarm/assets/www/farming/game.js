/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.Game');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.transitions.MoveInDown');
goog.require('farming.SceneMap');
goog.require('farming.SceneFarm');
goog.require('farming.SceneHarvest');
goog.require('farming.SceneClone');
goog.require('farming.SceneCloneOnMap');
goog.require('farming.SceneCropDetails');
goog.require('farming.SceneChallenge');
goog.require('farming.SceneChallengeDetails');

goog.require('farming.Crop');
goog.require('farming.Challenge');

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
        currentCrops : Object.keys(CROPS),
        challenges : Object.keys(CHALLENGES),
        body : {
            arms: 0,
            legs: 0,
            back: 0,
            abs: 0,
        },
        inventory : {}
    }
    
    // TODO Not yet used
    this.currentCrop = null;

    this.director = new lime.Director(document.body,this.screen.width,this.screen.height);
    this.director.makeMobileWebAppCapable()
    this.director.setDisplayFPS(false);

    //Define all the scenes
    this.sceneMap = new farming.SceneMap(this);
    this.sceneFarm = new farming.SceneFarm(this);
    this.sceneHarvest = new farming.SceneHarvest(this);
    this.sceneClone = new farming.SceneClone(this);
    this.sceneCloneOnMap = new farming.SceneCloneOnMap(this);
    this.sceneCropDetails = new farming.SceneCropDetails(this);
    this.sceneChallenge = new farming.SceneChallenge(this);
    this.sceneChallengeDetails = new farming.SceneChallengeDetails(this);

    //Set the starting scene
    this.director.replaceScene(this.sceneMap);
    var game = this;
    lime.scheduleManager.scheduleWithDelay(function() {
        for(var i in this.tickables) {
            if(this.tickables[i]) this.tickables[i].tick();
        }
    }, this, 1000*0.5);
}

farming.Game.prototype.tickables = [];
farming.Game.prototype.currentChallenge = null;

// -- farm --
farming.Game.prototype.showFarm = function(game){
    game.sceneFarm.redraw(game.player.inventory);
    game.director.pushScene(game.sceneFarm);
}

farming.Game.prototype.closeFarm = function(game){
    if(game.director.getCurrentScene() != game.sceneFarm) return;
    game.director.popScene();
}
// -- end farm --

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
	this.director.pushScene(this.sceneCropDetails);
}

farming.Game.prototype.hideCropDetails = function(){
    if(this.director.getCurrentScene() != this.sceneCropDetails) return;
    this.director.popScene();
}

// Show cloning screen
farming.Game.prototype.startCloning = function(crop){
	this.hideClone();
	//this.sceneCloneOnMap.startCloning(crop);
	this.sceneCropDetails.showDetails(crop);
	//this.director.pushScene(this.sceneCloneOnMap);
	//this.sceneCropDetails.showDetails(crop);
	//this.director.pushScene(this.sceneCropDetails);
}

farming.Game.prototype.closeCloning = function(){
	if(this.director.getCurrentScene() != this.sceneCloneOnMap) return;
	this.director.popScene();
}


// -- Challenge screen --
farming.Game.prototype.showChallenge = function(game){
    if(!game.currentChallenge) {
        game.director.pushScene(game.sceneChallenge);
    } else {
        game.showChallengeCurrent({'challenge': game.currentChallenge, 'game': game});
    }
}
farming.Game.prototype.pickChallenge = function(input){
    //TODO pick challenge
    input.game.currentChallenge = input.challenge;
    if(input.game.director.getCurrentScene() != input.game.sceneChallengeDetails) return;
    input.game.director.popScene();
    if(input.game.director.getCurrentScene() != input.game.sceneChallenge) return;
    input.game.director.popScene();
}
farming.Game.prototype.cancelChallenge = function(input){
    //TODO cancel challenge
    input.game.currentChallenge = null;
    if(input.game.director.getCurrentScene() != input.game.sceneChallengeDetails) return;
    input.game.director.popScene();
    if(input.game.director.getCurrentScene() != input.game.sceneChallenge) return;
    input.game.director.popScene();
}
farming.Game.prototype.closeChallenge = function(game){
    if(game.director.getCurrentScene() != game.sceneChallenge) return;
    game.director.popScene();
}
farming.Game.prototype.showChallengeDetails = function(input){
    input.game.sceneChallengeDetails = new farming.SceneChallengeDetails(input.game);
    input.game.sceneChallengeDetails.setChallenge(input.challenge);
    input.game.director.pushScene(input.game.sceneChallengeDetails);
}
farming.Game.prototype.showChallengeCurrent = function(input){
    input.game.sceneChallengeDetails = new farming.SceneChallengeDetails(input.game);
    input.game.sceneChallengeDetails.setChallenge(input.challenge, true);
    input.game.director.pushScene(input.game.sceneChallengeDetails);
}
farming.Game.prototype.backChallengeDetails = function(game){
    if(game.director.getCurrentScene() != game.sceneChallengeDetails) return;
    game.director.popScene();
}
farming.Game.prototype.closeChallengeDetails = function(game){
    if(game.director.getCurrentScene() != game.sceneChallengeDetails) return;
    game.director.popScene();
    if(game.director.getCurrentScene() != game.sceneChallenge) return;
    game.director.popScene();
}
farming.Game.prototype.doExercise = function(input){
    console.log('doExercise', input.exercise);
}
// -- end challenge screen --

farming.Game.prototype.addCoins = function(amount) {
    this.sceneMap.moneyAnimation(amount);
    this.player.coins += amount;
    this.sceneMap.updateControls();
    return this.player.coins;
}
farming.Game.prototype.removeCoins = function(amount) {
    this.sceneMap.moneyAnimation(amount);
    if(this.player.coins < amount) return false;
    this.player.coins -= amount;
    this.sceneMap.updateControls();
    return this.player.coins;
}
farming.Game.prototype.getCoins = function() {
    return this.player.coins;
}
farming.Game.prototype.hasCoins = function(amount) {
    return this.player.coins >= amount;
}

// -- Inventory --
farming.Game.prototype.addItem = function(type, amount) {
    if(!this.hasItem(type, amount)) {
        this.player.inventory[type] = amount;
    } else {
        this.player.inventory[type] += amount;
    }
    return this.player.inventory[type];
}
farming.Game.prototype.removeItem = function(type, amount) {
    if(!this.hasItem(type, amount)) return false;
    this.player.inventory[type] -= amount;
}
farming.Game.prototype.getInventory = function(type) {
    if(type) {
        if(this.hasItem(type))
            return this.player.inventory[type];
        else
            return 0;
    }
    return this.player.inventory;
}
farming.Game.prototype.hasItem = function(type, amount) {
    if(!amount)
        amount = 1;
    return this.player.inventory[type] >= amount;
}

farming.Game.prototype.getFullSize = function(percent) {
    var ratio = typeof percent == 'undefined' ? 1 : percent;
    return new goog.math.Size(this.screen.width * ratio, this.screen.height * ratio);
}

farming.Game.prototype.getCenterPosition = function() {
    return new goog.math.Coordinate(this.screen.width / 2, this.screen.height / 2)
}

