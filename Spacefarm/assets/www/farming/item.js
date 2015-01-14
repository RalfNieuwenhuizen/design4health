goog.provide('farming.Item');
goog.require('lime.Sprite');

/**
 * Crop elements
 *
 */
farming.Item = function(type) {
    goog.base(this);
    this.setAnchorPoint(0.5, 0.72);
    this.setSize(120, 120);

    this.type = type;
}

goog.inherits(farming.Item,lime.Sprite);

farming.Item.prototype.type = null;

var ITEMS = {
    space_apple : {
        name: 'Space Apple',
        revenue: 10
    },
    space_wheat : {
        name: 'Space Wheat',
        revenue: 15
    },
    egg : {
        name: 'Egg',
        revenue: 5
    },
    wool : {
        name: 'Wool',
        revenue: 10
    },
    bacon : {
        name: 'Bacon',
        revenue: 15
    },
    milk : {
        name: 'Milk',
        revenue: 15
    },
    carrot : {
        name: 'Carrot',
        revenue: 15
    },
    strawberry : {
        name: 'Space Berry',
        revenue: 15
    },
    diamond : {
        name: 'Diamond',
        revenue: 30
    }
};

