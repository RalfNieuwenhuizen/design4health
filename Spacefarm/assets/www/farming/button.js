/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.Button');
goog.require('lime.GlossyButton');

/**
 * Land elements
 *
 * @param {} gameObj
 */
farming.Button = function(text) {
    goog.base(this);
    this.setText(text);
}

goog.inherits(farming.Button,lime.GlossyButton);

farming.Button.prototype.parent = null;

farming.Button.prototype.setAction = function(action, target){
    this.removeAllListeners();

    if(action && target) {
        goog.events.listen(this, ['mousedown', 'touchstart'], function (e) {
            e.swallow(['touchend', 'mouseup'], function () {
                action(target, e)
            }, true);
        });
    }
    return this;
}