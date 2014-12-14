goog.provide('farming.Body');
goog.require('lime.Layer');

/**
 * Crop elements
 *
 */
farming.Body = function() {
    goog.base(this);

    this.bodyLayer = new lime.Layer();
    this.appendChild(this.bodyLayer);
}

goog.inherits(farming.Body,lime.Layer);

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
    this.drawChest(body.chest, new goog.math.Coordinate(position.x - 1, position.y - 30));
    this.drawAbs(body.abs, position);
    this.drawArms(body.arms, new goog.math.Coordinate(position.x, position.y - 2));
    this.drawLegs(body.legs, new goog.math.Coordinate(position.x + 2, position.y + 47));
}
farming.Body.prototype.drawBase= function (center) {
    var icon = new lime.Sprite().setFill('images/body/exoskeleton.png').setSize(100, 200).setPosition(center);
    this.bodyLayer.appendChild(icon);
}
farming.Body.prototype.drawBack = function (number, center) {
    var level = this.getLevel(number)
    var icon = new lime.Sprite().setFill('images/body/back'+level+'.png').setSize(50, 50).setPosition(center);
    var label = new lime.Label().setText(level).setSize(10, 10).setPosition(center);

    this.bodyLayer.appendChild(icon);
    if(!this.hideLevels) {
        farming.Body.prototype.addPopup(icon, "level " + this.getLevel(number) + ": " + number + "/" + this.getTargetXP(number) + " points");
        //this.bodyLayer.appendChild(label);
    }
}
farming.Body.prototype.drawArms = function (number, center) {
    var level = this.getLevel(number);
    var icon = new lime.Sprite().setFill('images/body/arms'+level+'.png').setSize(74, 50).setPosition(center);
    var label = new lime.Label().setText(level).setSize(10, 10).setPosition(center);

    this.bodyLayer.appendChild(icon);
    if(!this.hideLevels) {
        farming.Body.prototype.addPopup(icon, "level " + this.getLevel(number) + ": " + number + "/" + this.getTargetXP(number) + " points");
        //this.bodyLayer.appendChild(label);
    }
}
farming.Body.prototype.drawLegs = function (number, center) {
    var level = this.getLevel(number);
    var icon = new lime.Sprite().setFill('images/body/legs'+level+'.png').setSize(55, 85).setPosition(center);
    var label = new lime.Label().setText(level).setSize(10, 10).setPosition(center);

    this.bodyLayer.appendChild(icon);
    if(!this.hideLevels) {
        farming.Body.prototype.addPopup(icon, "level " + this.getLevel(number) + ": " + number + "/" + this.getTargetXP(number) + " points");
        //this.bodyLayer.appendChild(label);
    }
}
farming.Body.prototype.drawChest = function (number, center) {
    var level = this.getLevel(number);
    var icon = new lime.Sprite().setFill('images/body/chest'+level+'.png').setSize(60, 30).setPosition(center);
    var label = new lime.Label().setText(level).setSize(10, 10).setPosition(center);

    this.bodyLayer.appendChild(icon);
    if(!this.hideLevels) {
        farming.Body.prototype.addPopup(icon, "level " + this.getLevel(number) + ": " + number + "/" + this.getTargetXP(number) + " points");
        //this.bodyLayer.appendChild(label);
    }
}
farming.Body.prototype.drawAbs = function (number, center) {
    var level = this.getLevel(number);
    var icon = new lime.Sprite().setFill('images/body/abs'+level+'.png').setSize(50, 50).setPosition(center);
    var label = new lime.Label().setText(level).setSize(10, 10).setPosition(center);

    this.bodyLayer.appendChild(icon);
    if(!this.hideLevels) {
        farming.Body.prototype.addPopup(icon, "level " + this.getLevel(number) + ": " + number + "/" + this.getTargetXP(number) + " points");
        //this.bodyLayer.appendChild(label);
    }
}

// Mouseover / mouseout
farming.Body.prototype.addPopup = function (target, text, position) {
    var offset = 100;
    var position = position === 'right' ? new goog.math.Coordinate(offset, 0) : new goog.math.Coordinate(-offset, 0)
    var popup = new farming.Label(text).setPosition(position).setHidden(true);
    target.appendChild(popup);

    goog.events.listen(target, ['mousedown', 'touchstart'], function (e) {
        console.log("On", popup);
        popup.setHidden(false);
        e.swallow(['touchend', 'mouseup'], function(){
            console.log("Off", popup);
            popup.setHidden(true)
        }, true);
    });
    return this;
}

var LEVELS = [0, 5, 10, 20, 30, 50, 100, 200, 500, 1000, 10000];

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

farming.Body.prototype.bodypart = function (key) {
    switch(key) {
        case "full_body":
            return "Full-body workout, good for all body parts.";
        default:
            return key;
    }
}