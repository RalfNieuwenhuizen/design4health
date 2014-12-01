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
        time_to_ripe: 5,
        time_to_death: 5,
        harvests: 3,
        exercise: {
            title : '\"Apple Picking\"',
            description : 'Start from standing up straight' +
            '\n\n Raise one arm (with the phone in hand) as high as you can, while you raise your opposite ' +
            'knee until you have a 90 degrees angle both between legs and core and between upper ' +
            'and lower leg' +
            '\n\n Finally, try to keep this stance while standing on your toes' +
            '\n\n Repeat on the other side (switch the phone hand!)',
            example_frames: 7,
            callback : 'harvestAppleTree'
        }
    },
    wheat : {
        name: 'Wheat',
        key: 'wheat',
        growth_phases: 2,
        cost: 10,
        revenue: 15,
        time_to_ripe: 1,
        time_to_death: 10,
        harvests: 1,
        exercise: {
            title : 'Arm circles',
            description : 'Stand up and extend your arms straight out by the sides. The arms should be parallel to ' +
            'the floor and perpendicular to your torso' +
            '\n\n Slowly start to make circles of about 1 foot in diameter with each outstretched arm. ' +
            'Breathe normally as you perform the movement' +
            '\n\n Continue the circular motion of the outstretched arms for about ten seconds' +
            '\n\n Then reverse the movement, going the opposite direction',
            example_frames: 20,
            callback : 'harvestWheat'
        }
    }
};

