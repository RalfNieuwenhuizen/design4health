/**
 * Created on 09/01/15.
 */
goog.provide('farming.Settings');

var SETTINGS = {
    TESTING: true,

    timeUnit: function() {
        return SETTINGS.TESTING === true ? 1 : 60;
    },

    mapSize: 11,
    screen: {
        width: 800,
        height: 480
    },
    createWindow : function(){
        return new lime.RoundedRect().setRadius(9).setFill(SETTINGS.color.background_layer)
            .setStroke(SETTINGS.color.background_stroke)//.preventClickThrough()
            .setSize(SETTINGS.size.background_layer).setPosition(400,(480 - SETTINGS.size.controls.height) / 2);
    },
    createOverlay : function(){
        return new farming.Sprite().setFill(SETTINGS.color.background_overlay).preventClickThrough()
            .setSize(800,480-SETTINGS.size.controls.height).setPosition(400,(480 - SETTINGS.size.controls.height) / 2);
    },
    color: {
        tile: '#b08251',
        background_layer: '#f0f0f0',
        background_overlay: 'rgba(71,25,11,0.5)',
        background_stroke: new lime.fill.Stroke(3, '#662c1b'),
        button_primary: 'green',
        button_inactive: 'inactive',
        button: '#999999',
        green: '#22CC22',
        red: '#CC2222',
        black: '#000000',
        controls_label: '#ffe478',
        controls_background: '#0D0D0D'
    },

    size: {
        button: new goog.math.Size(160, 70),
        button_small: new goog.math.Size(80, 40),
        close_button: new goog.math.Size(60, 60),
        background_layer: new goog.math.Size(740, 480 * 0.8),
        background_layer_full: new goog.math.Size(800,480),
        tiles: new goog.math.Size(200, 116),
        controls: {
            height: 60
        }
    },

    position: {
        close_button: new goog.math.Coordinate(725, 65),
        close_button_full: new goog.math.Coordinate(765, 35),
        left_button: new goog.math.Coordinate(130, 355),
        center_button: new goog.math.Coordinate(400, 375),
        right_button: new goog.math.Coordinate(670, 355),
        title: new goog.math.Coordinate(400, 50),
        title_full: new goog.math.Coordinate(400, 30)
    },

    font: {
        title: 25,
        subtitle: {
            size: 18,
            weight: 600
        },
        button: {
            size: 20,
            weight: 600
        },
        text: 17
    }
};