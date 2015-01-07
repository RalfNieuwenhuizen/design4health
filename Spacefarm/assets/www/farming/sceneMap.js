/**
 * Created on 11/23/14.
 */
goog.provide('farming.SceneMap');
goog.require('farming.Scene');
goog.require('farming.Tile');
goog.require('farming.Crop');
goog.require('farming.Button');
goog.require('farming.Label');
goog.require('farming.Introduction');
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

    // make the map updateable
    this.game.tickables.push(this);

}
goog.inherits(farming.SceneMap, farming.Scene);

farming.SceneMap.prototype.game = null;
farming.SceneMap.prototype.farm = null;
farming.SceneMap.prototype.drag = {
    maxClickDistance: 15
};

farming.SceneMap.prototype.calculate = function (key) {
    var scene = this;
    return {
        mapWidth: function () {
            return Math.max(SETTINGS.mapSize, SETTINGS.mapSize) * SETTINGS.size.tiles.width;
        },
        mapHeight: function () {
            return SETTINGS.mapSize * SETTINGS.size.tiles.height;
        },
        middleTile: function () {
            var x = Math.round(SETTINGS.mapSize / 2);
            var y = Math.round(SETTINGS.mapSize / 2);
            return new goog.math.Coordinate(x, y);
        }
    }[key]();
}

farming.SceneMap.prototype.drawLand = function () {
    this.landLayer = new lime.Layer()
        .setPosition(this.game.screen.width / 2, SETTINGS.screen.height / 2 - this.calculate('mapHeight') / 2)
        .setSize(this.calculate('mapWidth'), this.calculate('mapHeight'));
    var bg = new lime.Sprite().setAnchorPoint(0.5, 0).setPosition(0, -SETTINGS.size.tiles.height / 2)
        .setSize(this.landLayer.getSize()).setFill(SETTINGS.color.tile);
    this.landLayer.appendChild(bg);


    var middle = this.calculate('middleTile');

    this.farm = new farming.Sprite('images/farm.png').setAnchorPoint(0.25, 0.579).setSize(400, 278);

    var min = 0;
    var max = 0;
    var z = 0;
    while (true) { // put the tiles on the map in zig-zag (from top to bottom), important for 3D overlay of the items
        if (max < SETTINGS.mapSize) {
            max++;
        } else if (min < SETTINGS.mapSize) {
            min++;
        } else {
            break;
        }
        for (var x = min; x < max; x++) {
            var y = max - x + min - 1;
            if (typeof this.tiles[x] == 'undefined') this.tiles[x] = [];
            this.tiles[x][y] = new farming.Tile(this.game).setPosition(this.twoDToScreen(x, y));
            this.landLayer.appendChild(this.tiles[x][y]);
            if (middle.x == x && middle.y == y) {
                this.landLayer.appendChild(this.farm.setPosition(this.twoDToScreen(x, y)));
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
            var newPos = this.getPosition();
            var xDiff = newPos.x - oldPos.x;
            var yDiff = newPos.y - oldPos.y;
            var diff = xDiff * xDiff + yDiff * yDiff;
            if (diff < scene.drag.maxClickDistance*scene.drag.maxClickDistance) {
                var focus = scene.screenToTwoD(e.position.x, e.position.y);
                var tile = scene.tiles[focus.x][focus.y];
                var farmPos = scene.screenToTwoD(scene.farm.getPosition().x, scene.farm.getPosition().y);
                if ((focus.x == farmPos.x || focus.x == farmPos.x + 1) && (focus.y == farmPos.y || focus.y == farmPos.y-1 )) {
                    scene.game.showFarmClick();
                } else if (tile.canBeHarvested()) {
                    tile.playSound();
                    scene.game.showHarvest(tile);
                } else if (tile.isRotten()) {
                    tile.crop.harvest();
                //} else if (tile.isDead()) {
                //    tile.removeItem();
                } 
                   else if (tile.isHungry()){
                    tile.showProgress(tile);
                } else if (tile.isEmpty()) {
                    var currentClone = scene.game.currentClone;
                    // If there is no current crop to be cloned, return
                    if(currentClone == null)
                        return;

                    // If there is a current crop and the amount of money is sufficient, this can be planted
                    if(currentClone.cost <= scene.game.player.coins){
                        scene.game.removeCoins(currentClone.cost);
                        if (CROPS[currentClone.key]) {
                            tile.addCrop(new farming.Crop(currentClone.key));
                        } else if (LIVESTOCK[currentClone.key]) {
                            tile.addLivestock(new farming.Livestock(currentClone.key));
                        }
                    }
                    else {
                        scene.noMoneyAnimation(tile.getPosition());
                    }
                } else if(true){//!tile.isDead()) {
                    tile.playSound();
                    tile.showProgress(tile);
                }
            }
        }
        e.swallow(['touchend', 'touchcancel', 'mouseup'], drag);
    });

    this.appendChild(this.landLayer);

    // TODO: change this into the image of the crop to be cloned with high opacity and plot in on the tile
    // Make the screen to show what crop is being cloned
    this.cloningScreen = new lime.Sprite().setSize(150,150).setPosition(85,100);
    this.appendChild(this.cloningScreen);

    // Make a layer for screens, fixed position
    this.sceneLayer = new lime.Layer()
        .setPosition(0,0).setSize(this.calculate('mapWidth'), this.calculate('mapHeight'));
    this.appendChild(this.sceneLayer);

    this.body = new farming.Body(0.5, this.game);
    var farmPos = scene.farm.getPosition();
    this.body.redraw(this.game.player.body, new goog.math.Coordinate(farmPos.x + 50, farmPos.y), false);
    goog.events.listen(this.body, ['mousedown', 'touchstart'], function (e) {
        e.swallow(['touchend', 'mouseup'], function () {
            this.parent_.parent_.showBody(this.parent_.parent_, e)
        }, true);
    });
    this.landLayer.appendChild(this.body);
}

farming.SceneMap.prototype.drawControls = function () {
    this.controlsLayer = new lime.Layer().setAnchorPoint(0, 0);
    this.appendChild(this.controlsLayer);
    var scene = this;
    //controls area
    var controlArea = new lime.Sprite().setAnchorPoint(0, 0)
        .setPosition(0, SETTINGS.screen.height - SETTINGS.size.controls.height)
        .setSize(this.game.screen.width, SETTINGS.size.controls.height)
        .setFill(SETTINGS.color.controls_background)
    this.controlsLayer.appendChild(controlArea);

    // Money
    this.moneyImage = new lime.Sprite().setFill('images/coin_small/0.png')
        .setSize(SETTINGS.size.controls.height * 0.8, SETTINGS.size.controls.height * 0.8).setPosition(this.game.screen.width-90, SETTINGS.screen.height - SETTINGS.size.controls.height / 2);
    this.moneyLabel = new lime.Label().setFontColor(SETTINGS.color.controls_label)
        .setPosition(this.game.screen.width-50, SETTINGS.screen.height - SETTINGS.size.controls.height / 2);

    // Create the labels for the cloning function

    this.cloningTitle = new lime.Label().setSize(140,25).setPosition(0,-50);
    this.cloningImage = new lime.Sprite().setSize(80, 60).setPosition(-20,-15);
    this.cloningCoin = new farming.Sprite('images/coin_small/0.png').setSize(20, 20).setPosition(30,0);
    this.cloningText = new lime.Label().setSize(20,20).setPosition(50,5);
    this.cloningClose = new farming.Button('Stop Cloning').setColor(SETTINGS.color.button).setPosition(0,50).setSize(120,SETTINGS.size.close_button.height).setAction(this.stopCloning,this);

    this.noCoinsWarning = new farming.Sprite('images/insufficient_coins.png').setSize(100,100).setPosition(450,50).setOpacity(0);

    //updating money indicator
    this.controlsLayer.appendChild(this.moneyImage);
    this.controlsLayer.appendChild(this.moneyLabel);
    this.landLayer.appendChild(this.noCoinsWarning);

    this.updateControls();

    // Farmbutton
    this.farmButton = new farming.Button('Inventory').setColor(SETTINGS.color.button)
        .setPosition(50, SETTINGS.screen.height - SETTINGS.size.controls.height / 2)
        .setSize(100,SETTINGS.size.controls.height).setAction(this.showFarm, this);
    this.controlsLayer.appendChild(this.farmButton);

    // Clonebutton
    this.cloneButton = new farming.Button('Clone').setColor(SETTINGS.color.button)
        .setPosition(150, SETTINGS.screen.height - SETTINGS.size.controls.height / 2)
        .setSize(100,SETTINGS.size.controls.height).setAction(this.showClone, this);
    this.controlsLayer.appendChild(this.cloneButton);

    // Challengebutton
    this.challengeButton = new farming.Button('Challenges').setColor(SETTINGS.color.button)
        .setPosition(250, SETTINGS.screen.height - SETTINGS.size.controls.height / 2)
        .setSize(100,SETTINGS.size.controls.height).setAction(this.showChallenge, this);
    this.controlsLayer.appendChild(this.challengeButton);

    // BODYbutton
    this.bodyButton = new farming.Button('BODY').setColor('#999999')
        .setPosition(350, SETTINGS.screen.height - SETTINGS.size.controls.height / 2)
        .setSize(100,SETTINGS.size.controls.height).setAction(this.showBody, this);
    this.controlsLayer.appendChild(this.bodyButton);

    // RESETButton
    this.resetButton = new farming.Button('Reset').setColor('#995555')
        .setPosition(620, SETTINGS.screen.height - SETTINGS.size.controls.height / 2)
        .setSize(70,SETTINGS.size.controls.height).setAction(function(){ scene.game.reset();  }, this);
    this.controlsLayer.appendChild(this.resetButton);

    // Zoom buttons
    this.zoomInButton = new farming.Button('+').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.screen.width - 20, 20)
        .setSize(40, 40).setAction(this.zoomIn, this);
    this.controlsLayer.appendChild(this.zoomInButton);
    this.zoomOutButton = new farming.Button('-').setColor(SETTINGS.color.button)
        .setPosition(SETTINGS.screen.width - 20, 60)
        .setSize(40, 40).setAction(this.zoomOut, this);
    this.controlsLayer.appendChild(this.zoomOutButton);

    // Temporary introduction button
    this.introButton = new farming.Button('Intro').setColor(SETTINGS.color.button)
        .setPosition(350, this.game.screen.height - SETTINGS.size.controls.height / 2)
        .setSize(100,SETTINGS.size.controls.height).setAction(this.showIntro, this);
    // this.controlsLayer.appendChild(this.introButton);
}

farming.SceneMap.prototype.showFarm = function(scene) {
    scene.game.showFarm();
}
farming.SceneMap.prototype.showClone = function(scene) {
    scene.game.showClone();
}
farming.SceneMap.prototype.showChallenge = function(scene) {
    scene.game.showChallenge();
}
farming.SceneMap.prototype.showBody = function(scene) {
    scene.game.showBody();
}
farming.SceneMap.prototype.showIntro = function(scene) {
    scene.game.introduction.intro();
}

farming.SceneMap.prototype.updateControls = function(){
    this.moneyLabel.setText(this.game.player.coins);
}

farming.SceneMap.prototype.tiles = [];

farming.SceneMap.prototype.twoDToScreen = function (x, y) {
    return this.twoDToIso(x, y).scale(SETTINGS.size.tiles.width / 2, SETTINGS.size.tiles.height);
}
farming.SceneMap.prototype.screenToTwoD = function (x, y) {
    var point = this.isoToTwoD(x / SETTINGS.size.tiles.width * 2, y / SETTINGS.size.tiles.height);
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

// flipping the small coin in the controls panel
farming.SceneMap.prototype.moneyAnimation = function (amount) {
    var animation = new lime.animation.KeyframeAnimation().setDelay(0.02);
    for(var i = 5; i >= 0; i--) {
        animation.addFrame('images/coin_small/'+i+'.png');
    }
    animation.setLooping(false);
    this.moneyImage.runAction(animation);

    // When positive amount, show big coin in the middle of the screen
    if(amount > 0) {
        lime.scheduleManager.callAfter(function () {
            var image = new lime.Sprite().setFill('images/coin/0.png')
                .setSize(300, 300)
                .setPosition(new goog.math.Coordinate(SETTINGS.screen.width / 2 - 150, SETTINGS.screen.height - SETTINGS.size.controls.height));

            var numberLabel = new lime.Label(amount < 0 ? amount : '+' + amount)
                .setPosition(new goog.math.Coordinate(SETTINGS.screen.width / 2 + 150, SETTINGS.screen.height - SETTINGS.size.controls.height))
                .setFontSize(150)
                .setFontColor(amount < 0 ? SETTINGS.color.red : SETTINGS.color.green);

            this.controlsLayer.appendChild(image).appendChild(numberLabel);

            // Move up
            var moveUp = new lime.animation.MoveBy(0, -(SETTINGS.screen.height / 2)).setDuration(3);
            image.runAction(moveUp);
            numberLabel.runAction(moveUp);
            goog.events.listen(moveUp, lime.animation.Event.STOP, function () {
                // Twist coin
                var animation = new lime.animation.KeyframeAnimation().setDelay(0.02);
                for (var i = 5; i >= 0; i--) {
                    animation.addFrame('images/coin/' + i + '.png');
                }
                animation.setLooping(false);
                image.runAction(animation);

                goog.events.listen(animation, lime.animation.Event.STOP, function () {
                    // Clean up coin
                    for (var i in this.targets) {
                        var target = this.targets[i];
                        target.parent_.removeChild(numberLabel);
                        target.parent_.removeChild(target);
                    }
                });
            });
        }, this, 500);
    }
}

// Animation of decreasing or increasing item
farming.SceneMap.prototype.itemAnimation = function (type, amount, opt_position) {
    var itemPos = new goog.math.Coordinate(SETTINGS.screen.width / 2 - 150, SETTINGS.screen.height - SETTINGS.size.controls.height);
    var labelPos = new goog.math.Coordinate(SETTINGS.screen.width / 2 + 150, SETTINGS.screen.height - SETTINGS.size.controls.height);
    if(opt_position) {
        itemPos = new goog.math.Coordinate(opt_position.x, opt_position.y - 30);
        labelPos = new goog.math.Coordinate(opt_position.x - 30, opt_position.y - 30);
    }

    lime.scheduleManager.callAfter(function() {
        var itemSprite = new lime.Sprite().setFill('images/items/'+type+'.png').setSize(SETTINGS.size.close_button)
            .setPosition(itemPos);
        var numberLabel = new lime.Label(amount < 0 ? amount : '+' + amount)
            .setPosition(labelPos)
            .setFontColor(amount < 0 ? SETTINGS.color.red : SETTINGS.color.green);

        if(opt_position) {
            this.landLayer.appendChild(itemSprite).appendChild(numberLabel);
        } else {
            itemSprite.setSize(300, 300);
            numberLabel.setFontSize(150);
            this.controlsLayer.appendChild(itemSprite).appendChild(numberLabel);
        }
        var moveUp = new lime.animation.MoveBy(0,opt_position ? -100 : -(SETTINGS.screen.height / 2)).setDuration(3);
        itemSprite.runAction(moveUp);
        numberLabel.runAction(moveUp);
        goog.events.listen(moveUp,lime.animation.Event.STOP,function(){
            for(var i in this.targets) {
                var target = this.targets[i];
                target.parent_.removeChild(target);
            }
        });
    }, this, 1000);
}

farming.SceneMap.prototype.startCloning = function (properties) {
    this.cloningTitle.setText(properties.name);
    this.cloningText.setText(properties.cost);
    this.cloningScreen.setFill(211,211,211,0.8);
    if (CROPS[properties.key]) {
        this.cloningImage.setFill('images/crops/'+properties.key+'_ripe.png');
    } else if (LIVESTOCK[properties.key]) {
        this.cloningImage.setFill('images/livestock/'+properties.key+properties.appearances+'.png');
    }
    this.cloningScreen.appendChild(this.cloningTitle).appendChild(this.cloningText).appendChild(this.cloningCoin).appendChild(this.cloningClose).appendChild(this.cloningImage);
}

// Shut the screen down for cloning
farming.SceneMap.prototype.stopCloning = function(scene) {
    scene.cloningScreen.setFill(211,211,211,0);
    scene.cloningScreen.removeAllChildren();
    scene.game.currentClone = null;
    // Let the event fire
    scene.game.source.dispatchEvent(scene.game.EventType.CLOSE_CLONE);
}

// Warning when trying to plant but there is no money
farming.SceneMap.prototype.noMoneyAnimation = function(position) {
    this.noCoinsWarning.setPosition(position.x, position.y);
    this.noCoinsWarning.setOpacity(1);
    var fadeAway = new lime.animation.FadeTo(0).setDuration(0.5);
    this.noCoinsWarning.runAction(fadeAway);
}

//In this function you can define all things that have to updated over time
farming.SceneMap.prototype.tick = function(){
    this.showCurrentChallenge();

    if(this.game && this.game.sceneHarvest && this.game.sceneHarvest.tile && !this.game.sceneHarvest.tile.canBeHarvested())
        this.game.sceneHarvest.hideHarvest(this);

    //Hide zoom buttons when a screen is active
    if(this.sceneLayer.children_.length > 0) {
        this.zoomInButton.setHidden(true);
        this.zoomOutButton.setHidden(true);
    } else {
        this.zoomInButton.setHidden(false);
        this.zoomOutButton.setHidden(false);
    }
}

// Zooming
farming.SceneMap.prototype.zoomIn = function(scene){
    var scale = scene.landLayer.getScale();
    if(scale.x >= 1.5) return;
    var newScale = scale.x/.9;
    scene.landLayer.setScale(newScale, newScale);
    scene.zoomOutButton.setColor(SETTINGS.color.button).setAction(farming.SceneMap.prototype.zoomOut, scene);
    if(newScale >= 1.5) {
        scene.zoomInButton.setColor(SETTINGS.color.button_inactive).setAction();
    }
}
farming.SceneMap.prototype.zoomOut = function(scene){
    var scale = scene.landLayer.getScale();
    if(scale.x <= 0.7) return;
    var newScale = scale.x*.9;
    scene.landLayer.setScale(newScale, newScale);
    scene.zoomInButton.setColor(SETTINGS.color.button).setAction(farming.SceneMap.prototype.zoomIn, scene);
    if(newScale <= 0.7) {
        scene.zoomOutButton.setColor(SETTINGS.color.button_inactive).setAction();
    }
}

// function for showing or hiding the current challenge indicator
farming.SceneMap.prototype.showCurrentChallenge = function(){
    if(this.game.player.currentChallenge) {
        this.challengeButton.setColor(SETTINGS.color.red);
    } else {
        this.challengeButton.setColor(SETTINGS.color.button);
    }
}