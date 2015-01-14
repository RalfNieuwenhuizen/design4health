//set main namespace 
goog.provide('farming');   
//get requirements
goog.require('farming.Game');


//---------------------------------------------------------------------------------------------------------
//                                       GAME SETUP
//---------------------------------------------------------------------------------------------------------

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
}
//entrypoint 
farming.start = function(){     
    var game = new farming.Game();
}