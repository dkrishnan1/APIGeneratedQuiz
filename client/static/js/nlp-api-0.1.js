var nlp = {};
nlp.globalVar=[];
nlp.getParse = function(text, callback)
{
	if (text.length >250)
	{
	return false; //"ERROR: input length greater than 250 characters. Please parse one sentence at a time";
	}
	else
	{
	var url = 'http://nlp.naturalparsing.com/api/parse?input=?format=json&jsoncallback='+encodeURIComponent(callback)+'&input=' + encodeURIComponent(text) +"&version=0.1&options=sentence";
	var script = document.createElement("script");
	script.setAttribute("async", "true");
	script.setAttribute("src", url);
	script.setAttribute("type", "text/javascript");
	
	document.body.appendChild(script);

	return true;
	}
};

nlp.getParsedTree = function(text, callback)
{
	if (text.length >25000)
	{
	return false; //"ERROR: input length greater than 250 characters. Please parse one sentence at a time";
	}
	else
	{
	var url = 'http://nlp.naturalparsing.com/api/parse?input=?format=json&jsoncallback='+encodeURIComponent(callback)+'&input=' + encodeURIComponent(text) +"&version=0.1&options=tree";
	var script = document.createElement("script");
	script.setAttribute("async", "true");
	script.setAttribute("src", url);
	script.setAttribute("type", "text/javascript");
	
	document.body.appendChild(script);
	return true;
	}
};

nlp.JSONtoString = function(data)
{
if (data.words == null )
{
	return;
}
else 
{
	var x;
	var output = "";
	for (x in data.words)
	{
		output = output +"{value:"+ data.words[x].value + ",tag:" + data.words[x].tag + ",id:"+data.words[x].id+"}";
	}
	//output+="]}"
	return output;
	}

};
nlp.JSONMyObject=function(data, done)
{
	nlp.globalVar.push(data);
	if(done==true){
		var temp=nlp.globalVar;
		nlp.globalVar=[];
		return callnow(temp);
	}
		

};

