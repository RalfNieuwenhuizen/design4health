/**
 * Created on 11/23/14.
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
goog.require('farming.SceneCropDetails');
goog.require('farming.SceneChallenge');
goog.require('farming.SceneChallengeDetails');
goog.require('farming.Introduction');
goog.require('farming.Crop');
goog.require('farming.Challenge');

var SETTINGS = {
    mapSize: 20,
    screen: {
        width: 800,
        height: 480
    },

    color: {
        tile: '#FFC285',
        background_layer: '#f0f0f0',
        button_primary: '#22CC22',
        button_inactive: '#AAAAAA',
        button: '#999999',
        green: '#22CC22',
        red: '#CC2222',
        black: '#000000',
        controls_label: '#E8FC08',
        controls_background: '#0D0D0D'
    },

    size: {
        button: new goog.math.Size(120, 50),
        button_small: new goog.math.Size(80, 40),
        close_button: new goog.math.Size(40, 40),
        background_layer: new goog.math.Size(735, 480 * 0.8),
        tiles: new goog.math.Size(200, 116),
        controls: {
            height: 50
        }
    },

    position: {
        close_button: new goog.math.Coordinate(745, 45),
        left_button: new goog.math.Coordinate(100, 375),
        center_button: new goog.math.Coordinate(400, 375),
        right_button: new goog.math.Coordinate(700, 375),
        title: new goog.math.Coordinate(400, 50)
    },

    font: {
        title: 22,
        subtitle: {
            size: 16,
            weight: 600
        }
    }
}

/**
 * Land elements
 *
 */
farming.Game = function() {

    this.screen = {
        width: SETTINGS.screen.width,
        height: SETTINGS.screen.height
    }

    this.player = {
        coins: 100,
        currentCrops : Object.keys(CROPS),
        challenges : Object.keys(CHALLENGES),
        body : {
            arms: 0,
            legs: 0,
            back: 0,
            abs: 0
        },
        inventory : {
            space_wheat: 10,
            space_apple: 10
        },
        currentChallenge : null,
        introPhase: 0 // Used to check for introductional screens
    }

    // Current crop defines the crop the user is building, initiated in clone screen
    this.currentCrop = null;

    this.director = new lime.Director(document.body,this.screen.width,this.screen.height);
    this.director.makeMobileWebAppCapable()
    this.director.setDisplayFPS(false);

    //Define all the scenes
    this.sceneMap = new farming.SceneMap(this);
    this.sceneFarm = new farming.SceneFarm(this);
    this.sceneExercise = new farming.SceneExercise(this);
    this.sceneHarvest = new farming.SceneHarvest(this);
    this.sceneClone = new farming.SceneClone(this);
    this.sceneCropDetails = new farming.SceneCropDetails(this);
    this.sceneChallenge = new farming.SceneChallenge(this);
    this.sceneChallengeDetails = new farming.SceneChallengeDetails(this);
    this.introduction = new farming.Introduction(this);

    //Set the starting scene
    this.director.replaceScene(this.sceneMap);
    var game = this;
    lime.scheduleManager.scheduleWithDelay(function() {
        for(var i in this.tickables) {
            if(this.tickables[i]) this.tickables[i].tick();
        }
    }, this, 1000*0.5);

    // Launches help if still applicable
    this.introduction.intro();
}

farming.Game.prototype.tickables = [];

// -- farm --
farming.Game.prototype.showFarm = function(){
    this.sceneFarm.redraw(this.player.inventory);
    this.director.pushScene(this.sceneFarm);
}

farming.Game.prototype.closeFarm = function(){
    if(this.director.getCurrentScene() != this.sceneFarm) return;
    this.director.popScene();
}
// -- end farm --

// -- harvest --
farming.Game.prototype.showHarvest = function(tile){
    this.sceneHarvest.showExercise(tile);
    this.director.pushScene(this.sceneHarvest, lime.transitions.MoveInDown);
}

farming.Game.prototype.hideHarvest = function(){
    if(this.director.getCurrentScene() != this.sceneHarvest) return;
    this.director.popScene();
}
// -- end harvest --

// -- exercise --
farming.Game.prototype.showExercise = function(exercise){
    this.sceneExercise.showExercise(exercise);
    this.director.pushScene(this.sceneExercise);
}

farming.Game.prototype.hideExercise = function(){
    if(this.director.getCurrentScene() != this.sceneExercise) return;
    this.director.popScene();
}
// -- end exercise --

// -- clone --
farming.Game.prototype.showClone = function(){
    this.director.pushScene(this.sceneClone);
}

farming.Game.prototype.hideClone = function(){
    if(this.director.getCurrentScene() != this.sceneClone) return;
    this.director.popScene();
}

// Start cloning a crop
farming.Game.prototype.startCloning = function(crop){
    this.hideClone();
    this.sceneCropDetails.showDetails(crop);
}
// -- end clone --

// -- cropdetails --
farming.Game.prototype.showCropDetails = function(crop){
    this.sceneCropDetails.showDetails(crop);
    this.director.pushScene(this.sceneCropDetails);
}

farming.Game.prototype.closeCropDetails = function(){
    if(this.director.getCurrentScene() != this.sceneCropDetails) return;
    this.director.popScene();
    if(this.director.getCurrentScene() != this.sceneClone) return;
    this.director.popScene();
}

farming.Game.prototype.backCropDetails = function(){
    if(this.director.getCurrentScene() != this.sceneCropDetails) return;
    this.director.popScene();
}
// -- end cropdetails --

// -- Challenge screen --
// if there is no current challenge, show the list of challenges, otherwise show the current challenge
farming.Game.prototype.showChallenge = function(){
    if(!this.player.currentChallenge) {
        this.director.pushScene(this.sceneChallenge);
    } else {
        this.showChallengeDetails(this.player.currentChallenge);
    }
}
// set the current challenge and close all challenge screens
farming.Game.prototype.selectChallenge = function(challenge){
    for(var i in challenge.requirements) {
        var requirement = challenge.requirements[i];
        if(requirement.type === 'item') {
            lime.scheduleManager.callAfter(function() {
                this.game.removeItem(this.requirement.key, this.requirement.number);
            }, {game: this, requirement: requirement}, i * 1000);
        }
    }
    this.player.currentChallenge = challenge;
    this.player.currentChallenge.exercisesDone = [];
    if(this.director.getCurrentScene() != this.sceneChallengeDetails) this.director.popScene();
    if(this.director.getCurrentScene() != this.sceneChallenge) this.director.popScene();
    this.showChallenge();
}
// remove the current challenge and close all challenge screens
farming.Game.prototype.giveUpChallenge = function(){
    this.player.currentChallenge = null;
    if(this.director.getCurrentScene() == this.sceneChallengeDetails) this.director.popScene();
    if(this.director.getCurrentScene() == this.sceneChallenge) this.director.popScene();
    this.showChallenge();
}
// complete the current challenge, remove all the items and close all challenge screens
farming.Game.prototype.completeChallenge = function(){
    for(var i in this.player.currentChallenge.rewards) {
        var reward = this.player.currentChallenge.rewards[i];
        if(reward.type === 'item') {
            lime.scheduleManager.callAfter(function() {
                this.game.addItem(this.reward.key, this.reward.number);
            }, {game: this, reward: reward}, i * 1000);
        }
        if(reward.type === 'coins') {
            lime.scheduleManager.callAfter(function() {
                this.game.addCoins(this.reward.number);
            }, {game: this, reward: reward}, i * 1000);
        }
    }
    this.player.currentChallenge = null;
    if(this.director.getCurrentScene() == this.sceneChallengeDetails) this.director.popScene();
    if(this.director.getCurrentScene() == this.sceneChallenge) this.director.popScene();
    this.showChallenge();
}
// close the challenge overview screen
farming.Game.prototype.closeChallenge = function(){
    if(this.director.getCurrentScene() == this.sceneChallenge) this.director.popScene();
}
// show the challenge details screen for input.challenge
farming.Game.prototype.showChallengeDetails = function(challenge){
    this.sceneChallengeDetails = new farming.SceneChallengeDetails(this);
    this.sceneChallengeDetails.setChallenge(challenge, !!(this.player.currentChallenge));
    this.director.pushScene(this.sceneChallengeDetails);
}
// go back from the details screen to the overview screen
farming.Game.prototype.backChallengeDetails = function(){
    if(this.director.getCurrentScene() != this.sceneChallengeDetails) return;
    this.director.popScene();
}
// go back from the details screen to the map screen
farming.Game.prototype.closeChallengeDetails = function(){
    if(this.director.getCurrentScene() != this.sceneChallengeDetails) return;
    this.director.popScene();
    if(this.director.getCurrentScene() != this.sceneChallenge) return;
    this.director.popScene();
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
    this.sceneMap.itemAnimation(type, amount);
    return this.player.inventory[type];
}
farming.Game.prototype.removeItem = function(type, amount) {
    if(!this.hasItem(type, amount)) return false;
    this.player.inventory[type] -= amount;
    this.sceneMap.itemAnimation(type, -amount);
    return this.player.inventory[type];
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

// -- BODY --
farming.Game.prototype.addPoints = function(bodypart, amount) {
    if(this.player.body[bodypart]) {
        this.player.body[bodypart] += amount;
    } else {
        this.player.body[bodypart] = amount;
    }
    return this.player.body[bodypart];
}
farming.Game.prototype.getPoints = function(bodypart) {
    if(this.player.body[bodypart])
        return this.player.body[bodypart];

    return 0;
}

// -- Game methods --
farming.Game.prototype.getFullSize = function(percent) {
    var ratio = typeof percent == 'undefined' ? 1 : percent;
    return new goog.math.Size(this.screen.width * ratio, this.screen.height * ratio);
}

farming.Game.prototype.getCenterPosition = function() {
    return new goog.math.Coordinate(this.screen.width / 2, (this.screen.height - SETTINGS.size.controls.height) / 2)
}
