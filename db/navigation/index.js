 
exports.getFullNav = function(callback){ 
    
        /* Will replace with db look up*/
        
       callback(null, [
				{name:"home", url:"/"},
				{name:"section 1", url:"/section1/",
					pages: [{name:"page 1", url:"/section1/page1/"},{name:"page 2", url:"/section1/page2/"},{name:"page 3", url:"/section1/page3/"}]},
				{name:"section 2", url:"/section 2/"},
				{name:"section 3", url:"/section 3/",
					pages: [{name:"page 1", url:"/section3/page1/"},{name:"page 2", url:"/section3/page2/"},{name:"page 3", url:"/section3/page3/"}]},
				
			]);
};
