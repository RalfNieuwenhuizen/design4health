goog.provide('farming.Body');
goog.require('lime.Layer');
goog.require('farming.Sprite');

/**
 * Crop elements
 *
 */
farming.Body = function(scale) {
    goog.base(this);

    if(!scale)
        scale = 1;

    this.bodyLayer = new lime.Layer();
    this.scale = scale;
    this.appendChild(this.bodyLayer);
}
goog.inherits(farming.Body,lime.Layer);

farming.Body.prototype.scale = null;

// redraw the inventory
farming.Body.prototype.redraw = function (body, position, showLevels) {
    if(position)
        this.position = position;

    var position = this.position;
    if(showLevels === false)
        this.hideLevels = true;

    if(this.bodyLayer) {
        var parent = this.bodyLayer.parent_;
        parent.removeChild(this.bodyLayer);
        this.bodyLayer = new lime.Layer();
        parent.appendChild(this.bodyLayer);
    }
    this.drawBase(position);
    this.drawArms(body.arms, new goog.math.Coordinate(position.x, position.y - (this.scale*2)));
    this.drawLegs(body.legs, new goog.math.Coordinate(position.x + (this.scale*2), position.y + (this.scale*47)));
    this.drawAbs(body.abs, position);
    this.drawChest(body.chest, new goog.math.Coordinate(position.x - (this.scale*1), position.y - (this.scale*30)));
}
farming.Body.prototype.drawBase= function (center) {
    var icon = new farming.Sprite('images/body/exoskeleton.png').setSize(this.scale*100, this.scale*200).setPosition(center);
    this.bodyLayer.appendChild(icon);
}
farming.Body.prototype.drawBack = function (number, center) {
    var level = this.getLevel(number)
    var icon = new farming.Sprite('images/body/back'+level+'.png').setSize(this.scale*50, this.scale*50).setPosition(center);
    var label = new lime.Label().setText(level).setSize(this.scale*10, this.scale*10).setPosition(center);

    this.bodyLayer.appendChild(icon);
    if(!this.hideLevels) {
        farming.Body.prototype.addPopup(icon, "back level " + this.getLevel(number) + ": " + number + "/" + this.getTargetXP(number) + " points");
        //this.bodyLayer.appendChild(label);
    }
}
farming.Body.prototype.drawArms = function (number, center) {
    var level = this.getLevel(number);
    var icon = new lime.Sprite().setFill('images/body/arms'+level+'.png').setSize(this.scale*74, this.scale*50).setPosition(center);
    var label = new lime.Label().setText(level).setSize(this.scale*10, this.scale*10).setPosition(center);

    this.bodyLayer.appendChild(icon);
    if(!this.hideLevels) {
        farming.Body.prototype.addPopup(icon, "arms level " + this.getLevel(number) + ": " + number + "/" + this.getTargetXP(number) + " points", -65);
        //this.bodyLayer.appendChild(label);
    }
}
farming.Body.prototype.drawLegs = function (number, center) {
    var level = this.getLevel(number);
    var icon = new lime.Sprite().setFill('images/body/legs'+level+'.png').setSize(this.scale*55, this.scale*85).setPosition(center);
    var label = new lime.Label().setText(level).setSize(this.scale*10, this.scale*10).setPosition(center);

    this.bodyLayer.appendChild(icon);
    if(!this.hideLevels) {
        farming.Body.prototype.addPopup(icon, "legs level " + this.getLevel(number) + ": " + number + "/" + this.getTargetXP(number) + " points");
        //this.bodyLayer.appendChild(label);
    }
}
farming.Body.prototype.drawChest = function (number, center) {
    var level = this.getLevel(number);
    var icon = new lime.Sprite().setFill('images/body/chest'+level+'.png').setSize(this.scale*60, this.scale*30).setPosition(center);
    var label = new lime.Label().setText(level).setSize(this.scale*10, this.scale*10).setPosition(center);

    this.bodyLayer.appendChild(icon);
    if(!this.hideLevels) {
        farming.Body.prototype.addPopup(icon, "chest level " + this.getLevel(number) + ": " + number + "/" + this.getTargetXP(number) + " points", -30);
        //this.bodyLayer.appendChild(label);
    }
}
farming.Body.prototype.drawAbs = function (number, center) {
    var level = this.getLevel(number);
    var icon = new lime.Sprite().setFill('images/body/abs'+level+'.png').setSize(this.scale*50, this.scale*50).setPosition(center);
    var label = new lime.Label().setText(level).setSize(this.scale*10, this.scale*10).setPosition(center);

    this.bodyLayer.appendChild(icon);
    if(!this.hideLevels) {
        farming.Body.prototype.addPopup(icon, "abs level " + this.getLevel(number) + ": " + number + "/" + this.getTargetXP(number) + " points", 60);
        //this.bodyLayer.appendChild(label);
    }
}

// Mouseover / mouseout
farming.Body.prototype.addPopup = function (target, text, yPos) {
    var xPos = 110;
    var position = yPos ? new goog.math.Coordinate(xPos, yPos) : new goog.math.Coordinate(xPos, 0)
    var popup = new farming.Label(text).setPosition(position).setHidden(true);
    target.appendChild(popup);

    goog.events.listen(target, ['mousedown', 'touchstart'], function (e) {
        popup.setHidden(false);
        e.swallow(['touchend', 'mouseup'], function(){
            popup.setHidden(true)
        }, true);
    });
    return this;
}

var LEVELS = [5, 10, 20, 30, 50, 100, 200, 500, 1000, 10000];

// Function that returns your overall level
farming.Body.prototype.getBodyLevel = function (body) {
    var min_xp = LEVELS[LEVELS.length - 1];
    for(var part in body) {
        if(body[part] < min_xp) {
            min_xp = body[part];
        }
    }
    return farming.Body.prototype.getLevel(min_xp);
}
// Function that returns your current level
farming.Body.prototype.getLevel = function (points) {
    for (var level in LEVELS) {
        if (points < LEVELS[level])
            return level;
    }
    return 1;
}
// Function that returns the required xp for next level
farming.Body.prototype.getTargetXP = function (points) {
    for (var level in LEVELS) {
        if (points < LEVELS[level])
            return LEVELS[level];
    }
}