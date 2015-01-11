/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.Slider');
goog.require('lime.Circle');

/**
 * Land elements
 *
 * @param {} gameObj
 */
farming.Slider = function() {
    goog.base(this);
    this.leftButton = new farming.Button('images/buttons/arrow_left.png','images/buttons/arrow_left_active.png').setSize(89*0.5,202*0.5);
    this.rightButton = new farming.Button('images/buttons/arrow_right.png','images/buttons/arrow_right_active.png').setSize(89*0.5,202*0.5);
    this.bg = new lime.Sprite();//.setFill('#99f');
    this.appendChild(this.bg).appendChild(this.leftButton).appendChild(this.rightButton);
    this.update();
    this.leftButton.setAction(this.prev, this);
    this.rightButton.setAction(this.next, this);
    this.slidesLayer = new lime.Layer();
    this.appendChild(this.slidesLayer);

    return this;
}

goog.inherits(farming.Slider,lime.Layer);

farming.Slider.prototype.slides = [];
farming.Slider.prototype.bubbles = [];
farming.Slider.prototype.bubblesHidden = false;
farming.Slider.prototype.index = 0;

farming.Slider.prototype.setSize = function(param1, param2){
    if(typeof param2 == 'undefined') {
        goog.base(this, 'setSize', param1);
        if(!this.leftButton) return this;
        this.bg.setSize(param1);
        this.update();
        return this;
    }
    goog.base(this, 'setSize', param1, param2);
    if(!this.leftButton) return this;
    this.bg.setSize(param1, param2);
    this.clear();
    this.update();
    return this;
}
farming.Slider.prototype.prev = function(slider){
    slider.index = (slider.index-1).mod(slider.slides.length);
    slider.update();
}
farming.Slider.prototype.next = function(slider){
    slider.index = (slider.index+1).mod(slider.slides.length);
    slider.update();
}
farming.Slider.prototype.addTextSlide = function(text, fontSize){
    var bubble = new lime.Circle().setSize(20,20);
    var slide = new lime.Layer();
    var size = this.getInnerSize();

    var text = new farming.Label().setText(text).setMultiline(true).setSize(size.width,0).setFontSize(fontSize).setLineHeight(1.4).setFill('#55f').setVerticalAlign(true);

    //text.setPosition(0, -20);
    slide.appendChild(text).setHidden(true);
    this.slidesLayer.appendChild(slide).appendChild(bubble);
    this.slides.push(slide);
    this.bubbles.push(bubble);
    return slide;
}
farming.Slider.prototype.addBlankSlide = function(){
    var bubble = new lime.Circle().setSize(20,20);
    var slide = new lime.Layer();
    slide.setHidden(true);
    this.slidesLayer.appendChild(slide).appendChild(bubble);
    this.slides.push(slide);
    this.bubbles.push(bubble);
    return slide;
}
farming.Slider.prototype.clear = function(){
    this.slides = [];
    this.bubbles = [];
    this.index = 0;
    this.slidesLayer.removeAllChildren();
}
farming.Slider.prototype.setBubblesHidden = function(hidden){
    this.bubblesHidden = hidden;
    return this;
}

farming.Slider.prototype.getInnerSize = function(){
    var size = this.getSize();
    return new goog.math.Size(size.width - this.leftButton.getSize().width*2 - 50, size.height-60);
}
farming.Slider.prototype.update = function(){
    var size = this.getSize();
    this.leftButton.setPosition(-size.width/2 + this.leftButton.getSize().width/2, 0);
    this.rightButton.setPosition(size.width/2 - this.rightButton.getSize().width/2, 0);
    var bw = 20;
    var bm = 10;
    var bubbleWidth = (this.slides.length-1) * bm + (this.slides.length) * bw;
    for(var i in this.slides) {
        this.slides[i].setHidden(i != this.index);
        this.bubbles[i].setHidden(this.bubblesHidden);
        this.bubbles[i].setFill(i == this.index ? 'rgba(88,46,16,0.9)' : 'rgba(95,56,28,0.3)').setPosition(i * (bw+bm) - bubbleWidth/2 + bw/2, -size.height/2+20);
    }
}