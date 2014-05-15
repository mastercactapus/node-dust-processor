var _ = require("lodash");

exports.request = function(builder, req, res, next){
	res.type("javascript");
	if (builder.cfg.define && /\.dust\.js$/.test(req.path)) {
		res.send(builder.build(req.path.replace(/\.js$/,"")));
	} else if (/\.dust$/.test(req.path)) {
		res.send(builder.build(req.path));
	} else {
		next();
	}
};

exports.use = function(_builder) {
	return function(cfg) {
		var builder = cfg ? _builder : new Builder(_.defaults(cfg, _builder.cfg));

		return _.bind(exports.request, null, builder);
	};
};

