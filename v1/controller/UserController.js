
var action = module.exports = {};

action.obtener = function (req, res){
	res.send("DESDE UN CONTROLLER");
};

action.get = function(req, res){
	res.send("ID: " + req.params.id + " Welcome!! ");
};