var mongoose = require('mongoose');
var Question = mongoose.model('Question');
var http=require('http');
module.exports = (function() 
{
	return{
		showQuestion:function(req,res)
		{
			Question.find({}, function(err, results){

				if(err)
				{
					console.log("fdfds");
				}
				else
				{
					res.json(results);
				}
			});
		},
		createQuestion:function(req, res)
		{
			var r1=[];

			for(var i=0;i<3;i++)
			{
				var t1=Math.floor(Math.random()*3);
				for(var j=0;j<r1.length;j++)
				{
					console.log(t1);
					if(t1===r1[j])
					{

						t1=Math.floor(Math.random()*3);
						j=0;
						console.log("first"+t1);
						continue;
					}
				}
				r1.push(t1);
			}
			var done=false;
			for(var j=0;j<r1.length;j++)
			{	
				if(r1[j]==2)
				{
					done=true;
					break;
				}
			}
			if(!done)
			{
				r1[0]=2;
			}
			var anss=-1;
			console.log(r1);
			for(var t=0;t<r1.length;t++)
			{
				if(r1[t]==2)
				{
					anss=t;
				}
			}
			var question = new Question({question: req.body.question, answer:req.body.answer, question_no:req.body.id,
				option1: req.body.option[r1[0]],
				option2: req.body.option[r1[1]],
				option3: req.body.option[r1[2]],answerOption:anss});
			question.save(function(err)
			{
				if(err){
					console.log("fhksdhfkdjs");
				}
				else
				{
					res.redirect('/question');
				}

			});

		},
		destroyQuestion: function(req,res)
		{
			Question.remove({question_no:req.body.id}, function (err){
				res.redirect('/question');
			});
		}
	}
})();