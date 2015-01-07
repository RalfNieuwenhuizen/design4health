goog.provide('farming.Tile');
goog.require('farming.Sprite');
goog.require('lime.Polygon');

/**
 * Tile elements
 *
 * @param game
 */
farming.Tile = function (game) {
    goog.base(this);
    this.game = game;
    this.setSize(SETTINGS.size.tiles);
    this.enable();

    var tile = this;
}

goog.inherits(farming.Tile, farming.Sprite);

farming.Tile.prototype.crop = null;
farming.Tile.prototype.livestock = null;
farming.Tile.prototype.disabled = false;

farming.Tile.prototype.serialize = function(){
    var crop = this.crop ? this.crop.serialize() : null;
    var livestock = this.livestock ? this.livestock.serialize() : null;
    return {crop : crop, livestock : livestock};
}
farming.Tile.prototype.deserialize = function(save){
    this.crop = null; this.livestock = null;
    if(save.crop)
        this.addCrop(new farming.Crop(null, save.crop));
    if(save.livestock)
        this.addLivestock(new farming.Livestock(null, save.livestock));
}
farming.Tile.prototype.addCrop = function (crop) {
    if (!this.isEmpty() || !crop) return false;
    this.crop = crop;
    this.appendChild(crop);
    this.game.tickables.push(crop);
    this.game.source.dispatchEvent(this.game.EventType.CROP_CLONED);
}
farming.Tile.prototype.addLivestock = function (livestock) {
    if (!this.isEmpty() || !livestock) return false;
    this.livestock = livestock;
    this.appendChild(new farming.Sprite('images/cattlefence.png').setSize(SETTINGS.size.tiles));
    this.appendChild(livestock);
    this.game.tickables.push(livestock);
}
farming.Tile.prototype.removeItem = function () {
    this.removeAllChildren();
    this.crop = null;
    this.livestock = null;
    // TODO remove item from the list of game.tickables
}
farming.Tile.prototype.getItem = function () {
    if(this.crop) {
        return this.crop;
    } else if(this.livestock) {
        return this.livestock;
    }
    return false;
}
farming.Tile.prototype.canBeHarvested = function () {
    return this.isRipe() || (this.livestock && this.livestock.isHarvestable());
}
farming.Tile.prototype.isRipe = function () {
    return this.crop && this.crop.isRipe();
}

farming.Tile.prototype.isHungry = function () {
    return this.livestock && this.livestock.isHungry();
}
/*
farming.Tile.prototype.isDead = function () {
    return (this.crop && this.crop.isDead()) || (this.livestock && this.livestock.isDead());
}
*/
farming.Tile.prototype.isRotten = function () {
    return this.crop && this.crop.isRotten();
}
farming.Tile.prototype.disable = function () {
    this.disabled = true;
    this.setFill('');
}
farming.Tile.prototype.enable = function () {
    this.disabled = false;
    this.setFill('images/tile.png');
}
farming.Tile.prototype.isEmpty = function () {
    return !this.disabled && !this.crop && !this.livestock;
}

farming.Tile.prototype.playSound = function () {
    if (this.livestock)
        this.livestock.playSound();
}
farming.Tile.prototype.showProgress = function(tile){
    var progress = this.getItem().getTimeTillHarvest();

    if (progress == null){
    	progress = 'Not fed yet';
    }
    else{
    	progress = progress + ' min';
    }
    
    var bg = new farming.Sprite(SETTINGS.color.background_layer).setSize(130,45).setPosition(0,-60);
    var icon = new farming.Sprite('images/duration.png').setSize(20,20).setPosition(-40 ,0);
    var label = new lime.Label().setPosition(15,0).setMultiline(true).setText("Ready in \n"+progress);
    bg.appendChild(icon).appendChild(label);
    this.appendChild(bg);
    
    // If this is livestock
    if (this.livestock != null){
    	var food = this.getItem().getFood();
    	// TODO: change namespace to wheat_ripe instead of space_wheat_ripe
    	
    	if (tile.isHungry()){
    		bg.setAction(this.feedTile,tile);
	    	icon.setFill('images/crops/'+food+'_ripe.png').setSize(40,30);
	    	label.setText('Feed now').setPosition(16,0).setFontWeight('bold');
	    	
	    	// If no food left for the animal
			if (!tile.game.hasItem(tile.livestock.getFood())){
				label.setText('Not in \n stock');	
			}
    	}
    }
    
    var fade = new lime.animation.FadeTo(0).setDuration(4);
    bg.runAction(fade);
    goog.events.listen(fade,lime.animation.Event.STOP,function(){
        for(var i in this.targets) {
            var target = this.targets[i];
            target.parent_.removeChild(target);
        }
    });
}

//farming.Tile.prototype.showFoodMenu = function(tile){}

farming.Tile.prototype.feedTile = function(tile){
	if (tile.game.hasItem(tile.livestock.getFood())){
		tile.game.removeItem(tile.livestock.getFood());
		tile.livestock.feed();	
	}
}

farming.Tile.prototype.getExercise = function () {
    if (this.livestock) {
        return this.livestock.prop.exercise;
    } else if (this.crop) {
        return this.crop.prop.exercise;
    }
    return false;
}
farming.Tile.prototype.getName = function () {
    if (this.livestock) {
        return this.livestock.prop.name;
    } else if (this.crop) {
        return this.crop.prop.name;
    }
    return '';
}