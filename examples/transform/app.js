var express = require("express");
var browserify = require("browserify-middleware");
var dust = require("dustjs-linkedin");

//just using the defaults
var dustp = require("../../index").create({
	dust: dust,
	baseDir: "./public"
});

var app = express();

app.use("/", browserify("./public", {
	extensions: [".dust"],
	transform: [dustp.transform]
}));

app.use("/", express.static("./public"));

app.listen(process.env.PORT||3000);
