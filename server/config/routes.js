
var mongoose = require('mongoose');


var questions = require('../controllers/Questions.js');
module.exports = function(app) {
app.post('/question/add', function(req,res){
	questions.createQuestion(req,res)
});
app.post('/question/delete', function(req,res){
	questions.destroyQuestion(req,res)
});
app.get('/question', function(req,res){
	
	questions.showQuestion(req,res)
});
}