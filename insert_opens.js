
//some changes here
var fs = require("fs");
var mongo = require('mongodb');
var monk = require('monk');
var db2 = monk('localhost:27017/globalsouth');
//var db = monk('amonter5:espana6248@54.175.50.182:27017/globalsouth');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('NHpudxhV9HV6zakj7-gH0A');
var readline = require('linebyline'),
     rl = readline('update_3.csv');



rl.on('line', function(line, lineCount, byteCount) {

        var elements = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (lineCount > 0){
                var theName = elements[0].match(/\S+/g);
		var theEmail = elements[1];
		var opens = elements[7];
		var clicks = elements[8];

		//console.log(tags);
		//console.log(theName+" "+companyName+" "+theLocation+" "+position);
		var collection = db2.get('temp_people');

        // insert to the DB
        collection.findOne({email : theEmail}, function (err, doc) {
                        if(!doc) {
				collection.insert({
                                        "email" : theEmail,
                                         "first_name" : theName[0],
                                        "full_name": elements[0],
                                        "company_url": elements[3],
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
	});
	}
})


