goog.provide('farming.Livestock');

goog.require('lime.audio.Audio');
goog.require('farming.Settings');

/**
 * Livestock elements
 *
 */
farming.Livestock = function(type, saved, tile) {
    goog.base(this);
    this.setAnchorPoint(0.5, 0.63); //0.5, 0.58
    this.setSize(200 *0.6, 169*0.6);
    this.tile = tile;

    if(typeof saved != 'undefined' && saved) {
        this.deserialize(saved);
    } else {
        this.start(type);
    }
}

goog.inherits(farming.Livestock,farming.Sprite);

farming.Livestock.prototype.timesHarvested = 0;
farming.Livestock.prototype.startTime = null;
farming.Livestock.prototype.feedTime = null;
farming.Livestock.prototype.harvestTime = null;
farming.Livestock.prototype.type = null;
farming.Livestock.prototype.prop = null;
farming.Livestock.prototype.appearance = null;

farming.Livestock.prototype.start = function(type){
    this.startTime = this.getCurrentTime();
    this.harvestTime = this.getCurrentTime();
    this.feedTime = this.getCurrentTime();
    this.type = type;
    this.prop = LIVESTOCK[type];
    this.appearance = Math.ceil(Math.random() * this.prop.appearances);
    this.showProgress();


}
farming.Livestock.prototype.serialize = function(){
    return {timesHarvested : this.timesHarvested, startTime : this.startTime, feedTime : this.feedTime, harvestTime : this.harvestTime, type : this.type, appearance : this.appearance};
}
farming.Livestock.prototype.deserialize = function(saved) {
    this.timesHarvested = saved.timesHarvested;
    this.harvestTime = saved.harvestTime;
    this.startTime = saved.startTime;
    this.feedTime = saved.feedTime;
    this.type = saved.type;
    this.prop = LIVESTOCK[saved.type];
    this.appearance = saved.appearance;
    this.showProgress();
}


farming.Livestock.prototype.showProgress = function(){
    this.removeAllChildren();

    if (this.isHarvestable()) {
        this.setFill('images/livestock/'+ this.type + this.appearance + '_harvestable.png');
    } else {
        this.setFill('images/livestock/'+ this.type + this.appearance + '.png');
    }
    this.tile.updateFence();
    this.tile.updateColor();
}

farming.Livestock.prototype.getCurrentTime = function(){
    return new Date().getTime() / 1000;
}
farming.Livestock.prototype.getElapsedTime = function(){
    return this.getCurrentTime() - this.startTime;
}
farming.Livestock.prototype.getTimeTillHarvest = function(){
    // Not yet fed after last harvest!
    if(this.feedTime < this.harvestTime){
        return null;
    }
    else{
        return Math.round((this.prop.time_between_harvests - (this.getCurrentTime() - this.feedTime))/60);
    }
}

// If the livestock is not fed yet after the 'harvest' it is hungry
farming.Livestock.prototype.isHungry = function() {
    return (this.feedTime < this.harvestTime);
}

farming.Livestock.prototype.isHarvestable = function() {
    if (this.feedTime >= this.harvestTime)
        return (this.getCurrentTime() - this.feedTime) > this.prop.time_between_harvests;
    else
        return false;
}

farming.Livestock.prototype.getFood = function(){
    return this.prop.food;
}
farming.Livestock.prototype.isRotten = function(){
    return false;
}

farming.Livestock.prototype.feed = function(){
    this.playSound();
    if (this.feedTime < this.harvestTime){
        this.feedTime = this.getCurrentTime();
    }
    this.showProgress();
    return true;
}
farming.Livestock.prototype.harvest = function(){
    this.timesHarvested++;
    this.harvestTime = this.getCurrentTime();
    this.showProgress();
    return false;
}

farming.Livestock.prototype.playSound = function(){
    if(this.parent_ && this.parent_.game && this.parent_.game.player.settings.sound === false) {
        return;
    }

    if (typeof device != 'undefined' && device.platform == "Android") {
        var sound = new Media('file:///android_asset/www/'+this.type+'.ogg');
        sound.play();
    } else {
        var sound = new lime.audio.Audio('sounds/'+this.type+'.ogg');
        if (sound.isLoaded() && !sound.isPlaying()) {
            sound.play();
        }
    }
}


farming.Livestock.prototype.tick = function(){
    this.showProgress();
}

var LIVESTOCK = {
    polychick : {
        name: 'Polychick',
        key: 'polychick',
        appearances: 1,
        cost: 75,
        revenue: 20,
        revenue_item: 'egg',
        food: 'space_wheat',
        time_between_harvests: 45 * SETTINGS.timeUnit(),
        exercise: 'dynamic_chest',
        required_level: 1
    },
    woolybot : {
        name: 'Woolybot',
        key: 'woolybot',
        appearances: 2,
        cost: 120,
        revenue: 40,
        revenue_item: 'wool',
        food: 'space_wheat',
        time_between_harvests: 120 * SETTINGS.timeUnit(),
        exercise: 'sky_kicks',
        required_level: 2
    },
    piggium : {
        name: 'Piggium',
        key: 'piggium',
        appearances: 2,
        cost: 200,
        revenue: 75,
        revenue_item: 'bacon',
        food: 'space_apple',
        time_between_harvests: 240 * SETTINGS.timeUnit(),
        exercise: 'bear_hug',
        required_level: 3
    },
    milkatron : {
        name: 'Milkatron',
        key: 'milkatron',
        appearances: 2,
        cost: 300,
        revenue: 100,
        revenue_item: 'milk',
        food: 'diamond',
        time_between_harvests: 360 * SETTINGS.timeUnit(),
        exercise: 'high_knees',
        required_level: 3
    }
};

