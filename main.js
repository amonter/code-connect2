var fs = require("fs");
//var debug = require('debug')
var mongo = require('mongodb');
var monk = require('monk');
var db2 = monk('54.197.18.144:27017/globalsouth');
//var db = monk('amonter5:espana6248@54.175.50.182:27017/globalsouth');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('NHpudxhV9HV6zakj7-gH0A');
var readline = require('linebyline'),
      rl = readline('edtech_list.csv');

var count = 0;
var la;

//checkEmail();
connectMongo();


rl.on('line', function(line, lineCount, byteCount) {

	
    	var elements = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);	
	//console.log(elements);
	//var language = elements[0].replace(/\W+/g, "").replace(/[0-9]/g, "");
	//la+=", "+language;	
	if (lineCount > 0){		
		var theName = elements[0].match(/\S+/g);		
		//console.log(elements[0]+" "+elements[1]+" "+elements[2]);
		var theEmail = elements[1];
		var company = theEmail.split('@');
		//console.log(company[1]);
		//if (elements[5] == 'yes'){			
			//console.log(elements[0] +" ("+ elements[2]+")<br>");	
				//var subSet = new String(elements[4]);													
				//if (lineCount == 3){
					//console.log(elements[0] +" - - "+ elements[1]);
					//sendMail(theName[0], elements[1], "", "");
				//}
				
		//}

			//console.log(elements[0]+"\n"+elements[4].replace(""", ""));			
	}		
	

	/*if (elements[1].length > 0 && elements[3] == ‘Comments’){
		//for ( var i = 0; i < elements.length;i++){
			var theName = elements[0].match(/\S+/g);
			count++;
			//101 151 201	
			if (count >= 201){
				console.log(count);
				console.log("Hey "+theName[0]+"\n"+elements[2].trim());
				
				sendMail(theName[0], elements[1].trim(), elements[2].trim());
			}
		//}
	}*/

	//console.log(count);
	
	//sendMail(elements[0], elements[1], elements[2]);
})
.on('error', function(e) {
// something went wrong 
});

rl.on('end', function () {
	//console.log("END "+la);
});

function connectMongo(){
	var collection = db2.get('people');
	collection.find({}, function (err, doc) {
		console.log(doc[0]);
	});
}

function checkEmail(){
	//web-yPcyzu@mail-tester.com
	sendMail('Petra', 'web-7NLcV8@mail-tester.com', "", "");
}

function sendMail (name, email, update, followup) {

console.log(name+" "+email+" \n "+ update+" \n ");
var template_name = "catch-up";
var template_content = [{
        "name": "example name",
        "content": "example content"
}];

var message = {
			"html": "",
			"text": "",
			"subject": "",
			"from_email": "a@latamtechmeetup.com",
			"merge": true,
			"merge_language": "mailchimp",
			"merge_vars": [{
			"rcpt": email,
			"vars": [{
				"name": "firstname",
				"content": name}
			]}],
		    "from_name": "Adrian Avendano",
		    "to": [{
			    "email": email,
			    "name": "",
			    "type": "to"
			}],
		    "headers": {
			"Reply-To": "a@latamtechmeetup.com"
		    }
	};

	mandrillSend(message, template_name, template_content);
}


function mandrillSend(message, template_name, template_content) {
	console.log("madrill mandrill");
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
