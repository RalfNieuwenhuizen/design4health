goog.provide('farming.Tile');
goog.require('farming.Sprite');
goog.require('lime.Polygon');

/**
 * Tile elements
 *
 * @param {} gameObj
 */
farming.Tile = function (game, settings) {
    goog.base(this);
    this.game = game;
    this.setSize(settings.tiles.width, settings.tiles.height);
    this.enable();

    var tile = this;
}

goog.inherits(farming.Tile, farming.Sprite);

farming.Tile.prototype.crop = null;
farming.Tile.prototype.disabled = false;

farming.Tile.prototype.addCrop = function (crop) {
    if (!this.isEmpty() || !crop) return false;
    this.crop = crop;
    this.appendChild(crop);
    this.game.tickables.push(crop);
}
farming.Tile.prototype.removeCrop = function () {
    this.removeAllChildren();
    this.crop = null;
    // TODO remove crop from the list of game.tickables
}
farming.Tile.prototype.getCrop = function () {
    return this.crop
}
farming.Tile.prototype.isRipe = function () {
    return this.crop && this.crop.isRipe();
}
farming.Tile.prototype.disable = function () {
    this.disabled = true;
    this.setFill('');
}
farming.Tile.prototype.enable = function () {
    this.disabled = false;
    this.setFill('images/tile.png');
}
farming.Tile.prototype.isEmpty = function () {
    return !this.disabled && !this.crop;
}