goog.provide('farming.Livestock');
goog.require('lime.Sprite');
goog.require('lime.audio.Audio');

/**
 * Livestock elements
 *
 */
farming.Livestock = function(type) {
    goog.base(this);
    this.setAnchorPoint(0.5, 0.63); //0.5, 0.58
    this.setSize(80, 60);

    this.start(type);
}

goog.inherits(farming.Livestock,lime.Sprite);

farming.Livestock.prototype.timesHarvested = 0;
farming.Livestock.prototype.startTime = null;
farming.Livestock.prototype.feedTime = null;
farming.Livestock.prototype.harvestTime = null;
farming.Livestock.prototype.type = null;
farming.Livestock.prototype.prop = null;
farming.Livestock.prototype.appearance = null;

farming.Livestock.prototype.start = function(type){
    this.startTime = this.getCurrentTime();
    this.type = type;
    this.prop = LIVESTOCK[type];
    this.appearance = Math.ceil(Math.random() * this.prop.appearances);
    this.showProgress();
}
farming.Livestock.prototype.showProgress = function(){
    this.removeAllChildren();

    // Healthbar
    var healthbaroffset = -40;
    this.appendChild(new farming.Sprite().setFill(SETTINGS.color.green).setSize(100, 10).setPosition(0, healthbaroffset));
    this.appendChild(new farming.Sprite().setFill(SETTINGS.color.red).setSize(Math.min(100 * this.getHungriness(), 100), 10).setAnchorPoint(1,0.5).setPosition(50, healthbaroffset));

    if (this.isDead()) {
        this.setFill('images/livestock/'+ this.type + this.appearance + '_dead.png');
    } else if (this.isHungry()) {
        this.setFill('images/livestock/'+ this.type + this.appearance + '_hungry.png');
    } else {
        this.setFill('images/livestock/'+ this.type + this.appearance + '.png');
    }
}
farming.Livestock.prototype.getCurrentTime = function(){
    return new Date().getTime() / 1000;
}
farming.Livestock.prototype.getElapsedTime = function(){
    return this.getCurrentTime() - this.startTime;
}

// Get a partial of how close this livestock is to dying (1 == dead)
farming.Livestock.prototype.getHungriness = function() {
    var lastFed = this.feedTime ? this.feedTime : this.startTime;
    return (this.getCurrentTime() - lastFed) / (this.prop.time_between_harvests * 4);
}

farming.Livestock.prototype.isHungry = function() {
    return this.getHungriness() >= 0.5;
}
farming.Livestock.prototype.isDead = function() {
    return this.getHungriness() >= 1;
}
farming.Livestock.prototype.isHarvestable = function() {
    if (this.isDead() || this.isHungry()) return false;
    return (this.getCurrentTime() - this.harvestTime) > this.prop.time_between_harvests;
}

farming.Livestock.prototype.getFood = function(){
    return this.prop.food;
}

farming.Livestock.prototype.feed = function(){
    if (this.isDead()) return false;
    this.playSound();
    this.feedTime = this.getCurrentTime();
    this.showProgress();
    return true;
}
farming.Livestock.prototype.harvest = function(){
    if (this.isDead()) return true;
    this.timesHarvested++;
    this.harvestTime = this.getCurrentTime();
    this.showProgress();
    return false;
}

farming.Livestock.prototype.playSound = function(){
    var sound = new lime.audio.Audio('sounds/'+this.type+'.ogg');
    sound.play();
}

farming.Livestock.prototype.tick = function(){
    this.showProgress();
}

var LIVESTOCK = {
    woolybot : {
        name: 'Woolybot',
        key: 'woolybot',
        appearances: 2,
        cost: 20,
        revenue: 10,
        revenue_item: 'wool',
        food: 'space_wheat',
        time_between_harvests: 8,
        exercise: {
            key : 'apple_picking'
        }
    },
    polychick : {
        name: 'Polychick',
        key: 'polychick',
        appearances: 2,
        cost: 15,
        revenue: 10,
        revenue_item: 'egg',
        food: 'space_wheat',
        time_between_harvests: 5,
        exercise: {
            key : 'apple_picking'
        }
    },
    piggium : {
        name: 'Piggium',
        key: 'piggium',
        appearances: 2,
        cost: 10,
        revenue: 50,
        revenue_item: 'pork',
        food: 'space_apple',
        time_between_harvests: 1440,
        exercise: {
            key : 'apple_picking'
        }
    },
    milkatron : {
        name: 'Milkatron',
        key: 'milkatron',
        appearances: 2,
        cost: 100,
        revenue: 40,
        revenue_item: 'milk',
        food: 'space_wheat',
        time_between_harvests: 240,
        exercise: {
            key : 'apple_picking'
        }
    }
};

