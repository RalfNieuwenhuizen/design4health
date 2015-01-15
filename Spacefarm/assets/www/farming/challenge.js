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

    walking : {
        name: 'Space forest walk',
        key: 'walking',
        description: 'Take a casual reversed moonwalk in the Yeopark. \nIt will give you the energy required to get to your urgent matters again. \nGood for your legs as well.',
        required_level: 1,
        requirements: [
            {
                type : 'exercise',
                name : 'Reversed moonwalk',
                key : 'walking' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 20
            }
        ]
    },
    /*test0 : {
        name: 'Timed',
        key: 'test0',
        description: '',
        required_level: 1,
        requirements: [
            {
                type : 'exercise',
                name : 'pushups',
                key : 'pushups' //require 'images/exercises/{key}/[0-9]+.png'   reference to exercise.js/EXERCISES
            }
        ],
        rewards: [
            {
                type : 'coins',
                number: 50
            }
        ]
    },
    test1 : {
        name: 'Bear Hug',
        key: 'test1',
        description: '',
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
        description: 'Bake a spaceapple pie for your ill neighbour Yeowoman. \n You will feel relieved when you have done this. \n Good for your karma as well as for your chest and arms.',
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
        description: 'Bake some space cookies. \nThese have the special ability that they don\'t sink to your belly,\n but to your muscles instead! Specifically good for your legs.',
        required_level: 1,
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
        description: 'You are cold, make some socks. \nYou would not expect it, but the comfortable warmth is very good for your back!',
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
        description: 'You are hungry, make some carrot pie. \n Carrot pie truly makes your whole body feel better.',
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
        description: 'You are cold, make an awesome sweater. \n After doing this, you should feel your legs. Your abs will feel better too.',
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
        description: 'You are hungry, make a huge bacon omelet. \n Bacon is good for your arms, and your abs will be relieved.',
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
        description: 'Build a carrot rocket to mine a neighbouring moon for gold! \n This is good for a big deal of your body.',
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
        description: 'You are hungry, jam some berries. \n The taste is the most rewarding. \n Your back will like it as well.',
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
        description: 'You are hungry, make spacecheese. \n Your legs will remember this day.',
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
        description: 'You are hungry, make apple, in pancakes. \n Takes care of most bodyparts!',
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
        description: 'Yeo is cold, make it (b)earable. \n Your ears will carry the muffs, your legs will carry the burden.',
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
        description: 'You are hungry, make bacon, in pancakes. \n You never knew you could bake with your legs? Now you do!',
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
        description: 'You are hungry, shake some berries. \n Not tired of jumping yet? \n Your legs are!',
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

