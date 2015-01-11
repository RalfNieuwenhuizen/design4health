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
farming.Label.prototype.verticalAlign = false;



farming.Label.prototype.setVerticalAlign = function(align){
    this.verticalAlign = align;
    return this;
}
farming.Label.prototype.setAction = function(action, target){
    goog.events.listen(this, ['mousedown', 'touchstart'], function (e) {
        e.swallow(['touchend', 'mouseup'], function(){ action(target, e) }, true);
    });
    return this;
}
lime.Renderer.CANVAS.LABEL.draw = function(context) {

    lime.Renderer.CANVAS.SPRITE.draw.call(this, context);

    var frame = this.getFrame(),
        width = -frame.left - this.padding_[3] + frame.right - this.padding_[1] + Math.abs(this.getShadowOffset().x) + Math.abs(this.getShadowBlur() * 2),
        dowrap = 0;

    if (!this.words_) {
        this.words_ = this.calcWordsArray();
        dowrap = 1;
    }

    var stroke = this.stroke_?this.stroke_.width_:0;

    context.save();
    var align = this.getAlign();
    if (align == 'left') {
        context.translate(frame.left + this.padding_[3]+stroke,
            frame.top + this.padding_[0]+stroke);
    }
    else if (align == 'right') {
        context.translate(frame.right - this.padding_[1]-stroke,
            frame.top + this.padding_[0]+stroke);
    }
    else if (align == 'center') {
        context.translate(
            (frame.left + this.padding_[3] +
                frame.right - this.padding_[1]) * .5,
            frame.top + this.padding_[0]+stroke);
    }

    var lh = this.getLineHeight();

    context.fillStyle = this.getFontColor();
    context.font = this.getStyle() + ' '+ this.getFontWeight() + ' ' + this.getFontSize() +
        'px/' + lh + ' ' + this.getFontFamily();
    context.textAlign = align;
    context.textBaseline = 'top';

    if(this.hasShadow_()){
        context.shadowColor = this.getShadowColor();
        context.shadowOffsetX = this.getShadowOffset().x;
        context.shadowOffsetY = this.getShadowOffset().y;
        context.shadowBlur = this.getShadowBlur();
    }

    if(dowrap || width!=this.lastDrawnWidth_){
        this.lines_ = this.wrapText(context, width - 2 * stroke);
        this.lastDrawnWidth_ = width;
    }

    if (this.lines_) {
        var lhpx = lh * this.getFontSize(),
            offsetY = (goog.isDef(this.getShadowBlur()) ? Math.abs(this.getShadowBlur()) : 0) +
                (goog.isDef(this.getShadowOffset()) ? Math.abs(this.getShadowOffset().y) / 2 : 0),
            offsetX = 0;
        lhpx = goog.userAgent.WEBKIT ? Math.floor(lhpx) : Math.round(lhpx);
        var centerY = this.verticalAlign ? this.lines_.length * lhpx : 0;
        for (var i = 0; i < this.lines_.length; i++) {
            context.fillText(this.lines_[i], offsetX, lhpx * i + offsetY - 0.5 - centerY / 2);
        }
    }

    context.restore();
};