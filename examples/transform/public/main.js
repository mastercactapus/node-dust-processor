var myTemplate = require("./template");

myTemplate.render().then(function(html){
	document.getElementById("test").innerHTML = html;
})

