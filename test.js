var helloWorldPackage = require('hello-world-classic');
var prompt = require('prompt');


helloWorldPackage();


prompt.start();
prompt.get('sag was', function(err, result){
	console.log('das hast du gesagt: ' + result['sag was']);
});