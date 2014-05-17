 
exports.getFullNav = function(callback){ 
    
        /* Will replace with db look up*/
        
       callback(null, [
            {
                "Name": "Home", "Title": "Home", "Url": "/"
            },
            {
                "Name": "Section", "Title": "Section", "Url": "/Section/",
				"Pages": [
                    {
                        "Name": "Consulting", "Title": "Consulting", "Url": "/Services/Consulting/"
                    }
				]
            }]);
};
