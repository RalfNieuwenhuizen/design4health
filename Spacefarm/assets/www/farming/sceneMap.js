/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.SceneMap');
goog.require('farming.Scene');
goog.require('farming.Tile');
goog.require('farming.Crop');
goog.require('farming.Button');
goog.require('farming.SceneCloneOnMap');
goog.require('lime.animation.FadeTo');

/**
 * Scene elements
 *
 */
farming.SceneMap = function (game) {
    goog.base(this);
    this.game = game;
    this.drawLand();
    this.drawControls();

    this.game.tickables.push(this);
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

    var farm = new lime.Sprite().setAnchorPoint(0.25, 0.579).setSize(400, 278).setFill('images/farm.png');

    var min = 0;
    var max = 0;
    var z = 0;
    while (true) { // put the tiles on the map in zig-zag (from top to bottom), important for 3D overlay of the items
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
            this.tiles[x][y] = new farming.Tile(this.game, this.settings).setPosition(this.twoDToScreen(x, y));
            this.landLayer.appendChild(this.tiles[x][y]);
            if (middle.x == x && middle.y == y) {
                this.landLayer.appendChild(farm.setPosition(this.twoDToScreen(x, y)));
            }
        }
    }
    for (var x = middle.x; x < middle.x+2; x++) {
        for (var y = middle.y-1; y < middle.y+1; y++) {
            this.tiles[x][y].disable();
        }
    }
    var scene = this;
    
    //drag land elements
    goog.events.listen(this.landLayer, ['mousedown', 'touchstart'], function (e) { // clicking on the map and dragging it
        var oldPos = this.getPosition();
        e.startDrag(false);
        var drag = function (e) {
        	var y = e.position.y + this.getPosition().y;
        	if(y > scene.game.screen.height - scene.settings.controls.height) return;
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
                	currentCrop = scene.game.currentCrop;
                	// If there is no current crop to be cloned, return
                	if(currentCrop == null)
                		return
                				
                	// If there is a current crop and the amount of money is sufficient, this can be planted	
                	if(currentCrop.cost <= scene.game.player.coins){
                		scene.game.removeCoins(currentCrop.cost);
                		tile.addCrop(new farming.Crop(currentCrop.key));
                	}	
                	else{
                		scene.noMoneyAnimation();
                	}
                }
            }
        }
        e.swallow(['touchend', 'touchcancel', 'mouseup'], drag);
    });
    
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

    // Money
    this.moneyImage = new lime.Sprite().setFill('images/coin_small/0.png')
        .setSize(25, 25).setPosition(this.game.screen.width-80, this.game.screen.height - this.settings.controls.height / 2);
    this.moneyLabel = new lime.Label().setFontColor('#E8FC08')
        .setPosition(this.game.screen.width-50, this.game.screen.height - this.settings.controls.height / 2);
   
    // Create the labels for the cloning function
    this.cloningScreen = new lime.Sprite().setFill(255,255,255,0).setSize(150,100).setPosition(85,100);
    this.cloningTitle = new lime.Label().setSize(100,25).setPosition(0,-35);
    this.cloningImage = new lime.Sprite().setSize(100, 60).setPosition(0,0);
    this.cloningText = new lime.Label().setSize(100,25).setPosition(0,40);
    this.cloningClose = new farming.Button('X').setColor('#999999').setPosition(57,-32).setSize(30,30).setAction(this.stopCloning,this);
    
    this.noCoinsWarning = new lime.Label().setFill(200,0,0,0.3).setFontColor('#000000').setFontWeight('bold').setFontSize(20).setSize(150,50).setPosition(450,50)
    		.setText('Insufficient Money').setAlign('center').setOpacity(0);
    
    //updating money indicator
    this.controlsLayer.appendChild(this.moneyImage);
    this.controlsLayer.appendChild(this.moneyLabel);
    this.controlsLayer.appendChild(this.noCoinsWarning);
    
    this.controlsLayer.appendChild(this.cloningScreen);
    this.updateControls();
    
    // Farmbutton
    this.farmButton = new farming.Button('Farm').setColor('#999999')
    		.setPosition(40, this.game.screen.height - this.settings.controls.height / 2)
    		.setSize(80,20).setAction(this.game.showFarm,this.game);
    this.controlsLayer.appendChild(this.farmButton);

    // Clonebutton
    this.cloneButton = new farming.Button('Clone').setColor('#999999')
    		.setPosition(140, this.game.screen.height - this.settings.controls.height / 2)
    		.setSize(80,20).setAction(this.game.showClone,this.game);
    this.controlsLayer.appendChild(this.cloneButton);

    // Challengebutton
    this.challengeButton = new farming.Button('Challenges').setColor('#999999')
    		.setPosition(240, this.game.screen.height - this.settings.controls.height / 2)
    		.setSize(80,20).setAction(this.game.showChallenge, this.game);
    this.controlsLayer.appendChild(this.challengeButton);

    // Current challenge indicator
    this.challengeIndicator = new farming.Label().setText('Active Challenge!').setFill('#CC2222')
        .setPosition(0, 0).setAnchorPoint(0, 0).setSize(70,30)
        .setHidden(true).setAction(this.game.showChallenge, this.game);
    this.controlsLayer.appendChild(this.challengeIndicator);
}

farming.SceneMap.prototype.updateControls = function(){
    this.moneyLabel.setText(this.game.player.coins);
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
farming.SceneMap.prototype.moneyAnimation = function (amount) {
    var animation = new lime.animation.KeyframeAnimation().setDelay(0.02);
    for(var i = 5; i >= 0; i--) {
        animation.addFrame('images/coin_small/'+i+'.png');
    }
    animation.setLooping(false);
    this.moneyImage.runAction(animation);
}

farming.SceneMap.prototype.startCloning = function (crop) {
	this.game.hideClone();
	this.cloningTitle.setText(crop.name);
	this.cloningText.setText('Cost: '+crop.cost);
	this.cloningScreen.setFill(211,211,211,0.8);
	this.cloningImage.setFill('images/'+crop.key+'_ripe.png');
	this.cloningScreen.appendChild(this.cloningTitle).appendChild(this.cloningText).appendChild(this.cloningClose).appendChild(this.cloningImage);
	this.game.currentCrop = crop;
}

// Shut the screen down for cloning
farming.SceneMap.prototype.stopCloning = function(scene) {
	scene.cloningScreen.setFill(211,211,211,0);
	scene.cloningScreen.removeAllChildren();
	scene.game.currentCrop = null;
}

// Warning when trying to plant but there is no money
farming.SceneMap.prototype.noMoneyAnimation = function () {
    this.noCoinsWarning.setOpacity(1);	
	var fadeAway = new lime.animation.FadeTo(0).setDuration(0.5);
    this.noCoinsWarning.runAction(fadeAway);
}
}

//In this function you can define all things that have to updated over time
farming.SceneMap.prototype.tick = function(){
    this.showCurrentChallenge();
}
farming.SceneMap.prototype.showCurrentChallenge = function(){
    if(this.game.currentChallenge) {
        this.challengeIndicator.setHidden(false);
    } else {
        this.challengeIndicator.setHidden(true);
    }
}