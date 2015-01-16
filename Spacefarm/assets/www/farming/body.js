goog.provide('farming.Body');
goog.require('lime.Layer');
goog.require('farming.Sprite');
goog.require('lime.RoundedRect');
goog.require('lime.fill.Stroke');

/**
 * Crop elements
 *
 */
farming.Body = function(scale, game) {
    goog.base(this);
    this.game = game;
    if(!scale)
        scale = 1;

    this.bodyLayer = new lime.Layer();
    this.levelNumber = new lime.Label().setFontSize(20);
    this.levelLabel = new lime.Label().setFontSize(15);
    this.scale = scale;
    this.appendChild(this.bodyLayer);
    this.redraw(this.game.player.body, null);

}
goog.inherits(farming.Body,lime.Layer);

farming.Body.prototype.scale = null;

// redraw the inventory
farming.Body.prototype.redraw = function (body, pos) {
    var position = pos ? pos : (this.position ? this.position : new goog.math.Coordinate(0,0));
    this.position = position;
    if(this.bodyLayer) {
        this.bodyLayer.removeAllChildren();
    }
    this.drawBase(position);
    this.drawBack(body.back, new goog.math.Coordinate(position.x, position.y - (this.scale*50)));
    this.drawArms(body.arms, new goog.math.Coordinate(position.x, position.y - (this.scale*2)));
    this.drawLegs(body.legs, new goog.math.Coordinate(position.x + (this.scale*2), position.y + (this.scale*47)));
    this.drawAbs(body.abs, position);
    this.drawChest(body.chest, new goog.math.Coordinate(position.x - (this.scale*1), position.y - (this.scale*30)));
    if(this.scale > 1) {
        var level = this.getBodyLevel();
        this.levelNumber.setText('Level '+level).setPosition(position.x, position.y + (this.scale*105));
        this.levelLabel.setText(LEVEL_TEXTS[level]).setPosition(position.x, position.y + (this.scale*105)+20);
        this.bodyLayer.appendChild(this.levelLabel).appendChild(this.levelNumber);
    }
}
farming.Body.prototype.drawBase= function (center) {
    var icon = new farming.Sprite('images/body/'+(+this.getBodyLevel())+'.png').setSize(this.scale*100, this.scale*200).setPosition(center);
    this.bodyLayer.appendChild(icon);
}
farming.Body.prototype.drawBack = function (number, center) {
    var level = this.getBodyLevel();
    var icon = new farming.Sprite().setSize(this.scale*50, this.scale*50).setPosition(center);
    if(this.scale > 1)
        icon.appendChild(this.getProgressBar('Back', number, this.getTargetXP(number), 40, 8, 65, 0));
    this.bodyLayer.appendChild(icon);

}
farming.Body.prototype.drawArms = function (number, center) {
    var level = this.getBodyLevel();
    var icon = new lime.Sprite().setSize(this.scale*74, this.scale*50).setPosition(center);
    if(this.scale > 1)
        icon.appendChild(this.getProgressBar('Arms', number, this.getTargetXP(number), 40, 8, 85, -10));
    this.bodyLayer.appendChild(icon);
}
farming.Body.prototype.drawLegs = function (number, center) {
    var level = this.getBodyLevel();
    var icon = new lime.Sprite().setSize(this.scale*55, this.scale*85).setPosition(center);
    if(this.scale > 1)
        icon.appendChild(this.getProgressBar('Legs', number, this.getTargetXP(number), 40, 8, -65, 0));
    this.bodyLayer.appendChild(icon);
}
farming.Body.prototype.drawChest = function (number, center) {
    var level = this.getBodyLevel();
    var icon = new lime.Sprite().setSize(this.scale*60, this.scale*30).setPosition(center);
    if(this.scale > 1)
        icon.appendChild(this.getProgressBar('Chest', number, this.getTargetXP(number), 40, 8, -85, 10));
    this.bodyLayer.appendChild(icon);
}
farming.Body.prototype.drawAbs = function (number, center) {
    var level = this.getBodyLevel();
    var icon = new lime.Sprite().setSize(this.scale*50, this.scale*50).setPosition(center);
    if(this.scale > 1)
        icon.appendChild(this.getProgressBar('Abs', number, this.getTargetXP(number), 40, 8, -85, 10));
    this.bodyLayer.appendChild(icon);
}

farming.Body.prototype.getProgressBar = function (type, number, max, width, height, x, y, color) {
    var bg = new lime.RoundedRect().setSize(width,height).setPosition(x,y).setFill('#777777').setStroke(new lime.fill.Stroke(1,'#444444'));
    var percent = this.getXPOverLevel(number)/this.getXPOverLevel(max);
    var progressWidth = width*percent-2;
    var fg = new lime.RoundedRect().setSize(progressWidth, height-2).setPosition(-width*(1-percent)/2,0).setFill(percent >= 1 ? '#00ff44' : '#77ccff');
    var label = new lime.Label().setText(type+' '+this.getXPOverLevel(number)+'/'+this.getXPOverLevel(max)).setPosition(0,-14);
    bg.appendChild(label);
    if(progressWidth > 0) bg.appendChild(fg);
    return bg;

}

var LEVELS = [0, 5, 15, 30, 50, 80, 120, 200, 300];
var LEVEL_TEXTS = [null,'Rusted iron body','Water body','EcoPower body','Fire body',
    'Streamlined ice body','Plant body','Plasma body','Diamond body','Platinum body','Printer ink body',
    'Caramel body','Chocolate body','Banana smoothie body','Last body'
];

// Function that returns your overall level
farming.Body.prototype.getBodyLevel = function (body) {
    var b = typeof body == 'undefined' ? this.game.player.body : body;
    var min_xp = Infinity;
    for(var i in b) {
        min_xp = Math.min(min_xp, b[i]);
    }
    return farming.Body.prototype.getLevel(min_xp);
}
// Function that returns your current level
farming.Body.prototype.getLevel = function (points) {
    for (var level in LEVELS) {
        if (points < LEVELS[level]){
            return level;
        }
    }
    return 1;
}
farming.Body.prototype.getXPOverLevel = function (points) {
    return points-this.getMinLevelXP(points);
}
farming.Body.prototype.getMinLevelXP = function (points) {
    return LEVELS[this.getBodyLevel()-1];
}
// Function that returns the required xp for next level
farming.Body.prototype.getTargetXP = function (points) {
    return LEVELS[this.getBodyLevel()];
}

farming.Body.prototype.getBestBodyPart = function () {
    var best = -1;
    var b = this.game.player.body;
    for(var i in b) {
        if(best == -1 || b[i] > b[best] || (Math.random() > 0.5 && b[i] == b[best])) {
            best = i;
        }
    }
    return best;
}
farming.Body.prototype.getWorstBodyPart = function () {
    var worst = -1;
    var b = this.game.player.body;
    for(var i in b) {
        if(worst == -1 || b[i] < b[worst] || (Math.random() > 0.5 && b[i] == b[worst])) {
            worst = i;
        }
    }
    return worst;
}