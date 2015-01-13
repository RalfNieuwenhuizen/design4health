/**
 *
 */
goog.provide('farming.SceneFeedback');

goog.require('lime.Sprite');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Scene');
goog.require('farming.Body');

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
    this.w = SETTINGS.createWindow();
    this.o = SETTINGS.createOverlay();
    this.title = new farming.Label('WELL DONE!').setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.description = new lime.Label().setPosition(SETTINGS.position.title.x, SETTINGS.position.title.y+30).setMultiline(true)
    		.setFontSize(15).setText('You gained the following body points:');

    this.armsPoints = new farming.Label().setFontSize(SETTINGS.font.text).setPosition(SETTINGS.position.title.x+75, SETTINGS.position.title.y+145);
    this.legsPoints = new farming.Label().setFontSize(SETTINGS.font.text).setPosition(SETTINGS.position.title.x-60, SETTINGS.position.title.y+210);
    this.chestPoints = new farming.Label().setFontSize(SETTINGS.font.text).setPosition(SETTINGS.position.title.x-80, SETTINGS.position.title.y+130);
    this.backPoints = new farming.Label().setFontSize(SETTINGS.font.text).setPosition(SETTINGS.position.title.x+65, SETTINGS.position.title.y+110);
    this.absPoints = new farming.Label().setFontSize(SETTINGS.font.text).setPosition(SETTINGS.position.title.x-75, SETTINGS.position.title.y+165);
    
    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeFeedback, this);

    this.body = new farming.Body(1, this.game);
    this.body.appendChild(this.armsPoints).appendChild(this.legsPoints).appendChild(this.chestPoints).appendChild(this.backPoints).appendChild(this.absPoints)
}
goog.inherits(farming.SceneFeedback, farming.Scene);

farming.SceneFeedback.prototype.game = null;

farming.SceneFeedback.prototype.showFeedback = function(exercise){
    this.windowLayer
	.appendChild(this.o)
    .appendChild(this.w)
    .appendChild(this.title)
    .appendChild(this.description)
    .appendChild(this.closeButton)
    .appendChild(this.body);
	
	if (this.body)
        this.body.redraw(this.game.player.body, new goog.math.Coordinate(this.game.getCenterPosition().x, this.game.getCenterPosition().y-5));
    
    this.armsPoints.setText('');
    this.legsPoints.setText('');
    this.chestPoints.setText('');
    this.backPoints.setText('');
    this.absPoints.setText('');
    
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
    //this.game.sceneMap.setActiveButton(null);
}

farming.SceneFeedback.prototype.closeFeedback = function(scene) {
    scene.windowLayer.removeAllChildren();
}

