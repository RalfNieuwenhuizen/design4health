goog.provide('farming.Challenge');
goog.require('lime.Sprite');
goog.require('farming.Exercise');

/**
 * Crop elements
 *
 */
farming.Challenge = function(name) {
    goog.base(this);
    this.setAnchorPoint(0.5, 0.72);
    this.setSize(120, 120);

    this.name = name;
    this.prop = CHALLENGES[name];



}
goog.inherits(farming.Challenge,lime.Sprite);

farming.Challenge.prototype.name = null;
farming.Challenge.prototype.prop = null;

farming.Challenge.prototype.showProgress = function(){
    //TODO
}

farming.Challenge.prototype.bodypart = function (key) {
    switch(key) {
        case "full_body":
            return "Full-body workout, good for all body parts.";
        default:
            return key;
    }
}

var CHALLENGES = {
    apple_pie : {
        name: 'Space Apple Pie',
        key: 'apple_pie',
        description: 'Bake a spaceapple pie for your ill neighbour Yeowoman.',
        type: 'full_body', //full_body, arms, legs, back, abs
        requirements: [
            {
                type : 'item', //item, exercise
                number: 3, //number of items
                key : 'space_apple' //require 'images/items/{key}.png'
            },
            {
                type : 'item',
                number: 3,
                key : 'space_wheat'
            },
            {
                type : 'exercise',
                name : '\"Crush it all together\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
            /*{
                type : 'exercise',
                name : '\"Wait for it to bake\"',
                key : 'wait_pie' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }*/
        ],
        rewards: [
            /*{
                type : 'item', //item, exercise
                number: 1, //number of items
                key : 'space_apple' //require 'images/items/{key}.png'
            },*/
            {
                type : 'coins',
                number: 50
            }
        ]
    },
    cookies : {
        name: 'Space Cookies',
        key: 'cookies',
        description: 'Bake some space cookies.',
        type: 'arms', //full_body, arms, legs, back, abs
        requirements: [
            {
                type : 'item', //item, exercise
                number: 2, //number of items
                key : 'egg' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 2, //number of items
                key : 'milk' //require 'images/items/{key}.png'
            },
            {
                type : 'item',
                number: 2,
                key : 'space_wheat'
            },
            {
                type : 'exercise',
                name : '\"Blend it\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : '\"Heat it up\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            /*{
                type : 'item', //item, exercise
                number: 1, //number of items
                key : 'space_apple' //require 'images/items/{key}.png'
            },*/
            {
                type : 'coins',
                number: 100
            }
        ]
    }
};

