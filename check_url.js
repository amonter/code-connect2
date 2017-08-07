var fs = require("fs");
//vaebug = require('debug')
const cheerio = require('cheerio')
var mysql = require('mysql');
var Crawler = require("crawler");
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
var db2 = monk('localhost:27017/globalsouth');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'espana19',
  database : 'bots'
});


var count = 0;

var filePath = path.join(__dirname, 'no_url.csv');
var fileCountries = path.join(__dirname, 'countries1.json');
var jsonCountries = JSON.parse(fs.readFileSync(fileCountries, 'utf8'));
connection.connect();




var c = new Crawler({
    maxConnections : 10,
    userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
	// This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else if (res.$){
			var $ = res.$;
			console.log("here "+$.html());
			/*connection.query('insert into pages (email,data) VALUES (?,?)',['adrian2@peoplehunt.com', $.html()], function (error, results, fields) {
			  if (error) throw error;
			  //console.log('The solution is: ', results[0].solution);
			});*/

			/*connection.query('select data from pages where email = ?',['adrian2@peoplehunt.com'], function (error, results, fields) {
                          	if (error) throw error;
                        	var buffer = new Buffer(results[0].data);
				var bufferBase64 = buffer.toString();	
				const $ = cheerio.load(bufferBase64)
				//console.log($(getMatchPhrase($, "Latin America")));
				var bodyText = $('html > body').text().toLowerCase();
				var theIndex = bodyText.indexOf("Latin America".toLowerCase());
				console.log( bodyText.substring(theIndex - 20, theIndex + 20));
			});*/
			//console.log("searching "+res.request.uri.href+" "+res.options.name+" "+res.options.email);    
			// $ is Cheerio by default
			//a lean implementation of core jQuery designed specifically for the server
			var lookPhrase = "investment";
			console.log($('meta[name=description]').attr("content"));
			var isWordFound = searchForWord($, lookPhrase);
			if(isWordFound) {
				console.log('Word ' + lookPhrase + ' found at page ');
				console.log(getMatchPhrase($, lookPhrase));
			}
		}
        
        done();
    }
});



//c.queue("https://www.linkedin.com/in/renelestrangenickson/");//https://www.sequoiacap.com/
//c.queue({uri:"https://www.stripe.com/",name:"Adan Lowes", email:"adam@sequioia.com"});


function searchForWord($, word) {
  var bodyText = $('html > body').text().toLowerCase();
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

function getMatchPhrase($,word){
	var bodyText = $('html > body').text().toLowerCase();
	var theIndex = bodyText.indexOf(word.toLowerCase());
	return bodyText.substring(theIndex - 20, theIndex + 20);

}

var collectionOut = db2.get('people');
collectionOut.find({}).then((docs) => {
		connection.query('select * from pages', function (error, results, fields) {	
			if (error) throw error;
			var missing = [];
			for (var i = 0;i<docs.length;i++){
				var theEmail = docs[i].email[0].replace(/\"/g, "").trim();
				if (theEmail){
					var haveFound = false;
					for (var z = 0;z<results.length;z++){			
						if (results[z].email == theEmail){
							haveFound = true;
						}
					}
					if (!haveFound){
						missing.push(docs[i]);		
					}		
				}	
			}

			console.log(missing);	
		})							
})



