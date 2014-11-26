goog.provide('farming.Tile');
goog.require('lime.Sprite');

/**
 * Tile elements
 * 
 * @param {} gameObj
 */
farming.Tile = function(settings, playerObj) {
    goog.base(this);
    this.setSize(settings.tiles.width, settings.tiles.height);
    this.enable();

	var tile = this;

	//growing plants
	dt = 1000;

}

goog.inherits(farming.Tile,lime.Sprite);

farming.Tile.prototype.crop = null;
farming.Tile.prototype.disabled = false;

farming.Tile.prototype.setCrop = function(crop){
    if(!crop) {
        this.removeAllChildren();
        this.crop = null;
    } else if(this.isEmpty()){
        this.crop = crop;
        this.appendChild(crop);
    }
}
farming.Tile.prototype.getCrop = function(){
    return this.crop
}
farming.Tile.prototype.isRipe = function(){
    return this.crop && this.crop.isRipe();
}
farming.Tile.prototype.disable = function(){
    this.disabled = true;
    this.setFill('');
}
farming.Tile.prototype.enable = function(){
    this.disabled = false;
    this.setFill('images/tile.png');
}
farming.Tile.prototype.isEmpty = function(){
    return !this.disabled && !this.crop;
}
farming.Tile.prototype.timePassed = function(currentTime){
    if(this.crop) this.crop.timePassed(currentTime);
}