goog.provide('farming.Crop');

goog.require('farming.Sprite');
goog.require('farming.Settings');

/**
 * Crop elements
 *
 */
farming.Crop = function(type, saved, tile) {

    goog.base(this);
    this.setAnchorPoint(0.5, 0.63); //0.5, 0.58
    this.setSize(200, 169);
    this.tile = tile;
    var crop = this;

    if(typeof saved != 'undefined' && saved) {
        this.deserialize(saved);
    } else {
        this.start(type);
    }



}
goog.inherits(farming.Crop, farming.Sprite);

farming.Crop.prototype.timesHarvested = 0;
farming.Crop.prototype.startTime = null;
farming.Crop.prototype.type = null;
farming.Crop.prototype.prop = null;

farming.Crop.prototype.start = function(type){
    this.startTime = this.getCurrentTime();
    this.type = type;
    this.prop = CROPS[type];
    this.showProgress();
}
farming.Crop.prototype.serialize = function(){
    return {timesHarvested : this.timesHarvested, startTime : this.startTime, type : this.type};
}
farming.Crop.prototype.deserialize = function(saved){
    this.startTime = saved.startTime;
    this.timesHarvested = saved.timesHarvested;
    this.type = saved.type;
    this.prop = CROPS[saved.type];
    this.showProgress();
}
farming.Crop.prototype.showProgress = function(){
    this.removeAllChildren();

    var progress = this.getProgress();
    var suffix = this.isDead() ? '_dead' :
        this.isRotten() ? '_rotten' :
            progress == 1 ? '_ripe' :
                this.timesHarvested == 0 ? Math.floor(progress*this.prop.growth_phases) :
                this.prop.growth_phases - 1;
    this.setFill('images/crops/'+ this.type + suffix + '.png');

    this.tile.updateColor();
}
farming.Crop.prototype.getCurrentTime = function(){
    return new Date().getTime() / 1000;
}
farming.Crop.prototype.getElapsedTime = function(){
    return this.getCurrentTime() - this.startTime;
}
farming.Crop.prototype.getHarvestTime = function(){
    return this.startTime + this.prop.time_to_ripe;
}
farming.Crop.prototype.getProgress = function(){
    return Math.min(this.getElapsedTime() / this.prop.time_to_ripe, 1);
}
farming.Crop.prototype.getTimeTillHarvest = function(){
    return Math.round((this.prop.time_to_ripe - this.getElapsedTime())/60);
}
farming.Crop.prototype.isHarvestable = function(){
    if (this.isDead() || this.isRotten()) return false;

    return this.getProgress() == 1;
}
farming.Crop.prototype.isRotten = function(){
    if(this.isDead()) return false;
    // Rotting time is one day after it is ripe
    return this.getElapsedTime() > this.prop.time_to_ripe + 24*60*60;
}
farming.Crop.prototype.isDead = function(){
    return (this.timesHarvested == this.prop.harvests);
}

farming.Crop.prototype.tick = function(){
    this.showProgress();
}

farming.Crop.prototype.harvest = function(){
    if (this.isDead()) return false;
    this.timesHarvested++;
    if ((this.timesHarvested == this.prop.harvests) && this.prop.harvests == 1) {
        this.tile.removeItem();
    }
    this.startTime = this.getCurrentTime();
    this.showProgress();
    return false;
}

var CROPS = {
    wheat : {
        name: 'Space Wheat',
        key: 'wheat',
        growth_phases: 2,
        cost: 10,
        revenue: 15,
        revenue_item: 'space_wheat',
        time_to_ripe: 10 * SETTINGS.timeUnit(),
        harvests: 1,
        exercise: 'back_circles',
        required_level: 1
    },
    carrot : {
        name: 'Space Carrots',
        key: 'carrot',
        growth_phases: 4,
        cost: 30,
        revenue: 50,
        revenue_item: 'carrot',
        time_to_ripe: 45 * SETTINGS.timeUnit(),
        harvests: 1,
        exercise: 'situps',
        required_level: 1
    },
    apple_tree : {
        name: 'Space Apple tree',
        key: 'apple_tree',
        growth_phases: 3,
        cost: 40,
        revenue: 25,
        revenue_item: 'space_apple',
        time_to_ripe: 20 * SETTINGS.timeUnit(),
        harvests: 3,
        exercise: 'arm_stretches',
        required_level: 1
    },
    strawberry : {
        name: 'Space Berries',
        key: 'strawberry',
        growth_phases: 3,
        cost: 50,
        revenue: 75,
        revenue_item: 'strawberry',
        time_to_ripe: 90 * SETTINGS.timeUnit(),
        harvests: 1,
        exercise: 'mason_twist',
        required_level: 2
    },
    spirulina : {
        name: 'Diamond Spirulina',
        key: 'spirulina',
        growth_phases: 3,
        cost: 70,
        revenue: 35,
        revenue_item: 'diamond',
        time_to_ripe: 120 * SETTINGS.timeUnit(),
        harvests: 3,
        exercise: 'rocket_jumps',
        required_level: 3
    }
};

