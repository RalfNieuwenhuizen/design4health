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

farming.Sprite.prototype.setAction = function(action, target){
    goog.events.listen(this, ['mousedown', 'touchstart'], function (e) {
        e.swallow(['touchend', 'mouseup'], function(){ action(target, e) }, true);
    });
    return this;
}