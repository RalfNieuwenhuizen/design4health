goog.provide('farming.Crop');
goog.require('lime.Sprite');

/**
 * Crop elements
 *
 */
farming.Crop = function(type) {
    goog.base(this);
    this.setAnchorPoint(0.5, 0.58);
    this.setSize(120, 120);

	var crop = this;
    this.start(type);



}
goog.inherits(farming.Crop,lime.Sprite);

farming.Crop.prototype.timesHarvested = 0;
farming.Crop.prototype.startTime = null;
farming.Crop.prototype.type = null;
farming.Crop.prototype.prop = null;
farming.Crop.prototype.dead = false;

farming.Crop.prototype.start = function(type){
    this.startTime = this.getCurrentTime();
    this.type = type;
    this.prop = CROPS[type];
    this.showProgress();
}
farming.Crop.prototype.showProgress = function(){
    var progress = this.getProgress();
    var suffix = this.isDead() ? '_dead' : this.isRotten() ? '_rotten' : progress == 1 ? '_ripe' : this.timesHarvested == 0 ? Math.floor(progress*this.prop.growth_phases) : this.prop.growth_phases - 1;
    this.setFill('images/'+this.type+suffix+'.png');
}
farming.Crop.prototype.getCurrentTime = function(){
    return new Date().getTime() / 1000;
}
farming.Crop.prototype.getElapsedTime = function(){
    return this.getCurrentTime() - this.startTime;
}
farming.Crop.prototype.getProgress = function(){
    return Math.min(this.getElapsedTime() / this.prop.time_to_ripe, 1);
}
farming.Crop.prototype.isRipe = function(){
    return this.getProgress() == 1;
}
farming.Crop.prototype.isRotten = function(){
    return false;
    return this.getElapsedTime() / (this.prop.time_to_ripe+this.prop.time_to_death) >= 1;
}
farming.Crop.prototype.isDead = function(){
    return this.dead;
}
farming.Crop.prototype.die = function(){
    this.dead = true;
    this.showProgress();
}
farming.Crop.prototype.tick = function(){
    this.showProgress();
}
farming.Crop.prototype.harvest = function(){
    this.timesHarvested++;
    if(this.timesHarvested == this.prop.harvests) return true;
    this.startTime = this.getCurrentTime();
    this.showProgress();
    return false;
}
var CROPS = {
    apple_tree : {
        name: 'Apple tree',
        key: 'apple_tree',
        growth_phases: 3,
        cost: 20,
        revenue: 10,
        revenue_item: 'space_apple',
        time_to_ripe: 5,
        time_to_death: 5,
        harvests: 3,
        exercise: {
            key : 'apple_picking',
            callback : 'harvestAppleTree'
        }
    },
    wheat : {
        name: 'Wheat',
        key: 'wheat',
        growth_phases: 2,
        cost: 10,
        revenue: 15,
        revenue_item: 'space_wheat',
        time_to_ripe: 1,
        time_to_death: 10,
        harvests: 1,
        exercise: {
            key : 'arm_circles',
            callback : 'harvestWheat'
        }
    }
};

