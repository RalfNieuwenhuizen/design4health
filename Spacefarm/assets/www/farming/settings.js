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

    color: {
        tile: '#b08251',
        background_layer: '#f0f0f0',
        button_primary: '#22CC22',
        button_inactive: '#BBB',
        button: '#999999',
        green: '#22CC22',
        red: '#CC2222',
        black: '#000000',
        controls_label: '#E8FC08',
        controls_background: '#0D0D0D'
    },

    size: {
        button: new goog.math.Size(160, 70),
        button_small: new goog.math.Size(80, 40),
        close_button: new goog.math.Size(60, 60),
        background_layer: new goog.math.Size(735, 480 * 0.8),
        background_layer_full: new goog.math.Size(800,480),
        tiles: new goog.math.Size(200, 116),
        controls: {
            height: 50
        }
    },

    position: {
        close_button: new goog.math.Coordinate(745, 45),
        close_button_full: new goog.math.Coordinate(765, 35),
        left_button: new goog.math.Coordinate(100, 375),
        center_button: new goog.math.Coordinate(400, 375),
        right_button: new goog.math.Coordinate(700, 375),
        title: new goog.math.Coordinate(400, 50),
        title_full: new goog.math.Coordinate(400, 30)
    },

    font: {
        title: 22,
        subtitle: {
            size: 17,
            weight: 600
        },
        text: 16
    }
};