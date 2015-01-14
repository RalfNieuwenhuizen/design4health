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
farming.Button = function (param1, param2) {
    goog.base(this);
    var text = null;
    if (typeof param2 == 'undefined') { // just text
        text = param1;
        this.upState = new lime.RoundedRect().setRadius(9);
        this.downState = new lime.RoundedRect().setRadius(9);
    } else {
        this.upState = new lime.Sprite().setFill(param1);
        this.downState = new lime.Sprite().setFill(param2);
    }
    if (text) {
        this.labelUp = new lime.Label().setMultiline(true).setText(text.toUpperCase()).setFontWeight(SETTINGS.font.button.weight).setFontSize(SETTINGS.font.button.size);
        this.labelDown = new lime.Label().setMultiline(true).setText(text.toUpperCase()).setFontWeight(SETTINGS.font.button.weight).setFontSize(SETTINGS.font.button.size);
        this.upState.appendChild(this.labelUp);
        this.downState.appendChild(this.labelDown);
    }

    this.setUpState(this.upState).setDownState(this.downState);
    this.setColor('default');
}

goog.inherits(farming.Button, lime.Button);

farming.Button.prototype.parent = null;
farming.Button.prototype.lastAction = 0;

farming.Button.prototype.setSize = function (param1, param2) {
    if (typeof param2 == 'undefined') {
        goog.base(this, 'setSize', param1);
        if (!this.upState) return this;
        this.upState.setSize(param1);
        this.downState.setSize(param1);
        return this;
    }
    goog.base(this, 'setSize', param1, param2);

    if (!this.upState) return this;
    this.upState.setSize(param1, param2);
    this.downState.setSize(param1, param2);
    return this;
}
farming.Button.prototype.setColor = function (color) {
    if (!this.labelUp) return this;

    if (color == 'default') {
        this.upState.setFill('#dbc1ad').setStroke(new lime.fill.Stroke(3, '#5f2c1c'));
        this.downState.setFill('#ba9880').setStroke(new lime.fill.Stroke(3, '#42241b'));
        this.labelUp.setFontColor('#5f2c1c');
        this.labelDown.setFontColor('#42241b');
    } else if (color == 'green') {
        this.upState.setFill('#9ad937').setStroke(new lime.fill.Stroke(3, '#5f2c1c'));
        this.downState.setFill('#79c600').setStroke(new lime.fill.Stroke(3, '#42241b'));
        this.labelUp.setFontColor('#5f2c1c');
        this.labelDown.setFontColor('#42241b');
    } else if (color == 'red') {
        this.upState.setFill('#e54d39').setStroke(new lime.fill.Stroke(3, '#cc0000'));
        this.downState.setFill('#cf2f1a').setStroke(new lime.fill.Stroke(3, '#aa0000'));
        this.labelUp.setFontColor('#fff');
        this.labelDown.setFontColor('#fff');
    } else if (color == 'clone') {
        this.upState.setFill('#9fcfc4').setStroke(new lime.fill.Stroke(3, '#6ca48e'));
        this.downState.setFill('#72bfa1').setStroke(new lime.fill.Stroke(3, '#6ca48e'));
    } else if (color == 'challenge') {
        this.upState.setFill('#e4deaf').setStroke(new lime.fill.Stroke(3, '#a19454'));
        this.downState.setFill('#d7ce82').setStroke(new lime.fill.Stroke(3, '#a19454'));
    }
    return this;
}
farming.Button.prototype.setFill = function (color) {
    if (!this.labelUp) return this;
    this.upState.setFill(color);
    this.downState.setFill(color);
    return this;
}
farming.Button.prototype.setStroke = function (color) {
    if (!this.labelUp) return this;
    this.upState.setStroke(new lime.fill.Stroke(3, color));
    this.downState.setStroke(new lime.fill.Stroke(3, color));
    return this;
}
farming.Button.prototype.setText = function (text) {
    if (!this.labelUp) return this;
    this.labelUp.setText(text);
    this.labelDown.setText(text);
    return this;
}
farming.Button.prototype.setAction = function (action, target) {
    var thisAction = ++this.lastAction;
    if (action && target) {
        goog.events.listen(this, ['mousedown', 'touchstart'], function (e) {
            if (this.lastAction != thisAction) return;
            if (this.parent_.getHidden() || (this.parent_.parent_ && this.parent_.parent_.getHidden())) return;
            e.swallow(['touchend', 'mouseup'], function () {
                action(target, e);
            }, true);
        });
    }
    return this;
}