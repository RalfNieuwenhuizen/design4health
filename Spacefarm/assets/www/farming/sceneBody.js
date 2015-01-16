/**
 *
 */
goog.provide('farming.SceneBody');

goog.require('lime.Sprite');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Scene');
goog.require('farming.Body');

/**
 * Scene elements
 *
 */
farming.SceneBody = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    this.w = SETTINGS.createWindow();
    this.o = SETTINGS.createOverlay();
    this.title = SETTINGS.createTitle('BODY');
    this.description = new lime.Label('Bionic Outer Dimension Yeosuit')
        .setPosition(SETTINGS.position.title.x, SETTINGS.position.title.y+20).setMultiline(true).setFontSize(15);

    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeBody, this);
    this.statsHeading = new lime.Label().setFontSize(20).setFontWeight(600).setPosition(580,135).setSize(300,20)
        .setText('This month you did:');
    this.statsText = new lime.Label().setFontSize(18).setLineHeight(1.2).setFontColor('#637706').setMultiline(true)
        .setPosition(580,265).setSize(300,220);

    this.statsButton = new farming.Button('More statistics').setColor('green')
        .setPosition(580,345)
        .setSize(230,60);
    this.statsButton.setAction(this.showStats, this);

    this.windowLayer
        .appendChild(this.o)
        .appendChild(this.w)
        .appendChild(SETTINGS.createTitleImage('body'))
        .appendChild(this.description)
        .appendChild(this.statsButton)
        .appendChild(this.statsHeading)
        .appendChild(this.statsText)
        .appendChild(this.closeButton);
    this.body = new farming.Body(1.35, this.game);
    this.windowLayer.appendChild(this.body);
    
    // Remember the current body level
    this.bodyLevel = 1;
}
goog.inherits(farming.SceneBody, farming.Scene);

farming.SceneBody.prototype.game = null;

farming.SceneBody.prototype.closeBody = function(scene) {
    scene.game.close();
}
farming.SceneBody.prototype.showStats = function(scene) {
    scene.game.showStats();
    scene.game.source.dispatchEvent(scene.game.EventType.SHOW_BODYSTATS);
}

/*farming.SceneBody.prototype.redraw = function(body) {
    this.statsText.//player.exercisesDone[year][month][day]
        if (this.body)
    this.body.redraw(body, new goog.math.Coordinate(this.game.getCenterPosition().x-180, this.game.getCenterPosition().y-5));
}*/
farming.SceneBody.prototype.redraw = function(body) {
    this.game.sceneStats.filterMonth(this.game.sceneStats, false);
    var exercises = this.game.sceneStats.getExercisesSorted(this.game.player);
    var text = '';
    var limit = 5;
    var append = '';
    if(exercises.length > limit) {
        exercises = exercises.slice(0,limit);
        append = 'and more...';
    }
    for(var i in exercises) {
        var exercise = EXERCISES[exercises[i].type];
        text += (exercise.repetitions ? exercise.repetitions*exercises[i].count : Math.round(exercise.duration*exercises[i].count/60)+' minutes of') +' '+exercise.title + '\n';
    }
    this.statsText.setText(text+append);

    if (this.body)
        this.body.redraw(body, new goog.math.Coordinate(this.game.getCenterPosition().x-180, this.game.getCenterPosition().y-5));
}
