var express = require("express");
var browserify = require("browserify-middleware");
var dust = require("dustjs-linkedin");

//just using the defaults
var dustp = require("../../index").create({
	dust: dust,
	baseDir: "./public"
});

//register the handler
dustp.nodeRequire(require);

var template = require("./templates/main");

var app = express();

app.get("/", function(req, res, next){
	template.render()
	.then(function(html){
		res.type("html");
		res.send(html);
	})
	.catch(next);
});

app.listen(process.env.PORT||3000);
