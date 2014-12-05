/**
 * Created by Ralf on 12/02/14.
 */
goog.provide('farming.Label');
goog.require('lime.Label');

/**
 * Label with setAction method
 *
 * @param {} gameObj
 */
farming.Label = function(text) {
    goog.base(this);
    if(text)
        this.setText(text);
    else
        this.setText('');
}

goog.inherits(farming.Label,lime.Label);

farming.Label.prototype.parent = null;

farming.Label.prototype.setAction = function(action, target){
    goog.events.listen(this, ['mousedown', 'touchstart'], function (e) {
        e.swallow(['touchend', 'mouseup'], function(){ action(target, e) }, true);
    });
    return this;
}