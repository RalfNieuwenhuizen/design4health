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
        case "arms":
            return "Arm workout, good for your arms.";
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
        required_level: 0,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 3, //number of items
                key : 'space_apple' //require 'images/items/{key}.png'
            },
            {
                type : 'item',
                number: 2,
                key : 'space_wheat'
            },
            {
                type : 'exercise',
                name : '\"Crush it all together\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : '\"Wait for it to bake\"',
                key : 'wait_pie' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
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
        type: 'full_body', //full_body, arms, legs, back, abs
        required_level: 0,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 2, //number of items
                key : 'egg' //require 'images/items/{key}.png'
            },
            {
                type : 'item',
                number: 2,
                key : 'space_wheat'
            },
            {
                type : 'exercise',
                name : '\"Blend it\"',
                key : 'ground_cycling' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : '\"Heat it up\"',
                key : 'burpees' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 100
            }
        ]
    },
    baked_eggs : {
        name: 'Baked Eggs',
        key: 'baked_eggs',
        description: 'Bake some eggs.',
        type: 'full_body', //full_body, arms, legs, back, abs
        required_level: 1,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 4, //number of items
                key : 'egg' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"Light the fire\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 150
            }
        ]
    },
    wool_socks : {
        name: 'Woolysocks',
        key: 'wool_socks',
        description: 'You are cold, make some socks.',
        type: 'full_body',
        required_level: 1,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 4, //number of items
                key : 'wool' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"Needle time\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 200
            }
        ]
    },
    carrot_pie : {
        name: 'Carrot Pie',
        key: 'carrot_pie',
        description: 'You are hungry, make some carrot pie.',
        type: 'full_body',
        required_level: 1,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 3, //number of items
                key : 'carrot' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 3, //number of items
                key : 'space_apple' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 3, //number of items
                key : 'space_wheat' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"Boil \'em, mash \'em, stick \'em in a stew\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 250
            }
        ]
    },
    apple_sweater : {
        name: 'Apple Sweater',
        key: 'apple_sweater',
        description: 'You are cold, make an awesome sweater.',
        type: 'full_body',
        required_level: 1,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 6, //number of items
                key : 'wool' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 3, //number of items
                key : 'space_apple' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"I needle it\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 300
            }
        ]
    },
    bacon_egg : {
        name: 'Bacon & Eggs',
        key: 'bacon_egg',
        description: 'You are hungry, make a huge bacon omelet.',
        type: 'full_body',
        required_level: 2,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 6, //number of items
                key : 'egg' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 3, //number of items
                key : 'bacon' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"Bake-on\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 350
            }
        ]
    },
    carrot_stew : {
        name: 'Carrot Stew',
        key: 'carrot_stew',
        description: 'You are hungry, make a carrot stew, because you can!',
        type: 'full_body',
        required_level: 2,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 6, //number of items
                key : 'carrot' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 3, //number of items
                key : 'space_wheat' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"Stew-pit\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 400
            }
        ]
    },
    strawberry_jam : {
        name: 'Spaceberry Jam',
        key: 'strawberry_jam',
        description: 'You are hungry, jam some berries.',
        type: 'full_body',
        required_level: 2,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 10, //number of items
                key : 'strawberry' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"Jammin\'\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 450
            }
        ]
    },
    cheese : {
        name: 'Cheesy',
        key: 'cheese',
        description: 'You are hungry, make spacecheese.',
        type: 'full_body',
        required_level: 3,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 10, //number of items
                key : 'milk' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"Say cheese!\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 500
            }
        ]
    },
    apple_pancakes : {
        name: 'Apple Pancakes',
        key: 'apple_pancakes',
        description: 'You are hungry, make apple, in pancakes.',
        type: 'full_body',
        required_level: 3,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 5, //number of items
                key : 'space_apple' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 5, //number of items
                key : 'space_wheat' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 5, //number of items
                key : 'milk' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"Toss the cake\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 550
            }
        ]
    },
    earmuffs : {
        name: 'Earmuffs',
        key: 'earmuffs',
        description: 'Yeo is cold, make it (b)earable.',
        type: 'full_body',
        required_level: 4,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 5, //number of items
                key : 'wool' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"It\'s so fluffyyyyyy\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 600
            }
        ]
    },
    bacon_pancakes : {
        name: 'Bacon Pancakes',
        key: 'bacon_pancakes',
        description: 'You are hungry, make bacon, in pancakes.',
        type: 'full_body',
        required_level: 5,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 5, //number of items
                key : 'bacon' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 5, //number of items
                key : 'space_wheat' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 5, //number of items
                key : 'milk' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"Toss the cake\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 650
            }
        ]
    },
    strawberry_milkshake : {
        name: 'Spaceberry Milkshake',
        key: 'strawberry_milkshake',
        description: 'You are hungry, shake some berries.',
        type: 'full_body',
        required_level: 6,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 10, //number of items
                key : 'strawberry' //require 'images/items/{key}.png'
            },
            {
                type : 'item', //item, exercise
                number: 5, //number of items
                key : 'milk' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : '\"Shake it up!\"',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 700
            }
        ]
    }
};

