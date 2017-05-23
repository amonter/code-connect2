var fs = require("fs");
//vaebug = require('debug')
var Crawler = require("crawler");
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
var db2 = monk('localhost:27017/globalsouth');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('NHpudxhV9HV6zakj7-gH0A');

var count = 0;

var fileCountries = path.join(__dirname, 'countries1.json');
var jsonCountries = JSON.parse(fs.readFileSync(fileCountries, 'utf8'));

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
        	console.log($('html > body').text());    
	// $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
		var lookPhrase = "Managing Director";
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



c.queue("https://www.linkedin.com/in/tracy-park-742731/");


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
		
			console.log(docs.length);
			for (var i = 0;i<docs.length;i++){
				if (docs[i].email){
					var theEmail = docs[i].email[0].replace(/\"/g, "").trim();
					var theLoc = docs[i].location[0].replace(/\"/g, "").trim();
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
						if (theLoc == "Toronto") countryCode = jsonCountries.countries.CA;						       if (theLoc == "Geneva") countryCode = jsonCountries.countries.CH;						      if (theLoc == "Tel Aviv") countryCode = jsonCountries.countries.IL;
						if (theLoc == "Mumbai") countryCode = jsonCountries.countries.IN;
						for (var prop in jsonCountries.countries) {
							if (theLoc == jsonCountries.countries[prop].capital){
								countryCode = jsonCountries.countries[prop];
							}	
						}
						if (!countryCode) console.log(docs[i].email[0]+" missing-----"+theLoc);
					} 				
					
					//c.queue(docs[i].company_url.trim());	
					//if (countryCode) console.log(countryCode.name+" continent "+countryCode.currency+" name "+docs[i].full_name);			
					//console.log(docs[i].location.join('|'));
					/*fs.appendFile(filePath, docs[i].full_name.trim()+","+docs[i].email[0].replace(/\"/g, "").trim()+","+docs[i].company_url.trim()+","+docs[i].company.trim()+","+docs[i].location.join('|')+","+theOpens+"\n", function(err) {
						if(err) {
							return console.log(err);
						}
					});*/	
					}
			
			}
})


function sendMail (name, email, template, format, theLocation) {

console.log(name+" "+email+" "+ template);
var template_name = template;
var template_content = [{
        "name": "example name",
        "content": "example content"
}];

var merge = [{"name": "firstname","content": name},{"name": "country","content": theLocation}];
if (template == "d-temp"){
	merge = [{"name": "firstname","content": name},{"name": "partone","content": format[0].replace(/\\/g, '').replace(/\"/g, "")},{"name": "parttwo","content": format[1].replace(/\\/g, '')},
{"name": "partthree","content": format[2].replace(/\\/g, '').replace(/\"/g, "")}]
	//console.log(merge);
	//console.log("\n");
}

	console.log(merge);
        console.log("\n");
var message = {
			"html": "",
			"text": "",
			"subject": "",
			"from_email": "a@latamtechmeetup.com",
			"merge": true,
			"merge_language": "mailchimp",
			"merge_vars": [{
			"rcpt": email,
			"vars": merge}],
		    "from_name": "Adrian Avendano",
		    "to": [{
			    "email": email,
			    "name": "",
			    "type": "to"
			},{"email": "petra@globalsouth.net",
                            "name": "",
                            "type": "cc"}],
		    "headers": {
			"Reply-To": "a@latamtechmeetup.com"
		    }
	};

	mandrillSend(message, template_name, template_content);
}


function mandrillSend(message, template_name, template_content) {
	var async = true;
	var ip_pool = "Main Pool";
	var send_at = "";
	mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
			for (i=0;i<result.length;i++){
				console.log(JSON.stringify(result[i]));
			}	
		
		}, function(e) {
		    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		}
	);
}
