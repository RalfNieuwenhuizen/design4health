/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.Slider');

/**
 * Land elements
 *
 * @param {} gameObj
 */
farming.Slider = function() {
    goog.base(this);
    this.leftButton = new farming.Button('images/buttons/arrow_left.png','images/buttons/arrow_left_active.png').setSize(89*0.5,202*0.5);
    this.rightButton = new farming.Button('images/buttons/arrow_right.png','images/buttons/arrow_right_active.png').setSize(89*0.5,202*0.5);
    this.bg = new lime.Sprite().setFill('#99f');
    this.appendChild(this.bg).appendChild(this.leftButton).appendChild(this.rightButton);
    this.update();
    this.leftButton.setAction(this.prev, this);
    this.rightButton.setAction(this.next, this);
    return this;
}

goog.inherits(farming.Slider,lime.Layer);

farming.Slider.prototype.slides = [];
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
    var slide = new lime.Layer();
    var size = this.getInnerSize();

    var text = new farming.Label().setText(text).setMultiline(true).setSize(size.width,0).setFontSize(fontSize).setFill('#55f').setVerticalAlign(true);

    //text.setPosition(0, -20);
    slide.appendChild(text).setHidden(true);
    this.appendChild(slide);
    this.slides.push(slide);
    return this;
}
farming.Slider.prototype.clear = function(){
    this.slides = [];
    this.size = 0;
}

farming.Slider.prototype.getInnerSize = function(){
    var size = this.getSize();
    return new goog.math.Size(size.width - this.leftButton.getSize().width*2 - 40, size.height-60);
}
farming.Slider.prototype.update = function(){
    var size = this.getSize();
    this.leftButton.setPosition(-size.width/2 + this.leftButton.getSize().width/2, 0);
    this.rightButton.setPosition(size.width/2 - this.rightButton.getSize().width/2, 0);
    for(var i in this.slides) {
        this.slides[i].setHidden(i != this.index);
    }
}