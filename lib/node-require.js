var _ = require("lodash");

exports.require = function(builder, require){
	require.extensions[".dust"] = function(module, filename) {
		builder.buildModule(module, filename);
	};
};

exports.use = function(builder) {
	return _.bind(exports.require, null, builder);
};
