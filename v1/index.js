var express = require('express');
var app = module.exports = express();

var userController = require('./controller/UserController.js');
console.log(userController);

app.route('/user')
	.get( userController.obtener )
	.post( function(req, res){
		res.send("Yes post User");
	})
	.delete( function(req, res){
		res.send("Yes delete user");
	});
app.route('/user/:id([0-9]+)')
	.get( userController.get );
