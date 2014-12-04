/**
 *
 */
goog.provide('farming.SceneStats');

goog.require('lime.Sprite');
goog.require('farming.Button');
goog.require('farming.Label');
goog.require('lime.Layer');
goog.require('farming.Scene');
goog.require('farming.Exercise');

/**
 * Scene elements
 *
 */
farming.SceneStats = function (game) {
    goog.base(this);
    this.game = game;
    this.filter = this.getDate();
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    var w = new lime.Sprite().setFill(SETTINGS.color.background_layer).setSize(SETTINGS.size.background_layer).setPosition(game.getCenterPosition());
    this.title = new farming.Label('Statistics').setFontSize(SETTINGS.font.title).setPosition(SETTINGS.position.title);
    this.description = new farming.Label('').setPosition(center).setMultiline(true).setFontSize(20).setAlign('center');

    this.monthNames = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];
    this.monthDays = [ '', 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    this.closeButton = new farming.Button('X').setColor('#999999')
        .setPosition(SETTINGS.position.close_button)
        .setSize(SETTINGS.size.close_button);
    this.closeButton.setAction(this.closeStats, this);

    this.prevButton = new farming.Button('Previous').setColor('#999999')
        .setPosition(SETTINGS.position.left_button)
        .setSize(SETTINGS.size.button);
    this.prevButton.setAction(this.prevPage, this);

    this.nextButton = new farming.Button('Next').setColor('#999999')
        .setPosition(SETTINGS.position.right_button)
        .setSize(SETTINGS.size.button);
    this.nextButton.setAction(this.nextPage, this);

    this.yearButton = new farming.Button('Year').setColor('#999999')
        .setPosition(SETTINGS.position.center_button.x - SETTINGS.size.button_small.width, SETTINGS.position.center_button.y)
        .setSize(SETTINGS.size.button_small);
    this.yearButton.setAction(this.filterYear, this);

    this.monthButton = new farming.Button('Month').setColor('#999999')
        .setPosition(SETTINGS.position.center_button)
        .setSize(SETTINGS.size.button_small);
    this.monthButton.setAction(this.filterMonth, this);

    this.dayButton = new farming.Button('Day').setColor('#999999')
        .setPosition(SETTINGS.position.center_button.x + SETTINGS.size.button_small.width, SETTINGS.position.center_button.y)
        .setSize(SETTINGS.size.button_small);
    this.dayButton.setAction(this.filterDay, this);

    this.windowLayer
        .appendChild(w)
        .appendChild(this.title)
        .appendChild(this.description)
        .appendChild(this.prevButton)
        .appendChild(this.yearButton)
        .appendChild(this.monthButton)
        .appendChild(this.dayButton)
        .appendChild(this.nextButton)
        .appendChild(this.closeButton);
}
goog.inherits(farming.SceneStats, farming.Scene);

farming.SceneStats.prototype.game = null;
farming.SceneStats.prototype.player = null;
farming.SceneStats.prototype.filter = null;

farming.SceneStats.prototype.closeStats = function(scene) {
    scene.game.closeStats();
}
farming.SceneStats.prototype.filterYear = function(scene) {
    switch(scene.filter.length) {
        case 1: scene.filter = [scene.getDate()[0]]; break;
        default: scene.filter = [scene.filter[0]]; break;
    }
    scene.redraw(scene.player);
}
farming.SceneStats.prototype.filterMonth = function(scene) {
    switch(scene.filter.length) {
        case 1: scene.filter = [scene.filter[0], 1]; break;
        case 2: scene.filter = [scene.getDate()[0], scene.getDate()[1]]; break;
        case 3: scene.filter = [scene.filter[0], scene.filter[1]]; break;
        default: break;
    }
    scene.redraw(scene.player);
}
farming.SceneStats.prototype.filterDay = function(scene) {
    switch(scene.filter.length) {
        case 1: scene.filter = [scene.filter[0], 1, 1]; break;
        case 2: scene.filter = [scene.filter[0], scene.filter[1], 1]; break;
        case 3: scene.filter = scene.getDate(); break;
        default: break;
    }
    scene.redraw(scene.player);
}
farming.SceneStats.prototype.prevPage = function(scene) {
    switch(scene.filter.length) {
        case 1: scene.filter = [scene.filter[0] - 1]; break;
        case 2:
            if(scene.filter[1] > 1)
                scene.filter = [scene.filter[0], scene.filter[1] - 1];
            else
                scene.filter = [scene.filter[0] - 1, 12];
            break;
        case 3:
            if(scene.filter[2] > 1)
                scene.filter = [scene.filter[0], scene.filter[1], scene.filter[2] - 1];
            else if(scene.filter[1] > 1)
                scene.filter = [scene.filter[0], scene.filter[1] - 1, scene.monthDays[scene.filter[1] - 1]];
            else
                scene.filter = [scene.filter[0] - 1, 12, 31];
            break;
        default: break;
    }
    scene.redraw(scene.player);
}
farming.SceneStats.prototype.nextPage = function(scene) {
    switch(scene.filter.length) {
        case 1: scene.filter = [scene.filter[0] + 1]; break;
        case 2:
            if(scene.filter[1] < 12)
                scene.filter = [scene.filter[0], scene.filter[1] + 1];
            else
                scene.filter = [scene.filter[0] + 1, 1];
            break;
        case 3:
            if(scene.filter[2] < scene.monthDays[scene.filter[1]])
                scene.filter = [scene.filter[0], scene.filter[1], scene.filter[2] + 1];
            else if(scene.filter[1] < 12)
                scene.filter = [scene.filter[0], scene.filter[1] + 1, 1];
            else
                scene.filter = [scene.filter[0] + 1, 1, 1];
            break;
        default: break;
    }
    scene.redraw(scene.player);
}

farming.SceneStats.prototype.redraw = function(player) {
    this.player = player;
    if(this.filter) {
        var description = ' - ';
        switch(this.filter.length) {
            case 1: description += this.filter[0]; break;
            case 2: description += this.monthNames[this.filter[1]-1] + ' ' + this.filter[0]; break;
            case 3: description += this.filter[2] + '-' + this.filter[1] + '-' + this.filter[0]; break;
            default: break;
        }
        this.title.setText('Statistics' + description);
    }
    var exercises = '';
    var year, month, day;
    switch(this.filter.length) {
        case 3: day = this.filter[2];
        case 2: month = this.filter[1];
        case 1: year = this.filter[0];
        default: break;
    }

    var exercises = [];

    var monthList = month ? [month] : (player.exercisesDone[year] ? Object.keys(player.exercisesDone[year]) : []);
    for(var m in monthList) {
        month = monthList[m];
        var dayList = day ? [day] : (player.exercisesDone[year] && player.exercisesDone[year][month] ? Object.keys(player.exercisesDone[year][month]) : []);
        for(var d in dayList) {
            day = dayList[d];
            if(!player.exercisesDone[year] || !player.exercisesDone[year][month] || !player.exercisesDone[year][month][day])
                break;
            for(var e in player.exercisesDone[year][month][day]) {
                var key = player.exercisesDone[year][month][day][e];
                if(!exercises[key])
                    exercises[key] = 0;
                exercises[key] += 1;
            }
        }
    }

    exercises.sort();
    var text = '';
    var keys = Object.keys(exercises);
    for(var i in keys) {
        var exercise = EXERCISES[keys[i]];
        text += exercise.title + ': ' + exercises[keys[i]] + '\n';
    }
    this.description.setText(text);
}

farming.SceneStats.prototype.getDate = function(dd, mm, yyyy) {
    var date = new Date();
    if(dd && mm && yyyy) {
        date = new Date(yyyy+'-'+mm+'-'+dd);
    }
    return [date.getFullYear(), date.getMonth()+1, date.getDate()];
}