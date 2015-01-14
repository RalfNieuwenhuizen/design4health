/**
 * Created on 11/23/14.
 */
goog.provide('farming.Game');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.transitions.MoveInDown');
goog.require('lime.fill.Stroke');
goog.require('lime.RoundedRect');
goog.require('farming.Settings');
goog.require('farming.SceneMap');
goog.require('farming.SceneFarm');
goog.require('farming.SceneBody');
goog.require('farming.SceneHarvest');
goog.require('farming.SceneClone');
goog.require('farming.SceneCropDetails');
goog.require('farming.SceneLivestockDetails');
goog.require('farming.SceneChallenge');
goog.require('farming.SceneChallengeDetails');
goog.require('farming.SceneStats');
goog.require('farming.SceneSettings');
goog.require('farming.SceneTask');
goog.require('farming.Introduction');
goog.require('farming.Challenge');
goog.require('farming.Crop');
goog.require('farming.Livestock');
goog.require('farming.Slider');
goog.require('farming.SceneFeedback');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventId');


/**
 * Land elements
 *
 */
farming.Game = function () {

    this.screen = {
        width: SETTINGS.screen.width,
        height: SETTINGS.screen.height
    }

    this.player = {
        coins: 150, // + 10000 * SETTINGS.TESTING,
        exercisesDone: {},
        body: {
            arms: 0,
            legs: 0,
            back: 0,
            chest: 0,
            abs: 0
        },
        inventory: {
            space_wheat: 3,
            space_apple: 3
        },
        currentChallenge: null,
        daysLoggedIn: {},
        settings: {
            sound: true,
            music: true
        }
    }

    // Current crop defines the crop the user is building, initiated in clone screen
    this.currentClone = null;

    this.director = new lime.Director(document.body, this.screen.width, this.screen.height);
    this.director.makeMobileWebAppCapable()
    this.director.setDisplayFPS(false);

    //Define all the scenes
    this.sceneMap = new farming.SceneMap(this);
    this.sceneFarm = new farming.SceneFarm(this);
    this.sceneBody = new farming.SceneBody(this);
    this.sceneExercise = new farming.SceneExercise(this);
    this.sceneHarvest = new farming.SceneHarvest(this);
    this.sceneClone = new farming.SceneClone(this);
    this.sceneCropDetails = new farming.SceneCropDetails(this);
    this.sceneLivestockDetails = new farming.SceneLivestockDetails(this);
    this.sceneChallenge = new farming.SceneChallenge(this);
    this.sceneChallengeDetails = new farming.SceneChallengeDetails(this);
    this.sceneStats = new farming.SceneStats(this);
    this.introduction = new farming.Introduction(this);
    this.sceneSettings = new farming.SceneSettings(this);
    this.sceneTask = new farming.SceneTask(this);
    this.sceneFeedback = new farming.SceneFeedback(this);

    this.load();

    //Set the starting scene
    this.director.replaceScene(this.sceneMap);
    var game = this;
    lime.scheduleManager.scheduleWithDelay(function () {
        for (var i in this.tickables) {
            if (this.tickables[i]) this.tickables[i].tick();
        }
    }, this, 1000);

    if (this.introduction.introPhase > 3)
        this.playMusic();


    lime.scheduleManager.scheduleWithDelay(function () {
        game.save();
    }, this, 5000);
    // Launches introductional screens if still applicable
    this.introduction.intro();

    document.addEventListener("pause", function () {
        if (!game.saveAtClose) return;
        game.save()
    }, false);
    document.addEventListener("backbutton", function () {
        if (!game.saveAtClose) return;
        game.save()
        navigator.app.exitApp();
    }, false);
    window.onbeforeunload = function () {
        if (!game.saveAtClose) return;
        game.save()
    };
}

// 	Create ID's for different events
farming.Game.prototype.EventType = {
    SHOW_FARM: goog.events.getUniqueId('show_farm'),
    GO_CLONE: goog.events.getUniqueId('go_clone'),
    CLONE_DETAILS: goog.events.getUniqueId('clone_details'),
    CLONE_CROP: goog.events.getUniqueId('clone_crop'),
    CLOSE_CLONE: goog.events.getUniqueId('close_clone'),
    OPEN_CHALLENGES: goog.events.getUniqueId('open_challenges'),
    CHALLENGE_DETAILS: goog.events.getUniqueId('challenge_details'),
    DO_CHALLENGE: goog.events.getUniqueId('do_challenge'),
    PRESSED_DO: goog.events.getUniqueId('pressed_do'),
    EXERCISE_DONE: goog.events.getUniqueId('exercise_done'),
    COMPLETE_CHALLENGE: goog.events.getUniqueId('complete_challenge'),
    OPEN_BODY: goog.events.getUniqueId('open_body'),
    SHOW_BODYSTATS: goog.events.getUniqueId('show_bodystats'),
    CLOSE_SCENE: goog.events.getUniqueId('close_scene'),
    FARM_CLICK: goog.events.getUniqueId('farm_click'),
    CROP_CLONED: goog.events.getUniqueId('crop_cloned'),
    CROP_HARVESTED: goog.events.getUniqueId('crop_harvested'),
    WINDOW_OPENED: goog.events.getUniqueId('window_opened'),
    NEW_DAY: goog.events.getUniqueId('new_day')
};

// Create source to fire events
farming.Game.prototype.source = new goog.events.EventTarget();

farming.Game.prototype.tickables = [];
farming.Game.prototype.saveAtClose = true;
farming.Game.prototype.music = false;


farming.Game.prototype.isAndroid = function () {
    return (typeof device != 'undefined' && device.platform == "Android");
}
// General close function
farming.Game.prototype.playMusic = function (file) {
    var f = typeof file == 'undefined' ? 'music.ogg' : file;
    this.stopMusic();
    // Background music
    this.music = new lime.audio.Audio('sounds/' + f);
    if (typeof device != 'undefined' && device.platform == "Android") {
        var loop = function (status) {
            if (status === Media.MEDIA_STOPPED) {
                this.music.play();
            }
        };
        this.music = new Media('file:///android_asset/www/' + f, null, null, loop);
    }
    if (this.player.settings.music == true) {
        this.music.play(true);
    }
}
farming.Game.prototype.stopMusic = function () {
    if (this.music) {
        if (this.music.pause)
            this.music.pause();
        else if (this.music.stop)
            this.music.stop();
    }
}

// General close function
farming.Game.prototype.close = function () {
    this.sceneMap.setActiveButton(null);
    this.sceneMap.sceneLayer.removeAllChildren();
    // Fire the event that the screen is closed, listened to by introduction
    this.source.dispatchEvent(this.EventType.CLOSE_SCENE);
}

// Check for the daily money bonus
farming.Game.prototype.checkDailyBonus = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (!this.player.daysLoggedIn)
        this.player.daysLoggedIn = [];
    if (!this.player.daysLoggedIn[year])
        this.player.daysLoggedIn[year] = [];
    if (!this.player.daysLoggedIn[year][month])
        this.player.daysLoggedIn[year][month] = [];
    if (!this.player.daysLoggedIn[year][month][day]) {
        this.player.daysLoggedIn[year][month][day] = true;
        lime.scheduleManager.callAfter(function () {
            var bonus = new lime.Label("Welcome back bonus!")
                .setPosition(SETTINGS.screen.width / 2, SETTINGS.screen.height - (SETTINGS.size.controls.height * 2))
                .setFontSize(50)
                .setFontColor(SETTINGS.color.green);

            this.sceneMap.controlsLayer.appendChild(bonus);
            lime.scheduleManager.callAfter(function () {
                this.parent_.removeChild(this);
            }, bonus, 2000);
        }, this, 1000);
        this.addCoins(20);
        this.source.dispatchEvent(this.EventType.NEW_DAY);
    }
}
farming.Game.prototype.load = function () {
    var savedString = localStorage.getItem('save');
    if (!savedString || savedString == 'null') return;
    var save = JSON.parse(savedString);

    try {
        this.player = save.player;
        this.introduction.introPhase = save.introPhase;
        if (save.tasks)
            this.sceneTask.tasks = save.tasks;
        for (var x = 0; x < SETTINGS.mapSize; x++) {
            for (var y = 0; y < SETTINGS.mapSize; y++) {
                this.sceneMap.tiles[x][y].deserialize(save.tiles[x][y]);
            }
        }
    } catch (e) {
        if (!this.isAndroid()) alert('incompatible save, restarting');
        this.reset();
    }
    this.checkDailyBonus();
    this.sceneMap.updateControls();
    this.sceneBody.redraw(this.player.body);
}
farming.Game.prototype.loadWrapper = function (game) {
    game.load();
}
farming.Game.prototype.reset = function () {
    localStorage.setItem('save', null);
    this.saveAtClose = false;
    window.location.reload();
}
farming.Game.prototype.save = function () {
    var save = {};
    save.player = this.player;
    save.introPhase = this.introduction.introPhase;
    save.tasks = this.sceneTask.tasks;
    save.tiles = [];
    for (var x = 0; x < SETTINGS.mapSize; x++) {
        save.tiles[x] = [];
        for (var y = 0; y < SETTINGS.mapSize; y++) {
            save.tiles[x][y] = this.sceneMap.tiles[x][y].serialize();
        }
    }
    var string = JSON.stringify(save);
    localStorage.setItem('save', string);
}
farming.Game.prototype.saveWrapper = function (game) {
    game.save();
}

// -- settings --
farming.Game.prototype.showSettings = function () {
    this.close();
    this.sceneMap.setActiveButton('settings');
    this.sceneSettings.redraw(this.player.settings);
    this.sceneMap.sceneLayer.appendChild(this.sceneSettings.windowLayer);
}
// -- end settings --
// -- farm --
farming.Game.prototype.showFarm = function () {
    this.close();
    this.sceneMap.setActiveButton('farm');
    // Fire the event that farm is showed, listened to by introduction.intro3
    this.source.dispatchEvent(this.EventType.SHOW_FARM);
    this.source.dispatchEvent(this.EventType.WINDOW_OPENED);
    this.sceneFarm.redraw(this.player.inventory);
    //this.director.pushScene(this.sceneFarm);
    this.sceneMap.sceneLayer.appendChild(this.sceneFarm.windowLayer);
}
// -- end farm --

//-- click on farm --
farming.Game.prototype.showFarmClick = function () {
    this.source.dispatchEvent(this.EventType.FARM_CLICK);
    this.sceneTask.task();
    //this.director.pushScene(this.sceneFarm);
    //this.sceneMap.sceneLayer.appendChild(this.sceneFarm.windowLayer);
}
//-- end click on farm --

// -- BODY --
farming.Game.prototype.showBody = function () {
    this.close();
    this.sceneMap.setActiveButton('body');
    this.sceneBody.redraw(this.player.body);
    this.sceneMap.sceneLayer.appendChild(this.sceneBody.windowLayer);
    this.source.dispatchEvent(this.EventType.OPEN_BODY);
    this.source.dispatchEvent(this.EventType.WINDOW_OPENED);
}

farming.Game.prototype.showStats = function () {
    this.sceneStats.filter = this.sceneStats.getDate();
    this.sceneStats.redraw(this.player);
    this.sceneMap.sceneLayer.appendChild(this.sceneStats.windowLayer);
}
// -- end BODY --

// -- harvest --
farming.Game.prototype.showHarvest = function (tile) {
    this.close();
    this.sceneHarvest.showExercise(tile);
    this.director.pushScene(this.sceneHarvest);
}

farming.Game.prototype.hideHarvest = function () {
    if (this.director.getCurrentScene() == this.sceneHarvest) this.director.popScene();
}
// -- end harvest --

// -- exercise --
farming.Game.prototype.showExercise = function (exercise) {
    this.sceneExercise.showExercise(exercise);
    this.director.pushScene(this.sceneExercise);
}

farming.Game.prototype.hideExercise = function () {
    if (this.director.getCurrentScene() == this.sceneExercise) this.director.popScene();
}
// -- end exercise --

// -- show feedback --
farming.Game.prototype.showFeedback = function (exercise) {
    //this.sceneFeedback.redraw(this.player.body);
    this.sceneFeedback.showFeedback(exercise);
    this.sceneMap.sceneLayer.appendChild(this.sceneFeedback.windowLayer);
}

// -- end feedback-- 

// -- clone --
farming.Game.prototype.showClone = function () {
    this.close();
    this.sceneMap.setActiveButton('clone');
    this.source.dispatchEvent(this.EventType.GO_CLONE);
    this.sceneClone.drawItems(this.player.body);
    this.sceneMap.sceneLayer.appendChild(this.sceneClone);
    this.source.dispatchEvent(this.EventType.WINDOW_OPENED);
}

// Start cloning a crop
farming.Game.prototype.startCloning = function (properties) {
    this.close();
    this.currentClone = properties;
    this.sceneMap.startCloning(properties);
    this.source.dispatchEvent(this.EventType.CLONE_CROP);
}
// -- end clone --

// -- cropdetails --
farming.Game.prototype.showItemDetails = function (item) {
    if (typeof item.food == 'undefined') {
        this.sceneCropDetails.showDetails(item);
        this.sceneMap.sceneLayer.appendChild(this.sceneCropDetails.windowLayer);
    } else {
        this.sceneLivestockDetails.showDetails(item);
        this.sceneMap.sceneLayer.appendChild(this.sceneLivestockDetails.windowLayer);
    }
    this.source.dispatchEvent(this.EventType.CLONE_DETAILS);
}

farming.Game.prototype.backCropDetails = function () {
    this.sceneMap.sceneLayer.removeChild(this.sceneCropDetails.windowLayer);
}

farming.Game.prototype.backLivestockDetails = function () {
    this.sceneMap.sceneLayer.removeChild(this.sceneLivestockDetails.windowLayer);
}
// -- end livestockdetails --

// -- Challenge screen --
// if there is no current challenge, show the list of challenges, otherwise show the current challenge
farming.Game.prototype.showChallenge = function () {
    this.close();
    this.sceneMap.setActiveButton('challenge');
    if (!this.player.currentChallenge) {
        this.sceneChallenge.redraw(this.player.body);
        this.sceneMap.sceneLayer.appendChild(this.sceneChallenge.windowLayer);
    } else {
        this.showChallengeDetails(this.player.currentChallenge);
    }
    this.source.dispatchEvent(this.EventType.OPEN_CHALLENGES);
    this.source.dispatchEvent(this.EventType.WINDOW_OPENED);
}

// set the current challenge and close all challenge screens
farming.Game.prototype.selectChallenge = function (challenge) {
    for (var i in challenge.requirements) {
        var requirement = challenge.requirements[i];
        if (requirement.type === 'item') {
            lime.scheduleManager.callAfter(function () {
                this.game.removeItem(this.requirement.key, this.requirement.number);
            }, {game: this, requirement: requirement}, i * 1000);
        }
    }
    this.player.currentChallenge = challenge;
    this.player.currentChallenge.exercisesDone = [];
    this.showChallenge();
}

// remove the current challenge and close all challenge screens
farming.Game.prototype.giveUpChallenge = function () {
    this.player.currentChallenge = null;
    this.sceneMap.sceneLayer.removeChild(this.sceneChallengeDetails.windowLayer);
    this.sceneMap.sceneLayer.removeChild(this.sceneChallenge.windowLayer);
    this.showChallenge();
}

// complete the current challenge, remove all the items and close all challenge screens
farming.Game.prototype.completeChallenge = function () {
    for (var i in this.player.currentChallenge.rewards) {
        var reward = this.player.currentChallenge.rewards[i];
        if (reward.type === 'item') {
            this.addItem(reward.key, reward.number);
        }
        if (reward.type === 'coins') {
            this.addCoins(reward.number);
        }
    }

    this.player.currentChallenge = null;
    this.close();
    //this.showChallenge();
}

// show the challenge details screen for input.challenge
farming.Game.prototype.showChallengeDetails = function (challenge) {
    //this.sceneChallengeDetails = new farming.SceneChallengeDetails(this);
    this.sceneChallengeDetails.setChallenge(challenge, !!(this.player.currentChallenge));
    this.sceneMap.sceneLayer.appendChild(this.sceneChallengeDetails.windowLayer);
    this.source.dispatchEvent(this.EventType.CHALLENGE_DETAILS);
}

// go back from the details screen to the overview screen
farming.Game.prototype.backChallengeDetails = function () {
    this.sceneMap.sceneLayer.removeChild(this.sceneChallengeDetails.windowLayer);
}

// -- end challenge screen --

// -- start introduction screen --
farming.Game.prototype.showIntroduction = function () {
    this.director.pushScene(this.introduction);
}

farming.Game.prototype.closeIntroduction = function () {
    if (this.director.getCurrentScene() == this.introduction) {
        this.director.popScene();
    }
}
// -- end introduction screen --

farming.Game.prototype.addCoins = function (amount) {
    this.sceneMap.moneyAnimation(amount);
    this.player.coins += amount;
    this.sceneMap.updateControls();
    return this.player.coins;
}
farming.Game.prototype.removeCoins = function (amount) {
    if (this.player.coins < amount) return false;
    this.sceneMap.moneyAnimation(-amount);
    this.player.coins -= amount;
    this.sceneMap.updateControls();
    return this.player.coins;
}
farming.Game.prototype.getCoins = function () {
    return this.player.coins;
}
farming.Game.prototype.hasCoins = function (amount) {
    return this.player.coins >= amount;
}

// -- Inventory --
farming.Game.prototype.addItem = function (type, amount, opt_positionOnMap) {
    if (!this.hasItem(type, amount)) {
        this.player.inventory[type] = amount;
    } else {
        this.player.inventory[type] += amount;
    }
    this.sceneMap.itemAnimation(type, amount, opt_positionOnMap);
    return this.player.inventory[type];
}
farming.Game.prototype.removeItem = function (type, amount, opt_positionOnMap) {
    if (!amount)
        amount = 1;

    if (!this.hasItem(type, amount)) return false;
    this.player.inventory[type] -= amount;
    this.sceneMap.itemAnimation(type, -amount, opt_positionOnMap);
    return this.player.inventory[type];
}
farming.Game.prototype.getInventory = function (type) {
    if (type) {
        if (this.hasItem(type))
            return this.player.inventory[type];
        else
            return 0;
    }
    return this.player.inventory;
}
farming.Game.prototype.hasItem = function (type, amount) {
    if (!amount)
        amount = 1;
    return this.player.inventory[type] >= amount;
}

// -- BODY --
farming.Game.prototype.addPoints = function (bodypart, amount) {
    if (!this.player.body[bodypart]) this.player.body[bodypart] = 0;
    var max = this.sceneMap.body.getTargetXP(this.player.body[bodypart]);
    this.player.body[bodypart] = Math.min(max, this.player.body[bodypart] + amount);
    this.sceneMap.body.redraw(this.player.body);
    return this.player.body[bodypart];
}
farming.Game.prototype.getPoints = function (bodypart) {
    if (this.player.body[bodypart])
        return this.player.body[bodypart];

    return 0;
}

farming.Game.prototype.putStatistics = function (exercise) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (!this.player.exercisesDone[yyyy])
        this.player.exercisesDone[yyyy] = {};
    if (!this.player.exercisesDone[yyyy][mm])
        this.player.exercisesDone[yyyy][mm] = {};
    if (!this.player.exercisesDone[yyyy][mm][dd])
        this.player.exercisesDone[yyyy][mm][dd] = [];
    this.player.exercisesDone[yyyy][mm][dd].push(exercise);
}

// -- Game methods --
farming.Game.prototype.getFullSize = function (percent) {
    var ratio = typeof percent == 'undefined' ? 1 : percent;
    return new goog.math.Size(this.screen.width * ratio, this.screen.height * ratio);
}

farming.Game.prototype.getCenterPosition = function (controls) {
    var c = typeof controls == 'undefined' ? 1 : +controls;
    return new goog.math.Coordinate(this.screen.width / 2, (this.screen.height - c * SETTINGS.size.controls.height) / 2)
}
