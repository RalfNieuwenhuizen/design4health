/**
 * Created by david on 11/23/14.
 */
goog.provide('farming.Scene');
goog.require('lime.Scene');

/**
 * Land elements
 *
 * @param {} gameObj
 */
farming.Scene = function(game) {
    goog.base(this);
    this.setRenderer(lime.Renderer.CANVAS);
    this.game = game;
}

goog.inherits(farming.Scene,lime.Scene);

