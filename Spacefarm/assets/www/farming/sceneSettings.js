/**
 *
 */
goog.provide('farming.SceneSettings');

goog.require('lime.Sprite');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Scene');

/**
 * Scene elements
 *
 */
farming.SceneSettings = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    var w = new farming.Sprite(SETTINGS.color.background_layer).preventClickThrough()
        .setSize(SETTINGS.size.background_layer).setPosition(game.getCenterPosition());
    this.title = new lime.Label().setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.title.setText('Settings');

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeSettings, this);

    this.windowLayer
        .appendChild(w).appendChild(this.title)
        .appendChild(this.closeButton);

    this.redraw(this.game.player.settings);
}
goog.inherits(farming.SceneSettings, farming.Scene);

farming.SceneSettings.prototype.game = null;

farming.SceneSettings.prototype.closeSettings = function(scene) {
    scene.game.close();
}
// redraw the inventory
farming.SceneSettings.prototype.redraw = function (settings) {
    if(this.drawLayer)
        this.windowLayer.removeChild(this.drawLayer);
    this.drawLayer = new lime.Layer();
    this.windowLayer.appendChild(this.drawLayer);
    var center = this.game.getCenterPosition();

    this.soundLabel = new farming.Label("Sounds").setPosition(center.x - 120, center.y - 97).setFontSize(SETTINGS.font.title);
    this.soundSlider = new farming.Sprite('#CCCCCC').setSize(200, 20).setPosition(center.x + 100, center.y - 100)
        .setAction(this.switchSound, this);
    this.soundSlider.appendChild(new farming.Sprite('#111111').setSize(180, 10));
    this.soundSlider.appendChild(new farming.Sprite('#FFFFFF').setSize(170, 2));
    this.soundSliderButton = new farming.Sprite('#888888').setSize(30, 30).setPosition(-80, 0);
    this.soundSliderButtonColor = new farming.Sprite(SETTINGS.color.green).setSize(15, 15);
    this.soundSliderButton.appendChild(this.soundSliderButtonColor);
    this.soundSlider.appendChild(this.soundSliderButton);
    if(settings.sound == false) {
        this.soundSliderButton.setPosition(80, 0);
        this.soundSliderButtonColor.setFill(SETTINGS.color.red);
    }

    this.musicLabel = new farming.Label("Music").setPosition(center.x - 120, center.y + 3).setFontSize(SETTINGS.font.title);
    this.musicSlider = new farming.Sprite('#CCCCCC').setSize(200, 20).setPosition(center.x + 100, center.y)
        .setAction(this.switchMusic, this);
    this.musicSlider.appendChild(new farming.Sprite('#111111').setSize(180, 10));
    this.musicSlider.appendChild(new farming.Sprite('#FFFFFF').setSize(170, 2));
    this.musicSliderButton = new farming.Sprite('#888888').setSize(30, 30).setPosition(-80, 0);
    this.musicSliderButtonColor = new farming.Sprite(SETTINGS.color.green).setSize(15, 15);
    this.musicSliderButton.appendChild(this.musicSliderButtonColor);
    this.musicSlider.appendChild(this.musicSliderButton);
    if(settings.music == false) {
        this.musicSliderButton.setPosition(80, 0);
        this.musicSliderButtonColor.setFill(SETTINGS.color.red);
    }

    this.drawLayer.appendChild(this.soundLabel).appendChild(this.soundSlider).appendChild(this.musicLabel).appendChild(this.musicSlider);

    // RESETButton
    this.resetButton = new farming.Button('Reset').setColor('#995555')
        .setPosition(center.x, center.y + 130)
        .setSize(200, SETTINGS.size.button.height).setAction(function(scene){ scene.game.reset(); }, this);
    this.drawLayer.appendChild(this.resetButton);
}

farming.SceneSettings.prototype.switchSound = function(scene) {
    if(scene.game.player.settings) {
        scene.game.player.settings.sound = !scene.game.player.settings.sound;
    } else {
        scene.game.player.settings = {};
        scene.game.player.settings.sound = false;
    }

    // Do movement!
    var movement = 0;
    if(scene.game.player.settings.sound) {
        scene.soundSliderButtonColor.setFill(SETTINGS.color.green);
        movement = -80;
    } else {
        scene.soundSliderButtonColor.setFill(SETTINGS.color.red);
        movement = 80;
    }
    var move = new lime.animation.MoveTo(movement, 0).setDuration(1);
    scene.soundSliderButton.runAction(move);
}

farming.SceneSettings.prototype.switchMusic = function(scene) {
    if(scene.game.player.settings) {
        scene.game.player.settings.music = !scene.game.player.settings.music;
    } else {
        scene.game.player.settings = {};
        scene.game.player.settings.music = false;
    }

    // Do movement!
    var movement = 0;
    if(scene.game.player.settings.music) {
        scene.musicSliderButtonColor.setFill(SETTINGS.color.green);
        movement = -80;
        scene.game.music.play(true);
    } else {
        scene.musicSliderButtonColor.setFill(SETTINGS.color.red);
        movement = 80;
        if(scene.game.music.pause)
            scene.game.music.pause();
        else if(scene.game.music.stop)
            scene.game.music.stop();
    }
    var move = new lime.animation.MoveTo(movement, 0).setDuration(1);
    scene.musicSliderButton.runAction(move);
}