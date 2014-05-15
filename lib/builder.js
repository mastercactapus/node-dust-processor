var _ = require("lodash");
var path = require("path");
var fs = require("fs");
var Promise = require("bluebird");


var Builder = exports.Builder = function(cfg) {
	this.cfg = _.defaults(cfg, exports.Builder.defaults);
	if (!cfg.dust) {
		throw new TypeError(".dust is a required property");
	}
	if (!cfg.baseDir) {
		throw new TypeError(".baseDir is a required property");
	}

	_.bindAll(this);
};

Builder.defaults = {
	dustlib: "dustjs-linkedin/dist/dust-core.js",
	promiselib: "bluebird",
	Promise: Promise,
	define: false,
	renderStyle: "default"
};

Builder.render= {
	default: function(ctx) {
		return new Promise(function(resolve, reject){
			dust.render(name, ctx, function(err, html){
				if (err) reject(err);
				else resolve(html);
			});
		});
	},
	native: function(ctx) {
		return new Promise(function(resolve, reject){
			dust.render(name, ctx, function(err, html){
				if (err) reject(err);
				else resolve(html);
			});
		});
	},
	hybrid: function(ctx, cb) {
		if (typeof ctx === "function") {
			cb = ctx;
			ctx = {};
		}
		ctx = ctx||{};
		if (cb) {
			dust.render(name, ctx, cb);
		} else {
			return new Promise(function(resolve, reject){
				dust.render(name, ctx, function(err,html){
					if (err) reject(err);
					else resolve(html);
				});
			});
		}
	},
	callback: function(ctx, cb) {
		dust.render(name, ctx, cb);
	}
};

Builder.prototype = {
	findPossibleDependencies: function(partial) {
		var self = this;
		var gaps = partial.split(/\{[^}]+?\}/);
		var deepPattern = path.join(this.cfg.baseDir, split.join("*/**/*") + "+(.js|).dust");
		var simplePattern = path.join(this.cfg.baseDir, split.join("*") + "+(.js|).dust");

		return _.chain(glob.sync(deepPattern).concat(glob.sync(simplePattern)))
		.uniq()
		.map(function(partial){
			return path.resolve(self.cfg.baseDir, partial);
		})
		.value();
	},
	scanDependencies: function(data) {
		var self = this;
		var partialRx = /\{>\s*("[^"]+"|[^\s\/]+)/;
		var partials = data.split(partialRx);

		return _.chain(partials)
		.filter(function(__, index) {
			return index % 2 === 1;
		})
		.map(function(partial){
			return partial.replace(/^"(.+)"$/, "$1");
		})
		.map(function(partial){
			if (partial.indexOf("{") > -1) {
				return self.findPossibleDependencies(partial);
			} else {
				return path.resolve(self.cfg.baseDir, partial);
			}
		})
		.flatten()
		.value();
	},

	makeRequire: function(lib, varName) {
		return (typeof varName === "string" ? "var " + varName + " = " : "") + "require(" + JSON.stringify(lib) + ");";
	},

	compile: function(data, fullname) {
		var name = path.relative(this.cfg.baseDir, fullname);
		var templateData = "";
		var rel = path.dirname(fullname);
		var dependencies = _.map(this.scanDependencies(data), function(dep){
			return path.relative(rel, dep);
		});

 		if (this.cfg.define) {
 			templateData += ";define(function(require, exports, module){";
 		}

 		templateData += this.makeRequire(this.cfg.dustlib, "dust");
		templateData += this.cfg.dust.compile(data, name);

 		if (this.cfg.promiselib !== "native" && this.cfg.promiselib) {
 			templateData += this.makeRequire(this.cfg.promiselib, "Promise");
 		}

 		templateData += "var name = " + JSON.stringify(name) + ";";

 		templateData += _.map(dependencies, this.makeRequire);
 		templateData += "exports.render = " + Builder.render[this.cfg.renderStyle].toString() + ";";

 		if (this.cfg.define) {
 			templateData += "});"
 		}

 		return templateData;
	},

	buildModule: function(module, filename) {
		var self = this;
		var data = fs.readFileSync(filename).toString();
		var name = path.relative(this.cfg.baseDir, filename);

		var compiled = this.cfg.dust.compile(data, name);
		this.cfg.dust.loadSource(compiled);

		//load dependencies
		var dependencies = this.scanDependencies(data);
		_.each(dependencies, function(dep){
			module.require(dep);
		});

		var dust = this.cfg.dust;
		var Promise = this.cfg.Promise;

		module.exports = {
			stream: function(ctx) {
				return dust.stream(name, ctx);
			},
			render: function(ctx, cb) {
				if (typeof ctx === "function") {
					cb = ctx;
					ctx = {};
				}
				ctx = ctx||{};
				if (cb) {
					dust.render(name, ctx, cb);
				} else {
					return new Promise(function(resolve, reject){
						dust.render(name, ctx, function(err,html){
							if (err) reject(err);
							else resolve(html);
						});
					});
				}
			}
		};

	},

	build: function(filename, data) {
		var fullname = path.resolve(this.cfg.baseDir, filename);
		var data = data || fs.readFileSync(filename);

		return this.compile(data.toString(), fullname);
	}
};

module.exports = Builder;
