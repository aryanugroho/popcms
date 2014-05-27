 
exports.getFullNav = function(callback){ 
    
        /* Will replace with db look up*/
        
       callback(null, [
				{name:"home", url:"/"},
				{name:"dispute resolution", url:"/dispute-resolution/"}, 
				{name:"family law", url:"/family-law/"}, 
				{name:"employment law", url:"/employment-law/"}, 
				{name:"contact", url:"/contact-us/"}
			]);
};
