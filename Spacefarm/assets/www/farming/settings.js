/**
 * Created on 09/01/15.
 */
goog.provide('farming.Settings');
goog.require('farming.RoundedRect');

var SETTINGS = {
    TESTING: true,

    timeUnit: function() {
        return SETTINGS.TESTING === true ? 1 : 60;
    },

    mapSize: 13,
    screen: {
        width: 800,
        height: 480
    },
    createWindow : function(){
        return new farming.RoundedRect().setRadius(9).setFill(SETTINGS.color.background_layer)
            .setStroke(new lime.fill.Stroke(3, SETTINGS.color.background_stroke)).preventClickThrough()
            .setSize(SETTINGS.size.background_layer).setPosition(400,(480 - SETTINGS.size.controls.height) / 2 + 5);
    },
    createTitleImage : function(title){
        return new lime.Sprite().setFill('images/title_'+title+'.png').setSize(571*0.5,115*0.5).setPosition(400,35);
    },
    createOverlay : function(){
        return new farming.Sprite().setFill(SETTINGS.color.background_overlay).preventClickThrough()
            .setSize(800,480).setPosition(400,240);
    },
    createTitle : function(title){
        return new lime.Label().setText(title).setFontSize(SETTINGS.font.title)
            .setPosition(SETTINGS.position.title).setFontWeight(600).setFontColor('#461b01');
    },
    drawCoin : function(wrapper, scale, coins){
        var costIcon = new lime.Sprite().setFill('images/coin_small/0.png').setSize(60*scale, 60*scale);
        var costLabel = new lime.Label().setFontSize(31*scale).setSize(30, 30).setText(coins).setPosition(0,15-13.5*scale);

        return wrapper.removeAllChildren().appendChild(costIcon).appendChild(costLabel);
    },
    drawItemRevenue : function(wrapper, item){
        var itemIcon = new lime.Sprite().setSize(55, 55).setPosition(40,-1).setFill('images/items/'+item+'.png');
        var itemPlus = new lime.Label().setFontSize(26).setFontWeight(800).setFontColor('#444').setSize(20, 20).setText('+');
        //var itemLabel = new lime.Label().setPosition(160,5).setFontSize(18).setFontWeight(600).setAlign('left').setFontColor('#5e342b').setSize(200, 18).setText(ITEMS[item].name);
        return wrapper.removeAllChildren().appendChild(itemIcon).appendChild(itemPlus);
    },
    drawBodyPoints : function(wrapper, type, count){
        var c = typeof count == 'undefined' ? 1 : count;
        var exPlus = new lime.Label().setFontSize(18).setPosition(18,2).setFontWeight(800).setFontColor('#184e00').setSize(20, 20).setText('+'+c);
        var exRect = new lime.RoundedRect().setRadius(8).setPosition(65,0).setFill('#e3f0dd').setSize(130, 30).setStroke(new lime.fill.Stroke(2,'#a5c781'));
        wrapper.removeAllChildren().appendChild(exRect);
        var exLabel = new lime.Label().setPosition(180,1).setFontSize(18)
            .setAlign('left').setFontColor('#184e00').setSize(200, 18);
        if(typeof type == 'string') {
            var exIcon = new lime.Sprite().setSize(37, 37).setPosition(53,-1).setFill('images/body/'+type+'.png');
            wrapper.appendChild(exIcon);
            exLabel.setText(type);
        } else {
            exLabel.setText(type.join(', ')).setPosition(136,1);
        }

        return wrapper.appendChild(exLabel).appendChild(exPlus);
    },
    color: {
        background_layer: '#f0f0f0',
        background_overlay: 'rgba(71,25,11,0.5)',
        background_stroke: '#662c1b',
        button_primary: 'green',
        button_inactive: 'inactive',
        button: '#999999',
        green: '#22CC22',
        red: '#CC2222',
        black: '#000000',
        coin: '#a97f00',
        controls_label: '#ffe478'
    },

    size: {
        button: new goog.math.Size(160, 70),
        button_small: new goog.math.Size(80, 40),
        close_button: new goog.math.Size(60, 60),
        background_layer: new goog.math.Size(740, 480 * 0.8),
        background_layer_full: new goog.math.Size(800,480),
        tiles: new goog.math.Size(200, 116),
        controls: {
            height: 77
        }
    },
    texts : {

    },

    position: {
        close_button: new goog.math.Coordinate(740, 45),
        close_button_full: new goog.math.Coordinate(765, 35),
        left_button: new goog.math.Coordinate(110, 363),
        center_button: new goog.math.Coordinate(400, 345),
        right_button: new goog.math.Coordinate(690, 363),
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