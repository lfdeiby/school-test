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

app.get('/firebase/set', function(req, res){
	var db = firebase.database();
	var ref = db.ref('server/saving-data/fireblog');
	var usersRef = ref.child('users');
	//CON ESTE METODO CREAMOS AMBOS OBJETOS 
	usersRef.set({
		alanisawesome:{
			date_of_birth: "June 23, 1912",
			full_name: "Alan Turing"
		},
		gracehop:{
			date_of_birth: "December 9, 1906",
			full_name: "Grace Hopper"
		}
	});
	//CREAR UN SOLO OBJETO
	usersRef.child('deiby').set({
		date_of_birth: "August 3, 1988",
		full_name: "Deiby Loayza"
	});
	//La diferencia es que en el primer metodo ejecuto una consulta y si lo hiciera
	//con la segunda opción ejecutaría varias consultas
	res.send("OK");
});
app.get('/firebase/update', function(req, res){
	var db = firebase.database();
	var ref = db.ref('server/saving-data/fireblog');
	var usersRef = ref.child('users');
	//ACTULIZAR LOS CAMPOS DE UN OBJETO
	var yoRef = usersRef.child('deiby');
	yoRef.update({
		nickname: "Amazing YO",
		date_of_birth: "August 1, 1988"
	});
	//ACTUALIZAR CAMPOS DE VARIOS OBJETOS
	usersRef.update({
		'alanisawesome/nickname': "ralf",
		'gracehop/nickname': "Grace anatomy"
	},function(err){
		if(err){
			res.send(err);
		}else{
			res.send("Modifico Correctamente");
		}
	});
});
app.get('/firebase/lista', function(req, res){
	var db = firebase.database();
	var ref = db.ref('server/saving-data/fireblog');
	var postsRef = ref.child('posts');
	//SI DEFINIMOS COMO PUSH CADA VEZ QUE UTILICEMOS EL METODO "set" CREARÁ UN ID
	//UNICO E IRA ALMACENANDO DE ACRUDO AL ID QUE NO SE REPITE
	var newPostRef = postsRef.push();
	newPostRef.set({
		author: "gracehop",
		title: "Annoucing COBOL, a new console log"
	});
	//OTRA MANERA DE AGREGAR A LA LISTA
	postsRef.push().set({
		author: "deiby",
		title: "The Turing Machine 2"
	});

	res.send("OK: " + newPostRef.key);
});
app.get('/firebase/trans', function(req, res){
	var db = firebase.database();
	var ref = db.ref('server/saving-data/fireblog');
	var voteRef = ref.child('vote');
	voteRef.set({
		votes: {
			current: '0',
			name: 'Cambio'
		}
	}, function(err){
		if( err ){
			res.send(err);
		}else{
			res.send('OK');
		}
	});
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