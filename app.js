var express = require('express');
var firebase = require("firebase");
var bodyParser = require('body-parser');

firebase.initializeApp({
	serviceAccount: __dirname + "/config/firebase_config.json",
	databaseURL: 'https://testfb-f3e6b.firebaseio.com'

});

var app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) )

app.get('/', function(req, res){
	res.send("Hola");
	res.end();
});
app.post('/token-device', function(req, res){
	var token = req.body.token;
	var db = firebase.database();
	var tokenDevices = db.ref("token-device").push();
	tokenDevices.set({
		token: token
	});
	res.send(req.body.token);
});

var v1 = require('./v1');
app.use('/v1', v1);

app.all('*', function(req, res){
	res.status(404);
	res.send("Lo sentimos 404 not found page");
});


app.listen(80, function(){
	console.log("runing in port: 80");
})