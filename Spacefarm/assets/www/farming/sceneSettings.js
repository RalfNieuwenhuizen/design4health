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
    this.w = SETTINGS.createWindow();
    this.o = SETTINGS.createOverlay();
    this.title = SETTINGS.createTitle('Settings');

    this.closeButton = new farming.Button('X').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeSettings, this);

    this.windowLayer
        .appendChild(this.o)
        .appendChild(this.w).appendChild(this.title)
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

    var slider_width = 120;
    this.slider_off = -(slider_width * 0.5) + 20;
    this.slider_on = (slider_width * 0.5) - 20;

    this.soundLabel = new farming.Label("Sounds").setPosition(center.x - 120, center.y - 97).setFontSize(SETTINGS.font.title);
    this.soundSlider = new farming.Sprite('#CCCCCC').setSize(slider_width, 20).setPosition(center.x + (slider_width / 2), center.y - 100)
        .setAction(this.switchSound, this);
    this.soundSlider.appendChild(new farming.Sprite('#111111').setSize(slider_width * 0.9, 10));
    this.soundSlider.appendChild(new farming.Sprite('#FFFFFF').setSize(slider_width * 0.85, 2));
    this.soundSliderButton = new farming.Sprite('#888888').setSize(30, 30).setPosition(this.slider_on, 0);
    this.soundSliderButtonColor = new farming.Sprite(SETTINGS.color.green).setSize(15, 15);
    this.soundSliderButton.appendChild(this.soundSliderButtonColor);
    this.soundSlider.appendChild(this.soundSliderButton);
    if(settings.sound == false) {
        this.soundSliderButton.setPosition(this.slider_off, 0);
        this.soundSliderButtonColor.setFill(SETTINGS.color.red);
    }

    this.musicLabel = new farming.Label("Music").setPosition(center.x - 120, center.y + 3).setFontSize(SETTINGS.font.title);
    this.musicSlider = new farming.Sprite('#CCCCCC').setSize(slider_width, 20).setPosition(center.x + (slider_width / 2), center.y)
        .setAction(this.switchMusic, this);
    this.musicSlider.appendChild(new farming.Sprite('#111111').setSize(slider_width * 0.9, 10));
    this.musicSlider.appendChild(new farming.Sprite('#FFFFFF').setSize(slider_width * 0.85, 2));
    this.musicSliderButton = new farming.Sprite('#888888').setSize(30, 30).setPosition(this.slider_on, 0);
    this.musicSliderButtonColor = new farming.Sprite(SETTINGS.color.green).setSize(15, 15);
    this.musicSliderButton.appendChild(this.musicSliderButtonColor);
    this.musicSlider.appendChild(this.musicSliderButton);
    if(settings.music == false) {
        this.musicSliderButton.setPosition(this.slider_off, 0);
        this.musicSliderButtonColor.setFill(SETTINGS.color.red);
    }

    this.drawLayer.appendChild(this.soundLabel).appendChild(this.soundSlider).appendChild(this.musicLabel).appendChild(this.musicSlider);

    // RESETButton
    this.resetButton = new farming.Button('Reset game').setColor('red')
        .setPosition(180, 340)
        .setSize(240, SETTINGS.size.button.height).setAction(this.askReset, this);
    this.drawLayer.appendChild(this.resetButton);
    // CONFIRMButton
    this.confirmButton = new farming.Button('Confirm').setColor('red')
        .setPosition(120, 340).setHidden(true)
        .setSize(120, SETTINGS.size.button.height).setAction(function(scene){ scene.game.reset(); }, this);
    this.cancelButton = new farming.Button('Cancel').setColor('green')
        .setPosition(240, 340).setHidden(true)
        .setSize(120, SETTINGS.size.button.height).setAction(this.cancelReset, this);
    this.drawLayer.appendChild(this.confirmButton).appendChild(this.cancelButton);
}

farming.SceneSettings.prototype.askReset = function(scene) {
    scene.resetButton.setHidden(true);
    scene.confirmButton.setHidden(false);
    scene.cancelButton.setHidden(false);
}

farming.SceneSettings.prototype.cancelReset = function(scene) {
    scene.resetButton.setHidden(false);
    scene.confirmButton.setHidden(true);
    scene.cancelButton.setHidden(true);
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
        movement = scene.slider_on;
    } else {
        scene.soundSliderButtonColor.setFill(SETTINGS.color.red);
        movement = scene.slider_off;
    }
    var move = new lime.animation.MoveTo(movement, 0).setDuration(.5);
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
        movement = scene.slider_on;
        scene.game.playMusic();
    } else {
        scene.musicSliderButtonColor.setFill(SETTINGS.color.red);
        movement = scene.slider_off;
        scene.game.stopMusic();
    }
    var move = new lime.animation.MoveTo(movement, 0).setDuration(.5);
    scene.musicSliderButton.runAction(move);
}