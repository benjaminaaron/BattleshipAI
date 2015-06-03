var hwc = require('hello-world-classic');
var prompt = require('prompt');

hwc();

prompt.start();
prompt.get('sag was', function(err, result){
	console.log(result);
	console.log('du hast gesagt: ' + result['sag was']);
})