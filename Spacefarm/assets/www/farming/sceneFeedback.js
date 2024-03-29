/**
 *
 */
goog.provide('farming.SceneFeedback');

goog.require('lime.Sprite');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Scene');
goog.require('farming.Body');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.FadeTo');

/**
 * Scene elements
 *
 */
farming.SceneFeedback = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    this.w = SETTINGS.createWindow().setSize(200,300).setOpacity(0.9);
    this.title = new farming.Label('WELL DONE!').setFontSize(SETTINGS.font.title).setPosition(0,-120);
    this.description = new lime.Label().setPosition(0,-80).setMultiline(true)
    		.setFontSize(15).setText('You gained the following \n body points:');
    var position = {x:50, y:-150};
    this.armsPoints = new farming.Label().setFontSize(SETTINGS.font.text).setAlign('left').setPosition(new goog.math.Coordinate(position.x, position.y+180));
    this.legsPoints = new farming.Label().setFontSize(SETTINGS.font.text).setAlign('left').setPosition(new goog.math.Coordinate(position.x, position.y+220));
    this.chestPoints = new farming.Label().setFontSize(SETTINGS.font.text).setAlign('left').setPosition(new goog.math.Coordinate(position.x, position.y+160));
    this.backPoints = new farming.Label().setFontSize(SETTINGS.font.text).setAlign('left').setPosition(new goog.math.Coordinate(position.x, position.y+140));
    this.absPoints = new farming.Label().setFontSize(SETTINGS.font.text).setAlign('left').setPosition(new goog.math.Coordinate(position.x, position.y+200));
    
    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeFeedback, this);

    this.body = new farming.Body(1, this.game);
}
goog.inherits(farming.SceneFeedback, farming.Scene);

farming.SceneFeedback.prototype.game = null;

farming.SceneFeedback.prototype.showFeedback = function(exercise){

    lime.scheduleManager.callAfter(function(){
        this.w.appendChild(this.title)
            .appendChild(this.description)
            .appendChild(this.closeButton)
            .appendChild(this.body)
            .appendChild(this.armsPoints).appendChild(this.legsPoints)
            .appendChild(this.chestPoints).appendChild(this.backPoints).appendChild(this.absPoints)
            .setOpacity(1).setPosition(570,200+500);

        this.windowLayer.appendChild(this.w);


        if (this.body)
            this.body.redraw(this.game.player.body, new goog.math.Coordinate(-40, +50));

        this.armsPoints.setText('arms: 0');
        this.legsPoints.setText('legs: 0');
        this.chestPoints.setText('chest: 0');
        this.backPoints.setText('back: 0');
        this.absPoints.setText('abs: 0');

        if(exercise && exercise.type && exercise.points) {
            if( Object.prototype.toString.call( exercise.type ) === '[object Array]' ) {
                for(var i = 0; i < exercise.type.length; i++) {
                    //this.description.setText('You gained the following bodypoints:\n\n'+
                    this[exercise.type[i]+'Points'].setText(exercise.type[i] + ': ' + exercise.points);
                }
            } else {
                this[exercise.type+'Points'].setText(exercise.type + ': ' + exercise.points);
            }
        }
        var scene = this;
        /*goog.events.listen(this.o, ['mousedown', 'touchstart'], function (e) {
         scene.game.sceneFeedback.closeFeedback();
         e.swallow(['touchend', 'mouseup'], function () {
         e.preventDefault();
         }, true);
         },false,this);*/
        var fadeIn = new lime.animation.FadeTo(1).setDuration(0.5);
        var move = new lime.animation.MoveBy(0,-500).setDuration(0.5);
        this.w.runAction(fadeIn);
        this.w.runAction(move);

        lime.scheduleManager.callAfter(function(){
            scene.game.sceneFeedback.closeFeedback();
        }, this, 3000);
    }, this, 1000)
}

farming.SceneFeedback.prototype.closeFeedback = function() {
    console.log('closing');
    if(!this.windowLayer.children_ || !this.windowLayer.children_.length) return;
    var fadeAway = new lime.animation.FadeTo(0).setDuration(0.5);
    var move = new lime.animation.MoveBy(0,-200).setDuration(0.5);
    this.w.runAction(fadeAway);
    this.w.runAction(move);
    lime.scheduleManager.callAfter(function(){
        this.windowLayer.removeAllChildren();
    }, this, 500);
}

farming.SceneFeedback.prototype.bodyUpgraded = function(bodyLevel) {
    var w = SETTINGS.createWindow();
    var text = new lime.Label().setFontSize(18).setMultiline(true).setText('GREAT! \n You upgraded your body to level '+ bodyLevel +'! \n New challenges and items to clone are available now.')
    		.setPosition(0,-135).setFontWeight('bold');
    var scene = this;
    var button = new farming.Button('THANKS').setColor(SETTINGS.color.button).setAction(function(){scene.game.close()}, scene.game).setSize(SETTINGS.size.button).setPosition(0,135);
    var body = new farming.Body(1, this.game);
    body.redraw(this.game.player.body, new goog.math.Coordinate(this.game.getCenterPosition().x, this.game.getCenterPosition().y));
    w.appendChild(text).appendChild(button);//.appendChild(closeButton);
	
    this.game.sceneMap.sceneLayer.appendChild(w).appendChild(body);
}

