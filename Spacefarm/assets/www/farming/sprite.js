/**
 * Created by Ralf on 12/02/14.
 */
goog.provide('farming.Sprite');
goog.require('lime.Sprite');

/**
 * Sprite with setAction method
 *
 * @param {} gameObj
 */
farming.Sprite = function(fill) {
    goog.base(this);
    if(fill)
        this.setFill(fill);
    else
        this.setFill('');
}

goog.inherits(farming.Sprite,lime.Sprite);

farming.Sprite.prototype.parent = null;
farming.Sprite.prototype.fillString = null;

farming.Sprite.prototype.setFill = function(fill) {
    if(this.fillString != fill) {
        goog.base(this, 'setFill', fill);
        this.fillString = fill;
    }
    return this;
}
farming.Sprite.prototype.setHidden = function(hidden) {
    if(this.getHidden() != hidden) {
        goog.base(this, 'setHidden', hidden);
    }
    return this;
}
farming.Sprite.prototype.setAction = function(action, target) {
    this.removeAllListeners();

    if (action && target) {
        goog.events.listen(this, ['mousedown', 'touchstart'], function (e) {
            e.swallow(['touchend', 'mouseup'], function () {
                action(target, e)
            }, true);
        });
    }
    return this;
}
farming.Sprite.prototype.preventClickThrough = function() {
    goog.events.listen(this, ['mousedown', 'touchstart'], function (e) {
        e.swallow(['touchend', 'mouseup'], function () {
            e.preventDefault();
        }, true);
    });
    return this;
}