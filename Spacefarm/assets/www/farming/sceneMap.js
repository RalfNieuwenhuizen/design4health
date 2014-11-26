/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.SceneMap');
goog.require('farming.Scene');
goog.require('farming.Tile');
goog.require('farming.Crop');

/**
 * Scene elements
 *
 */
farming.SceneMap = function (game) {
    goog.base(this);
    this.game = game;
    this.drawLand();
    this.drawControls();


}
goog.inherits(farming.SceneMap, farming.Scene);

farming.SceneMap.prototype.game = null;

farming.SceneMap.prototype.settings = {
    mapSize: 20,
    tiles: {
        width: 200,
        height: 116
    },
    controls: {
        height: 30
    },
    drag: {
        maxClickDistance: 15
    }
}
farming.SceneMap.prototype.calculate = function (key) {
    var scene = this;
    return {
        mapWidth: function () {
            return Math.max(scene.settings.mapSize, scene.settings.mapSize) * scene.settings.tiles.width;
        },
        mapHeight: function () {
            return scene.settings.mapSize * scene.settings.tiles.height;
        },
        middleTile: function () {
            var x = Math.round(scene.settings.mapSize / 2);
            var y = Math.round(scene.settings.mapSize / 2);
            return new goog.math.Coordinate(x, y);
        }
    }[key]();
}

farming.SceneMap.prototype.drawLand = function () {
    this.landLayer = new lime.Layer()
        .setPosition(this.game.screen.width / 2, this.game.screen.height / 2 - this.calculate('mapHeight') / 2)
        .setSize(this.calculate('mapWidth'), this.calculate('mapHeight'));


    var bg = new lime.Sprite().setAnchorPoint(0.5, 0).setPosition(0, -this.settings.tiles.height / 2)
        .setSize(this.landLayer.getSize()).setFill('#443b35');
    this.landLayer.appendChild(bg);
    //create land elements
    /*for (var x = 0; x < this.settings.mapSize; x++) {
     this.tiles[x] = [];
     for (var y = 0; y < this.settings.mapSize; y++) {
     this.tiles[x][y] = new farming.Tile(this.settings, this.player).setPosition(this.twoDToScreen(x, y));
     this.landLayer.appendChild(this.tiles[x][y]);
     }
     }*/
    var middle = this.calculate('middleTile');

    var farm = new lime.Sprite().setAnchorPoint(0.5, 0.70).setSize(400, 293).setFill('images/farm.png');

    var min = 0;
    var max = 0;
    var z = 0;
    while (true) {
        if (max < this.settings.mapSize) {
            max++;
        } else if (min < this.settings.mapSize) {
            min++;
        } else {
            break;
        }
        for (var x = min; x < max; x++) {
            var y = max - x + min - 1;
            if (typeof this.tiles[x] == 'undefined') this.tiles[x] = [];
            this.tiles[x][y] = new farming.Tile(this.settings, this.player).setPosition(this.twoDToScreen(x, y));
            this.landLayer.appendChild(this.tiles[x][y]);
            if (middle.x == x && middle.y == y) {
                this.landLayer.appendChild(farm.setPosition(this.twoDToScreen(x, y)));
            }
        }
    }
    /*for (var x = middle.x-2; x < middle.x+2; x++) {
        for (var y = middle.y-2; y < middle.y+2; y++) {
            if(x == middle.x+1 && y == middle.y+1) continue;
            this.tiles[x][y].disable();
        }
    }*/
    var scene = this;
    //drag land elements
    goog.events.listen(this.landLayer, ['mousedown', 'touchstart'], function (e) {
        var oldPos = this.getPosition();
        e.startDrag(false);
        var drag = function (e) {
            var newPos = this.getPosition();
            var xDiff = newPos.x - oldPos.x;
            var yDiff = newPos.y - oldPos.y;
            var diff = xDiff * xDiff + yDiff * yDiff;
            if (diff < scene.settings.drag.maxClickDistance*scene.settings.drag.maxClickDistance) {
                var focus = scene.screenToTwoD(e.position.x, e.position.y);
                var tile = scene.tiles[focus.x][focus.y];
                if(tile.isRipe()) {
                    scene.game.showHarvest(tile);
                } else {
                    tile.setCrop(new farming.Crop(Math.random() >  0.5 ? 'wheat' : 'apple_tree'));
                }
            }
        }
        e.swallow(['touchend', 'touchcancel', 'mouseup'], drag);
    });
    scene.tiles[12][12].setCrop(new farming.Crop('wheat'));
    this.appendChild(this.landLayer);

}

farming.SceneMap.prototype.drawControls = function () {
    this.controlsLayer = new lime.Layer().setAnchorPoint(0, 0);
    this.appendChild(this.controlsLayer);
    //controls area
    var controlArea = new lime.Sprite().setAnchorPoint(0, 0)
        .setPosition(0, this.game.screen.height - this.settings.controls.height)
        .setSize(this.game.screen.width, this.settings.controls.height)
        .setFill('#0D0D0D')
    this.controlsLayer.appendChild(controlArea);


    //money
    this.moneyLabel = new lime.Label().setFontColor('#E8FC08')
        .setPosition(this.game.screen.width-50, this.game.screen.height - this.settings.controls.height / 2);
    //updating money indicator
    this.controlsLayer.appendChild(this.moneyLabel);
    this.updateControls();
}

farming.SceneMap.prototype.updateControls = function(){
    this.moneyLabel.setText('$' + this.game.player.coins);
}
farming.SceneMap.prototype.timePassed = function(currentTime){
    for (var x = 0; x < this.settings.mapSize; x++) {
        for (var y = 0; y < this.settings.mapSize; y++) {
            if(this.tiles[x][y]) this.tiles[x][y].timePassed(currentTime);
        }
    }
}


farming.SceneMap.prototype.tiles = [];

farming.SceneMap.prototype.twoDToScreen = function (x, y) {
    return this.twoDToIso(x, y).scale(this.settings.tiles.width / 2, this.settings.tiles.height);
}
farming.SceneMap.prototype.screenToTwoD = function (x, y) {
    var point = this.isoToTwoD(x / this.settings.tiles.width * 2, y / this.settings.tiles.height);
    return new goog.math.Coordinate(Math.round(point.x), Math.round(point.y));
}
farming.SceneMap.prototype.twoDToIso = function (x, y) {
    return new goog.math.Coordinate(
        (x - y),
        (x + y) / 2
    );
}
farming.SceneMap.prototype.isoToTwoD = function (x, y) {
    return new goog.math.Coordinate(
        (2 * y + x) / 2,
        (2 * y - x) / 2
    );
}