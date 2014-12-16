//set main namespace 
goog.provide('farming');   
//get requirements
goog.require('farming.Game');


//---------------------------------------------------------------------------------------------------------
//                                       GAME SETUP
//---------------------------------------------------------------------------------------------------------

//entrypoint 
farming.start = function(){     
    var game = new farming.Game();
}
