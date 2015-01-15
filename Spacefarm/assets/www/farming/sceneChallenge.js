/**
 *
 */
goog.provide('farming.SceneChallenge');

goog.require('lime.Sprite');
goog.require('farming.Challenge');
goog.require('farming.Exercise');
goog.require('farming.Button');
goog.require('farming.Sprite');
goog.require('lime.Layer');
goog.require('farming.Scene');

/**
 * Scene elements
 *
 */
farming.SceneChallenge = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    this.w = SETTINGS.createWindow();
    this.o = SETTINGS.createOverlay();
    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.title.setText('Challenges');

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeChallenge, this);


    this.windowLayer
        .appendChild(this.o)
        .appendChild(this.w)
        .appendChild(SETTINGS.createTitleImage('challenges'))
        .appendChild(this.closeButton);
    this.slider = new farming.Slider().setSize(700,420).setPosition(400,230).setBubblesPosition('left');
    this.windowLayer.appendChild(this.slider);

    this.redraw();
}
goog.inherits(farming.SceneChallenge, farming.Scene);

farming.SceneChallenge.prototype.game = null;

farming.SceneChallenge.prototype.redraw = function() {
    var nItems = CHALLENGES.length;
    this.slider.clear();
    var position = null;
    var slide = null;
    for(var i in Object.keys(CHALLENGES)) {
        if(i % 6 == 0) {
            slide = this.slider.addBlankSlide();
        }
        var position = new goog.math.Coordinate((i % 3)*200-200,Math.floor((i%6) / 3)*160-80);
        this.drawChallenge(slide, CHALLENGES[Object.keys(CHALLENGES)[i]], position);
    }

    this.title.setText('Challenges');
}

farming.SceneChallenge.prototype.drawChallenge = function(slide, challenge, position) {
    var challengeIcon = new farming.Sprite('images/challenges/'+challenge.key+'.png')
        .setSize(305*0.4, 258*0.4).setPosition(position.x, position.y - 20);

    var bg = new farming.Button(' ').setSize(180,140).setPosition(position);
    var challengeTitle = new farming.Label(challenge.name)
        .setPosition(position.x, position.y + 45)
        .setFontSize(SETTINGS.font.subtitle.size).setFontWeight(SETTINGS.font.subtitle.weight);

    slide.appendChild(bg).appendChild(challengeIcon).appendChild(challengeTitle);

    if(farming.Body.prototype.getBodyLevel(this.game.player.body) < challenge.required_level) {
        challengeTitle.setText('Level '+challenge.required_level)
        bg.setFill('#bfbfbf').setStroke('#6e7d79');
        var icon = new farming.Sprite('images/lock.png').setSize(60*0.5, 85*0.5).setPosition(position.x + 80, position.y - 55);
        slide.appendChild(icon);
    } else {
        //this.drawFood(slide, item.food, position);
        bg.setColor('challenge').setAction(this.showChallengeDetails, {'challenge': challenge,'scene': this} );
        var x = 0;
        for(var i in challenge.requirements) {
            var item = challenge.requirements[i];
            if(item.type != 'item') continue;
            var currentNumber = this.game.getInventory(item.key);
            var itemIcon = new lime.Sprite().setFill('images/items/'+item.key+'.png').setSize(35, 35).setPosition(position.x + 77 - x * 40, position.y - 63);
            var itemCircle = new lime.Circle().setSize(35,35).setPosition(position.x + 77 - x * 40, position.y - 57);
            itemCircle.setFill(currentNumber >= item.number ? '#7cc437' : '#de5959').setStroke(new lime.fill.Stroke(2,'#a19454'));
            slide.appendChild(itemCircle).appendChild(itemIcon);
            x++;
        }
    }
}

farming.SceneChallenge.prototype.drawLock = function(required_level, position) {
    if(farming.Body.prototype.getBodyLevel(this.game.player.body) < required_level) {
        var lock = new farming.Sprite('images/lock.png').setOpacity(.75).preventClickThrough()
            .setSize(165, 140).setPosition(position.x, position.y + 30);
        var label = new lime.Label('Level '+required_level).setFontSize(20)
            .setSize(165, 20).setPosition(position.x, position.y + 77);
        this.w.appendChild(lock).appendChild(label);
        return true;
    }
    return false;
}

farming.SceneChallenge.prototype.showChallengeDetails = function(input) {
    input.scene.game.showChallengeDetails(input.challenge);
}
farming.SceneChallenge.prototype.closeChallenge = function(scene) {
    scene.game.close();
}