var _ = require("lodash");
var through = require("through");


exports.transform = function(builder, file) {
	if (!/\.dust$/.test(file)) return through();

	var data = "";
	function write(buf) {
		data += buf;
	}

	function end() {
		this.queue(builder.build(file, data));
		this.queue(null);
	}

	return through(write, end);
};

exports.use = function(builder) {
	return _.bind(exports.transform, null, builder);
};
