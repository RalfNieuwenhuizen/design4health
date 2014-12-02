/**
 * 
 */
goog.provide('farming.SceneClone');

goog.require('lime.Sprite');
goog.require('farming.Exercise');
goog.require('farming.Button');
goog.require('lime.Layer');
goog.require('farming.Tile');
goog.require('farming.Crop');
goog.require('farming.Scene');
goog.require('farming.SceneCropDetails');
goog.require('lime.ui.Scroller');

/**
 * Scene elements
 *
 */
farming.SceneClone = function (game) {
    goog.base(this);
    this.game = game;
    this.windowLayer = new lime.Layer();
    this.appendChild(this.windowLayer);
    var center = game.getCenterPosition();
    //var bg = new lime.Sprite().setFill('rgba(0,0,0,0.3)').setSize(game.getFullSize(1)).setPosition(game.getCenterPosition());
    this.w = new lime.Sprite().setFill('#FFFFFF').setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition());
    var mask = new lime.Sprite().setSize(game.getFullSize(0.7)).setPosition(game.getCenterPosition().x, game.getCenterPosition().y);
    this.title = new lime.Label().setFontSize(18).setPosition(center.x, center.y * 0.5);
    this.title.setText('Clone');
    
    this.closeButton = new farming.Button('X').setColor('#999999')
    		.setPosition(center.x + game.getFullSize(0.33).width, center.y - game.getFullSize(0.32).height)
    		.setSize(20,20);
    
    this.nextButton = new farming.Button('Next').setColor('#999999')
    		.setPosition(new goog.math.Coordinate( 250, 150))
    		.setSize(50,30);
    
    this.prevButton = new farming.Button('Prev').setColor('#999999')
    		.setPosition(new goog.math.Coordinate( -250, 150))
    		.setSize(50,30);
    
    this.w.appendChild(this.nextButton);
    
    this.windowLayer.setMask(mask);
    
    this.windowLayer.appendChild(mask).appendChild(this.w)
    	.appendChild(this.title).appendChild(this.closeButton);
    
    this.closeButton.setAction(this.closeClone, this);
    this.nextButton.setAction(this.nextClone, this);
    this.prevButton.setAction(this.prevClone, this);
    // Set the page the clonescreen is showing
    this.page = 1;  
    
    // Draw the crops
    this.drawCrop(this);
    
}
goog.inherits(farming.SceneClone, farming.Scene);

farming.SceneClone.prototype.game = null;

farming.SceneClone.prototype.closeClone = function(scene) {
	scene.game.hideClone();
}

// Set action for the next button
farming.SceneClone.prototype.nextClone = function(scene) {
 
	// Total amount of crops
    var nCrops = goog.object.getCount(scene.game.player.currentCrops);
    
    // If there are no more screens return: safety check
    if(scene.page >= Math.ceil(nCrops/6))
    	return
    
    scene.w.removeAllChildren();
    scene.page += 1;
    var i;
    
    // If this is not the last page: add the next button
    if(scene.page < Math.ceil(nCrops/6))
    	scene.w.appendChild(scene.nextButton);
    
    // If this is not the first page: add the previous button
    if(scene.page != 1 )
    	scene.w.appendChild(scene.prevButton);

    // Print six crops to the screen (in layer w) according to the number of the page
    scene.drawCrop(scene);

//	for(i=6*(scene.page-1); i < Math.min(nCrops,scene.page*6); i++) {
//    	var prop = CROPS[scene.game.player.currentCrops[i]];
//   	scene.drawCrop(prop, new goog.math.Coordinate( ((i%6)%3)*150 - 150, Math.floor((i%6)/3)*100 - 50))
//	}	 
}

// Set action for the previous button
farming.SceneClone.prototype.prevClone = function(scene) {
	 
	// Total amount of crops
    var nCrops = goog.object.getCount(scene.game.player.currentCrops);
    
    // If this is the first screen there is no previous: safety check
    if(scene.page == 1)
    	return
    
    scene.w.removeAllChildren();
    scene.page -= 1;
    var i;
    
    // If this is not the last page: add the next button
    if(scene.page < Math.ceil(nCrops/6))
    	scene.w.appendChild(scene.nextButton);
    
    // If this is not the first page: add the previous button
    if(scene.page != 1 )
    	scene.w.appendChild(scene.prevButton);
 
    scene.drawCrop(scene);	
}

//Draw a crop with the icon, clone button and details button
farming.SceneClone.prototype.drawCrop = function(scene) {
	
	var prop;
	var position;
	// Total amount of crops
    var nCrops = goog.object.getCount(scene.game.player.currentCrops);
	
	// Print six crops to the screen (in layer w) according to the number of the page
	for(i=6*(scene.page-1); i < Math.min(nCrops,scene.page*6); i++) {
	
		cropProps = CROPS[scene.game.player.currentCrops[i]]
		position = new goog.math.Coordinate( ((i%6)%3)*150 - 150, Math.floor((i%6)/3)*100 - 50);
		var cropIcon = new lime.Sprite().setFill('images/'+cropProps.key+'_ripe.png').setSize(100, 60).setPosition(position);
		
		// Create button to clone the icon
		scene.cloneButton = new farming.Button('Clone').setColor('#0000FF').setPosition(new goog.math.Coordinate(position.x-32,position.y+45)).setSize(60,20);
		scene.cloneButton.setAction(scene.startClone, {'cropProps': cropProps,'game': scene.game} );
		
		// Create button to get details about the icon
		scene.cloneDetails = new farming.Button('Details').setColor('#0000FF').setPosition(new goog.math.Coordinate(position.x+32,position.y+45)).setSize(60,20);
		scene.cloneDetails.setAction(scene.showCropDetails, {'cropProps' : cropProps, 'game' : scene.game});
		
		// Add all to the w-layer
		scene.w.appendChild(cropIcon).appendChild(scene.cloneButton).appendChild(scene.cloneDetails);
	}
}

// Function to show the details of the crop
farming.SceneClone.prototype.showCropDetails = function(object) {
    object.game.showCropDetails(object.cropProps);
}


// OLD FUNCTION, ONLY BACKUP
farming.SceneClone.prototype.drawCropOld = function(cropProps, position) {
	var cropIcon = new lime.Sprite().setFill('images/'+cropProps.key+'_ripe.png').setSize(100, 60).setPosition(position);
	
	// Create button to clone the icon
	this.cloneButton = new farming.Button('Clone').setColor('#0000FF').setPosition(new goog.math.Coordinate(position.x-32,position.y+45)).setSize(60,20);
	this.cloneButton.setAction(this.startClone, {'cropProps': cropProps,'game': this.game} );
	
	// Create button to get details about the icon
	this.cloneDetails = new farming.Button('Details').setColor('#0000FF').setPosition(new goog.math.Coordinate(position.x+32,position.y+45)).setSize(60,20);
	this.cloneDetails.setAction(this.showCropDetails, {'cropProps' : cropProps, 'game' : this.game});
	
	// Add all to the w-layer
	this.w.appendChild(cropIcon).appendChild(this.cloneButton).appendChild(this.cloneDetails);
}