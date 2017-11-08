var fs = require("fs");
vaebug = require('debug')
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
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});




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
               // var isWordFound = searchForWord($, lookPhrase);
                //if(isWordFound) {
                        //console.log('Word ' + lookPhrase + ' found at page ');
                        //console.log(getMatchPhrase($, lookPhrase));
                        /*collectionOut.findOne({email : res.options.email}, function (err, doc) {
                                console.log(JSON.stringify(doc.full_name+" matched "+getMatchPhrase($, lookPhrase)));
                        });*/
                //}
        }
        done();
    }
});

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
			console.log(docs.length);
			for (var i = 0;i<docs.length;i++){
				if (docs[i].email){
					
					var theEmail = docs[i].email[0].replace(/\"/g, "").trim();
					if (typeof docs[i].email === 'string') theEmail = docs[i].email.trim();
					var haveFound = false;
					for (var z = 0;z<results.length;z++){
						var theEmail2 = results[z].email.replace(/\"/g, "").trim();								     
						if (theEmail2 == theEmail){
							haveFound = true;
						}
					}
					if (!haveFound && docs[i].company_url){
						missing.push(docs[i].company_url);	
						console.log(docs[i].email+" "+docs[i].company_url);
						var theURL = docs[i].company_url;
						if(!theURL.includes('www')) theURL = theURL.replace('://', '://www.');
                                       		//c.queue({uri:theURL, name:docs[i].full_name.trim(), email:docs[i].email});    	
					}		
				}
		
			}
			
			console.log(missing.length);

		})							
})


