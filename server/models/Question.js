var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new mongoose.Schema({
	question: String,
	option1: String,
	option2: String,
	option3: String,
	answer:String,
	question_no:Number,
	answerOption:Number
});
var Question = mongoose.model('Question', QuestionSchema);