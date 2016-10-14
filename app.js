var express = require('express');
var firebase = require("firebase");
var bodyParser = require('body-parser');

firebase.initializeApp({
	serviceAccount: __dirname + "/config/firebase_config.json",
	databaseURL: 'https://testfb-f3e6b.firebaseio.com'

});

var db = firebase.database();
var ref = db.ref("server/saving-data/fireblog/posts");
ref.on("child_added", function(snapshot, prevChildKey){
	var newPost = snapshot.val();
	console.log(newPost);
	console.log(prevChildKey);
	console.log('--------------------------------------');
});
ref.on("child_changed", function(snapshot){
	var changedPost = snapshot.val();
	console.log("the update title: " + changedPost.title);
});




var app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) )

app.get('/', function(req, res){
	res.send("Hola");
	res.end();
});
// SETTERES
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
		author: "deiby",
		title: "Laravel in action"
	});
	//OTRA MANERA DE AGREGAR A LA LISTA
	/*postsRef.push().set({
		author: "deiby",
		title: "The Turing Machine 2"
	});*/

	res.send("OK: " + newPostRef.key);
});
app.get('/firebase/trans', function(req, res){
	var db = firebase.database();
	var ref = db.ref('server/saving-data/fireblog');
	var voteRef = ref.child('vote');
	/*
	voteRef.set({
		current: 0,
		name: 'Cambio'
	}, function(err){
		if( err ){
			res.send(err);
		}else{
			res.send('OK');
		}
	});
	*/
	
	var upVoteRef = db.ref('server/saving-data/fireblog/vote/current');
	upVoteRef.transaction( function(current){
		return ( current || 0 ) + 1;
	}, function(err){
		if( err ){
			res.send(err);
		}else{
			res.send('OK');
		}
	});
});
// GETTERS
app.get('/firebase/value', function(req, res){
	var db = firebase.database();
	var ref = db.ref("server/saving-data/fireblog/posts");
	ref.on("value", function(snapshot){
		res.send(snapshot.val());
	}, function(err){
		res.send(err);
	});
});
app.get('/firebase/child_added', function(req, res){
	var db = firebase.database();
	var ref = db.ref("server/saving-data/fireblog/posts");
	ref.on("child_added", function(snapshot, prevChildKey){
		var newPost = snapshot.val();
		res.send(newPost);
		res.send(prevChildKey);
	});
});
app.get('/firebase/child_changed', function(req, res){
	var db = firebase.database();
	var ref = db.ref("server/saving-data/fireblog/posts");
	ref.on("child_changed", function(snapshot){
		var changedPost = snapshot.val();
		res.send("the update title: " + changedPost.title);
	});
});
app.get('/firebase/child_removed', function(req, res){
	var db = firebase.database();
	var ref = db.ref("server/saving-data/fireblog/posts");
	ref.on("child_removed", function(snapshot){
		var deletedPost = snapshot.val();
		res.send("the remove title: " + deletedPost.title);
	});
});
app.get('/firebase/once', function(req, res){
	var db = firebase.database();
	var ref = db.ref("server/saving-data/fireblog/posts");
	ref.once("value", function(snapshot){
		res.send(snapshot.val());
	}, function(err){
		res.send(err);
	});
});
app.get('/firebase/orderbychild', function(req, res){
	var db = firebase.database();
	var ref = db.ref("server/saving-data/fireblog/posts");
	ref.orderByChild('author').on("child_added", function(snapshot){
		console.log(snapshot.val());
		res.send(snapshot.val());
	}, function(err){
		res.send(err);
	});
});
app.get('/firebase/orderbykey', function(req, res){
	var db = firebase.database();
	var ref = db.ref("server/saving-data/fireblog/posts");
	ref.orderByKey().once("value", function(snapshot){
		res.send( snapshot.key );
	}, function(err){
		res.send(err);
	});
});
app.get('/firebase/play', function(req, res){
	var db = firebase.database();
	var ref = db.ref("server/saving-data/fireblog/posts");
	var data = [];
	var sync = true;
    ref.orderByChild('author').on("child_added", function(snapshot){
		data.push( snapshot.val() );
		sync = false;
		console.log(snapshot.val());
	}, function(err){
		res.send(err);
	});
	require('deasync').loopWhile(function(){ return sync; });
	// while(sync) {require('deasync').sleep(100);}
	res.send(data);
});

var v1 = require('./v1');
app.use('/v1', v1);

app.all('*', function(req, res){
	res.status(404);
	res.send("Lo sentimos 404 not found page");
});


app.listen(8080, function(){
	console.log("runing in port: 8080");
})