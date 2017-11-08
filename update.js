
//some changes here
var fs = require("fs");
var mongo = require('mongodb');
var monk = require('monk');
var db2 = monk('localhost:27017/globalsouth');
//var db = monk('amonter5:espana6248@54.175.50.182:27017/globalsouth');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('NHpudxhV9HV6zakj7-gH0A');
var readline = require('linebyline'),
      rl = readline('temp_loc.csv');



rl.on('line', function(line, lineCount, byteCount) {

        var elements = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (lineCount > 0){
                var theName = elements[0].match(/\S+/g);
                //console.log(elements[0]+" "+elements[1]+" "+elements[2]);
                var theEmail = elements[1];
		var company = elements[3];
		//var theLocation = elements[4].split(',');
                        // insert to the DB
		var collection = db2.get('temp_people');
		collection.update({email : theEmail}, {$set:{company:company}}, function (err, doc) {
				if (err){
					console.log('problem updating '+err);
				} else {
					console.log("updated");
				} 				
		})
        /*collection.findOne({email : theEmail}, function (err, doc) {
                        if(!doc) {
				collection.insert({
                                        "first_name" : theName[0],
					"full_name": elements[0],
                                        "email" : theEmail,
                                        "company_url": companyURL,
					"company": companyName,
					"comments": comments,
					"location": theLocation,
					"tags": tags
                                        }, function (err, doc) {
					    	//console.log(err+" "+doc);
						if (err) {
						// If it failed, return error
					    	console.log('problem inserting');
					    }
					else {
						console.log('inserted');
					}
					})
			}	
	});*/
	}
})


