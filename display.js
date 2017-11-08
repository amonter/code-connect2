const readline = require('readline');
var fs = require("fs");
var mysql = require('mysql');
const cheerio = require('cheerio')
var Crawler = require("crawler");
var mongo = require('mongodb');
var path = require('path');
var monk = require('monk');
var db2 = monk('localhost:27017/globalsouth');
var collectionOut = db2.get('people');
var fileCountries = path.join(__dirname, 'countries1.json');
var jsonCountries = JSON.parse(fs.readFileSync(fileCountries, 'utf8'));


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'espana19',
  database : 'bots'
});

connection.connect();


var c = new Crawler({
    	maxConnections: 300,
	retries: 0,
	userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else if (res.$) {
            var $ = res.$;
                console.log("searching "+res.request.uri.href+" "+res.options.name+" "+res.options.email);
                var lookPhrase = res.options.searchword;
                //console.log($('meta[name=description]').attr("content"));
                connection.query('insert into pages (email,data) VALUES (?,?)',[res.options.email, $.html()], function (error, results, fields) {
                          if (error) throw error;
                          //console.log('The solution is: ', results[0].solution);
                });
		var isWordFound = searchForWord($, lookPhrase);
                if(isWordFound) {
                        //console.log('Word ' + lookPhrase + ' found at page ');
                        //console.log(getMatchPhrase($, lookPhrase));
			/*collectionOut.findOne({email : res.options.email}, function (err, doc) {
                        	console.log(JSON.stringify(doc.full_name+" matched "+getMatchPhrase($, lookPhrase)));
			});*/
                }
        }
	done();
    }
});





rl.question('Tell me who to display: ', (input_answer) => {

	if(input_answer.indexOf("-b") > -1) {
		var term = input_answer.replace(/\-b/g, "").trim();
		console.log(term);
		connection.query('SELECT * FROM pages where CONVERT(data USING utf8mb4) like ?','%'+term+'%', function (error, results, fields) {
			if (error) throw error;
			for (var i = 0;i<results.length;i++){
				console.log('\nanswer is ', results[i].email);
				var buffer = new Buffer(results[i].data);
				var bufferBase64 = buffer.toString();   
				var $ = cheerio.load(bufferBase64);
				
				//console.log($('meta[name=description]').attr("content"));
				if($('meta[name=keywords]').attr("content"))console.log($('meta[name=keywords]').attr("content"));			
				var bodyText = $('html > body').text().toLowerCase();
				var theIndex = bodyText.indexOf(term.toLowerCase());
				var theRes = bodyText.substring(theIndex - 40, theIndex + 40);
				console.log(theRes.trim());
			}
		});	
	} else {	
	collectionOut.find({}).then((docs) => {
				var result;
				console.log(docs.length);
				for (var i = 701;i<docs.length;i++){
					console.log('the enter');
					var answer = input_answer.toLowerCase();
					if (answer == 'looking' || answer == 'help'){
						if (docs[i].match.looking_for){
							console.log(docs[i].full_name.trim()+" from "+docs[i].company.trim()+"\n\n");
							if (answer == 'looking'){
								console.log("  "+docs[i].match.looking_for+" in "+docs[i].match.markets+"\n");
							}
							if (answer == 'help'){
								console.log("  "+docs[i].match.help_with+"\n");
							}	
						}
					} else {
						/*var continent = findLocation(docs[i]);
						if (answer == 'latam'){
							if (continent == "SA"){
								result = docs[i];
							}	
						} else if (answer == "us"){
							if (continent == "NA"){
								result = docs[i];
                                                        }
						} else if (answer == "europe"){
							if (continent == "EU"){
								result = docs[i];
                                                        }	
						} else if (answer == "africa"){
							if (continent == "AF"){
								result = docs[i];
                                                        } 	
						} else if (answer == "asia"){
                                                        if (continent == "AS"){
								result = docs[i];
                                                        } 
						}*/
						
						if (result){
							console.log(JSON.stringify(result));
						} else {
							var theURL = docs[i].company_url.trim();
								if(theURL){
									console.log(theURL);
									if(!theURL.includes('www')) theURL = theURL.replace('://', '://www.');
									//c.queue({uri:theURL, name:docs[i].full_name.trim(), email:docs[i].email[0], searchword:answer});		
								}
								/*if(docs[i].location[0].replace(/\"/g, "").trim().toLowerCase() == answer) {
								console.log(JSON.stringify(docs[i]));
							}*/						
						}
					}
					//console.log(docs[i].full_name.trim()+","+docs[i].email[0].replace(/\"/g, "").trim()+","+docs[i].company_url.trim()+","+docs[i].company.trim()+","+docs[i].location.join('|'));	
				}
		console.log("loop end");
				
	});
	}
	console.log('done');
	rl.close();
});






function findLocation(docs){
        var theLoc = docs.location[0].replace(/\"/g, "").trim();
        var countryCode = null;
                                        for (var prop in jsonCountries.countries) {
                                                //console.log("Key:" + prop);
                                                //console.log("Value:" + jsonCountries.countries[prop].name);
                                                if (theLoc == jsonCountries.countries[prop].name){
                                                        countryCode = jsonCountries.countries[prop];
                                                }
                                        }
                                        if (!countryCode){
                                                if (theLoc =="SF"|| theLoc =="Seattle" || theLoc =="Miami" || theLoc =="NYC"|| theLoc =="DC" || theLoc =="LA" || theLoc =="Chicago" || theLoc =="Austin" || theLoc == "Boston" || theLoc == "Santa Clara" || theLoc == "Boulder") countryCode = jsonCountries.countries.US;
                                                if (theLoc == "Barcelona") countryCode = jsonCountries.countries.ES;
                                                if (theLoc =="Dubai") countryCode = jsonCountries.countries.AE;
                                                if (theLoc == "Toronto") countryCode = jsonCountries.countries.CA;                                                     if (theLoc == "Geneva") countryCode = jsonCountries.countries.CH;                                                      if (theLoc == "Tel Aviv") countryCode = jsonCountries.countries.IL;
                                                if (theLoc == "Mumbai") countryCode = jsonCountries.countries.IN;
                                                for (var prop in jsonCountries.countries) {
                                                        if (theLoc == jsonCountries.countries[prop].capital){
                                                                countryCode = jsonCountries.countries[prop];
                                                        }
                                                }
                                                if (!countryCode) console.log(docs.email[0]+" missing-----"+theLoc);
                                        }
		//console.log(countryCode);
		if (countryCode.name == 'Mexico') {	
			return "SA";
		}
	
	return countryCode.continent;
}


function searchForWord($, word) {
  var bodyText = $('html > body').text().toLowerCase();
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function getMatchPhrase($,word){
        var bodyText = $('html > body').text().toLowerCase();
        var theIndex = bodyText.indexOf(word.toLowerCase());
        return bodyText.substring(theIndex - 20, theIndex + 20);

}



