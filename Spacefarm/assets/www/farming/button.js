/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.Button');
goog.require('lime.Button');

/**
 * Land elements
 *
 * @param {} gameObj
 */
farming.Button = function(param1, param2) {
    goog.base(this);
    var text = null;
    if(typeof param2 == 'undefined') { // just text
        text = param1;
        this.upState = new lime.Sprite().setFill('#f99');
        this.downState = new lime.Sprite().setFill('#f99');
    } else {
        this.upState = new lime.Sprite().setFill(param1);
        this.downState = new lime.Sprite().setFill(param2);
    }
    if(text) {
        this.labelUp = new lime.Label().setText(text).setFontSize(16);
        this.labelDown = new lime.Label().setText(text).setFontSize(16);
        this.upState.appendChild(this.labelUp);
        this.downState.appendChild(this.labelDown);
    }

    this.setUpState(this.upState).setDownState(this.downState);

}

goog.inherits(farming.Button,lime.Button);

farming.Button.prototype.parent = null;

farming.Button.prototype.setSize = function(param1, param2){
    if(typeof param2 == 'undefined') {
        goog.base(this, 'setSize', param1);
        if(!this.upState) return this;
        this.upState.setSize(param1);
        this.downState.setSize(param1);
        return this;
    }
    goog.base(this, 'setSize', param1, param2);
    
    if(!this.upState) return this;
    this.upState.setSize(param1, param2);
    this.downState.setSize(param1, param2);
    return this;
}
farming.Button.prototype.setColor = function(color){

    return this;
}
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