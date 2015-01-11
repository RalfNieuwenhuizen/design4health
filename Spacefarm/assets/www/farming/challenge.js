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
/*
    test1 : {
        name: 'Bear Hug',
        key: 'test1',
        description: '',
        type: 'full_body', //full_body, arms, legs, back, abs
        required_level: 1,
        requirements: [
            {
                type : 'exercise',
                name : 'bear_hug',
                key : 'bear_hug' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 50
            }
        ]
    },
    test2: {
        name: 'High Knees',
        key: 'test2',
        description: '',
        type: 'full_body', //full_body, arms, legs, back, abs
        required_level: 1,
        requirements: [
            {
                type : 'exercise',
                name : 'high_knees',
                key : 'high_knees' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 50
            }
        ]
    },
    test3: {
        name: 'Mason twist',
        key: 'test3',
        description: '',
        type: 'full_body', //full_body, arms, legs, back, abs
        required_level: 1,
        requirements: [
            {
                type : 'exercise',
                name : 'mason_twist',
                key : 'mason_twist' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 50
            }
        ]
    },
    test4: {
        name: 'wall_arm_pulls',
        key: 'test4',
        description: '',
        type: 'full_body', //full_body, arms, legs, back, abs
        required_level: 1,
        requirements: [
            {
                type : 'exercise',
                name : 'wall_arm_pulls',
                key : 'wall_arm_pulls' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 50
            }
        ]
    },
    test5: {
        name: 'wall_ears',
        key: 'test5',
        description: '',
        type: 'full_body', //full_body, arms, legs, back, abs
        required_level: 1,
        requirements: [
            {
                type : 'exercise',
                name : 'wall_ears',
                key : 'wall_ears' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 50
            }
        ]
    },
    test6: {
        name: 'wall_flapping',
        key: 'test6',
        description: '',
        type: 'full_body', //full_body, arms, legs, back, abs
        required_level: 1,
        requirements: [
            {
                type : 'exercise',
                name : 'wall_flapping',
                key : 'wall_flapping' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 50
            }
        ]
    },*/
    apple_pie : {
        name: 'Space Apple Pie',
        key: 'apple_pie',
        description: 'Bake a spaceapple pie for your ill neighbour Yeowoman.',
        type: 'full_body', //full_body, arms, legs, back, abs
        required_level: 1,
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
                name : 'Prepare cooking utensils',
                key : 'dynamic_chest' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : 'Press the dough',
                key : 'pushup_knees' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
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
        required_level: 1,
        requirements: [
/* {
                type : 'item', //item, exercise
                number: 2, //number of items
                key : 'egg' //require 'images/items/{key}.png'
            },
            {
                type : 'item',
                number: 2,
                key : 'space_wheat'
            },*/
            {
                type : 'exercise',
                name : 'Press the ingredients together',
                key : 'squats' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : 'Shake the bowl',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : 'Run from Santa Claus!',
                key : 'high_knees' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 100
            }
        ]
    },
    wool_socks : {
        name: 'Woolysocks',
        key: 'wool_socks',
        description: 'You are cold, make some socks.',
        type: 'full_body',
        required_level: 2,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 4, //number of items
                key : 'wool' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : 'Climb the ladder to get to the top shelf',
                key : 'wall_arm_pulls' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : 'Put on your earplugs',
                key : 'wall_ears' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : 'Work the weaving machine!',
                key : 'wall_flapping' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
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
        required_level: 2,
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
                name : 'Tear \'em ',
                key : 'dynamic_chest' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : 'Mash \'em',
                key : 'pushups' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : 'Press them into a nice pie!',
                key : 'sky_kicks' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
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
        required_level: 2,
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
                name : 'I needle it',
                key : 'rocket_jumps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : 'Sew the sweater on yourself',
                key : 'mason_twist' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
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
        required_level: 3,
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
                name : 'Collect the ingredients',
                key : 'arm_stretches' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            },
            {
                type : 'exercise',
                name : 'Check on them as they \"bake-on\"',
                key : 'situps' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
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
        name: 'Carrot Rocket',
        key: 'carrot_rocket',
        description: 'Build a carrot rocket to mine a neighbouring moon for gold!',
        type: 'full_body',
        required_level: 3,
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
                name : 'Stew-pit',
                key : 'high_knees' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
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
        required_level: 3,
        requirements: [
            {
                type : 'item', //item, exercise
                number: 10, //number of items
                key : 'strawberry' //require 'images/items/{key}.png'
            },
            {
                type : 'exercise',
                name : 'Jammin\'',
                key : 'wall_flapping' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
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
                name : 'Say cheese!',
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
                name : 'Toss the cake',
                key : 'sky_kicks' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
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
                name : 'It\'s so fluffyyyyyy',
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
                name : 'Toss the cake',
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
                name : 'Shake it up!',
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

