goog.provide('farming.Livestock');
goog.require('lime.Sprite');
goog.require('lime.audio.Audio');

/**
 * Livestock elements
 *
 */
farming.Livestock = function(type, saved) {
    goog.base(this);
    this.setAnchorPoint(0.5, 0.63); //0.5, 0.58
    this.setSize(80, 60);


    if(typeof saved != 'undefined') {
        this.deserialize(saved);
    } else {
        this.start(type);
    }
}

goog.inherits(farming.Livestock,lime.Sprite);

farming.Livestock.prototype.timesHarvested = 0;
farming.Livestock.prototype.startTime = null;
farming.Livestock.prototype.feedTime = null;
farming.Livestock.prototype.firstFeed = null;
farming.Livestock.prototype.harvestTime = null;
farming.Livestock.prototype.type = null;
farming.Livestock.prototype.prop = null;
farming.Livestock.prototype.appearance = null;

farming.Livestock.prototype.start = function(type){
    this.startTime = this.getCurrentTime();
    this.harvestTime = this.getCurrentTime();
    this.feedTime = this.getCurrentTime();
    // First feed time after the last harvest;
    this.firstFeed = this.getCurrentTime();
    this.type = type;
    this.prop = LIVESTOCK[type];
    this.appearance = Math.ceil(Math.random() * this.prop.appearances);
    this.showProgress();


}
farming.Livestock.prototype.serialize = function(){
    return {timesHarvested : this.timesHarvested, startTime : this.startTime, feedTime : this.feedTime, harvestTime : this.harvestTime, firstFeed : this.firstFeed, type : this.type, appearance : this.appearance};
}
farming.Livestock.prototype.deserialize = function(saved) {
    this.timesHarvested = saved.timesHarvested;
    this.harvestTime = saved.harvestTime;
    this.startTime = saved.startTime;
    this.feedTime = saved.feedTime;
    this.firstFeed = saved.firstFeed;
    this.type = saved.type;
    this.prop = LIVESTOCK[saved.type];
    this.appearance = saved.appearance;
    this.showProgress();
}


farming.Livestock.prototype.showProgress = function(){
    this.removeAllChildren();

    // Healthbar
    /*
    var healthbaroffset = -40;
    this.appendChild(new farming.Sprite().setFill(SETTINGS.color.green).setSize(100, 10).setPosition(0, healthbaroffset));
    this.appendChild(new farming.Sprite().setFill(SETTINGS.color.red).setSize(Math.min(100 * this.getHungriness(), 100), 10).setAnchorPoint(1,0.5).setPosition(50, healthbaroffset));
    this.appendChild(new lime.Label().setFontSize(10).setText('Food stock').setPosition(0,healthbaroffset));
    */
    //if (this.isDead()) {
    //    this.setFill('images/livestock/'+ this.type + this.appearance + '_dead.png');
    //} else 
    if (this.isHarvestable()) {
        this.setFill('images/livestock/'+ this.type + this.appearance + '_harvestable.png');
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
farming.Livestock.prototype.getTimeTillHarvest = function(){
	// Not yet fed after last harvest!
	if(this.firstFeed < this.harvestTime){
		return null;
	}
	else{
		return Math.round((this.prop.time_between_harvests - (this.getCurrentTime() - this.firstFeed))/60);
	}
}

// Get a partial of how close this livestock is to dying (1 == dead)
/*farming.Livestock.prototype.getHungriness = function() {
    var lastFed = this.feedTime ? this.feedTime : this.startTime;
    // Livestock dies in 12 h / level
    return (this.getCurrentTime() - lastFed) / (12 * 60 * 60 * this.prop.required_level);//(this.prop.time_between_harvests * 4);
}*/

// If the chicken is not fed yet after the 'harvest' it is hungry 
farming.Livestock.prototype.isHungry = function() {
    console.log('isHungry: '+(this.firstFeed<this.harvestTime));
	return (this.firstFeed < this.harvestTime);
}

/*
farming.Livestock.prototype.isDead = function() {
    return this.getHungriness() >= 1;
}
*/

farming.Livestock.prototype.isHarvestable = function() {
    //if (this.isDead()) return false;
    if (this.firstFeed >= this.harvestTime)
    	return (this.getCurrentTime() - this.firstFeed) > this.prop.time_between_harvests;
    else
    	return false;
}

farming.Livestock.prototype.getFood = function(){
    return this.prop.food;
}

farming.Livestock.prototype.feed = function(){
    //if (this.isDead()) return false;
    this.playSound();
    if (this.firstFeed < this.harvestTime){
    	this.firstFeed = this.getCurrentTime();
    	console.log('firstFeed updated');
    }
    this.feedTime = this.getCurrentTime();
    this.showProgress();
    return true;
}
farming.Livestock.prototype.harvest = function(){
    //if (this.isDead()) return true;
    this.timesHarvested++;
    this.harvestTime = this.getCurrentTime();
    this.showProgress();
    return false;
}

// farming.Livestock.prototype.playSound = function(){
//     var sound = new lime.audio.Audio('sounds/'+this.type+'.ogg');
//     if (sound.isLoaded() && !sound.isPlaying()) {
//         sound.play();
//     }
// }

farming.Livestock.prototype.playSound = function(){

    //  var mp3URL = getMediaURL("sounds/"+this.type+".ogg");
    // var media = new Media(mp3URL, null, mediaError);
    // media.play();

    
     if (typeof device != 'undefined' && device.platform == "Android") {
        console.log("I am in play sound function in android");
        var sound = new Media('file:///android_asset/www/'+this.type+'.ogg');
        //if (sound.isLoaded() && !sound.isPlaying()) {
         
            sound.play();
              //}
          }
         
       else {
        console.log("I am in the limejs sound")
           var sound = new lime.audio.Audio('sounds/'+this.type+'.ogg');
           if (sound.isLoaded() && !sound.isPlaying()) {
             sound.play();
             } 
         }

  
    //var sound = new Media("/android_asset/www/sounds/"+this.type+ ".ogg");
    // var sound = new Media('sounds/'+this.type+'.ogg');
    // if (sound.isLoaded() && !sound.isPlaying()) {
    //     sound.play();
    // }

    // var sound = new lime.audio.Audio('sounds/'+this.type+'.ogg');
    // if (sound.isLoaded() && !sound.isPlaying()) {
    //     console.log("sound is loaded");
    //     sound.play();
    // }
}

farming.Livestock.prototype.showWarning = function(){
    //TODO show a warning sign that there is no food
}

farming.Livestock.prototype.tick = function(){
    //automatic feeding of livestock
    /*
     * if(this.isHungry()) {
        if(this.parent_ && this.parent_.game && this.parent_.game.hasItem(this.getFood())) {
            this.parent_.game.removeItem(this.getFood(), 1, this.parent_.getPosition());
            this.feed();
        } else {
            this.showWarning();
        }
    }
    */
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
        time_between_harvests: 45, //*60,
        exercise: 'butterflies',
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
        time_between_harvests: 2 * 60 * 60,
        exercise: 'apple_picking',
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
        time_between_harvests: 4 * 60 * 60,
        exercise: 'apple_picking',
        required_level: 3
    },
    milkatron : {
        name: 'Milkatron',
        key: 'milkatron',
        appearances: 2,
        cost: 300,
        revenue: 100,
        revenue_item: 'milk',
        food: 'space_wheat',
        time_between_harvests: 6 * 60 * 60 ,
        exercise: 'apple_picking',
        required_level: 3
    }
};

