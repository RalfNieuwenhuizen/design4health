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

    this.dailyTip = new lime.Label().setFontSize(18).setStyle('italic').setMultiline(true)
        .setPosition(580,135).setSize(300,100);

    this.statsHeading = new lime.Label().setFontSize(20).setFontWeight(600).setPosition(580,185).setSize(300,20)
        .setText('This month you did:');
    this.statsText = new lime.Label().setFontSize(18).setLineHeight(1.2).setFontColor('#637706').setMultiline(true)
        .setPosition(580,310).setSize(300,220);

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
        .appendChild(this.dailyTip)
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
    var limit = 4;
    var append = '';
    if(exercises.length > limit) {
        exercises = exercises.slice(0,limit);
        append = 'and more...';
    }
    if (exercises.length == 0) {
        this.statsHeading.setHidden(true);
        this.statsText.setHidden(true);
    } else {
        this.statsHeading.setHidden(false);
        this.statsText.setHidden(false);
    }
    for(var i in exercises) {
        var exercise = EXERCISES[exercises[i].type];
        text += (exercise.repetitions ? exercise.repetitions*exercises[i].count : Math.round(exercise.duration*exercises[i].count/60)+' minutes of') +' '+exercise.title + '\n';
    }
    this.statsText.setText(text+append);

    if (this.body) {
        this.body.redraw(body, new goog.math.Coordinate(this.game.getCenterPosition().x - 180, this.game.getCenterPosition().y - 5));

        var suggestions = {
            'arms': 'picking space apples',
            'back': 'harvesting space wheat',
            'chest': 'gathering eggs from polychicks',
            'abs': 'harvesting space carrots',
            'legs': 'doing the space cookies challenge'
        };

        this.dailyTip.setText(
            (Math.random() > 0.5) ?
            "Good job on your "+this.body.getBestBodyPart()+",\n don\`t forget your other body parts! \n Try for example "+suggestions[this.body.getWorstBodyPart()]+"." :
            "Try to focus a little more on your "+this.body.getWorstBodyPart()+", for example by "+suggestions[this.body.getWorstBodyPart()]+".\n Keep up the good work!"
        );
    }
}