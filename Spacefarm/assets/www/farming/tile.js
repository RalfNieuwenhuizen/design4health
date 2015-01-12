goog.provide('farming.Tile');

goog.require('farming.Sprite');
goog.require('lime.Polygon');
goog.require('farming.Settings');

/**
 * Tile elements
 *
 * @param game
 */
farming.Tile = function (game,x,y) {
    goog.base(this);
    this.game = game;
    this.x = x;
    this.y = y;
    this.setSize(SETTINGS.size.tiles);
    this.enable();

    var tile = this;
}

goog.inherits(farming.Tile, farming.Sprite);

farming.Tile.prototype.crop = null;
farming.Tile.prototype.livestock = null;
farming.Tile.prototype.disabled = false;
farming.Tile.prototype.fence4 = false;
farming.Tile.prototype.fence3 = false;
farming.Tile.prototype.fence2 = false;
farming.Tile.prototype.fence1 = false;

farming.Tile.prototype.serialize = function(){
    var crop = this.crop ? this.crop.serialize() : null;
    var livestock = this.livestock ? this.livestock.serialize() : null;
    return {crop : crop, livestock : livestock};
}
farming.Tile.prototype.deserialize = function(save){
    this.crop = null; this.livestock = null;
    if(save.crop)
        this.addCrop(new farming.Crop(null, save.crop, this));
    if(save.livestock)
        this.addLivestock(new farming.Livestock(null, save.livestock, this));
}
farming.Tile.prototype.addCrop = function (crop) {
    if (!this.isEmpty() || !crop) return false;
    this.crop = crop;
    this.appendChild(crop);
    this.game.tickables.push(crop);
    this.game.source.dispatchEvent(this.game.EventType.CROP_CLONED);
    this.updateColor();
}
farming.Tile.prototype.addLivestock = function (livestock) {
    if (!this.isEmpty() || !livestock) return false;
    this.livestock = livestock;
    this.fence4 = new farming.Sprite('images/fence4.png').setSize(200,169).setAnchorPoint(0.5, 0.63);
    this.fence3 = new farming.Sprite('images/fence3.png').setSize(200,169).setAnchorPoint(0.5, 0.63);
    this.fence2 = new farming.Sprite('images/fence2.png').setSize(200,169).setAnchorPoint(0.5, 0.63);
    this.fence1 = new farming.Sprite('images/fence1.png').setSize(200,169).setAnchorPoint(0.5, 0.63);

    this.appendChild(this.fence4).appendChild(this.fence3)
        .appendChild(livestock).appendChild(this.fence2).appendChild(this.fence1);

    this.game.tickables.push(livestock);
    this.updateColor();
}

farming.Tile.prototype.updateFence = function () {
    var tile = this;
    lime.scheduleManager.callAfter(function () {
        if(!tile.fence4) return;
        tile.fence4.setHidden(tile.isSameNeighbour(-1,0));
        tile.fence3.setHidden(tile.isSameNeighbour(0,-1));
        tile.fence2.setHidden(tile.isSameNeighbour(1,0));
        tile.fence1.setHidden(tile.isSameNeighbour(0,1));
    }, this, 50);
}

farming.Tile.prototype.updateColor = function () {
    var item = this.getItem();
    if(this.disabled) return;
    if(!item) this.setFill(this.game.currentClone ? 'images/tile_cloning.png' : 'images/tile.png');
    else if(item.isRotten()) this.setFill('images/tile_rotten.png');
    else if(this.isHungry()) this.setFill('images/tile_hungry.png');
    else if(item.isHarvestable()) this.setFill('images/tile_ripe.png');
    else this.setFill('images/tile.png');
}
farming.Tile.prototype.removeItem = function () {
    this.removeAllChildren();
    this.crop = null;
    this.livestock = null;
    this.updateColor();
    // TODO remove item from the list of game.tickables
}
farming.Tile.prototype.isSameNeighbour = function (rx,ry) {

    if(typeof this.game.sceneMap.tiles[this.x+rx][this.y+ry] == 'undefined') return false;
    if(!this.game.sceneMap.tiles[this.x+rx][this.y+ry].livestock) return false;
    return this.game.sceneMap.tiles[this.x+rx][this.y+ry].livestock.type == this.livestock.type;
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
    return this.isHarvestable() || (this.livestock && this.livestock.isHarvestable());
}
farming.Tile.prototype.isHarvestable = function () {
    return this.crop && this.crop.isHarvestable();
}

farming.Tile.prototype.isHungry = function () {
    return this.livestock && this.livestock.isHungry();
}
farming.Tile.prototype.isDead = function () {
    return this.crop && this.crop.isDead();
}

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
farming.Tile.prototype.showProgress = function() {
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
    if (this.livestock != null) {
        var food = this.getItem().getFood();

        if (this.isHungry()) {
            icon.setFill('images/items/' + food + '.png').setSize(40, 30);
            // If no food left for the animal
            if (!this.game.hasItem(this.livestock.getFood())){
                label.setText('Not in \n stock');
            } else {
                bg.setAction(this.feedTile, this);
                label.setText('Feed now').setPosition(16, 0).setFontWeight('bold');
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

farming.Tile.prototype.feedTile = function(tile){
    if (tile.game.hasItem(tile.livestock.getFood()) && tile.isHungry()){
        tile.game.removeItem(tile.livestock.getFood());
        tile.livestock.feed();
        tile.showProgress();
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