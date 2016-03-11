var Project_app = angular.module('Project_app', ['ngRoute']);


callnow=function(data)
{
	var scope =angular.element(document.getElementById('Questiondiv')).scope()
	scope.$apply(function(){
		scope.callnow(data);
	});
}
Project_app.factory('QuestionFactory', function ($http)
{

    var factory = {};
    
    var title=[];
    factory.page=0;
    factory.id=0;
	factory.textval=[];
	factory.questions={};
	factory.getID = function ()
    {
    	
    	return factory.id++;
    }
    factory.addQuestion=function(data)
    {
    	$http.post("/question/add", data).success(function(d){});
    }
    factory.popQuestion=function(data)
    {
    	$http.post("/question/delete", data).success(function(d){});
    }
    factory.getAddedQuestion=function(callback)
    {
    	$http.get("/question").success(function(data){
    		console.log(callback);
    		callback(data);
    	});
    }
    factory.setTheQuestion=function(questions)
    {
    	for(var h=0;h<questions.length;h++)
    	{
    		factory.questions[questions[h].id]=questions[h];
    	}
    	
    }
    factory.getOptions=function(word,callback)
    {
    	var results=[];
    	var arrCategory=["same-context","synonym","antonym","variant","equivalent","cross-reference","related-word","rhyme","form","etymologically-related-term","hypernym","hyponym","inflected-form","primary","verb-form","verb-stem","has_topic"];
    	var url="http://api.wordnik.com/api/word.json/"+word+"/related?type=same-context&api_key=7f8e586a54a38f8cf100f0b198f04ac61d2ea7b9dd26c1d76";
    	$http.get(url).success(function (output)
    	{
    		for(var t=0;t<arrCategory.length;t++)
    		{
    			
    			if(output["relationshipType"]&&output["relationshipType"][arrCategory[t]])
    			{
    				//console.log(output["relationshipType"][arrCategory[t]]);
    				for(var h=0;h<output["relationshipType"][arrCategory[t]]["words"].length;h++)
    				{
    					results.push(output["relationshipType"][arrCategory[t]]["words"][h]);
    					if(results.length==3)
    						callback(result);
    				}
    			}
    		}
    		callback(result);
    	});

    }

	factory.getTheQuestion=function(pid)
    {
    	return factory.questions[pid];
    	
    }


    factory.getQuestion = function ()
    {
    	
    	var url="http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=df1dbd818571c8d1a670fa6dcfbe496c:18:73102157&fq=news_desk:(Sports)&page="+factory.page++;
        $http.get(url).success(function(output) 
        {
	        titleText=output;

	        var questionAnswer=[];
	        for(var j=0;j<titleText.response.docs.length;j++)
	        {	//console.log(titleText.response.docs);
	     
	        	if(titleText.response.docs[j].headline.print_headline)
	        	{
	        			
	        		factory.textval.push(titleText.response.docs[j].headline.print_headline);
	        	}
	        	
	        	
	     	}
	     	factory.textval[factory.textval.length-1]=factory.textval[factory.textval.length-1]+" fbjsdf ";
	     	for(var z=0;z<factory.textval.length;z++)
	     	{
	     		
		     	nlp.getParse(factory.textval[z], function (wordsPrased)
				{
					var done=false;
					if(nlp.JSONtoString(wordsPrased).indexOf('fbjsdf')!=-1)
						done=true;
					nlp.JSONMyObject(wordsPrased, done);
					return;
				});

	     	}


	    });
	    
    }




return factory;
});


Project_app.config(function ($routeProvider) 
{
	$routeProvider
	.when('/',
	{
		templateUrl: 'partial/question.html'
	})
	.when('/Quiz',
	{
		templateUrl: 'partial/quiz.html'
	})
	.otherwise(
	{
		redirectTo: '/'
	})
});

Project_app.controller('QuestionController', function ($scope, QuestionFactory) 
{
    QuestionFactory.getQuestion(); 

    $scope.getMoreQuestion=function()
    {
    	QuestionFactory.getQuestion(); 
    }
   
    $scope.callnow=function(ArrwordsPrased)
	{
		var questionAnswer=[];
		for(var g in ArrwordsPrased){

		var output ={"words":[]};
		var x;
			var wordsPrased=ArrwordsPrased[g];
		for (x in wordsPrased.words)
		{
			output["words"].push( {"value": wordsPrased.words[x].value , "id": wordsPrased.words[x].id ,"tag":wordsPrased.words[x].tag, "visit":0 });
		}


		var arrstr=[];
		for(var k=0;k<output["words"].length;k++)
		{
			if(output["words"][k]["value"]!=='fbjsdf')
			{
				arrstr.push(output["words"][k].value);	
			}
			
		}

		for(var k=0;k<output["words"].length;k++)
		{
			if(output["words"][k]["visit"]==0&&output["words"][k]["value"]!=='fbjsdf'&&output["words"][k]["tag"]=="NNP")
			{
				output["words"][k]["visit"]=1;
				var temp=arrstr[parseInt(output["words"][k]["id"])];
				arrstr[parseInt(output["words"][k]["id"])]="___________";
				var aans=output["words"][k]["value"];
				for(var y=k+1;y<output["words"].length;y++)
				{
					if(output["words"][y]["value"]!=='fbjsdf'&&output["words"][y]["tag"]=="NNP")
					{
						output["words"][y]["visit"]=1;
						temp+=" "+arrstr[parseInt(output["words"][y]["id"])];
						arrstr[parseInt(output["words"][y]["id"])]="";
						aans+=" "+output["words"][y]["value"];
					}
					else
					{
						break;
					}
				}
				var Options=[];
				var tt=aans.split("").sort("").join("");
				Options.push(tt);
				tt=aans.slice(aans.length/2)+aans.slice(0,aans.length/2);
				Options.push(tt);
				//console.log(Options);
				Options.push(aans);
				var qa={id:QuestionFactory.getID(),question:arrstr.join(" "), answer:aans, option:Options};
				questionAnswer.push(qa);
				arrstr[parseInt(output["words"][k]["id"])]=temp;
				}
			}
		}
		QuestionFactory.setTheQuestion(questionAnswer);

		$scope.questions=questionAnswer;
	}
	$scope.getCheckedValue=function(checkedstatus, question)
	{
		//console.log(question);
		if(checkedstatus)
		{
			var quest=QuestionFactory.getTheQuestion(question)
			QuestionFactory.addQuestion(quest);
		}
		else
		{
			QuestionFactory.popQuestion({id:question});
		}
		
	}
	

});

Project_app.controller('QuizController', function ($scope, QuestionFactory) 
{
	
	QuestionFactory.getAddedQuestion(function(question){
		$scope.questions=question;
		for(var i=0;i<question.length;i++)
		{
			
			$scope.questions[i].divid1=	{id:question[i]._id + "1", color:"#0000"};
			$scope.questions[i].divid2=	{id:question[i]._id + "2", color:"#0000"};
			$scope.questions[i].divid3=	{id:question[i]._id + "3", color:"#0000"};
		}
		
	});
	$scope.isAnswer=function(option,question, divid)
	{

		if((parseInt(option)-1)==parseInt(question.answerOption))	
		{
			// $(document).ready(function(){
				divid.color='green';
				$scope.color=divid.color;
			//$scope.color="#ff00"

			// });
		}
		else
		{
			divid.color='red';

				$scope.color=divid.color;
		}
	}

});