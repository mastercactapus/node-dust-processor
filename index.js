var Builder = require("./lib/builder");

exports.create = function(cfg) {
	var builder = new Builder(cfg);

	return {
		builder: builder,
		build: builder.build,
		express: require("./lib/express-middleware").use(builder),
		transform: require("./lib/browserify-transform").use(builder),
		nodeRequire: require("./lib/node-require").use(builder)
	}
};
