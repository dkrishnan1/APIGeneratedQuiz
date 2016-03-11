var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoginSchema = new mongoose.Schema({
	name:String,
	username:String,
	password:String
});
var Login = mongoose.model('Login', LoginSchema);