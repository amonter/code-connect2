var fs = require("fs");
//vaebug = require('debug')
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
var db2 = monk('localhost:27017/globalsouth');
//var db = monk('amonter5:espana6248@54.175.50.182:27017/globalsouth');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('NHpudxhV9HV6zakj7-gH0A');
var readline = require('linebyline'),
      rl = readline('activity.csv');

var count = 0;
var la;

//checkEmail();
//connectMongo();

var filePath = path.join(__dirname, 'latest.csv');
var fileCountries = path.join(__dirname, 'countries1.json');
var jsonCountries = JSON.parse(fs.readFileSync(fileCountries, 'utf8'));
var lines = [];


var contents = fs.readFileSync(filePath, 'utf8');
//readContent();
function readContent (){
	
	var str = "test,test\\\\,test\\\,test,test";
	var array = str.replace(/([^\\]),/g, '$1\u000B').split('\u000B')
	console.log(array[1].replace(/\\/g, ''));	
	
	var allTextLines = contents.split(/\r\n|\n/);
        for (var i=0; i<allTextLines.length; i++) {
                var data = allTextLines[i].split(',');

                    var tarr = [];
                    for (var j=0; j<data.length; j++) {
                        if(data[j].length > 0){
				tarr.push(data[j]);
			}
                    }
                lines.push(tarr);
        }
        //console.log(lines); 
}

var count = 0;

var collectionOut = db2.get('people');
collectionOut.find({}).then((docs) => {
		
		var collectionData = db2.get('email_data');
		collectionData.find({}).then((dataDoc) => {
			console.log(docs.length);
			for (var i = 0;i<docs.length;i++){
				if (docs[i].email){
					var theOpens = -1;
					var theEmail = docs[i].email[0].replace(/\"/g, "").trim();
					for (var j = 0;j<dataDoc.length;j++){
						if (dataDoc[j].email == theEmail){
							theOpens = dataDoc[j].opens;
							//console.log(theEmail+" "+dataDoc[j].opens);	
						}			
					}
					var countryFound = false;
					var countryCode;	
					/*for (var prop in jsonCountries.countries) {
						//console.log("Key:" + prop);
						//console.log("Value:" + jsonCountries.countries[prop].name);
						if (docs[i].location[0] == jsonCountries.countries[prop].name){
							countryFound = true;
							console.log(jsonCountries.countries[prop].name+" continent "+jsonCountries.countries[prop].currency+" name "+docs[i].full_name);
						}
                                        }
					if (!countryFound){
						var theLoc = docs[i].location[0];
						if (theLoc =="SF"|| theLoc =="Seattle" || theLoc =="Miami" || theLoc =="NYC"|| theLoc =="DC") countryCode = jsonCountries.countries.US;
						console.log(contryCode);
						//if (countryCode) console.log(contryCode.name+" continent "+contryCode.currency+" name "+docs[i].full_name);
						//else console.log(docs[i].location[0] +" name "+docs[i].full_name);
					}*/
					//console.log(docs[i].location.join('|'));
					fs.appendFile(filePath, docs[i].full_name.trim()+","+docs[i].email[0].replace(/\"/g, "").trim()+","+docs[i].company_url.trim()+","+docs[i].company.trim()+","+docs[i].location.join('|')+","+theOpens+"\n", function(err) {
						if(err) {
							return console.log(err);
						}
					});	
					}
			
			}
		})	
})



/*rl.on('line', function(line, lineCount, byteCount) {
	 var elements = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                if (lineCount > 0){
                        //console.log(elements[0]+" "+elements[1]+" "+elements[2]);
                        var theEmail = elements[1].split(',');
                        var template  = elements[4];
                        //var formatText = elements[5];
			var formatting = '';
			//if (formatText.length > 1) formatting = formatText.replace(/([^\\]),/g, '$1\u000B').split('\u000B');
                        var collection = db2.get('people');
			//if (template == 'A')template = "a-temp";
			//if (template == 'B')template = "b-temp";
			//if (template == 'B1')template = "b1-temp";
			//if (template == 'C')template = "c-temp";
			//if (template == 'C1')template = "c1-temp";
			//if (template == 'D')template = "d-temp";
			if (template == 'E' || template == 'E1'){
				template = "e-temp";
			} else {
				template = '';
			}
			//console.log(formatting);	
                        //console.log("\n");
			collection.findOne({email : theEmail[0]}, function (err, doc) {
				if (doc && template){
					count++;
					//console.log(template);
					//console.log(theEmail[0]+" ---"+ formatting+" "+template);
					//sendMail(doc.first_name,doc.email[0].replace(/\"/g, ""),template,formatting,doc.location[0]);	
				} else {
					//console.log("not found "+theEmail[0]);
				}	
				//console.log(theEmail[0]+" ---"+ doc.email[0]+" "+doc.first_name);
				//if(doc.email[0].length >0) {
                                        //console.log(doc.email[0]);
                                        //console.log(template+" "+formating+"  -------------  "+doc.first_name);

					for (var j=0; j<lines.length; j++){
                                                if (lines[j][0] == template){
                                                        if (formatting.length > 0){
                                                                console.log(formatting);
                                                        } else {
                                                                console.log(lines[j][1]);
                                                        }
                                                }
                                        }
                                        //console.log(doc.company+" company "+theName);         
                                //} else {
                                        //console.log('record not found');
                                //}
                        })
		}	
	}).on('error', function(e) {
	// something went wrong 
	console.log("error for sure");
});*/


rl.on('end', function () {
	//console.log("END "+la);
});

function isEmptyObject(obj){
    return JSON.stringify(obj) === '{}';
}

function connectMongo(){
	var collection = db2.get('people');
	collection.find({}, function (err, doc) {
		console.log(doc[0]);
	});
}

function checkEmail(){
	//web-yPcyzu@mail-tester.com
	//sendMail('Petra', 'web-7NLcV8@mail-tester.com', "", "");
}

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
