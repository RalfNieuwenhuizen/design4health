/**
 * Created by Ralf on 12/02/14.
 */
goog.provide('farming.RoundedRect');
goog.require('lime.RoundedRect');

/**
 * RoundedRect with preventClickthrough method
 *
 * @param {} gameObj
 */
farming.RoundedRect = function(fill) {
    goog.base(this);
    if(fill)
        this.setFill(fill);
    else
        this.setFill('');
}

goog.inherits(farming.RoundedRect,lime.RoundedRect);

farming.RoundedRect.prototype.preventClickThrough = function() {
    goog.events.listen(this, ['mousedown', 'touchstart'], function (e) {
        e.swallow(['touchend', 'mouseup'], function () {
            e.preventDefault();
        }, true);
    });
    return this;
}